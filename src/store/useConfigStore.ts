import { useMemo } from 'react';
import { create } from 'zustand';
import type {
  MaterialType,
  ProductId,
  ConfigurationState,
  PriceBreakdown,
  HistoryEntry,
  SavedDesign,
  Preset,
} from '../types';
import type { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { calculatePrice } from '../utils/pricing';
import useUIStore from './useUIStore';

const STORAGE_KEY = 'customizer-designs';
const MAX_HISTORY = 50;
const COALESCE_MS = 400;

function getInitialState(productId: ProductId): ConfigurationState {
  const product = findProduct(productId);
  const colors: Record<string, string> = {};
  const materials: Record<string, MaterialType> = {};
  const dimensions: Record<string, number> = {};
  const components: Record<string, string> = {};

  for (const part of product.parts) {
    colors[part.id] = part.defaultColor;
    materials[part.id] = part.defaultMaterial;
  }

  for (const dim of product.dimensions) {
    dimensions[dim.id] = dim.default;
  }

  for (const group of product.componentGroups) {
    components[group.id] = group.defaultChoice;
  }

  return {
    productId,
    colors,
    materials,
    dimensions,
    components,
    activePreset: null,
  };
}

function loadSavedDesigns(): SavedDesign[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedDesign[]) : [];
  } catch {
    return [];
  }
}

function persistSavedDesigns(designs: SavedDesign[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
    return true;
  } catch {
    return false;
  }
}

export function findProduct(productId: ProductId): Product {
  const found = PRODUCTS.find((p) => p.id === productId);
  if (found) return found;
  const fallback = PRODUCTS[0];
  if (!fallback) throw new Error('PRODUCTS data is empty');
  return fallback;
}

function partExists(product: Product, partId: string | null): boolean {
  if (partId === null) return false;
  return product.parts.some((p) => p.id === partId);
}

function syncSelection(productId: ProductId): void {
  const ui = useUIStore.getState();
  const product = findProduct(productId);
  if (!partExists(product, ui.selectedPart)) ui.setSelectedPart(null);
  if (!partExists(product, ui.hoveredPart)) ui.setHoveredPart(null);
}

interface ConfigStore {
  config: ConfigurationState;
  history: HistoryEntry[];
  historyIndex: number;
  savedDesigns: SavedDesign[];

  setProduct: (id: ProductId) => void;
  setColor: (partId: string, hex: string) => void;
  setMaterial: (partId: string, material: MaterialType) => void;
  setDimension: (dimId: string, value: number) => void;
  setComponent: (groupId: string, choiceId: string) => void;
  applyPreset: (presetId: string) => void;
  applyConfig: (config: ConfigurationState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  reset: () => void;
  saveDesign: (name: string) => boolean;
  loadDesign: (id: string) => void;
  deleteDesign: (id: string) => boolean;
  renameDesign: (id: string, name: string) => boolean;
  duplicateDesign: (id: string) => boolean;
}

interface CommitOptions {
  source?: string;
  coalesce?: boolean;
}

function commit(
  state: ConfigStore,
  newConfig: ConfigurationState,
  options: CommitOptions = {}
): Partial<ConfigStore> {
  const { source, coalesce = false } = options;
  const now = Date.now();
  const atTip = state.historyIndex === state.history.length - 1;
  const current = state.history[state.historyIndex];

  const canCoalesce =
    coalesce &&
    atTip &&
    current !== undefined &&
    current.source === source &&
    now - current.timestamp < COALESCE_MS;

  if (canCoalesce) {
    const history = state.history.slice();
    history[state.historyIndex] = { config: newConfig, timestamp: now, source };
    return { config: newConfig, history };
  }

  const history = [
    ...state.history.slice(0, state.historyIndex + 1),
    { config: newConfig, timestamp: now, source },
  ].slice(-MAX_HISTORY);

  return { config: newConfig, history, historyIndex: history.length - 1 };
}

export const useConfigStore = create<ConfigStore>((set, get) => {
  const apply = (newConfig: ConfigurationState, options: CommitOptions): void => {
    set((state) => commit(state, newConfig, options));
    syncSelection(get().config.productId);
  };

  const initialConfig = getInitialState('sneaker');

  return {
    config: initialConfig,
    history: [{ config: initialConfig, timestamp: Date.now(), source: 'init' }],
    historyIndex: 0,
    savedDesigns: loadSavedDesigns(),

    setProduct: (id) => {
      if (get().config.productId === id) return;
      apply(getInitialState(id), { source: 'setProduct' });
    },

    setColor: (partId, hex) => {
      const state = get();
      apply(
        {
          ...state.config,
          colors: { ...state.config.colors, [partId]: hex },
          activePreset: null,
        },
        { source: `color:${partId}`, coalesce: true }
      );
    },

    setMaterial: (partId, material) => {
      const state = get();
      apply(
        {
          ...state.config,
          materials: { ...state.config.materials, [partId]: material },
          activePreset: null,
        },
        { source: `material:${partId}` }
      );
    },

    setDimension: (dimId, value) => {
      const state = get();
      apply(
        {
          ...state.config,
          dimensions: { ...state.config.dimensions, [dimId]: value },
          activePreset: null,
        },
        { source: `dimension:${dimId}`, coalesce: true }
      );
    },

    setComponent: (groupId, choiceId) => {
      const state = get();
      apply(
        {
          ...state.config,
          components: { ...state.config.components, [groupId]: choiceId },
          activePreset: null,
        },
        { source: `component:${groupId}` }
      );
    },

    applyPreset: (presetId) => {
      const state = get();
      const product = findProduct(state.config.productId);
      const preset = product.presets.find((p: Preset) => p.id === presetId);
      if (!preset) return;

      const newColors = { ...state.config.colors };
      const newMaterials = { ...state.config.materials };
      const newComponents = { ...state.config.components };

      if (preset.colors) Object.assign(newColors, preset.colors);
      if (preset.materials) Object.assign(newMaterials, preset.materials);
      if (preset.components) Object.assign(newComponents, preset.components);

      apply(
        {
          ...state.config,
          colors: newColors,
          materials: newMaterials,
          components: newComponents,
          activePreset: presetId,
        },
        { source: `preset:${presetId}` }
      );
    },

    applyConfig: (config) => {
      if (!PRODUCTS.some((p) => p.id === config.productId)) return;
      apply({ ...config }, { source: 'applyConfig' });
    },

    undo: () => {
      const state = get();
      if (state.historyIndex <= 0) return;
      const entry = state.history[state.historyIndex - 1];
      if (!entry) return;
      apply(entry.config, {});
    },

    redo: () => {
      const state = get();
      if (state.historyIndex >= state.history.length - 1) return;
      const entry = state.history[state.historyIndex + 1];
      if (!entry) return;
      apply(entry.config, {});
    },

    canUndo: () => get().historyIndex > 0,

    canRedo: () => get().historyIndex < get().history.length - 1,

    reset: () => {
      apply(getInitialState(get().config.productId), { source: 'reset' });
    },

    saveDesign: (name) => {
      const { config, savedDesigns } = get();
      const now = Date.now();
      const design: SavedDesign = {
        id: `design-${now}-${Math.random().toString(36).slice(2, 9)}`,
        name: name.trim() || 'Untitled design',
        config: { ...config },
        createdAt: now,
        updatedAt: now,
      };
      const updated = [...savedDesigns, design];
      const persisted = persistSavedDesigns(updated);
      if (persisted) set({ savedDesigns: updated });
      return persisted;
    },

    loadDesign: (id) => {
      const design = get().savedDesigns.find((d: SavedDesign) => d.id === id);
      if (!design) return;
      apply({ ...design.config }, { source: 'loadDesign' });
    },

    deleteDesign: (id) => {
      const updated = get().savedDesigns.filter((d: SavedDesign) => d.id !== id);
      const persisted = persistSavedDesigns(updated);
      if (persisted) set({ savedDesigns: updated });
      return persisted;
    },

    renameDesign: (id, name) => {
      const updated = get().savedDesigns.map((d: SavedDesign) =>
        d.id === id ? { ...d, name, updatedAt: Date.now() } : d
      );
      const persisted = persistSavedDesigns(updated);
      if (persisted) set({ savedDesigns: updated });
      return persisted;
    },

    duplicateDesign: (id) => {
      const original = get().savedDesigns.find((d: SavedDesign) => d.id === id);
      if (!original) return false;

      const now = Date.now();
      const duplicate: SavedDesign = {
        id: `design-${now}-${Math.random().toString(36).slice(2, 9)}`,
        name: `${original.name} (Copy)`,
        config: { ...original.config },
        createdAt: now,
        updatedAt: now,
      };
      const updated = [...get().savedDesigns, duplicate];
      const persisted = persistSavedDesigns(updated);
      if (persisted) set({ savedDesigns: updated });
      return persisted;
    },
  };
});

export function useProduct(): Product {
  const productId = useConfigStore((s) => s.config.productId);
  return useMemo(() => findProduct(productId), [productId]);
}

export function usePrice(): PriceBreakdown {
  const config = useConfigStore((s) => s.config);
  return useMemo(
    () => calculatePrice(findProduct(config.productId), config),
    [config]
  );
}
