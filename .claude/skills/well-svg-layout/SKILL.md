---
name: well-svg-layout
description: "Design or repair UCORN well schematic geometry, SVG symbols, layering, clipping and labels. Use when changing rendering or preparing a component drawing contract."
---

# Well SVG Layout

## Workflow

Read [layout convention](../../../docs/well-schematic/geometry-layout.md), relevant [catalog card](../../../docs/well-schematic/component-catalog.md) and [QA fixtures](../../../docs/well-schematic/qa-fixtures.md). Check source handler and component rather than assuming the proposed architecture exists.

Normalize physical quantities before geometry. Separate physical unit conversion from diameter/depth pixel scales. Vertical MD schematic is not a trajectory; MD↔TVD requires survey and datum transforms. Keep tool anchors at physical depth, use minimum glyph height only in layout and explain exaggeration in legend.

Create pure layout primitives before D3/SVG adaptation. Define layer and clipping boundary, host anchors, stable symbol IDs and readable labels with size/depth/basis/datum/state. Use separate lanes/leaders or detail insets for collisions; do not move actual packer/perforation depth. Unknown variant/state stays visible. Proposed symbols are UCORN conventions, not certified API/ISO glyphs.

## Checks and result

Check finite coordinates, no inverted extents, annular fill stays outside lumen, full bounds including surface equipment/labels, deterministic rendering and immutable inputs. Escape text, namespace defs and do not accept arbitrary raw SVG/external URLs from labels. Deliver before/after SVG or fixture specs and evidence of structural/visual review appropriate to the requested scope.
