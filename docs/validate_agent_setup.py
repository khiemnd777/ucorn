#!/usr/bin/env python3
"""Validate UCORN agent assets without execution, network or dependencies."""
import hashlib
import json
import re
import sys
import tomllib
from pathlib import Path
from urllib.parse import unquote, urlsplit


def validate(root):
    root = Path(root).resolve()
    errors = []
    stats = {'skills': 0, 'files': 0, 'mirrors': 0, 'agents': 0}

    def check(condition, message):
        if not condition:
            errors.append(message)

    def scoped_file(value):
        if not isinstance(value, str) or not value:
            errors.append('Invalid manifest path')
            return None
        relative = Path(value)
        path = root / relative
        unsafe = (
            relative.is_absolute() or '..' in relative.parts
            or any(part in {'.git', '.kit-work'} for part in relative.parts)
            or not path.resolve().is_relative_to(root)
            or any((root / Path(*relative.parts[:i])).is_symlink()
                   for i in range(1, len(relative.parts) + 1))
        )
        if unsafe or not path.is_file():
            errors.append('Unsafe or missing file: ' + value)
            return None
        return path

    manifest_path = scoped_file('docs/skills-manifest.json')
    if manifest_path is None:
        return errors, stats
    try:
        manifest = json.loads(manifest_path.read_text())
        for field in ('files', 'mirror_pairs', 'skills', 'native_agents'):
            if not isinstance(manifest.get(field), list) or any(
                    not isinstance(item, dict) for item in manifest[field]):
                raise ValueError('Manifest must contain objects in list: ' + field)
        file_names = [item['path'] for item in manifest['files']]
        names = [item['name'] for item in manifest['skills']]
        agent_names = [item['name'] for item in manifest['native_agents']]
        if any(not isinstance(value, str) for value in file_names + names + agent_names):
            raise ValueError('Manifest names and paths must be strings')
        path_fields = {'mirror_pairs': ('canonical', 'mirror'),
                       'skills': ('canonical', 'mirror'),
                       'native_agents': ('role_source', 'codex', 'claude')}
        for field, keys in path_fields.items():
            if any(not isinstance(item.get(key), str) for item in manifest[field] for key in keys):
                raise ValueError('Manifest source paths must be strings: ' + field)
    except (OSError, ValueError, KeyError, AttributeError, TypeError) as exc:
        return [str(exc)], stats
    maintained = set(file_names)
    check(len(file_names) == len(maintained), 'Duplicate manifest file paths')
    for item in manifest['files']:
        path = scoped_file(item['path'])
        if path is not None:
            check(hashlib.sha256(path.read_bytes()).hexdigest() == item.get('sha256'),
                  'Hash mismatch: ' + item['path'])
            stats['files'] += 1
    for pair in manifest['mirror_pairs']:
        canonical = scoped_file(pair.get('canonical'))
        mirror = scoped_file(pair.get('mirror'))
        check(pair.get('canonical') in maintained and pair.get('mirror') in maintained,
              'Untracked mirror pair')
        if canonical is not None and mirror is not None:
            check(canonical.read_bytes() == mirror.read_bytes(), 'Mirror mismatch: ' + pair['mirror'])
            stats['mirrors'] += 1
    expected = set(names)
    check(len(names) == len(expected) and bool(expected), 'Duplicate/empty skill inventory')
    stats['skills'] = len(expected)
    for folder in ('.agents/skills', '.claude/skills'):
        actual = {p.parent.name for p in (root / folder).glob('*/SKILL.md')}
        check(actual == expected, 'Skill inventory mismatch: ' + folder)
    for item in manifest['skills']:
        name = item['name']
        check(re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', name) is not None
              and len(name) < 64, 'Invalid skill name: ' + name)
        for key, folder in (('canonical', '.agents/skills'), ('mirror', '.claude/skills')):
            value = item.get(key)
            check(value == f'{folder}/{name}/SKILL.md', 'Skill source mismatch: ' + name)
            check(value in maintained, 'Untracked skill: ' + name)
            path = scoped_file(value)
            if path is not None:
                # Full YAML parsing is a separate metadata check.
                match = re.match(r'^---\nname: ([a-z0-9-]+)\n', path.read_text())
                check(match is not None and match[1] == name, 'Skill identity mismatch: ' + str(value))
    agents = manifest['native_agents']
    check(len(agent_names) == len(set(agent_names)), 'Duplicate native agent names')

    def check_role_instructions(text, name):
        if name in {'kit-explorer', 'kit-reviewer'}:
            # Authored package expectations do not prove effective runtime behavior.
            clauses = (
                'Do not change application code, implement features or repairs, or deploy.',
                'Use tools and checks only within actual runtime permissions and the approved task scope.',
            )
            check(isinstance(text, str) and all(clause in text for clause in clauses),
                  'Role responsibility/scope instructions missing: ' + name)

    for folder, extension, key in (('.codex/agents', '*.toml', 'codex'),
                                   ('.claude/agents', '*.md', 'claude')):
        actual = {str(p.relative_to(root)) for p in (root / folder).glob(extension)}
        check(actual == {item.get(key) for item in agents}, 'Native inventory mismatch: ' + folder)
    for item in agents:
        name = item['name']
        paths = {}
        for key in ('role_source', 'codex', 'claude'):
            check(item.get(key) in maintained, 'Untracked agent source: ' + name)
            paths[key] = scoped_file(item.get(key))
        if paths['codex'] is not None:
            try:
                config = tomllib.loads(paths['codex'].read_text())
                check(config.get('name') == name, 'Native name mismatch: ' + name)
                check(all(isinstance(config.get(k), str) and config[k].strip()
                          for k in ('description', 'developer_instructions')),
                      'Missing native metadata: ' + name)
                check('model' not in config and 'model_reasoning_effort' not in config,
                      'Unexpected Codex model pin: ' + name)
                if name in {'kit-explorer', 'kit-reviewer'}:
                    check('sandbox_mode' not in config, 'Unexpected Codex sandbox override: ' + name)
                    check_role_instructions(config.get('developer_instructions', ''), name)
            except (OSError, tomllib.TOMLDecodeError) as exc:
                errors.append(str(exc))
        if paths['claude'] is not None:
            match = re.match(r'^---\n(.*?)\n---\n', paths['claude'].read_text(), re.S)
            check(match is not None, 'Missing Claude frontmatter: ' + name)
            if match:
                fields = dict(re.findall(r'^([a-z-]+): ([^\n]+)$', match[1], re.M))
                # Include empty/block values, CamelCase and quoted YAML keys.
                field_names = set(re.findall(r'^["\']?([A-Za-z][A-Za-z0-9_-]*)["\']?\s*:',
                                             match[1], re.M))
                check(fields.get('name') == name and bool(fields.get('description')),
                      'Claude metadata mismatch: ' + name)
                check(fields.get('model') == 'inherit' and 'effort' not in field_names,
                      'Claude model intent mismatch: ' + name)
                if name in {'kit-explorer', 'kit-reviewer'}:
                    check(not field_names.intersection({'tools', 'disallowedTools', 'permissionMode'}),
                          'Unexpected Claude permission/tool override: ' + name)
                    check_role_instructions(paths['claude'].read_text()[match.end():], name)
        stats['agents'] += 1
    actual_assets = {str(p.relative_to(root)) for folder in ('.agents', '.claude', '.codex/agents')
                     for p in (root / folder).rglob('*')
                     if p.is_file() and '__pycache__' not in p.parts}
    recorded_assets = {name for name in maintained
                       if name.startswith(('.agents/', '.claude/', '.codex/agents/'))}
    check(actual_assets == recorded_assets, 'Agent asset inventory differs from manifest')
    document_names = {name for name in maintained if name.endswith('.md')}
    document_names.update(('docs/project-context.md', 'docs/project-plan.md',
                           'docs/project-state.md', 'docs/agent-kit-adoption.md'))
    document_names.update(str(p.relative_to(root)) for p in (root / 'docs/tasks').glob('*.md'))
    docs = {path for name in document_names if (path := scoped_file(name)) is not None}
    for path in sorted(docs):
        if not path.is_file():
            errors.append('Missing document: ' + str(path.relative_to(root)))
            continue
        text = re.sub(r'```.*?```', '', path.read_text(), flags=re.S)
        for href in re.findall(r'\[[^\]]+\]\(([^)]+)\)', text):
            if urlsplit(href).scheme:
                continue
            relative = href.split('#', 1)[0]
            target = (path.parent / unquote(relative)).resolve() if relative else path
            check(target.is_relative_to(root) and target.is_file(),
                  f'{path.relative_to(root)}: broken/unsafe link {href}')
    claude_import = scoped_file('CLAUDE.md')
    check(claude_import is not None and claude_import.read_text().strip() == '@AGENTS.md',
          'Claude shared instructions import mismatch')
    return errors, stats


if __name__ == '__main__':
    errors, stats = validate(Path(sys.argv[1] if len(sys.argv) > 1 else '.'))
    if errors:
        print('\n'.join('ERROR: ' + error for error in errors))
        sys.exit(1)
    print(f"PASS: {stats['skills']} skills per root, {stats['files']} maintained files, "
          f"{stats['mirrors']} mirror pairs, {stats['agents']} native agents per runtime. "
          'Static integrity only; full YAML/native behavior checked separately.')
