import { useState, useEffect, useRef } from 'react';
import { useConfigStore } from '../../store/useConfigStore';
import useUIStore from '../../store/useUIStore';

function SaveForm({ onClose }: { onClose: () => void }) {
  const { addToast } = useUIStore();
  const saveDesign = useConfigStore((s) => s.saveDesign);

  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (saveDesign(trimmed)) {
      addToast('Design saved successfully!', 'success');
    } else {
      addToast('Could not save — storage is unavailable.', 'error');
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Save Design">
        <div className="modal-header">
          <h3>Save Design</h3>
          <button className="btn btn-icon" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">
          <label htmlFor="design-name">Design Name</label>
          <input
            ref={inputRef}
            id="design-name"
            type="text"
            className="input"
            placeholder="My awesome design"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
          />
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!name.trim()}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SaveModal() {
  const saveModalOpen = useUIStore((s) => s.saveModalOpen);
  const setSaveModalOpen = useUIStore((s) => s.setSaveModalOpen);

  useEffect(() => {
    if (!saveModalOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSaveModalOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [saveModalOpen, setSaveModalOpen]);

  if (!saveModalOpen) return null;

  return <SaveForm onClose={() => setSaveModalOpen(false)} />;
}
