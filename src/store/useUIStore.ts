import { create } from 'zustand';

export type TabId = 'colors' | 'materials' | 'size' | 'components' | 'presets';
export type Theme = 'dark' | 'light';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem('customizer-theme');
  if (stored === 'dark' || stored === 'light') return stored;
  const fromEnv = import.meta.env.VITE_DEFAULT_THEME;
  if (fromEnv === 'dark' || fromEnv === 'light') return fromEnv;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('customizer-theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
}

interface UIStore {
  theme: Theme;
  toggleTheme: () => void;

  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;

  configDrawerOpen: boolean;
  summaryDrawerOpen: boolean;
  setConfigDrawerOpen: (open: boolean) => void;
  setSummaryDrawerOpen: (open: boolean) => void;
  toggleConfigDrawer: () => void;
  toggleSummaryDrawer: () => void;
  closeDrawers: () => void;

  productSelectorOpen: boolean;
  exportModalOpen: boolean;
  shareModalOpen: boolean;
  saveModalOpen: boolean;
  savedDesignsOpen: boolean;
  resetConfirmOpen: boolean;
  setProductSelectorOpen: (open: boolean) => void;
  setExportModalOpen: (open: boolean) => void;
  setShareModalOpen: (open: boolean) => void;
  setSaveModalOpen: (open: boolean) => void;
  setSavedDesignsOpen: (open: boolean) => void;
  setResetConfirmOpen: (open: boolean) => void;

  selectedPart: string | null;
  setSelectedPart: (partId: string | null) => void;

  hoveredPart: string | null;
  setHoveredPart: (partId: string | null) => void;

  isFullscreen: boolean;
  setIsFullscreen: (fs: boolean) => void;

  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

let toastCounter = 0;
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const initialTheme = getInitialTheme();
applyTheme(initialTheme);

const useUIStore = create<UIStore>((set) => ({
  theme: initialTheme,
  toggleTheme: () =>
    set((state) => {
      const next: Theme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      return { theme: next };
    }),

  activeTab: 'colors' as TabId,
  setActiveTab: (tab: TabId) => set({ activeTab: tab }),

  configDrawerOpen: false,
  summaryDrawerOpen: false,
  setConfigDrawerOpen: (open: boolean) =>
    set((state) => ({
      configDrawerOpen: open,
      summaryDrawerOpen: open ? false : state.summaryDrawerOpen,
    })),
  setSummaryDrawerOpen: (open: boolean) =>
    set((state) => ({
      summaryDrawerOpen: open,
      configDrawerOpen: open ? false : state.configDrawerOpen,
    })),
  toggleConfigDrawer: () =>
    set((state) => ({
      configDrawerOpen: !state.configDrawerOpen,
      summaryDrawerOpen: false,
    })),
  toggleSummaryDrawer: () =>
    set((state) => ({
      summaryDrawerOpen: !state.summaryDrawerOpen,
      configDrawerOpen: false,
    })),
  closeDrawers: () => set({ configDrawerOpen: false, summaryDrawerOpen: false }),

  productSelectorOpen: false,
  exportModalOpen: false,
  shareModalOpen: false,
  saveModalOpen: false,
  savedDesignsOpen: false,
  resetConfirmOpen: false,
  setProductSelectorOpen: (open: boolean) => set({ productSelectorOpen: open }),
  setExportModalOpen: (open: boolean) => set({ exportModalOpen: open }),
  setShareModalOpen: (open: boolean) => set({ shareModalOpen: open }),
  setSaveModalOpen: (open: boolean) => set({ saveModalOpen: open }),
  setSavedDesignsOpen: (open: boolean) => set({ savedDesignsOpen: open }),
  setResetConfirmOpen: (open: boolean) => set({ resetConfirmOpen: open }),

  selectedPart: null as string | null,
  setSelectedPart: (partId: string | null) => set({ selectedPart: partId }),

  hoveredPart: null as string | null,
  setHoveredPart: (partId: string | null) => set({ hoveredPart: partId }),

  isFullscreen: false,
  setIsFullscreen: (fs: boolean) => set({ isFullscreen: fs }),

  toasts: [] as Toast[],
  addToast: (message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${++toastCounter}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    toastTimeouts.set(
      id,
      setTimeout(() => {
        toastTimeouts.delete(id);
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, 4000)
    );
  },
  removeToast: (id: string) => {
    const timeout = toastTimeouts.get(id);
    if (timeout) {
      clearTimeout(timeout);
      toastTimeouts.delete(id);
    }
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));

export default useUIStore;
