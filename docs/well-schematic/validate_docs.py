#!/usr/bin/env python3
"""Validate UCORN docs and project skills without runtime or network access."""
import json
import re
import runpy
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit

EXPECTED_SKILLS = {
    'well-schematic-domain', 'well-component-modeling', 'well-svg-layout',
    'well-schema-units', 'well-visual-qa', 'well-technical-research',
}
GROUPS = {
    'borehole-formation', 'casing-liner-tieback', 'cement-barriers',
    'completion', 'valves-flow', 'perforation-sand', 'artificial-lift',
    'wellhead-subsea', 'abandonment', 'annotations',
}
CARD_FIELDS = {
    'group', 'id', 'name', 'tier', 'function', 'fields', 'attachment',
    'symbol', 'validation', 'status', 'edge', 'done', 'sources', 'verification',
}
STATUSES = {'legacy-rendered', 'legacy-generic', 'type-only', 'proposed', 'implemented'}
IMPLEMENTED_IDS = {'tubing', 'tubing-hanger', 'production-packer', 'liner-top-packer', 'isolation-packer', 'test-packer', 'crossover', 'seal-bore', 'landing-nipple'}
RENDERED_IDS = {'hole', 'underream', 'shoe', 'annular-cement', 'wellhead', 'casing-hanger'}
GENERIC_IDS = {'conductor', 'surface-casing', 'intermediate-casing', 'production-casing',
               'drilling-liner', 'production-liner', 'production-packer',
               'liner-top-packer', 'isolation-packer', 'test-packer'}

def anchors(text):
    found, counts = set(), {}
    for line in text.splitlines():
        if not re.match(r'^#{1,6} ', line):
            continue
        label = re.sub(r'[`*_]', '', re.sub(r'^#{1,6} ', '', line)).lower()
        label = re.sub(r'[^\w\- ]', '', label).replace(' ', '-')
        n = counts.get(label, 0)
        counts[label] = n + 1
        found.add(label if n == 0 else f'{label}-{n}')
    return found

def validate(root):
    errors = []
    base = root / 'docs/well-schematic'
    def check(condition, message):
        if not condition:
            errors.append(message)
    try:
        cards = json.loads((base / 'component-catalog.json').read_text())
        sources = json.loads((base / 'sources.json').read_text())
        catalog = (base / 'component-catalog.md').read_text()
    except (OSError, ValueError) as exc:
        return [str(exc)], 0, 0
    check(isinstance(cards, list) and bool(cards), 'Catalog must be nonempty list')
    check(isinstance(sources, dict) and bool(sources), 'Sources must be nonempty object')
    if not isinstance(cards, list) or not isinstance(sources, dict):
        return errors, 0, 0
    ids = [c.get('id') for c in cards if isinstance(c, dict)]
    check(len(ids) == len(cards) == len(set(ids)), 'Catalog IDs must be unique')
    check({c.get('group') for c in cards} == GROUPS, 'Catalog group coverage mismatch')
    for c in cards:
        cid = c.get('id', '?')
        check(set(c) == CARD_FIELDS, f'{cid}: missing or unexpected card fields')
        for field in CARD_FIELDS - {'sources'}:
            check(isinstance(c.get(field), str) and bool(c[field].strip()), f'{cid}: empty {field}')
        check(c.get('status') in STATUSES, f'{cid}: unknown implementation status')
        expected = ('implemented' if cid in IMPLEMENTED_IDS else
                    'legacy-rendered' if cid in RENDERED_IDS else
                    'legacy-generic' if cid in GENERIC_IDS else
                    'type-only' if cid == 'tieback' else 'proposed')
        check(c.get('status') == expected, f'{cid}: status contradicts pinned audit')
        check(c.get('tier') in {'core', 'configuration'}, f'{cid}: scope tier invalid')
        check(c.get('verification') in {'definition-backed', 'family-only', 'proposed-local'}, f'{cid}: verification invalid')
        check(isinstance(c.get('sources'), list) and bool(c['sources']), f'{cid}: no sources')
        for sid in c.get('sources', []):
            check(sid in sources, f'{cid}: unknown source {sid}')
            if sid in sources and sources[sid]['status'] == 'unverified-unavailable':
                check(c.get('verification') != 'definition-backed', f'{cid}: inaccessible source cannot verify variant')
        check(re.search(r'F\d{2}', c.get('edge', '')) is not None, f'{cid}: no fixture reference')
        heading = f'### {cid} — {c.get("name")}'
        check(catalog.count(heading) == 1, f'{cid}: Markdown card missing/duplicated')
        if heading in catalog:
            card_text = catalog.split(heading, 1)[1].split('\n### ', 1)[0]
            check(f'**{c.get("status")}**' in card_text, f'{cid}: Markdown/JSON implementation status drift')
        for field in ('function', 'fields', 'attachment', 'symbol', 'validation', 'edge', 'done'):
            check(c.get(field, '') in catalog, f'{cid}: Markdown/JSON drift in {field}')
    fixture_doc = (base / 'qa-fixtures.md').read_text()
    for c in cards:
        for fid in re.findall(r'F\d{2}', c.get('edge', '')):
            check(f'| {fid} |' in fixture_doc, f'{c["id"]}: fixture {fid} absent')
    for sid, source in sources.items():
        check(set(source) == {'url', 'status', 'checked', 'scope'}, f'{sid}: source fields invalid')
        check(source.get('status') in {'verified-definition', 'unverified-unavailable', 'proposed-local'}, f'{sid}: source status invalid')
        check(re.fullmatch(r'\d{4}-\d{2}-\d{2}', source.get('checked', '')) is not None, f'{sid}: no checked date')
        check(bool(source.get('scope')), f'{sid}: source scope empty')
        if source.get('url'):
            check(urlsplit(source['url']).scheme == 'https', f'{sid}: source must use HTTPS')
            check(source['url'] in (base / 'sources.md').read_text(), f'{sid}: source absent from register')
    skill_root = root / '.agents/skills'
    actual = {p.parent.name for p in skill_root.glob('*/SKILL.md')}
    check(EXPECTED_SKILLS.issubset(actual), 'Missing required UCORN domain skill')
    domain_skills = [p for p in skill_root.glob('*/SKILL.md') if p.parent.name in EXPECTED_SKILLS]
    for p in sorted(domain_skills):
        text = p.read_text()
        match = re.match(r'^---\nname: ([a-z0-9-]+)\ndescription: ("[^\n]+")\n---\n', text)
        check(match is not None, f'{p}: unsupported/malformed frontmatter')
        if match:
            check(match[1] == p.parent.name and len(match[1]) < 64, f'{p}: invalid skill name')
            try:
                desc = json.loads(match[2])
                check(isinstance(desc, str) and 0 < len(desc) <= 1024, f'{p}: invalid description')
            except ValueError:
                errors.append(f'{p}: description string invalid')
        metadata = p.parent / 'agents/openai.yaml'
        check(metadata.is_file(), f'{p}: UI metadata missing')
        if metadata.is_file():
            fields = {}
            for line in metadata.read_text().splitlines()[1:]:
                try:
                    key, value = line.strip().split(': ', 1)
                    fields[key] = json.loads(value)
                except ValueError:
                    errors.append(f'{metadata}: invalid quoted scalar')
            check(set(fields) == {'display_name', 'short_description', 'default_prompt'}, f'{metadata}: metadata fields mismatch')
            check(25 <= len(fields.get('short_description', '')) <= 64, f'{metadata}: short description length')
            check(f'${p.parent.name}' in fields.get('default_prompt', ''), f'{metadata}: prompt missing skill invocation')
    files = [root / 'AGENTS.md'] + sorted(base.glob('*.md')) + sorted(domain_skills)
    for p in files:
        if not p.is_file():
            errors.append(f'Missing {p}')
            continue
        text = p.read_text()
        check('[TODO:' not in text, f'{p}: unfinished scaffold')
        # Skip fenced code; only actual authored Markdown links are checked.
        text = re.sub(r'```.*?```', '', text, flags=re.S)
        for href in re.findall(r'\[[^\]]+\]\(([^)]+)\)', text):
            if urlsplit(href).scheme:
                continue
            path, sep, fragment = href.partition('#')
            target = (p.parent / unquote(path)).resolve() if path else p
            check(target.is_file(), f'{p}: broken link {href}')
            if sep and target.is_file():
                check(unquote(fragment) in anchors(target.read_text()), f'{p}: missing anchor {href}')
    manifest = root / 'docs/skills-manifest.json'
    if manifest.exists():
        kit_validator = root / 'docs/validate_agent_setup.py'
        check(kit_validator.is_file(), 'Agent Kit validator missing')
        if kit_validator.is_file():
            kit_errors, _ = runpy.run_path(str(kit_validator))['validate'](root)
            errors.extend(kit_errors)
    return errors, len(cards), len(domain_skills)

if __name__ == '__main__':
    root = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
    errors, card_count, skill_count = validate(root)
    if errors:
        print('\n'.join(f'ERROR: {e}' for e in errors))
        sys.exit(1)
    print(f'PASS: {skill_count} domain skills, {card_count} component cards, sources and internal links. Agent Kit checked when present. No runtime/network validation.')
