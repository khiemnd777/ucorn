import { afterAll, beforeAll, describe, expect, spyOn, test } from 'bun:test';
import { serve } from 'bun';
import { routeRequest } from '../src/index.bun';

let server: ReturnType<typeof serve>;
let baseUrl: string;

beforeAll(() => {
  server = serve({ port: 0, hostname: '127.0.0.1', fetch: routeRequest });
  baseUrl = `http://127.0.0.1:${server.port}`;
});

afterAll(() => server?.stop(true));

describe('Bun HTTP routes', () => {
  test('opening / in a browser returns API instructions without parsing a body', async () => {
    const response = await fetch(`${baseUrl}/`);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/plain');
    expect(await response.text()).toContain('POST');
  });

  test('HEAD / returns no body', async () => {
    const response = await fetch(`${baseUrl}/`, { method: 'HEAD' });
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('');
  });

  test('GET /hole requires POST', async () => {
    const response = await fetch(`${baseUrl}/hole`);
    expect(response.status).toBe(405);
    expect(response.headers.get('Allow')).toBe('POST, OPTIONS');
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  for (const path of ['/', '/hole']) {
    test(`PUT ${path} is rejected before parsing JSON`, async () => {
      const response = await fetch(`${baseUrl}${path}`, { method: 'PUT' });
      expect(response.status).toBe(405);
      expect(response.headers.get('Allow')).toContain('POST');
    });

    test(`OPTIONS ${path} advertises supported methods`, async () => {
      const response = await fetch(`${baseUrl}${path}`, { method: 'OPTIONS' });
      expect(response.status).toBe(204);
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe(
        path === '/' ? 'GET, HEAD, POST, OPTIONS' : 'POST, OPTIONS',
      );
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type');
    });

    for (const body of ['', '{']) {
      test(`POST ${path} with ${body ? 'malformed' : 'empty'} JSON returns 400`, async () => {
        const response = await fetch(`${baseUrl}${path}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
        });
        expect(response.status).toBe(400);
        expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
        expect(await response.json()).toEqual({ error: 'Request body must contain valid JSON.' });
      });
    }

    test(`POST ${path} renders a valid well using the real SVG handler`, async () => {
      const response = await fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ holes: [{ holeID: 'H1', diameter: 12, depth: 1000 }] }),
      });
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('image/svg+xml');
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      const svg = await response.text();
      expect(svg).toContain('<svg');
      expect(svg).toContain('<path');
      expect(svg).not.toMatch(/NaN|Infinity/);
    });
  }

  test('unknown routes return 404', async () => {
    const response = await fetch(`${baseUrl}/missing`, { method: 'POST', body: '{' });
    expect(response.status).toBe(404);
  });

  test('the existing sample payload still renders SVG', async () => {
    const body = await Bun.file(new URL('../sample-data/well-5-holes-liner-hangers.json', import.meta.url)).text();
    const response = await fetch(`${baseUrl}/hole`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
    });
    expect(response.status).toBe(200);
    const svg = await response.text();
    expect(svg).toContain('<svg');
    expect(svg).not.toMatch(/NaN|Infinity/);
  });

  test('renderer failures return a generic error and are logged on the server', async () => {
    const log = spyOn(console, 'error').mockImplementation(() => {});
    try {
      const response = await fetch(`${baseUrl}/hole`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: 'null',
      });
      expect(response.status).toBe(500);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(await response.json()).toEqual({ error: 'Unable to render well schematic.' });
      expect(log).toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });
});
