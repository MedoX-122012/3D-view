import { useEffect } from 'react';
import { RotateCcw, Maximize2, Eye, Monitor, ArrowUp } from 'lucide-react';
import useUIStore from '../../store/useUIStore';

function dispatchCamera(action: string) {
  window.dispatchEvent(new CustomEvent('camera-action', { detail: action }));
}

const buttons = [
  { id: 'reset', icon: RotateCcw, label: 'Reset Camera', action: 'reset' },
  { id: 'front', icon: Eye, label: 'Front View', action: 'front' },
  { id: 'side', icon: Monitor, label: 'Side View', action: 'side' },
  { id: 'top', icon: ArrowUp, label: 'Top View', action: 'top' },
] as const;

export function CameraToolbar() {
  const isFullscreen = useUIStore((s) => s.isFullscreen);
  const setIsFullscreen = useUIStore((s) => s.setIsFullscreen);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, [setIsFullscreen]);

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      return;
    }
    const container = document.querySelector<HTMLElement>('.viewport-container');
    const target = container ?? document.documentElement;
    target.requestFullscreen().catch(() => {});
  }

  return (
    <div className="camera-toolbar">
      {buttons.map(({ id, icon: Icon, label, action }) => (
        <button
          key={id}
          className="camera-btn"
          title={label}
          onClick={() => dispatchCamera(action)}
        >
          <Icon size={16} />
        </button>
      ))}

      <button
        className="camera-btn"
        title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        onClick={toggleFullscreen}
      >
        <Maximize2 size={16} />
      </button>
    </div>
  );
}
