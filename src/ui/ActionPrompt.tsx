import type { AssetManifest } from '../assets/definitions';
import { BUTTON_PROPERTIES } from '../core/actions';
import type { Action, InputView } from '../core/actions';
import { promptFor } from '../assets/gui';
import { packedSpriteStyle } from './atlas-ui';
export function ActionPrompt({
  manifest,
  input,
  action,
}: {
  manifest: AssetManifest | null;
  input: InputView;
  action: Action;
}) {
  const keyboard = input.device === 'keyboard';
  const button =
    action in BUTTON_PROPERTIES
      ? input[BUTTON_PROPERTIES[action as keyof typeof BUTTON_PROPERTIES]]
      : -1;
  const control = keyboard
    ? input.keys[action]
    : (['south', 'east', 'west', 'north'][button] ?? '');
  const label = keyboard
    ? control.startsWith('Key')
      ? control.slice(3)
      : control === 'Escape'
        ? 'Esc'
        : control
    : ({ 0: 'South', 1: 'East', 2: 'West', 3: 'North', 4: 'LB', 5: 'RB', 8: 'View', 9: 'Start' }[
        button
      ] ?? 'Button');
  const prompt =
    input.device === 'generic'
      ? undefined
      : promptFor(input.device === 'keyboard' ? 'keyboard-light' : input.device, control);
  const style = prompt ? packedSpriteStyle(manifest, prompt.rect, 2) : undefined;
  return (
    <kbd className={style ? 'sprite-key' : undefined}>
      {style && <span className="packed-key" aria-hidden="true" style={style} />}
      <span className={style ? 'visually-hidden' : undefined}>{prompt?.label ?? label}</span>
    </kbd>
  );
}
