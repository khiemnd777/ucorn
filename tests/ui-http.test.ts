import { afterAll, beforeAll, expect, test } from 'bun:test';
import { serve } from 'bun';
import { uiRequest } from '../src/ui/server';

let server: ReturnType<typeof serve>;
let baseUrl: string;
beforeAll(() => {
  server = serve({ port: 0, hostname: '127.0.0.1', fetch: uiRequest });
  baseUrl = `http://127.0.0.1:${server.port}`;
});
afterAll(() => server?.stop(true));

test('UI serves local assets with restricted content policy', async () => {
  for (const [path, type] of [['/', 'text/html'], ['/app.js', 'text/javascript'], ['/styles.css', 'text/css']]) {
    const response = await fetch(`${baseUrl}${path}`);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain(type);
    expect(response.headers.get('Content-Security-Policy')).toContain("object-src 'none'");
    expect(response.headers.get('Content-Security-Policy')).not.toContain('unsafe-inline');
    expect((await response.text()).length).toBeGreaterThan(0);
  }
});

test('UI static routes only support GET and HEAD', async () => {
  const head = await fetch(`${baseUrl}/`, { method: 'HEAD' });
  expect(head.status).toBe(200);
  expect(await head.text()).toBe('');
  const post = await fetch(`${baseUrl}/`, { method: 'POST' });
  expect(post.status).toBe(405);
  expect(post.headers.get('Allow')).toBe('GET, HEAD');
});

test('UI does not expose project source or arbitrary paths', async () => {
  for (const path of ['/package.json', '/server.ts', '/src/ui/server.ts', '/%2e%2e%2fpackage.json']) {
    expect((await fetch(`${baseUrl}${path}`)).status).toBe(404);
  }
});

test('UI sample renders using the shared API handler', async () => {
  const sample = await fetch(`${baseUrl}/sample.json`);
  expect(sample.status).toBe(200);
  const payload = await sample.json();
  expect(payload.holes.length).toBe(5);
  const response = await fetch(`${baseUrl}/hole`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  expect(response.status).toBe(200);
  expect(response.headers.get('Content-Type')).toBe('image/svg+xml');
  const svg = await response.text();
  expect(svg).toContain('<svg');
  expect(svg).not.toMatch(/NaN|Infinity/);
});

test('UI rendering endpoint preserves API errors', async () => {
  const badJson = await fetch(`${baseUrl}/hole`, { method: 'POST', body: '{' });
  expect(badJson.status).toBe(400);
  expect(await badJson.json()).toEqual({ error: 'Request body must contain valid JSON.' });
  expect((await fetch(`${baseUrl}/hole`)).status).toBe(405);
});

test('sample liner-top packer occupies the annulus at the liner top and leaves the bore open', async () => {
  const payload = await (await fetch(`${baseUrl}/sample.json`)).json();
  const packer = payload.components.find((c: any) => c.type === 'Packer');
  expect(packer?.toolType).toBe('Liner Top Packer');
  const liner = payload.components.find((c: any) => c.casingID === packer.refCasingID);
  const parent = payload.components.find((c: any) => c.casingID === packer.seatingCasingID);
  expect(liner.pipeType).toBe('Production Liner');
  expect(parent.pipeType).toBe('Production Casing');
  expect(packer.startDepth).toBe(liner.startDepth);
  expect(packer.startDepth).toBeGreaterThanOrEqual(parent.startDepth);
  expect(packer.startDepth).toBeLessThan(parent.startDepth + parent.segments[0].length);

  const render = async (components: any[]) => {
    const response = await fetch(`${baseUrl}/hole`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, components }),
    });
    expect(response.status).toBe(200);
    return [...(await response.text()).matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map(match => match[1]);
  };
  const baseline = await render(payload.components.filter((c: any) => c.type !== 'Packer'));
  const paths = (await render(payload.components)).filter(path => !baseline.includes(path));
  const packers = payload.components.filter((c: any) => c.type === 'Packer');
  expect(paths.length).toBe(packers.length * 2);

  const bounds = paths.map(path => {
    let x = 0, y = 0;
    const points = [];
    for (const command of path.split(/z/i)[0].matchAll(/([MmLl])\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/g)) {
      const dx = Number(command[2]), dy = Number(command[3]);
      x = command[1] === command[1].toLowerCase() ? x + dx : dx;
      y = command[1] === command[1].toLowerCase() ? y + dy : dy;
      points.push({ x, y });
    }
    expect(points.length).toBe(4);
    return { left: Math.min(...points.map(p => p.x)), right: Math.max(...points.map(p => p.x)), top: Math.min(...points.map(p => p.y)) };
  });
  // Fixture geometry: center 112.5 px, 5 px/in, depth 2800 on a 0–5000 m / 0–900 px scale.
  expect(bounds.map(({ left, right }) => ({ left, right }))).toEqual(packers.flatMap(() => [
    { left: 88.4375, right: 95 },
    { left: 130, right: 136.5625 },
  ]));
  for (const bound of bounds) expect(bound.top).toBeCloseTo(504, 10);
  expect(bounds[0].right).toBeLessThan(bounds[1].left);
});
