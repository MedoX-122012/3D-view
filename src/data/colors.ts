import type { ColorOption, RGB } from '../types';

export const COLOR_PALETTE: ColorOption[] = [
  { hex: '#1a1a2e', name: 'Midnight', rgb: { r: 26, g: 26, b: 46 } },
  { hex: '#16213e', name: 'Navy', rgb: { r: 22, g: 33, b: 62 } },
  { hex: '#0f3460', name: 'Sapphire', rgb: { r: 15, g: 52, b: 96 } },
  { hex: '#533483', name: 'Purple', rgb: { r: 83, g: 52, b: 131 } },
  { hex: '#e94560', name: 'Crimson', rgb: { r: 233, g: 69, b: 96 } },
  { hex: '#ff6b6b', name: 'Coral', rgb: { r: 255, g: 107, b: 107 } },
  { hex: '#ee5a24', name: 'Burnt Orange', rgb: { r: 238, g: 90, b: 36 } },
  { hex: '#f39c12', name: 'Amber', rgb: { r: 243, g: 156, b: 18 } },
  { hex: '#f1c40f', name: 'Gold', rgb: { r: 241, g: 196, b: 15 } },
  { hex: '#2ecc71', name: 'Emerald', rgb: { r: 46, g: 204, b: 113 } },
  { hex: '#00b894', name: 'Teal', rgb: { r: 0, g: 184, b: 148 } },
  { hex: '#00cec9', name: 'Cyan', rgb: { r: 0, g: 206, b: 201 } },
  { hex: '#0984e3', name: 'Azure', rgb: { r: 9, g: 132, b: 227 } },
  { hex: '#74b9ff', name: 'Sky', rgb: { r: 116, g: 185, b: 255 } },
  { hex: '#a29bfe', name: 'Lavender', rgb: { r: 162, g: 155, b: 254 } },
  { hex: '#fd79a8', name: 'Rose', rgb: { r: 253, g: 121, b: 168 } },
  { hex: '#ffffff', name: 'White', rgb: { r: 255, g: 255, b: 255 } },
  { hex: '#dfe6e9', name: 'Cloud', rgb: { r: 223, g: 230, b: 233 } },
  { hex: '#b2bec3', name: 'Silver', rgb: { r: 178, g: 190, b: 195 } },
  { hex: '#636e72', name: 'Slate', rgb: { r: 99, g: 110, b: 114 } },
  { hex: '#2d3436', name: 'Charcoal', rgb: { r: 45, g: 52, b: 54 } },
  { hex: '#000000', name: 'Black', rgb: { r: 0, g: 0, b: 0 } },
  { hex: '#8B4513', name: 'Saddle Brown', rgb: { r: 139, g: 69, b: 19 } },
  { hex: '#D2691E', name: 'Chocolate', rgb: { r: 210, g: 105, b: 30 } },
  { hex: '#F5DEB3', name: 'Wheat', rgb: { r: 245, g: 222, b: 179 } },
  { hex: '#DEB887', name: 'Burlywood', rgb: { r: 222, g: 184, b: 135 } },
];

export function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(result[1] ?? '0', 16),
    g: parseInt(result[2] ?? '0', 16),
    b: parseInt(result[3] ?? '0', 16),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
}
