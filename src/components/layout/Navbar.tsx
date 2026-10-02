import { useCallback } from 'react';
import { Undo2, Redo2, RotateCcw, Save, Share2, Sun, Moon, Package, FolderOpen } from 'lucide-react';
import { useConfigStore, useProduct } from '../../store/useConfigStore';
import useUIStore from '../../store/useUIStore';

export default function Navbar() {
  const product = useProduct();
  const undo = useConfigStore((s) => s.undo);
  const redo = useConfigStore((s) => s.redo);
  const canUndo = useConfigStore((s) => s.canUndo);
  const canRedo = useConfigStore((s) => s.canRedo);

  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const setResetConfirmOpen = useUIStore((s) => s.setResetConfirmOpen);
  const setSaveModalOpen = useUIStore((s) => s.setSaveModalOpen);
  const setShareModalOpen = useUIStore((s) => s.setShareModalOpen);
  const setProductSelectorOpen = useUIStore((s) => s.setProductSelectorOpen);
  const setSavedDesignsOpen = useUIStore((s) => s.setSavedDesignsOpen);

  const handleUndo = useCallback(() => { if (canUndo()) undo(); }, [undo, canUndo]);
  const handleRedo = useCallback(() => { if (canRedo()) redo(); }, [redo, canRedo]);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Package size={20} />
        <span>Studio 3D</span>
        <span className="navbar-divider">/</span>
        <button
          className="navbar-product-name"
          onClick={() => setProductSelectorOpen(true)}
          title="Change product"
        >
          {product.name}
        </button>
      </div>
      <div className="navbar-actions">
        <button className="navbar-btn" onClick={handleUndo} disabled={!canUndo()} title="Undo">
          <Undo2 size={16} />
        </button>
        <button className="navbar-btn" onClick={handleRedo} disabled={!canRedo()} title="Redo">
          <Redo2 size={16} />
        </button>
        <button className="navbar-btn" onClick={() => setResetConfirmOpen(true)} title="Reset">
          <RotateCcw size={16} />
        </button>
        <div className="navbar-separator" />
        <button className="navbar-btn" onClick={() => setSaveModalOpen(true)} title="Save">
          <Save size={16} />
        </button>
        <button
          className="navbar-btn"
          onClick={() => setSavedDesignsOpen(true)}
          title="Saved designs"
        >
          <FolderOpen size={16} />
        </button>
        <button className="navbar-btn" onClick={() => setShareModalOpen(true)} title="Share">
          <Share2 size={16} />
        </button>
        <div className="navbar-separator" />
        <button className="navbar-btn" onClick={toggleTheme} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </nav>
  );
}
