import { useConfigStore, useProduct } from '../../store/useConfigStore';
import useUIStore from '../../store/useUIStore';
import type { MaterialType } from '../../types';

export default function MaterialSelector() {
  const { config, setMaterial } = useConfigStore();
  const product = useProduct();
  const { selectedPart, setSelectedPart } = useUIStore();

  const activePart = selectedPart ?? product.parts[0]?.id;
  const activePartData = product.parts.find((p) => p.id === activePart);
  const currentMaterial = activePart ? config.materials[activePart] : undefined;

  const availableMaterials = product.materials;

  const handleSelect = (materialId: MaterialType) => {
    if (!activePart) return;
    setMaterial(activePart, materialId);
  };

  return (
    <div className="config-section">
      <h3 className="config-section-title">Material</h3>

      <div className="part-selector" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
        {product.parts.map((part) => (
          <button
            key={part.id}
            onClick={() => setSelectedPart(part.id)}
            style={{
              flex: '0 0 auto',
              padding: '4px 10px',
              borderRadius: 6,
              border: part.id === activePart ? '2px solid var(--accent, #6366f1)' : '1px solid var(--border, #333)',
              background: part.id === activePart ? 'var(--accent-bg, rgba(99,102,241,0.15))' : 'transparent',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: 12,
              whiteSpace: 'nowrap',
            }}
          >
            {part.name}
          </button>
        ))}
      </div>

      {activePartData && (
        <p style={{ margin: '8px 0 4px', fontSize: 13, opacity: 0.7 }}>
          {activePartData.name}
        </p>
      )}

      <div className="material-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 8 }}>
        {availableMaterials.map((matId) => {
          const isActive = currentMaterial === matId;
          const pricing = product.pricing.materialModifier[matId];
          const label = matId.charAt(0).toUpperCase() + matId.slice(1);

          return (
            <button
              key={matId}
              className={`material-card ${isActive ? 'selected' : ''}`}
              onClick={() => handleSelect(matId)}
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
              <div className="material-card-name" style={{ fontSize: 13, fontWeight: 600 }}>
                {label}
              </div>
              {pricing > 0 && (
                <div className="material-card-price" style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>
                  +${pricing}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
