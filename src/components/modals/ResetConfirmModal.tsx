import { useEffect } from 'react';
import { useConfigStore } from '../../store/useConfigStore';
import useUIStore from '../../store/useUIStore';

export default function ResetConfirmModal() {
  const { resetConfirmOpen, setResetConfirmOpen, addToast } = useUIStore();
  const reset = useConfigStore((s) => s.reset);

  useEffect(() => {
    if (!resetConfirmOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setResetConfirmOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [resetConfirmOpen, setResetConfirmOpen]);

  if (!resetConfirmOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setResetConfirmOpen(false);
  };

  const handleReset = () => {
    reset();
    addToast('Design reset to defaults', 'success');
    setResetConfirmOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Confirm Reset">
        <div className="modal-header">
          <h3>Reset Design</h3>
          <button className="btn btn-icon" onClick={() => setResetConfirmOpen(false)} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to reset? All unsaved changes will be lost.</p>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={() => setResetConfirmOpen(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
