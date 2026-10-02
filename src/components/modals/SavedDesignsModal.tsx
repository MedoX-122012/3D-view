import { useState, useEffect } from 'react';
import { useConfigStore } from '../../store/useConfigStore';
import useUIStore from '../../store/useUIStore';

export default function SavedDesignsModal() {
  const { savedDesignsOpen, setSavedDesignsOpen, addToast } = useUIStore();
  const { savedDesigns, loadDesign, deleteDesign, renameDesign, duplicateDesign } =
    useConfigStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (!savedDesignsOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSavedDesignsOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [savedDesignsOpen, setSavedDesignsOpen]);

  if (!savedDesignsOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setSavedDesignsOpen(false);
  };

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const startRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const confirmRename = () => {
    if (editingId && editName.trim()) {
      if (renameDesign(editingId, editName.trim())) {
        addToast('Design renamed', 'success');
      } else {
        addToast('Could not save — storage is unavailable.', 'error');
      }
    }
    setEditingId(null);
    setEditName('');
  };

  const handleDelete = (id: string, name: string) => {
    if (deleteDesign(id)) {
      addToast(`"${name}" deleted`, 'info');
    } else {
      addToast('Could not save — storage is unavailable.', 'error');
    }
  };

  const handleDuplicate = (id: string) => {
    if (duplicateDesign(id)) {
      addToast('Design duplicated', 'success');
    } else {
      addToast('Could not save — storage is unavailable.', 'error');
    }
  };

  const handleLoad = (id: string) => {
    loadDesign(id);
    addToast('Design loaded', 'success');
    setSavedDesignsOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Saved Designs">
        <div className="modal-header">
          <h3>Saved Designs</h3>
          <button className="btn btn-icon" onClick={() => setSavedDesignsOpen(false)} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">
          {savedDesigns.length === 0 ? (
            <p className="empty-state">No saved designs yet. Create and save a design to see it here.</p>
          ) : (
            <ul className="saved-designs-list">
              {savedDesigns.map((design) => (
                <li key={design.id} className="saved-design-item">
                  {editingId === design.id ? (
                    <div className="saved-design-rename">
                      <input
                        className="input"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') confirmRename();
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        autoFocus
                      />
                      <button className="btn btn-primary btn-sm" onClick={confirmRename}>
                        Save
                      </button>
                      <button className="btn btn-sm" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="saved-design-info">
                        <span className="saved-design-name">{design.name}</span>
                        <span className="saved-design-date">{formatDate(design.createdAt)}</span>
                      </div>
                      <div className="saved-design-actions">
                        <button className="btn btn-primary btn-sm" onClick={() => handleLoad(design.id)}>
                          Load
                        </button>
                        <button className="btn btn-sm" onClick={() => startRename(design.id, design.name)}>
                          Rename
                        </button>
                        <button className="btn btn-sm" onClick={() => handleDuplicate(design.id)}>
                          Duplicate
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(design.id, design.name)}>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={() => setSavedDesignsOpen(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
