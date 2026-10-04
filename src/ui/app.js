const editor = document.querySelector('#json-input');
const highlight = document.querySelector('#highlight');
const gutter = document.querySelector('#line-numbers');
const renderButton = document.querySelector('#render-button');
const downloadButton = document.querySelector('#download-button');
const preview = document.querySelector('#svg-preview');
const previewState = document.querySelector('#preview-state');
const feedback = document.querySelector('#feedback');
let svgUrl;
let controller;
let revision = 0;

function notify(message, kind = '') {
  feedback.textContent = message;
  feedback.className = `feedback ${kind}`;
}

function busy(value) {
  renderButton.disabled = value;
  renderButton.textContent = value ? 'Generating schematic…' : 'Generate schematic ↗';
  document.querySelector('#preview-canvas').setAttribute('aria-busy', String(value));
}

function cursor() {
  const before = editor.value.slice(0, editor.selectionStart).split('\n');
  document.querySelector('#cursor-position').textContent = `Ln ${before.length}, Col ${before.at(-1).length + 1}`;
}

function syncScroll() {
  highlight.scrollTop = editor.scrollTop;
  highlight.scrollLeft = editor.scrollLeft;
  gutter.style.transform = `translateY(-${editor.scrollTop}px)`;
}

function refresh() {
  const text = editor.value;
  gutter.textContent = Array.from({ length: text.split('\n').length }, (_, i) => i + 1).join('\n');
  const fragment = document.createDocumentFragment();
  const tokens = /"(?:\\.|[^"\\])*"\s*(?=:)|"(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\b(?:true|false|null)\b/g;
  let end = 0;
  for (const match of text.matchAll(tokens)) {
    fragment.append(document.createTextNode(text.slice(end, match.index)));
    const span = document.createElement('span');
    const isKey = match[0].startsWith('"') && text.slice(match.index + match[0].length).startsWith(':');
    span.className = isKey ? 'token-key' : match[0].startsWith('"') ? 'token-string' : /^-?\d/.test(match[0]) ? 'token-number' : 'token-literal';
    span.textContent = match[0];
    fragment.append(span);
    end = match.index + match[0].length;
  }
  fragment.append(document.createTextNode(text.slice(end) + '\n'));
  highlight.replaceChildren(fragment);
  try {
    JSON.parse(text);
    document.querySelector('#json-state').textContent = `Valid JSON · ${text.split('\n').length} lines`;
  } catch {
    document.querySelector('#json-state').textContent = text.trim() ? 'Invalid JSON' : 'No data';
  }
  cursor();
  syncScroll();
}

function changed() {
  revision++;
  controller?.abort();
  busy(false);
  downloadButton.disabled = true;
  previewState.textContent = svgUrl ? 'Out of date' : 'No schematic yet';
  previewState.className = 'preview-state';
  notify('Data changed. Select “Generate schematic” to update the preview.');
  refresh();
}

async function render() {
  try {
    JSON.parse(editor.value);
  } catch (error) {
    notify(`Invalid JSON: ${error.message}`, 'error');
    editor.focus();
    return;
  }
  controller?.abort();
  const current = ++revision;
  controller = new AbortController();
  const active = controller;
  const timeout = setTimeout(() => active.abort(), 15000);
  busy(true);
  downloadButton.disabled = true;
  previewState.textContent = 'Generating…';
  previewState.className = 'preview-state';
  notify('Generating a schematic from JSON data…');
  try {
    const response = await fetch('/hole', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: editor.value, signal: active.signal,
    });
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      const details = result.diagnostics?.map(d => `${d.path}: ${d.message}`).join('\n');
      throw new Error(details || result.error || `HTTP ${response.status}`);
    }
    const svg = await response.blob();
    if (current !== revision) return;
    if (!response.headers.get('Content-Type')?.includes('image/svg+xml')) throw new Error('The response is not an SVG.');
    if (svgUrl) URL.revokeObjectURL(svgUrl);
    svgUrl = URL.createObjectURL(svg);
    preview.src = svgUrl;
    preview.hidden = false;
    document.querySelector('#empty-preview').hidden = true;
    downloadButton.disabled = false;
    previewState.textContent = 'Up to date';
    previewState.className = 'preview-state ready';
    notify('Schematic generated. You can preview or download the SVG.', 'success');
  } catch (error) {
    if (current !== revision) return;
    previewState.textContent = 'Generation failed';
    notify(error.name === 'AbortError' ? 'Generation timed out. Please try again.' : `Unable to generate the schematic: ${error.message} Check the holes and components data.`, 'error');
  } finally {
    clearTimeout(timeout);
    if (current === revision) busy(false);
  }
}

async function loadSample(samplePath = '/sample.json', buttonId = '#sample-button') {
  const button = document.querySelector(buttonId);
  button.disabled = true;
  const current = revision;
  try {
    const response = await fetch(samplePath);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const sample = await response.json();
    if (current !== revision) return;
    editor.value = JSON.stringify(sample, null, 2);
    editor.setSelectionRange(0, 0);
    editor.scrollTop = editor.scrollLeft = 0;
    changed();
    await render();
  } catch (error) {
    if (current === revision) notify(`Unable to load the sample: ${error.message}`, 'error');
  } finally {
    button.disabled = false;
  }
}

editor.addEventListener('input', changed);
editor.addEventListener('scroll', syncScroll);
editor.addEventListener('click', cursor);
editor.addEventListener('keyup', cursor);
editor.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    render();
  } else if (event.key === 'Tab' && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
    event.preventDefault();
    editor.setRangeText('  ', editor.selectionStart, editor.selectionEnd, 'end');
    changed();
  }
});
document.querySelector('#editor-form').addEventListener('submit', (event) => {
  event.preventDefault();
  render();
});
document.querySelector('#format-button').addEventListener('click', () => {
  try {
    editor.value = JSON.stringify(JSON.parse(editor.value), null, 2);
    changed();
  } catch (error) {
    notify(`Unable to format JSON: ${error.message}`, 'error');
    editor.focus();
  }
});
document.querySelector('#sample-button').addEventListener('click', () => loadSample());
document.querySelector('#tubing-sample-button').addEventListener('click', () => loadSample('/sample-tubing.json', '#tubing-sample-button'));
document.querySelector('#packers-sample-button').addEventListener('click', () => loadSample('/sample-packers.json', '#packers-sample-button'));
document.querySelector('#crossover-sample-button').addEventListener('click', () => loadSample('/sample-crossover.json', '#crossover-sample-button'));
document.querySelector('#joints-sample-button').addEventListener('click', () => loadSample('/sample-joints.json', '#joints-sample-button'));
document.querySelector('#size-button').addEventListener('click', (event) => {
  const fullSize = preview.classList.toggle('actual-size');
  document.querySelector('#preview-canvas').classList.toggle('actual-size', fullSize);
  event.currentTarget.setAttribute('aria-pressed', String(fullSize));
  event.currentTarget.textContent = fullSize ? 'Fit preview' : 'Actual size';
});
downloadButton.addEventListener('click', () => {
  if (!svgUrl || downloadButton.disabled) return;
  const link = document.createElement('a');
  link.href = svgUrl;
  link.download = 'well-schematic.svg';
  document.body.append(link);
  link.click();
  link.remove();
});
refresh();
loadSample();
