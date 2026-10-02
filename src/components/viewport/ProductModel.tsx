import { Suspense } from 'react';
import { useConfigStore } from '../../store/useConfigStore';
import { SneakerModel } from './models/SneakerModel';
import { ChairModel } from './models/ChairModel';
import { HeadsetModel } from './models/HeadsetModel';
import { WatchModel } from './models/WatchModel';
import { BackpackModel } from './models/BackpackModel';

const MODEL_MAP = {
  sneaker: SneakerModel,
  chair: ChairModel,
  headset: HeadsetModel,
  watch: WatchModel,
  backpack: BackpackModel,
} as const;

export function ProductModel() {
  const productId = useConfigStore((s) => s.config.productId);
  const Model = MODEL_MAP[productId];

  return (
    <group rotation={[0, 0, 0]}>
      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </group>
  );
}
