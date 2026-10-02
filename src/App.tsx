import { useEffect } from 'react';
import { SlidersHorizontal, ReceiptText } from 'lucide-react';
import useUIStore from './store/useUIStore';
import { useConfigStore } from './store/useConfigStore';
import type { ConfigurationState } from './types';
import Navbar from './components/layout/Navbar';
import ProductViewport from './components/viewport/ProductViewport';
import ConfigPanel from './components/panels/ConfigPanel';
import SummaryPanel from './components/layout/SummaryPanel';
import ProductSelector from './components/layout/ProductSelector';
import SaveModal from './components/modals/SaveModal';
import ShareModal from './components/modals/ShareModal';
import ExportModal from './components/modals/ExportModal';
import ResetConfirmModal from './components/modals/ResetConfirmModal';
import SavedDesignsModal from './components/modals/SavedDesignsModal';
import ToastSystem from './components/ui/ToastSystem';

const HASH_PREFIX = '#config=';

function decodeSharePayload(raw: string): unknown {
  try {
    return JSON.parse(atob(raw));
  } catch {
    try {
      return JSON.parse(decodeURIComponent(raw));
    } catch {
      return null;
    }
  }
}

function readSharedConfig(): ConfigurationState | null {
  const { hash } = window.location;
  if (!hash.startsWith(HASH_PREFIX)) return null;
  const parsed = decodeSharePayload(hash.slice(HASH_PREFIX.length));
  if (!parsed || typeof parsed !== 'object') return null;
  if (typeof (parsed as { productId?: unknown }).productId !== 'string') return null;
  return parsed as ConfigurationState;
}

function App() {
  const theme = useUIStore((s) => s.theme);
  const configDrawerOpen = useUIStore((s) => s.configDrawerOpen);
  const summaryDrawerOpen = useUIStore((s) => s.summaryDrawerOpen);
  const toggleConfigDrawer = useUIStore((s) => s.toggleConfigDrawer);
  const toggleSummaryDrawer = useUIStore((s) => s.toggleSummaryDrawer);
  const closeDrawers = useUIStore((s) => s.closeDrawers);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const shared = readSharedConfig();
    if (!shared) return;
    const before = useConfigStore.getState().config;
    useConfigStore.getState().applyConfig(shared);
    const after = useConfigStore.getState().config;
    if (before !== after) {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
    }
  }, []);

  useEffect(() => {
    if (!configDrawerOpen && !summaryDrawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawers();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [configDrawerOpen, summaryDrawerOpen, closeDrawers]);

  return (
    <div className="app">
      <Navbar />
      <div className="app-main">
        <ConfigPanel />
        <ProductViewport />
        <SummaryPanel />

        <div className="drawer-tabs">
          <button
            className={`drawer-tab drawer-tab-left${configDrawerOpen ? ' active' : ''}`}
            onClick={toggleConfigDrawer}
            aria-expanded={configDrawerOpen}
            aria-controls="config-panel"
          >
            <SlidersHorizontal size={16} />
            <span>Customize</span>
          </button>
          <button
            className={`drawer-tab drawer-tab-right${summaryDrawerOpen ? ' active' : ''}`}
            onClick={toggleSummaryDrawer}
            aria-expanded={summaryDrawerOpen}
            aria-controls="summary-panel"
          >
            <ReceiptText size={16} />
            <span>Summary</span>
          </button>
        </div>

        {(configDrawerOpen || summaryDrawerOpen) && (
          <div className="drawer-backdrop" onClick={closeDrawers} />
        )}
      </div>

      <ProductSelector />
      <SaveModal />
      <ShareModal />
      <ExportModal />
      <ResetConfirmModal />
      <SavedDesignsModal />
      <ToastSystem />
    </div>
  );
}

export default App;
