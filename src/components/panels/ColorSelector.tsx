import { useState } from 'react';
import { useConfigStore, useProduct } from '../../store/useConfigStore';
import useUIStore from '../../store/useUIStore';
import type { RGB } from '../../types';
import { COLOR_PALETTE, hexToRgb, rgbToHex } from '../../data/colors';

export default function ColorSelector() {
  const { config, setColor } = useConfigStore();
  const product = useProduct();
  const { selectedPart, setSelectedPart } = useUIStore();

  const activePart = selectedPart ?? product.parts[0]?.id;
  const activePartData = product.parts.find((p) => p.id === activePart);
  const currentColor = activePart ? config.colors[activePart] ?? '#ffffff' : '#ffffff';

  const [hexInput, setHexInput] = useState(currentColor);
  const [prevColor, setPrevColor] = useState(currentColor);

  if (prevColor !== currentColor) {
    setPrevColor(currentColor);
    setHexInput(currentColor);
  }

  const rgb = hexToRgb(currentColor);

  const applyColor = (hex: string) => {
    if (!activePart) return;
    setColor(activePart, hex);
  };

  const handleHexChange = (val: string) => {
    setHexInput(val);
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      applyColor(val);
    }
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', val: number) => {
    const next: RGB = { r: rgb.r, g: rgb.g, b: rgb.b };
    next[channel] = Math.max(0, Math.min(255, val));
    applyColor(rgbToHex(next.r, next.g, next.b));
  };

  return (
    <div className="config-section">
      <h3 className="config-section-title">Color</h3>

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

      <div className="color-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, marginTop: 8 }}>
        {COLOR_PALETTE.map((swatch) => (
          <button
            key={swatch.hex}
            className={`color-swatch ${currentColor.toLowerCase() === swatch.hex.toLowerCase() ? 'selected' : ''}`}
            onClick={() => applyColor(swatch.hex)}
            title={swatch.name}
            style={{
              width: '100%',
              aspectRatio: '1',
              borderRadius: 6,
              border: currentColor.toLowerCase() === swatch.hex.toLowerCase()
                ? '2px solid var(--accent, #6366f1)'
                : '2px solid transparent',
              background: swatch.hex,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}
          />
        ))}
      </div>

      <div className="color-picker-custom" style={{ marginTop: 12 }}>
        <div className="color-input-row" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 12, opacity: 0.7 }}>HEX</span>
          <input
            className="color-hex-input"
            type="text"
            value={hexInput}
            onChange={(e) => handleHexChange(e.target.value)}
            onBlur={() => {
              if (/^#[0-9a-fA-F]{6}$/.test(hexInput)) {
                applyColor(hexInput);
              } else {
                setHexInput(currentColor);
              }
            }}
            style={{
              flex: 1,
              padding: '4px 8px',
              borderRadius: 4,
              border: '1px solid var(--border, #333)',
              background: 'var(--input-bg, #1a1a2e)',
              color: 'inherit',
              fontSize: 13,
              fontFamily: 'monospace',
            }}
          />
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 4,
              background: currentColor,
              border: '1px solid var(--border, #333)',
              flexShrink: 0,
            }}
          />
        </div>

        {(['r', 'g', 'b'] as const).map((ch) => (
          <div key={ch} className="color-input" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 12, width: 14, textTransform: 'uppercase', opacity: 0.7 }}>{ch}</span>
            <input
              type="range"
              min={0}
              max={255}
              step={1}
              value={ch === 'r' ? rgb.r : ch === 'g' ? rgb.g : rgb.b}
              onChange={(e) => handleRgbChange(ch, Number(e.target.value))}
              style={{ flex: 1, accentColor: ch === 'r' ? '#e94560' : ch === 'g' ? '#2ecc71' : '#0984e3' }}
            />
            <input
              type="number"
              min={0}
              max={255}
              value={ch === 'r' ? rgb.r : ch === 'g' ? rgb.g : rgb.b}
              onChange={(e) => handleRgbChange(ch, Number(e.target.value))}
              style={{
                width: 52,
                padding: '2px 4px',
                borderRadius: 4,
                border: '1px solid var(--border, #333)',
                background: 'var(--input-bg, #1a1a2e)',
                color: 'inherit',
                fontSize: 12,
                textAlign: 'center',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
