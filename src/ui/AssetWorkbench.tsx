import { useEffect, useState } from 'react';
import type { SpriteCatalogue } from '../assets/catalogue-types';
import { catalogueSchema } from '../assets/catalogue-schema';
import { manifestSchema } from '../assets/definitions';
import type { AssetManifest } from '../assets/definitions';
import { AssetInspector } from './AssetInspector';

export default function AssetWorkbench({ onClose }: { onClose: () => void }) {
  const [catalogue, setCatalogue] = useState<SpriteCatalogue | null>(null);
  const [textures, setTextures] = useState<AssetManifest['assets']>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    void Promise.all([
      fetch('/__catalogue/index.json', { signal: controller.signal }),
      fetch(`${import.meta.env.BASE_URL}generated/manifest.json`, { signal: controller.signal }),
    ])
      .then(async ([catalogueResponse, manifestResponse]) => {
        if (!catalogueResponse.ok || !manifestResponse.ok)
          throw new Error('The development catalogue is unavailable. Run npm run catalogue:build.');
        const next = catalogueSchema.parse(await catalogueResponse.json());
        const manifest = manifestSchema.parse(await manifestResponse.json());
        if (controller.signal.aborted) return;
        setCatalogue(next);
        setTextures(manifest.assets);
        setSelectedId(
          manifest.assets.find((texture) => texture.id === 'hero-1-idle')?.canonicalId ??
            next.assets[0]?.id ??
            '',
        );
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted)
          setError(cause instanceof Error ? cause.message : 'Catalogue could not load.');
      });
    return () => controller.abort();
  }, []);
  const selected = catalogue?.assets.find((asset) => asset.id === selectedId);
  const filtered =
    catalogue?.assets.filter(
      (asset) =>
        (!category || asset.category === category) &&
        `${asset.identity} ${asset.id} ${asset.auditId} ${asset.suggestedUse} ${asset.groups.join(' ')} ${asset.sources.map((source) => source.archive + ' ' + source.path).join(' ')}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    ) ?? [];
  const related =
    catalogue?.assets.filter(
      (asset) =>
        asset.id !== selected?.id &&
        asset.groups.some((group) =>
          [...(selected?.groups ?? []), ...(selected?.relatedGroups ?? [])].includes(group),
        ),
    ) ?? [];
  const pageSize = 24;
  return (
    <section className="asset-workbench" aria-label="Sprite workbench">
      <div className="workbench-heading">
        <div>
          <p className="eyebrow">DEVELOPMENT REFERENCE</p>
          <h2>Sprite & animation workbench</h2>
        </div>
        <button className="button button-subtle" onClick={onClose}>
          Close workbench
        </button>
      </div>
      {error && <p role="alert">{error}</p>}
      {!catalogue && !error && <p>Loading reviewed source mappings…</p>}
      {catalogue && (
        <>
          <p data-testid="catalogue-summary">
            {catalogue.counts.archives} archives · {catalogue.counts.png_entries} PNG occurrences ·{' '}
            {catalogue.counts.unique_pngs} canonical images ·{' '}
            {catalogue.counts.support_text_entries} support-text entries
          </p>
          <div className="catalogue-filters">
            <label>
              Search sprites
              <input
                aria-label="Search sprites"
                type="search"
                value={query}
                placeholder="Try: boomerang, hook, mushroom…"
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(0);
                }}
              />
            </label>
            <label>
              Category
              <select
                aria-label="Sprite category"
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setPage(0);
                }}
              >
                <option value="">All categories</option>
                {[...new Set(catalogue.assets.map((asset) => asset.category))]
                  .sort()
                  .map((name) => (
                    <option key={name}>{name}</option>
                  ))}
              </select>
            </label>
            <span>{filtered.length} matches</span>
          </div>
          <div className="workbench-columns">
            <div className="catalogue-browser">
              <div className="catalogue-grid">
                {filtered.slice(page * pageSize, (page + 1) * pageSize).map((asset) => (
                  <button
                    key={asset.id}
                    className={`catalogue-card ${asset.id === selectedId ? 'selected' : ''}`}
                    onClick={() => setSelectedId(asset.id)}
                  >
                    <span className="catalogue-thumbnail">
                      <img loading="lazy" src={`/__catalogue/${asset.id}.png`} alt="" />
                    </span>
                    <strong>{asset.identity}</strong>
                    <small>
                      {asset.auditId} · {asset.width}×{asset.height}px
                    </small>
                  </button>
                ))}
              </div>
              <div className="catalogue-pagination">
                <button
                  className="button button-subtle"
                  disabled={page === 0}
                  onClick={() => setPage((value) => value - 1)}
                >
                  Previous
                </button>
                <span>
                  {page + 1} / {Math.max(1, Math.ceil(filtered.length / pageSize))}
                </span>
                <button
                  className="button button-subtle"
                  disabled={(page + 1) * pageSize >= filtered.length}
                  onClick={() => setPage((value) => value + 1)}
                >
                  Next
                </button>
              </div>
            </div>
            <div>
              {selected && (
                <>
                  <AssetInspector key={selected.id} asset={selected} textures={textures} />
                  <details>
                    <summary>Companion sets & related images</summary>
                    <p>{selected.groups.join(', ')}</p>
                    <p>{selected.relatedGroups.join(', ')}</p>
                    <div className="companion-links">
                      {related.map((other) => {
                        const id = other.id;
                        return (
                          <button key={id} onClick={() => setSelectedId(id)}>
                            {other?.auditId} {other?.identity}
                          </button>
                        );
                      })}
                    </div>
                  </details>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
