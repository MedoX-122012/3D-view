import { useEffect, useRef, useMemo } from 'react';
import { useConfigStore } from '../../store/useConfigStore';
import useUIStore from '../../store/useUIStore';

export default function ShareModal() {
  const { shareModalOpen, setShareModalOpen, addToast } = useUIStore();
  const config = useConfigStore((s) => s.config);

  const inputRef = useRef<HTMLInputElement>(null);

  const shareUrl = useMemo(() => {
    const encoded = btoa(JSON.stringify(config));
    const base = window.location.origin + window.location.pathname;
    return `${base}#config=${encoded}`;
  }, [config]);

  useEffect(() => {
    if (!shareModalOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShareModalOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [shareModalOpen, setShareModalOpen]);

  if (!shareModalOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      addToast('Copied to clipboard!', 'success');
    } catch {
      inputRef.current?.select();
      document.execCommand('copy');
      addToast('Copied to clipboard!', 'success');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setShareModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Share Design">
        <div className="modal-header">
          <h3>Share Design</h3>
          <button className="btn btn-icon" onClick={() => setShareModalOpen(false)} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">
          <label htmlFor="share-url">Shareable Link</label>
          <input
            ref={inputRef}
            id="share-url"
            type="text"
            className="input"
            readOnly
            value={shareUrl}
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={() => setShareModalOpen(false)}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handleCopy}>
            Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
}
