import { useEffect } from 'react';
import { useConfigStore, usePrice } from '../../store/useConfigStore';
import useUIStore from '../../store/useUIStore';
import { formatPrice } from '../../utils/pricing';

export default function ExportModal() {
  const { exportModalOpen, setExportModalOpen, addToast } = useUIStore();
  const config = useConfigStore((s) => s.config);
  const price = usePrice();

  useEffect(() => {
    if (!exportModalOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExportModalOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [exportModalOpen, setExportModalOpen]);

  if (!exportModalOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setExportModalOpen(false);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design.json';
    a.click();
    URL.revokeObjectURL(url);
    addToast('JSON exported!', 'success');
  };

  const exportPreview = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      addToast('No canvas found', 'error');
      return;
    }
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design-preview.png';
    a.click();
    addToast('Preview exported!', 'success');
  };

  const copySummary = async () => {
    const lines = [
      `Product: ${config.productId}`,
      `Colors: ${Object.entries(config.colors).map(([k, v]) => `${k}: ${v}`).join(', ')}`,
      `Materials: ${Object.entries(config.materials).map(([k, v]) => `${k}: ${v}`).join(', ')}`,
      `Total Price: ${formatPrice(price.total)}`,
    ];
    const text = lines.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      addToast('Summary copied!', 'success');
    } catch {
      addToast('Failed to copy', 'error');
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Export Design">
        <div className="modal-header">
          <h3>Export Design</h3>
          <button className="btn btn-icon" onClick={() => setExportModalOpen(false)} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">
          <button className="btn export-option" onClick={exportJSON}>
            Export JSON
          </button>
          <button className="btn export-option" onClick={exportPreview}>
            Export Preview
          </button>
          <button className="btn export-option" onClick={copySummary}>
            Copy Summary
          </button>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={() => setExportModalOpen(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
