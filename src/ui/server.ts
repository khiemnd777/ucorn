import { serve } from 'bun';
import { fileURLToPath } from 'node:url';
import { routeRequest } from '../index.bun';

const assets = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
]);
const samples = new Map([
  ['/sample.json', '../../sample-data/well-5-holes-liner-hangers.json'],
  ['/sample-tubing.json', '../../sample-data/well-tubing-hanger.json'],
  ['/sample-packers.json', '../../sample-data/well-completion-packers.json'],
  ['/sample-crossover.json', '../../sample-data/well-completion-crossover.json'],
  ['/sample-joints.json', '../../sample-data/well-completion-joints.json'],
  ['/sample-seals.json', '../../sample-data/well-completion-seals.json'],
]);

export const uiRequest = async (request: Request): Promise<Response> => {
  const path = new URL(request.url).pathname;
  if (path === '/hole') return routeRequest(request);

  const asset = assets.get(path);
  const isSample = samples.has(path);
  if (!asset && !isSample) return new Response('Not Found', { status: 404 });
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', {
      status: 405, headers: { Allow: 'GET, HEAD' },
    });
  }

  const file = isSample
    ? new URL(samples.get(path)!, import.meta.url)
    : new URL(asset![0], import.meta.url);
  return new Response(request.method === 'HEAD' ? null : Bun.file(fileURLToPath(file.href)), {
    headers: {
      'Content-Type': isSample ? 'application/json' : asset![1],
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' blob:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
    },
  });
};

if (import.meta.main) {
  serve({ hostname: '127.0.0.1', port: 3001, fetch: uiRequest });
  console.log('JSON editor running on http://localhost:3001');
}
