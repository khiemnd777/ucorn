---
name: well-schema-units
description: "Validate or design UCORN runtime schemas, units, depth datums and interval boundaries. Use for input contracts, import adapters, quantity conversion or malformed well data."
---

# Well Schema and Units

## Workflow

Read [data contract](../../../docs/well-schematic/data-contract.md) and [audit](../../../docs/well-schematic/source-audit.md). Legacy `unit` is optional arbitrary strings and is not applied by current handler; TypeScript request casting does not validate input.

Separate parse/schema, quantity normalization, references/topology, physical containment and layout warnings. Require finite numbers and explicit allowed units. Depth carries MD/TVD and datum; do not infer from magnitude. Preserve original quantity and convert once: ft→m 0.3048, in→mm 25.4; pixels are display units. Pressure also needs absolute/gauge/differential reference; density needs gallon-system identity if used.

Use point versus interval types, documented endpoint policy and named shoe/tool anchors. Check positive dimensions, cumulative segment depth, top/bottom ordering, host spans, IDs and lifecycle snapshot. Reject NaN/Infinity, dangling refs and impossible fit when enough OD/ID data exists. Missing ID/datum/survey must report unresolved rather than generate synthetic numbers.

## Result and checks

Deliver error taxonomy (`code`, `path`, `componentId`, `severity`), legacy migration behavior and fixtures for exact top/bottom, before-start, shuffled intervals, mixed units and missing datum. Test equivalent quantities across units and known survey transformations. Do not interpret schema validation as design approval.
