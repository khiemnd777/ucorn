import { beforeAll, afterAll, test, expect } from 'bun:test';
import { serve } from 'bun';
import { app } from '../src/index';
import { routeRequest } from '../src/index.bun';
import { uiRequest } from '../src/ui/server';
import sample from '../sample-data/well-tubing-hanger.json';
import packerSample from '../sample-data/well-completion-packers.json';
import crossoverSample from '../sample-data/well-completion-crossover.json';
import jointsSample from '../sample-data/well-completion-joints.json';
import type { Server } from 'node:http';

let bunServer: ReturnType<typeof serve>, uiServer: ReturnType<typeof serve>, expressServer: Server;
let targets: { name: string; url: string }[];
beforeAll(async () => {
  bunServer = serve({ port: 0, hostname: '127.0.0.1', fetch: routeRequest });
  uiServer = serve({ port: 0, hostname: '127.0.0.1', fetch: uiRequest });
  expressServer = await new Promise<Server>(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  const address = expressServer.address();
  if (!address || typeof address === 'string') throw new Error('Missing Express port');
  targets = [
    { name: 'Bun root', url: `http://127.0.0.1:${bunServer.port}/` },
    { name: 'Bun hole', url: `http://127.0.0.1:${bunServer.port}/hole` },
    { name: 'UI hole', url: `http://127.0.0.1:${uiServer.port}/hole` },
    { name: 'Express hole', url: `http://127.0.0.1:${address.port}/hole` },
  ];
});
afterAll(async () => {
  bunServer?.stop(true); uiServer?.stop(true);
  if (expressServer) await new Promise<void>((resolve, reject) => expressServer.close(e => e ? reject(e) : resolve()));
});

test('all transports render coupling and real-length Pup Joint; invalid references fail with paths', async () => {
  for (const target of targets) {
    const response = await fetch(target.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(jointsSample) });
    expect(response.status).toBe(200); const svg = await response.text();
    expect(svg).toContain('data-kind="Coupling"'); expect(svg).toContain('data-kind="PupJoint"');
    expect(svg).toContain('data-length-m="6"');
    for (const type of ['Coupling', 'PupJoint']) {
      const invalid: any = structuredClone(jointsSample);
      const component = invalid.components.find((c: any) => c.type === type);
      component[type === 'Coupling' ? 'toSegmentId' : 'segmentId'] = 'missing';
      const failed = await fetch(target.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(invalid) });
      expect(failed.status).toBe(400);
      expect((await failed.json()).diagnostics.some((d: any) => d.code === 'DANGLING_REFERENCE' && d.path.startsWith('components['))).toBe(true);
    }
  }
});

test('joint sample allowlist is read-only and exposed by the editor button', async () => {
  const url = `http://127.0.0.1:${uiServer.port}/sample-joints.json`;
  expect((await fetch(url, { method: 'POST' })).status).toBe(405);
  expect((await fetch(url, { method: 'HEAD' })).headers.get('Content-Type')).toContain('application/json');
  const sample = await (await fetch(url)).json();
  expect(sample.components.some((c: any) => c.type === 'PupJoint')).toBe(true);
  expect(await (await fetch(`http://127.0.0.1:${uiServer.port}/`)).text()).toContain('id="joints-sample-button"');
});

test('all transports render explicit crossover endpoints and reject a wrong anchor', async () => {
  for (const target of targets) {
    const response = await fetch(target.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(crossoverSample) });
    expect(response.status).toBe(200);
    expect(await response.text()).toContain('data-kind="Crossover"');
    const invalid = structuredClone(crossoverSample);
    invalid.components.find(c => c.type === 'Crossover')!.at!.value += 1;
    const failed = await fetch(target.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(invalid) });
    expect(failed.status).toBe(400);
    const body = await failed.json();
    expect(body.diagnostics.some((d: any) => d.code === 'ANCHOR_MISMATCH' && d.path.endsWith('.at'))).toBe(true);
  }
});

test('crossover sample is allowlisted and read only', async () => {
  const url = `http://127.0.0.1:${uiServer.port}/sample-crossover.json`;
  expect((await fetch(url, { method: 'POST' })).status).toBe(405);
  expect((await (await fetch(url)).json()).components.some((c: any) => c.type === 'Crossover')).toBe(true);
  const page = await (await fetch(`http://127.0.0.1:${uiServer.port}/`)).text();
  expect(page).toContain('id="crossover-sample-button"');
});
test('all transports render both new components with the real handler', async () => {
  for (const target of targets) {
    const response = await fetch(target.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sample) });
    expect(response.status).toBe(200); expect(response.headers.get('Content-Type')).toContain('image/svg+xml');
    const svg = await response.text();
    expect(svg).toContain('data-kind="Tubing"'); expect(svg).toContain('data-kind="TubingHanger"');
    expect(svg).not.toMatch(/NaN|Infinity/);
  }
});
test('all transports reject semantic failures with paths instead of silent omission', async () => {
  const invalid: any = structuredClone(sample);
  invalid.components.find((c: any) => c.type === 'TubingHanger').seatId = 'missing';
  for (const target of targets) {
    const response = await fetch(target.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(invalid) });
    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result.diagnostics.some((d: any) => d.code === 'DANGLING_REFERENCE' && d.path.endsWith('.seatId'))).toBe(true);
  }
});
test('UI exposes the new sample only through an explicit allowlisted route', async () => {
  const response = await fetch(`http://127.0.0.1:${uiServer.port}/sample-tubing.json`);
  expect(response.status).toBe(200); expect(await response.json()).toEqual(sample);
});
test('all transports render four explicit packer roles and reject dangling seal endpoints', async () => {
  const invalid: any = structuredClone(packerSample);
  invalid.components.find((c: any) => c.type === 'CompletionPacker').outerHostId = 'missing';
  for (const target of targets) {
    const send = (data: unknown) => fetch(target.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const good = await send(packerSample);
    expect(good.status).toBe(200);
    const svg = await good.text();
    expect((svg.match(/data-kind="CompletionPacker"/g) ?? []).length).toBe(4);
    const bad = await send(invalid);
    expect(bad.status).toBe(400);
    expect((await bad.json()).diagnostics.some((d: any) => d.code === 'DANGLING_REFERENCE' && d.path.endsWith('.outerHostId'))).toBe(true);
  }
});
test('packer sample route is explicit, read only, and does not expose fixture paths', async () => {
  const base = `http://127.0.0.1:${uiServer.port}`;
  const response = await fetch(`${base}/sample-packers.json`);
  expect(response.status).toBe(200); expect(await response.json()).toEqual(packerSample);
  expect((await fetch(`${base}/sample-packers.json`, { method: 'POST' })).status).toBe(405);
  expect((await fetch(`${base}/sample-data/well-completion-packers.json`)).status).toBe(404);
});
