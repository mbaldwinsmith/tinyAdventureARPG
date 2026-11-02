import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

/** Development-only previews: never copy the full paid-art catalogue into public/dist. */
export function cataloguePlugin(): Plugin {
  const cache = fileURLToPath(new URL('../.cache/catalogue/', import.meta.url));
  return {
    name: 'tiny-adventure-catalogue',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__catalogue', (request, response) => {
        const name = (request.url ?? '').split('?')[0]?.replace(/^\//, '') ?? '';
        if (name !== 'index.json' && !/^sprite-[a-f0-9]{16}\.png$/.test(name)) {
          response.statusCode = 404;
          response.end('Unknown catalogue asset');
          return;
        }
        void readFile(path.join(cache, name))
          .then((bytes) => {
            response.setHeader(
              'Content-Type',
              name.endsWith('.png') ? 'image/png' : 'application/json; charset=utf-8',
            );
            response.setHeader('Cache-Control', 'no-cache');
            response.end(bytes);
          })
          .catch(() => {
            response.statusCode = 404;
            response.end('Catalogue unavailable. Run npm run catalogue:build.');
          });
      });
    },
  };
}
