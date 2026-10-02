import { useConfigStore, useProduct } from '../../store/useConfigStore';

export default function PresetSelector() {
  const { config, applyPreset } = useConfigStore();
  const product = useProduct();

  const presets = product.presets;

  if (presets.length === 0) {
    return (
      <div className="config-section">
        <h3 className="config-section-title">Presets</h3>
        <p style={{ opacity: 0.5, fontSize: 13 }}>No presets available for this product.</p>
      </div>
    );
  }

  return (
    <div className="config-section">
      <h3 className="config-section-title">Presets</h3>

      <div className="preset-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {presets.map((preset) => {
          const isActive = config.activePreset === preset.id;
          const colorValues = Object.values(preset.colors);

          return (
            <button
              key={preset.id}
              className={`preset-card ${isActive ? 'selected' : ''}`}
              onClick={() => applyPreset(preset.id)}
              style={{
                padding: '12px 10px',
                borderRadius: 8,
                border: isActive ? '2px solid var(--accent, #6366f1)' : '1px solid var(--border, #333)',
                background: isActive ? 'var(--accent-bg, rgba(99,102,241,0.15))' : 'var(--card-bg, rgba(255,255,255,0.04))',
                color: 'inherit',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div className="preset-card-name" style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                {preset.name}
              </div>

              <div className="preset-card-colors" style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                {colorValues.map((hex, i) => (
                  <span
                    key={`${preset.id}-${i}`}
                    className="preset-card-dot"
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: hex,
                      border: '1px solid rgba(255,255,255,0.15)',
                      display: 'inline-block',
                    }}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
