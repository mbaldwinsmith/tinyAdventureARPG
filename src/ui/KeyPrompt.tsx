import type { AssetManifest } from '../assets/definitions';
import { promptFor } from '../assets/gui';
import { packedSpriteStyle } from './atlas-ui';
export function KeyPrompt({
  manifest,
  control,
  label,
}: {
  manifest: AssetManifest | null;
  control: string;
  label: string;
}) {
  const prompt = promptFor('keyboard-light', control),
    style = prompt ? packedSpriteStyle(manifest, prompt.rect, 2) : undefined;
  return (
    <kbd className={style ? 'sprite-key' : undefined}>
      {style && <span aria-hidden="true" className="packed-key" style={style} />}
      <span className={style ? 'visually-hidden' : undefined}>{label}</span>
    </kbd>
  );
}
