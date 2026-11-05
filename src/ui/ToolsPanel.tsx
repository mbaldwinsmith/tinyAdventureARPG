import type { GameBridge, GameSnapshot } from '../bridge/game-bridge';
import { activeToolSchema } from '../core/tool-model';
export function ToolsPanel({ bridge, snapshot }: { bridge: GameBridge; snapshot: GameSnapshot }) {
  const tools = snapshot.tools;
  if (!tools) return null;
  const busy =
    snapshot.paused ||
    !!snapshot.saves?.busy ||
    !!snapshot.saves?.pending ||
    snapshot.status !== 'ready';
  const focus = () =>
    requestAnimationFrame(() => document.querySelector<HTMLElement>('.game-canvas')?.focus());
  return (
    <section className="tools-panel" aria-label="Tools and trail">
      <div>
        <p className="eyebrow">AN ANSWER FOR EACH OBSTACLE</p>
        <h2>{tools.active ? 'The wayfarer’s tool trail' : 'Find another way through'}</h2>
        <p className="small-copy">
          The north woodland path leads to the tool trail. Collect its permanent kit, then choose a
          tool in your pack. Arrows, hooks and boomerangs use cooldowns. Bombs and magic use
          regenerating energy. No ammunition.
        </p>
      </div>
      {tools.nearby && (
        <div className="tool-hint">
          <strong>{tools.nearby.name}</strong>
          <p>{tools.nearby.hint}</p>
        </div>
      )}
      {tools.active && (
        <>
          <p className="small-copy">
            {tools.orange ? 'Orange O raised · blue B lowered' : 'Blue B raised · orange O lowered'}
            . The matching diamond levers work from both sides. Pots and crates can be lifted with E
            / south, set down with E, or thrown with X / RT. Heavy weights use selected Push / Pull.
          </p>
          <details>
            <summary>Trail passages</summary>
            <ul>
              {tools.solved.map((s) => (
                <li key={s.id}>
                  {s.solved ? 'Open' : 'Unsolved'} · {s.name}
                </li>
              ))}
            </ul>
          </details>
        </>
      )}
      <div className="tool-context-actions">
        {(['bomb', 'boomerang', 'hook', 'magic', 'push', 'pull'] as const).map((tool) => (
          <button
            key={tool}
            className="button button-subtle"
            disabled={busy}
            onClick={() => {
              bridge.send({ type: 'tool.action', tool: activeToolSchema.parse(tool) });
              focus();
            }}
          >
            {tool === 'magic'
              ? 'Cast magic'
              : tool === 'bomb'
                ? 'Place bomb'
                : tool === 'push'
                  ? 'Push weight'
                  : tool === 'pull'
                    ? 'Pull weight'
                    : `Use ${tool}`}
          </button>
        ))}
        <button
          className="button button-subtle"
          disabled={busy}
          onClick={() => {
            bridge.send({ type: 'tool.lift-bomb' });
            focus();
          }}
        >
          Lift nearby bomb
        </button>
        <button
          className="button button-subtle"
          disabled={busy}
          onClick={() => {
            bridge.send({ type: 'tool.throw' });
            focus();
          }}
        >
          Throw carried object
        </button>
      </div>
      {tools.feedback && (
        <p className="pack-feedback" data-testid="tool-feedback" aria-live="polite">
          {tools.feedback}
        </p>
      )}
      {tools.effects.length > 0 && (
        <p className="small-copy" data-testid="tool-effects">
          Active: {tools.effects.map((e) => `${e.kind} · ${e.phase}`).join(', ')}
        </p>
      )}
    </section>
  );
}
