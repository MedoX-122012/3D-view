import { Palette, Layers, Ruler, Sparkles, LayoutGrid } from 'lucide-react';
import useUIStore, { type TabId } from '../../store/useUIStore';
import ColorSelector from './ColorSelector';
import MaterialSelector from './MaterialSelector';
import SizeControls from './SizeControls';
import ComponentSelector from './ComponentSelector';
import PresetSelector from './PresetSelector';

const TABS: { id: TabId; label: string; Icon: typeof Palette }[] = [
  { id: 'colors', label: 'Colors', Icon: Palette },
  { id: 'materials', label: 'Materials', Icon: Layers },
  { id: 'size', label: 'Size', Icon: Ruler },
  { id: 'components', label: 'Parts', Icon: Sparkles },
  { id: 'presets', label: 'Presets', Icon: LayoutGrid },
];

const PANEL_MAP: Record<TabId, React.FC> = {
  colors: ColorSelector,
  materials: MaterialSelector,
  size: SizeControls,
  components: ComponentSelector,
  presets: PresetSelector,
};

export default function ConfigPanel() {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const drawerOpen = useUIStore((s) => s.configDrawerOpen);
  const Panel = PANEL_MAP[activeTab];

  return (
    <aside
      id="config-panel"
      className={`config-panel${drawerOpen ? ' drawer-open' : ''}`}
    >
      <div className="config-tabs">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`config-tab${activeTab === id ? ' active' : ''}`}
            onClick={() => setActiveTab(id)}
            title={label}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </div>
      <div className="config-content">
        <Panel />
      </div>
    </aside>
  );
}
