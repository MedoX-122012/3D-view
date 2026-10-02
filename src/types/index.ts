export type MaterialType = 'matte' | 'glossy' | 'metallic' | 'leather' | 'fabric' | 'rubber' | 'plastic' | 'glass';

export type ProductId = 'sneaker' | 'chair' | 'headset' | 'watch' | 'backpack';

export type CameraPreset = 'front' | 'side' | 'top' | 'three-quarter';

export interface RGB { r: number; g: number; b: number }

export interface ColorOption {
  hex: string;
  name: string;
  rgb: RGB;
}

export interface MaterialOption {
  id: MaterialType;
  name: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
  opacity: number;
  priceModifier: number;
}

export interface ProductPart {
  id: string;
  name: string;
  defaultColor: string;
  defaultMaterial: MaterialType;
}

export interface DimensionOption {
  id: string;
  name: string;
  min: number;
  max: number;
  default: number;
  unit: string;
}

export interface ComponentChoice {
  id: string;
  name: string;
  priceModifier: number;
}

export interface ComponentGroup {
  id: string;
  name: string;
  options: ComponentChoice[];
  defaultChoice: string;
}

export interface Preset {
  id: string;
  name: string;
  colors: Record<string, string>;
  materials: Record<string, MaterialType>;
  components?: Record<string, string>;
}

export interface PricingRule {
  materialModifier: Record<MaterialType, number>;
  customColorFee: number;
  sizeMultiplier: number;
}

export interface Product {
  id: ProductId;
  name: string;
  category: string;
  basePrice: number;
  parts: ProductPart[];
  materials: MaterialType[];
  dimensions: DimensionOption[];
  componentGroups: ComponentGroup[];
  presets: Preset[];
  pricing: PricingRule;
}

export interface PartColors {
  [partId: string]: string;
}

export interface PartMaterials {
  [partId: string]: MaterialType;
}

export interface PartDimensions {
  [dimId: string]: number;
}

export interface PartComponents {
  [groupId: string]: string;
}

export interface ConfigurationState {
  productId: ProductId;
  colors: PartColors;
  materials: PartMaterials;
  dimensions: PartDimensions;
  components: PartComponents;
  activePreset: string | null;
}

export interface PriceBreakdown {
  base: number;
  materialCost: number;
  colorCost: number;
  componentCost: number;
  sizeCost: number;
  total: number;
}

export interface HistoryEntry {
  config: ConfigurationState;
  timestamp: number;
  source?: string;
}

export interface SavedDesign {
  id: string;
  name: string;
  config: ConfigurationState;
  createdAt: number;
  updatedAt: number;
}
