import { useConfigStore, useProduct } from '../../store/useConfigStore';

export default function ComponentSelector() {
  const { config, setComponent } = useConfigStore();
  const product = useProduct();

  const groups = product.componentGroups;

  if (groups.length === 0) {
    return (
      <div className="config-section">
        <h3 className="config-section-title">Components</h3>
        <p style={{ opacity: 0.5, fontSize: 13 }}>No components available for this product.</p>
      </div>
    );
  }

  return (
    <div className="config-section">
      <h3 className="config-section-title">Components</h3>

      {groups.map((group) => {
        const selectedChoice = config.components[group.id] ?? group.defaultChoice;

        return (
          <div key={group.id} style={{ marginBottom: 16 }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, opacity: 0.8 }}>
              {group.name}
            </h4>

            <div className="component-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {group.options.map((option) => {
                const isActive = selectedChoice === option.id;

                return (
                  <button
                    key={option.id}
                    className={`component-option ${isActive ? 'selected' : ''}`}
                    onClick={() => setComponent(group.id, option.id)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 8,
                      border: isActive ? '2px solid var(--accent, #6366f1)' : '1px solid var(--border, #333)',
                      background: isActive ? 'var(--accent-bg, rgba(99,102,241,0.15))' : 'var(--card-bg, rgba(255,255,255,0.04))',
                      color: 'inherit',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    <div className="component-option-name" style={{ fontSize: 13, fontWeight: 600 }}>
                      {option.name}
                    </div>
                    {option.priceModifier !== 0 && (
                      <div className="component-option-price" style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>
                        {option.priceModifier > 0 ? `+$${option.priceModifier}` : `-$${Math.abs(option.priceModifier)}`}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
