---
name: well-visual-qa
description: "Review UCORN well schematic output and design meaningful fixtures, SVG checks and visual regressions. Use for renderer changes, component acceptance and drawing QA."
---

# Well Visual QA

## Workflow

Read [QA matrix](../../../docs/well-schematic/qa-fixtures.md), relevant [catalog](../../../docs/well-schematic/component-catalog.md) and [audit](../../../docs/well-schematic/source-audit.md). There is no trustworthy current test suite; do not call `src/test.ts` coverage.

Choose fixtures based on observable geometry/relationships, not copies of implementation. Include valid and invalid hosts, exact boundaries, units/datum, lifecycle, labels, unsupported kind/variant and malformed data relevant to the change. Test immutability, determinism and array reordering when ordering is not semantic.

Verify runtime parsing/graph first, geometry invariants second, SVG structure third, raster/visual readability last. Check annular clipping, anchor depths, hosts, symbol/state distinction, full viewport, monochrome legend and escaped labels. Record viewport/font/platform/fixture revision for baseline. Review before/after semantic changes before updating baseline; do not hide errors by increasing pixel threshold.

## Result

Give findings with component ID/depth and evidence, tests run and gaps. If visual tooling is unavailable, state that visual review was not performed and give structural checks completed. For docs-only work use the docs validator; do not claim runtime checks or engineering safety from its pass.
