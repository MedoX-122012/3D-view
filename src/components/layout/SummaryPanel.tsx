import { useMemo, useCallback } from 'react';
import { Palette, Ruler, Layers, Sparkles, ShoppingCart, Download } from 'lucide-react';
import { useConfigStore, useProduct, usePrice } from '../../store/useConfigStore';
import useUIStore from '../../store/useUIStore';
import { formatPrice } from '../../utils/pricing';
import type { TabId } from '../../store/useUIStore';

export default function SummaryPanel() {
  const product = useProduct();
  const config = useConfigStore((s) => s.config);
  const price = usePrice();
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const setExportModalOpen = useUIStore((s) => s.setExportModalOpen);
  const addToast = useUIStore((s) => s.addToast);
  const drawerOpen = useUIStore((s) => s.summaryDrawerOpen);

  const colorEntries = useMemo(() => Object.entries(config.colors), [config.colors]);
  const materialEntries = useMemo(() => Object.entries(config.materials), [config.materials]);

  const handleClick = useCallback((tab: TabId) => setActiveTab(tab), [setActiveTab]);

  return (
    <aside id="summary-panel" className={`summary-panel${drawerOpen ? ' drawer-open' : ''}`}>
      <div className="summary-header">
        <h2 className="summary-product-name">{product.name}</h2>
        <span className="summary-product-category">{product.category}</span>
      </div>
      <div className="summary-body">
        <div className="summary-section">
          <button className="summary-section-title" onClick={() => handleClick('colors')}>
            <Palette size={14} /> Colors
          </button>
          {colorEntries.map(([partId, hex]) => {
            const part = product.parts.find(p => p.id === partId);
            return (
              <div key={partId} className="summary-item" onClick={() => handleClick('colors')}>
                <span className="summary-item-label">{part?.name ?? partId}</span>
                <span className="summary-item-value">
                  <span className="summary-color-dot" style={{ backgroundColor: hex }} />
                  {(hex as string).toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>

        <div className="summary-section">
          <button className="summary-section-title" onClick={() => handleClick('materials')}>
            <Layers size={14} /> Materials
          </button>
          {materialEntries.map(([partId, mat]) => {
            const part = product.parts.find(p => p.id === partId);
            return (
              <div key={partId} className="summary-item" onClick={() => handleClick('materials')}>
                <span className="summary-item-label">{part?.name ?? partId}</span>
                <span className="summary-item-value">{String(mat)}</span>
              </div>
            );
          })}
        </div>

        <div className="summary-section">
          <button className="summary-section-title" onClick={() => handleClick('size')}>
            <Ruler size={14} /> Dimensions
          </button>
          {product.dimensions.map(dim => (
            <div key={dim.id} className="summary-item" onClick={() => handleClick('size')}>
              <span className="summary-item-label">{dim.name}</span>
              <span className="summary-item-value">
                {config.dimensions[dim.id] ?? dim.default} {dim.unit}
              </span>
            </div>
          ))}
        </div>

        <div className="summary-section">
          <button className="summary-section-title" onClick={() => handleClick('components')}>
            <Sparkles size={14} /> Components
          </button>
          {product.componentGroups.map(group => {
            const choiceId = config.components[group.id] ?? group.defaultChoice;
            const choice = group.options.find(o => o.id === choiceId);
            return (
              <div key={group.id} className="summary-item" onClick={() => handleClick('components')}>
                <span className="summary-item-label">{group.name}</span>
                <span className="summary-item-value">{choice?.name ?? choiceId}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="price-section">
        <div className="price-row">
          <span className="price-row-label">Base Price</span>
          <span className="price-row-value">{formatPrice(price.base)}</span>
        </div>
        {price.materialCost > 0 && (
          <div className="price-row">
            <span className="price-row-label">Materials</span>
            <span className="price-row-value">+{formatPrice(price.materialCost)}</span>
          </div>
        )}
        {price.colorCost > 0 && (
          <div className="price-row">
            <span className="price-row-label">Colors</span>
            <span className="price-row-value">+{formatPrice(price.colorCost)}</span>
          </div>
        )}
        {price.componentCost > 0 && (
          <div className="price-row">
            <span className="price-row-label">Components</span>
            <span className="price-row-value">+{formatPrice(price.componentCost)}</span>
          </div>
        )}
        {price.sizeCost > 0 && (
          <div className="price-row">
            <span className="price-row-label">Size</span>
            <span className="price-row-value">+{formatPrice(price.sizeCost)}</span>
          </div>
        )}
        <div className="price-row total">
          <span className="price-row-label">Total</span>
          <span className="price-row-value">{formatPrice(price.total)}</span>
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn btn-primary" onClick={() => addToast('Added to cart!', 'success')}>
          <ShoppingCart size={16} /> Add to Cart
        </button>
        <button className="btn btn-secondary" onClick={() => setExportModalOpen(true)}>
          <Download size={16} /> Export
        </button>
      </div>
    </aside>
  );
}
