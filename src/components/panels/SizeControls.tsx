import { useConfigStore, useProduct } from '../../store/useConfigStore';

export default function SizeControls() {
  const { config, setDimension } = useConfigStore();
  const product = useProduct();

  const dimensions = product.dimensions;

  if (dimensions.length === 0) {
    return (
      <div className="config-section">
        <h3 className="config-section-title">Dimensions</h3>
        <p style={{ opacity: 0.5, fontSize: 13 }}>No dimensions available for this product.</p>
      </div>
    );
  }

  return (
    <div className="config-section">
      <h3 className="config-section-title">Dimensions</h3>

      {dimensions.map((dim) => {
        const currentValue = config.dimensions[dim.id] ?? dim.default;
        const step = dim.default % 1 === 0 && dim.min % 1 === 0 && dim.max % 1 === 0 ? 1 : 0.1;

        return (
          <div key={dim.id} className="slider-group" style={{ marginBottom: 16 }}>
            <div className="slider-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span className="slider-label" style={{ fontSize: 13, fontWeight: 500 }}>
                {dim.name}
              </span>
              <span className="slider-value" style={{ fontSize: 13, opacity: 0.7, fontFamily: 'monospace' }}>
                {currentValue}{dim.unit ? ` ${dim.unit}` : ''}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                className="slider-input"
                type="range"
                min={dim.min}
                max={dim.max}
                step={step}
                value={currentValue}
                onChange={(e) => setDimension(dim.id, Number(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--accent, #6366f1)' }}
              />
              <input
                type="number"
                min={dim.min}
                max={dim.max}
                step={step}
                value={currentValue}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= dim.min && val <= dim.max) {
                    setDimension(dim.id, val);
                  }
                }}
                style={{
                  width: 60,
                  padding: '3px 6px',
                  borderRadius: 4,
                  border: '1px solid var(--border, #333)',
                  background: 'var(--input-bg, #1a1a2e)',
                  color: 'inherit',
                  fontSize: 12,
                  textAlign: 'center',
                }}
              />
              <button
                onClick={() => setDimension(dim.id, dim.default)}
                title="Reset to default"
                style={{
                  padding: '3px 8px',
                  borderRadius: 4,
                  border: '1px solid var(--border, #333)',
                  background: 'transparent',
                  color: 'inherit',
                  cursor: 'pointer',
                  fontSize: 11,
                  opacity: 0.6,
                  whiteSpace: 'nowrap',
                }}
              >
                Reset
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
