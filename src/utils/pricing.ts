import type { ConfigurationState, Product, PriceBreakdown } from '../types';

export function calculatePrice(product: Product, config: ConfigurationState): PriceBreakdown {
  const base = product.basePrice;

  let materialCost = 0;
  for (const part of product.parts) {
    const matType = config.materials[part.id];
    if (!matType) continue;
    materialCost += product.pricing.materialModifier[matType] ?? 0;
  }

  const hasCustomColor = product.parts.some((part) => {
    const hex = config.colors[part.id];
    return hex !== undefined && hex.toLowerCase() !== part.defaultColor.toLowerCase();
  });
  const colorCost = hasCustomColor ? product.pricing.customColorFee : 0;

  let componentCost = 0;
  for (const groupId of Object.keys(config.components)) {
    const group = product.componentGroups.find((g) => g.id === groupId);
    if (group) {
      const choiceId = config.components[groupId];
      const choice = group.options.find((o) => o.id === choiceId);
      if (choice) componentCost += choice.priceModifier;
    }
  }

  let sizeCost = 0;
  for (const dim of product.dimensions) {
    const value = config.dimensions[dim.id];
    if (value === undefined) continue;
    const ratio = value / dim.default;
    sizeCost += Math.abs(ratio - 1) * product.pricing.sizeMultiplier * 10;
  }

  const total = base + materialCost + colorCost + componentCost + sizeCost;

  return {
    base,
    materialCost,
    colorCost,
    componentCost,
    sizeCost,
    total: Math.round(total * 100) / 100,
  };
}

export function formatPrice(price: number): string {
  return '$' + price.toFixed(2);
}
