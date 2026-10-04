---
name: well-component-modeling
description: "Design or review well component data models and attachment graphs in UCORN, including casing, liner, tubing, tools and interfaces. Use for new kinds, relationships or schema migrations."
---

# Well Component Modeling

## Workflow

Read [data contract](../../../docs/well-schematic/data-contract.md), then the relevant [catalog card](../../../docs/well-schematic/component-catalog.md) and [audit](../../../docs/well-schematic/source-audit.md). Record current API versus proposed API; existing `as any` casts and AI documents are not a validated schema.

Give components stable IDs and discriminated kind/variant contracts. Define depth quantities, wellbore identity and lifecycle separately from implementation status. Define owner/host, support, seals-between, connection ports, annular occupancy and annotation relations explicitly. Avoid one ref serving several meanings and avoid array order as seat identity. Check dangling refs, ownership cycles, containment and endpoint boundaries; flow loops require separate semantics.

Keep domain pure and renderer/LLM independent. Plan typed validation and legacy adapter before changing meaning of `diameter`, `startDepth`, `refCasingID` or cumulative hole depth. Keep provenance and unresolved fit when ID/wall data is missing. Do not turn current generic Packer/Casing metadata into tubing or liner-hanger support claims.

## Result and checks

Deliver contract, graph examples, migration impact, valid/invalid fixture specs and errors with field paths. For authorized runtime work, test graph invariants, reorder invariance and legacy payload compatibility. This skill does not itself authorize committing or calling an LLM API.
