import { useCallback, useEffect, useRef } from 'react';
import { Watch, Headphones, Armchair, Footprints, Backpack, X } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { useConfigStore } from '../../store/useConfigStore';
import useUIStore from '../../store/useUIStore';
import { formatPrice } from '../../utils/pricing';
import type { ProductId } from '../../types';

type Thumb = { gradient: string; Icon: typeof Watch };

const FALLBACK_THUMB: Thumb = {
  gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  Icon: Footprints,
};

const THUMBNAILS: Record<ProductId, Thumb> = {
  sneaker: { gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', Icon: Footprints },
  chair: { gradient: 'linear-gradient(135deg, #10b981, #14b8a6)', Icon: Armchair },
  headset: { gradient: 'linear-gradient(135deg, #ef4444, #f97316)', Icon: Headphones },
  watch: { gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', Icon: Watch },
  backpack: { gradient: 'linear-gradient(135deg, #6366f1, #3b82f6)', Icon: Backpack },
};

export default function ProductSelector() {
  const open = useUIStore((s) => s.productSelectorOpen);
  const setOpen = useUIStore((s) => s.setProductSelectorOpen);
  const currentId = useConfigStore((s) => s.config.productId);
  const setProduct = useConfigStore((s) => s.setProduct);
  const overlayRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), [setOpen]);

  const handleBackdrop = useCallback((e: React.MouseEvent) => {
    if (e.target === overlayRef.current) close();
  }, [close]);

  const select = useCallback((id: ProductId) => {
    setProduct(id);
    close();
  }, [setProduct, close]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  if (!open) return null;

  return (
    <div ref={overlayRef} className="modal-overlay" onClick={handleBackdrop}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Choose a Product</h3>
          <button className="modal-close" onClick={close}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="product-grid">
            {PRODUCTS.map(p => {
              const thumb = THUMBNAILS[p.id] ?? FALLBACK_THUMB;
              const selected = p.id === currentId;
              return (
                <button
                  key={p.id}
                  className={`product-card${selected ? ' selected' : ''}`}
                  onClick={() => select(p.id)}
                >
                  <div className="product-card-thumb" style={{ background: thumb.gradient }}>
                    <thumb.Icon size={40} strokeWidth={1.5} color="#fff" />
                  </div>
                  <div className="product-card-name">{p.name}</div>
                  <div className="product-card-category">{p.category}</div>
                  <div className="product-card-price">From {formatPrice(p.basePrice)}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
