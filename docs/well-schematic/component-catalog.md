# Component catalog

64 card families/variants theo vòng đời giếng. Core/configuration là phạm vi; status là implementation. Không là danh sách mọi thiết bị dầu khí. Mỗi card kế thừa [common contract](data-contract.md): ID/lifecycle/provenance, quantity units, MD/TVD/datum. Proposed fields chưa là API runtime.

Mọi interval/depth/length dùng quantity có unit + basis/datum như contract; card không có physical depth (ví dụ title/legend) dùng target reference thay vì giả depth 0. Geometry/symbol, validation và completion criteria là quy ước UCORN, không tiêu chuẩn chứng nhận. `definition-backed` xác minh chức năng tổng quát; `family-only` còn cần nguồn đúng variant; `proposed-local` là convention sản phẩm.

## Mục lục

- [borehole-formation](#borehole-formation)
- [casing-liner-tieback](#casing-liner-tieback)
- [cement-barriers](#cement-barriers)
- [completion](#completion)
- [valves-flow](#valves-flow)
- [perforation-sand](#perforation-sand)
- [artificial-lift](#artificial-lift)
- [wellhead-subsea](#wellhead-subsea)
- [abandonment](#abandonment)
- [annotations](#annotations)

## borehole-formation

### hole — Borehole section / đoạn lỗ khoan

Phạm vi: **core**; xác minh kỹ thuật: **definition-backed**. Nguồn: [openhole](https://glossary.slb.com/en/terms/o/openhole).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Biểu diễn bore boundary theo interval. |
| Fields / units / depth | diameter; interval; wellboreId. Legacy: holeID?, diameter, cumulative depth. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Host wellbore; segment continuity; không là physical installed equipment. |
| Symbol / layer / label | bore; paired wavy boundaries; label size + top/bottom. |
| Validation | Finite positive diameter; ordered section bottoms; no unexplained overlap/gap. |
| Current / proposed | **legacy-rendered**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F01/F02/F14: empty holes; subsequent hole underream; unknown datum. |
| Completion criteria | Correct split/extents, IDs và immutable input. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### underream — Underreamed interval

Phạm vi: **configuration**; xác minh kỹ thuật: **definition-backed**. Nguồn: [underream](https://glossary.slb.com/en/terms/u/underream).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Đoạn bore được mở rộng. |
| Fields / units / depth | diameter; interval trong parent hole. Legacy startDepth/endDepth. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | contained-in holeID; diameter boundary overrides tại interval. |
| Symbol / layer / label | bore; widened boundaries, no separate installed-tool glyph. |
| Validation | Within hole interval; enlarged diameter > parent; reject intersecting intervals. |
| Current / proposed | **legacy-rendered**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F02: shuffled, adjacent, overlap, exact parent end. |
| Completion criteria | Only enlarged span changes geometry; không mutate sort. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### formation — Formation / lithology band

Phạm vi: **configuration**; xác minh kỹ thuật: **definition-backed**. Nguồn: [formation](https://glossary.slb.com/en/terms/f/formation).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Bối cảnh địa chất quanh bore. |
| Fields / units / depth | formationName; lithology?; interval; confidence. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | wellbore interval reference; không host pipe. |
| Symbol / layer / label | context; muted band/hatch ngoài bore, geological legend. |
| Validation | Interval/datum valid; overlapping interpretations có source riêng. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F01/F13: repeated names; uncertain top; MD vs TVD. |
| Completion criteria | Band/label trace source và không che bore. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### reservoir — Reservoir / target zone

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [formation](https://glossary.slb.com/en/terms/f/formation).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Đánh dấu zone liên quan completion/production. |
| Fields / units / depth | zoneId; interval; purpose; fluid description optional. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | annotates formation interval; references perforation/screens nếu có. |
| Symbol / layer / label | context; bracket + zone label. |
| Validation | Không suy reservoir từ lithology; target refs và interval consistent. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F08: multiple zones, commingled completion, unknown fluid. |
| Completion criteria | Zone distinct from perforation và formation. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### annulus — Annulus / fluid column

Phạm vi: **core**; xác minh kỹ thuật: **definition-backed**. Nguồn: [annulus](https://glossary.slb.com/en/terms/a/annulus).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Khoảng giữa boundaries; có thể gắn fluid annotation. |
| Fields / units / depth | innerId; outerId; interval; fluidName?; density quantity? Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Bounded by pipe OD và outer bore/pipe ID; wellbore reference. |
| Symbol / layer / label | annular-fill; optional light fill; label boundary IDs. |
| Validation | Positive annular clearance khi OD/ID đủ; fluid density unit explicit. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F05/F12: multiple annuli; missing ID; partial fluid level. |
| Completion criteria | Correct occupied region; unknown clearance diagnostic. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |


## casing-liner-tieback

### conductor — Conductor casing

Phạm vi: **core**; xác minh kỹ thuật: **definition-backed**. Nguồn: [casing](https://glossary.slb.com/en/terms/c/casing).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Ống chống ngoài cùng ở đoạn nông theo cấu hình. |
| Fields / units / depth | stringId; interval/start + segments(length, OD, ID?); grade/weight/connection optional với unit. Legacy pipeType + diameter/length. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | contained-in hole/outer casing; supported-by hanger nếu known; segments same string. |
| Symbol / layer / label | tubular; paired boundaries + shoe anchor; label role, OD/ID và depths. |
| Validation | Segments positive/continuous; OD < available host ID; grade không suy rating; role không auto-generate cement. |
| Current / proposed | **legacy-generic**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F03/F14: taper; nested fit; exact segment end; duplicate string ID. |
| Completion criteria | Generic legacy path phân biệt metadata; future graph giữ role và boundary checks. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### surface-casing — Surface casing

Phạm vi: **core**; xác minh kỹ thuật: **definition-backed**. Nguồn: [casing](https://glossary.slb.com/en/terms/c/casing).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Ống chống đoạn nông; support surface interfaces theo input. |
| Fields / units / depth | stringId; interval/start + segments(length, OD, ID?); grade/weight/connection optional với unit. Legacy pipeType + diameter/length. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | contained-in hole/outer casing; supported-by hanger nếu known; segments same string. |
| Symbol / layer / label | tubular; paired boundaries + shoe anchor; label role, OD/ID và depths. |
| Validation | Segments positive/continuous; OD < available host ID; grade không suy rating; role không auto-generate cement. |
| Current / proposed | **legacy-generic**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F03/F14: taper; nested fit; exact segment end; duplicate string ID. |
| Completion criteria | Generic legacy path phân biệt metadata; future graph giữ role và boundary checks. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### intermediate-casing — Intermediate casing

Phạm vi: **core**; xác minh kỹ thuật: **definition-backed**. Nguồn: [casing](https://glossary.slb.com/en/terms/c/casing).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Ống chống giữa các drilling stages. |
| Fields / units / depth | stringId; interval/start + segments(length, OD, ID?); grade/weight/connection optional với unit. Legacy pipeType + diameter/length. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | contained-in hole/outer casing; supported-by hanger nếu known; segments same string. |
| Symbol / layer / label | tubular; paired boundaries + shoe anchor; label role, OD/ID và depths. |
| Validation | Segments positive/continuous; OD < available host ID; grade không suy rating; role không auto-generate cement. |
| Current / proposed | **legacy-generic**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F03/F14: taper; nested fit; exact segment end; duplicate string ID. |
| Completion criteria | Generic legacy path phân biệt metadata; future graph giữ role và boundary checks. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### production-casing — Production casing

Phạm vi: **core**; xác minh kỹ thuật: **definition-backed**. Nguồn: [casing](https://glossary.slb.com/en/terms/c/casing).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Ống chống phục vụ completion/production interval. |
| Fields / units / depth | stringId; interval/start + segments(length, OD, ID?); grade/weight/connection optional với unit. Legacy pipeType + diameter/length. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | contained-in hole/outer casing; supported-by hanger nếu known; segments same string. |
| Symbol / layer / label | tubular; paired boundaries + shoe anchor; label role, OD/ID và depths. |
| Validation | Segments positive/continuous; OD < available host ID; grade không suy rating; role không auto-generate cement. |
| Current / proposed | **legacy-generic**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F03/F14: taper; nested fit; exact segment end; duplicate string ID. |
| Completion criteria | Generic legacy path phân biệt metadata; future graph giữ role và boundary checks. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### drilling-liner — Drilling liner

Phạm vi: **configuration**; xác minh kỹ thuật: **definition-backed**. Nguồn: [liner](https://glossary.slb.com/en/terms/l/liner).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Casing string treo trong casing trước, không kéo tới surface. |
| Fields / units / depth | linerId; interval; segments OD/ID/length; overlap interval. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | contained-in parent casing/hole; supported-by liner hanger; named liner-top anchor. |
| Symbol / layer / label | tubular; terminates ở liner top + overlap label. |
| Validation | Top inside parent range; overlap explicit; not auto-assume hanger/support. |
| Current / proposed | **legacy-generic**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F04: liner top at parent shoe; multiple nested liners; absent hanger. |
| Completion criteria | Label liner role và explicit top; generic legacy rendering không nhận là hanger-supported assembly. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### production-liner — Production liner

Phạm vi: **configuration**; xác minh kỹ thuật: **definition-backed**. Nguồn: [liner](https://glossary.slb.com/en/terms/l/liner).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Casing string treo trong casing trước, không kéo tới surface. |
| Fields / units / depth | linerId; interval; segments OD/ID/length; overlap interval. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | contained-in parent casing/hole; supported-by liner hanger; named liner-top anchor. |
| Symbol / layer / label | tubular; terminates ở liner top + overlap label. |
| Validation | Top inside parent range; overlap explicit; not auto-assume hanger/support. |
| Current / proposed | **legacy-generic**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F04: liner top at parent shoe; multiple nested liners; absent hanger. |
| Completion criteria | Label liner role và explicit top; generic legacy rendering không nhận là hanger-supported assembly. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### tieback — Liner tieback / extension

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [liner](https://glossary.slb.com/en/terms/l/liner), [tieback](https://glossary.slb.com/en/terms/t/tieback).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Extension nối từ liner-top connector lên phía trên. |
| Fields / units / depth | startDepth + segments; connectorId; targetLinerId; OD/ID. Legacy tiebackID/type fields. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | connects-to liner-top/PBR; supported-by upper seat where supplied. |
| Symbol / layer / label | tubular; separate extension line + connector label. |
| Validation | Connector/endpoint continuity; no duplicate overlap counted; không dùng subsea flowline tieback meaning. |
| Current / proposed | **type-only**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F04: disconnected extension; taper; reversed endpoint. |
| Completion criteria | Dispatch explicit extension và topology diagnostic; không silently ignore tieback. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### shoe — Casing shoe / guide or float variant

Phạm vi: **core**; xác minh kỹ thuật: **family-only**. Nguồn: [float_shoe](https://glossary.slb.com/en/terms/f/float_shoe).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Terminal shoe assembly; float function chỉ khi variant được cung cấp. |
| Fields / units / depth | stringId; bottom anchor; variant guide/float/unknown; envelope optional. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Owned by terminal string segment; connects to bottom endpoint. |
| Symbol / layer / label | tools; paired terminal triangles legacy, proposed variant + label. |
| Validation | At terminal depth; float capability không suy từ shoe=true; avoid duplicate bottom glyph. |
| Current / proposed | **legacy-rendered**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F03: shoe false/undefined; empty segments; float vs guide label. |
| Completion criteria | Anchor at computed bottom; generic glyph không tuyên bố check valve. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### float-collar — Float collar

Phạm vi: **configuration**; xác minh kỹ thuật: **definition-backed**. Nguồn: [float_collar](https://glossary.slb.com/en/terms/f/float_collar).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Collar near-bottom với check-valve/plug-landing context. |
| Fields / units / depth | stringId; at; OD/ID; valve variant unknown allowed. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Inline casing, above shoe per provided assembly. |
| Symbol / layer / label | tools; short collar/check-valve marker + label. |
| Validation | Within host; position relative shoe explicit; no guessed spacing. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F03: collar at segment transition; removed/drilled-out state. |
| Completion criteria | Inline anchor, valve role và lifecycle legible. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### liner-hanger — Liner hanger

Phạm vi: **configuration**; xác minh kỹ thuật: **definition-backed**. Nguồn: [liner_hanger](https://glossary.slb.com/en/terms/l/liner_hanger).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Support liner tại casing trước. |
| Fields / units / depth | linerId; parentCasingId; at; seatProfile?; settingMethod? Common quantities/datum contract áp dụng. |
| Host / reference / attachment | supported-by parent wall/seat; supports liner; seal relation separate. |
| Symbol / layer / label | tools; slip/support glyph at liner top. |
| Validation | Parent present at at-depth; liner ID resolved; no substitute surface CasingHanger. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F04: nested liners; shared depth; unknown seat. |
| Completion criteria | Distinct support relation và symbol; no seal inferred. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### centralizer — Casing centralizer

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [casing](https://glossary.slb.com/en/terms/c/casing).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Giữ casing quanh vị trí bore tương đối theo assembly data. |
| Fields / units / depth | stringId; at/interval; envelopeOD; variant optional. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | attached-to casing exterior; constrained by bore envelope. |
| Symbol / layer / label | tools; bowed/stand-off marker, schematic label. |
| Validation | Envelope fit nếu known; không infer cement quality hay centering perfection. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F03: many repeated items; eccentricity unspecified. |
| Completion criteria | Repeated items deterministic, labels summarized có counts. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### stage-collar — Stage cementing collar

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [cement](https://glossary.slb.com/en/terms/c/cement).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Interface cho staged cement placement theo thiết bị được khai báo. |
| Fields / units / depth | stringId; at; portState; stageId. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Inline casing; connects-to declared annulus/stage record. |
| Symbol / layer / label | tools; ported collar symbol + state label. |
| Validation | Stage refs và depth valid; no staged-operation simulation. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F05: closed/unknown ports; two cement stages. |
| Completion criteria | Stage identity không merge với float collar. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |


## cement-barriers

### annular-cement — Annular cement / TOC

Phạm vi: **core**; xác minh kỹ thuật: **definition-backed**. Nguồn: [cement](https://glossary.slb.com/en/terms/c/cement).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Biểu diễn cement giữa casing và bore/outer casing. |
| Fields / units / depth | innerId; outerId; interval; TOC source/uncertainty; placement status. Legacy refCasingID/startDepth. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | occupies-annulus; associated with string, not lumen. |
| Symbol / layer / label | annular-fill; cement hatch; TOC depth/unknown label. |
| Validation | Clip boundaries; top≤bottom; bottom explicit proposed; no cement quality inferred. |
| Current / proposed | **legacy-rendered**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F05: TOC outside casing; missing refs; diameter step; unknown TOC. |
| Completion criteria | Fill đúng annulus, TOC/provenance explicit. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### cement-plug — Cement plug / squeeze interval

Phạm vi: **configuration**; xác minh kỹ thuật: **definition-backed**. Nguồn: [cement](https://glossary.slb.com/en/terms/c/cement), [plug_and_abandon](https://glossary.slb.com/en/terms/p/plug_and_abandon).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Cement ở bore/lumen hoặc declared repair interval; purpose tách annular cement. |
| Fields / units / depth | interval; purpose abandonment/kickoff/repair; hostBoreId; evidenceIds. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | occupies bore/lumen; optional supported-by bridge plug; squeeze target explicit. |
| Symbol / layer / label | barrier-overlay; full-bore hatch + purpose label. |
| Validation | Not map to current annular Cement; bore boundaries exist; placement không là tested isolation. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F11: plug spanning cut casing; uncertain top/bottom; failed test. |
| Completion criteria | Plug span/purpose/evidence distinct from annular fill. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### barrier-record — Declared barrier / evidence span

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [plug_and_abandon](https://glossary.slb.com/en/terms/p/plug_and_abandon).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Nhóm component/evidence theo objective người nhập; overlay traceability. |
| Fields / units / depth | barrierId; objective; componentIds; evidenceIds; verification state; interval optional. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | annotates components; separate from physical ownership. |
| Symbol / layer / label | barrier-overlay; bracket with explicit unknown/verified evidence text. |
| Validation | No pass inferred from presence; evidence source/time/type required for supplied verification. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F11: incomplete/failed evidence; duplicate barrier role; removed component. |
| Completion criteria | Traceable evidence display; no certification wording. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### packoff — Annular packoff / seal assembly

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [casing_hanger](https://glossary.slb.com/en/terms/c/casing_hanger), [tubing_hanger](https://glossary.slb.com/en/terms/t/tubing_hanger).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Seal interface tại head/hanger hoặc annular assembly. |
| Fields / units / depth | innerId; outerId; seatId; at; sealState; envelope. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | seals-between named interfaces; support relation independent. |
| Symbol / layer / label | interfaces; seal blocks + state label. |
| Validation | Seats consistent, unknown seal status retained; no rating default. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F10: missing seat; multiple seals; leak annotation. |
| Completion criteria | Seal relation distinct from hanger support. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |


## completion

Ưu tiên triển khai đã chọn ngày 2026-10-04: **Tubing String** và **Tubing Hanger**. Theo dõi selection, implementation evidence và kế hoạch tại [Completion Phase 1](completion-phase-1-plan.md). Hai cards đã có runtime **implemented** trong phạm vi [Completion v2 Phase 1](completion-v2-contract.md); giới hạn dual tubing/subsea ports và common contract chưa triển khai được ghi rõ ở runtime contract.

### tubing — Production / injection tubing string

Phạm vi: **core**; xác minh kỹ thuật: **family-only**. Nguồn: [production_tubing](https://glossary.slb.com/en/terms/p/production_tubing).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Conduit completion đưa lưu thể theo purpose supplied. |
| Fields / units / depth | stringId; purpose; segments OD/ID/length; interval; connection optional. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | contained-in casing/liner/bore; supported-by tubing hanger; connects-to completion tools. |
| Symbol / layer / label | tubular; inner string lines; label Tubing + size/depth. |
| Validation | No Casing alias; segment continuity/clearance; injection purpose không suy từ pipe. |
| Current / proposed | **implemented** — Completion v2 Phase 1; xem runtime contract cho wire fields, capability và giới hạn. Common/variant contracts ngoài slice vẫn proposed. |
| Fixture / edge cases | F06/F12: dual strings, taper, missing ID, tubing below packer. |
| Completion criteria | Independent tubing model/dispatch/hosts, no LLM coupling. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### tubing-hanger — Tubing hanger

Phạm vi: **configuration**; xác minh kỹ thuật: **definition-backed**. Nguồn: [tubing_hanger](https://glossary.slb.com/en/terms/t/tubing_hanger).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Support tubing ở tubing head; sealing interfaces theo cấu hình. |
| Fields / units / depth | tubingId; headId; seatId; at/elevation; ports optional. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | supports tubing, supported-by head seat; seals-between declared boundaries. |
| Symbol / layer / label | interfaces; hanger glyph + tubing ID, named ports. |
| Validation | Different from casing hanger; one seat occupancy per snapshot unless assembly supports more. |
| Current / proposed | **implemented** — Completion v2 Phase 1; xem runtime contract cho wire fields, capability và giới hạn. Common/variant contracts ngoài slice vẫn proposed. |
| Fixture / edge cases | F10: dual bore, cable/control-line feedthrough, unknown seat elevation. |
| Completion criteria | Tubing support/ports/seals traceable separately. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### production-packer — Production packer

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [packer](https://glossary.slb.com/en/terms/p/packer), [production_packer](https://glossary.slb.com/en/terms/p/production_packer).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Seal tubing annulus theo production completion. |
| Fields / units / depth | CompletionPacker v2: id, role, innerConduitId, outerHostId, top/bottom quantities, setState, retrievable? và metadata. Phase 2 cased/liner annuli only; legacy Packer riêng. |
| Host / reference / attachment | Explicit inner/outer annulus endpoints; tubing-host spans cho production/isolation/test; liner-top → parent casing tại liner top. Không suy support từ seal. |
| Symbol / layer / label | tools; paired blocks ngoài lumen; set crossed, unset outline, unknown outline + text; all strokes solid; role/state/depth/refs label. Unknown ID dùng unresolved outline. |
| Validation | Full interval coverage, same annulus, bore clearance nếu biết, uniform diameter, no overlapping packers; stable IDs, units/MD/datum, lifecycle/evidence. Unsupported openhole/taper/setting profiles trả diagnostic. |
| Current / proposed | **implemented**; Phase 2 bounded v2, [packer contract](completion-packers.md); Packer legacy giữ riêng. |
| Fixture / edge cases | F06: tubing missing; multiple packers; openhole variant; at shoe boundary. |
| Completion criteria | Phase 2 VERIFIED_LOCAL trong capability bounded; legacy generic vẫn riêng. Role/state, seal endpoints và QA evidence traceable; không chứng nhận hydraulic sealing/rating. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### liner-top-packer — Liner top packer

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [packer](https://glossary.slb.com/en/terms/p/packer), [liner_top_packer](https://www.halliburton.com/en/products/matchset-hydraulic-set-liner-hanger-with-integral-liner-top-packer).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Seal liner-top overlap annulus; support role không tự suy. |
| Fields / units / depth | CompletionPacker v2: id, role, innerConduitId, outerHostId, top/bottom quantities, setState, retrievable? và metadata. Phase 2 cased/liner annuli only; legacy Packer riêng. |
| Host / reference / attachment | Explicit inner/outer annulus endpoints; tubing-host spans cho production/isolation/test; liner-top → parent casing tại liner top. Không suy support từ seal. |
| Symbol / layer / label | tools; paired blocks ngoài lumen; set crossed, unset outline, unknown outline + text; all strokes solid; role/state/depth/refs label. Unknown ID dùng unresolved outline. |
| Validation | Full interval coverage, same annulus, bore clearance nếu biết, uniform diameter, no overlapping packers; stable IDs, units/MD/datum, lifecycle/evidence. Unsupported openhole/taper/setting profiles trả diagnostic. |
| Current / proposed | **implemented**; Phase 2 bounded v2, [packer contract](completion-packers.md); Packer legacy giữ riêng. |
| Fixture / edge cases | F06: tubing missing; multiple packers; openhole variant; at shoe boundary. |
| Completion criteria | Phase 2 VERIFIED_LOCAL trong capability bounded; legacy generic vẫn riêng. Role/state, seal endpoints và QA evidence traceable; không chứng nhận hydraulic sealing/rating. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### isolation-packer — Isolation packer

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [packer](https://glossary.slb.com/en/terms/p/packer).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Isolate declared interval/zone boundaries. |
| Fields / units / depth | CompletionPacker v2: id, role, innerConduitId, outerHostId, top/bottom quantities, setState, retrievable? và metadata. Phase 2 cased/liner annuli only; legacy Packer riêng. |
| Host / reference / attachment | Explicit inner/outer annulus endpoints; tubing-host spans cho production/isolation/test; liner-top → parent casing tại liner top. Không suy support từ seal. |
| Symbol / layer / label | tools; paired blocks ngoài lumen; set crossed, unset outline, unknown outline + text; all strokes solid; role/state/depth/refs label. Unknown ID dùng unresolved outline. |
| Validation | Full interval coverage, same annulus, bore clearance nếu biết, uniform diameter, no overlapping packers; stable IDs, units/MD/datum, lifecycle/evidence. Unsupported openhole/taper/setting profiles trả diagnostic. |
| Current / proposed | **implemented**; Phase 2 bounded v2, [packer contract](completion-packers.md); Packer legacy giữ riêng. |
| Fixture / edge cases | F06: tubing missing; multiple packers; openhole variant; at shoe boundary. |
| Completion criteria | Phase 2 VERIFIED_LOCAL trong capability bounded; legacy generic vẫn riêng. Role/state, seal endpoints và QA evidence traceable; không chứng nhận hydraulic sealing/rating. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### test-packer — Well-test / service packer

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [packer](https://glossary.slb.com/en/terms/p/packer).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Temporary/test isolation context, không mặc định permanent. |
| Fields / units / depth | CompletionPacker v2: id, role, innerConduitId, outerHostId, top/bottom quantities, setState, retrievable? và metadata. Phase 2 cased/liner annuli only; legacy Packer riêng. |
| Host / reference / attachment | Explicit inner/outer annulus endpoints; tubing-host spans cho production/isolation/test; liner-top → parent casing tại liner top. Không suy support từ seal. |
| Symbol / layer / label | tools; paired blocks ngoài lumen; set crossed, unset outline, unknown outline + text; all strokes solid; role/state/depth/refs label. Unknown ID dùng unresolved outline. |
| Validation | Full interval coverage, same annulus, bore clearance nếu biết, uniform diameter, no overlapping packers; stable IDs, units/MD/datum, lifecycle/evidence. Unsupported openhole/taper/setting profiles trả diagnostic. |
| Current / proposed | **implemented**; Phase 2 bounded v2, [packer contract](completion-packers.md); Packer legacy giữ riêng. |
| Fixture / edge cases | F06: tubing missing; multiple packers; openhole variant; at shoe boundary. |
| Completion criteria | Phase 2 VERIFIED_LOCAL trong capability bounded; legacy generic vẫn riêng. Role/state, seal endpoints và QA evidence traceable; không chứng nhận hydraulic sealing/rating. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### seal-bore — Seal-bore / PBR / seal assembly

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [sealbore](https://glossary.slb.com/en/terms/s/sealbore), [seal_receptacle](https://glossary.slb.com/en/terms/s/seal_receptacle), [seal_assembly](https://glossary.slb.com/en/terms/s/seal_assembly).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Receptacle/seal interface cho completion movement/connection. |
| Fields / units / depth | Completion v2 SealBore: variant, ownerId, top/bottom, od, innerDiameter?, profile?; SealAssembly: tubingId, segmentId, receptacleId, seal interval, engagement, profile?; shared metadata. |
| Host / reference / attachment | Explicit liner or tubing-packer owner and receptacle reference; seal segment owns existing tubing length once. No support or hydraulic sealing inferred. |
| Symbol / layer / label | tools; supplied receptacle walls and seal interval markers at true MD; separate not-MD-scale details, solid strokes and traceable labels. |
| Validation | Owner/host coverage and fit, seal interval containment, geometric engagement consistency, lifecycle, unique receipt/segment occupancy, unknown profiles and unsupported overlap. |
| Current / proposed | **implemented** — bounded Phase 5; [runtime contract](completion-seals.md). |
| Fixture / edge cases | F04/F06/F12-F15: partial/disengaged/unknown, missing profile/ID, unit conversion, boundaries, repeated ownership, escaped labels and immutable input. |
| Completion criteria | Phase 5 bounded runtime; see completion-seals.md and local evidence. No manufacturer mating, integral assembly, ratings or seal certification. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### landing-nipple — Landing nipple / lock profile

Phạm vi: **configuration**; xác minh kỹ thuật: **definition-backed**. Nguồn: [landing_nipple](https://glossary.slb.com/en/terms/l/landing_nipple).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Profile bên trong tubular cho insert tool/plug. |
| Fields / units / depth | Completion v2 LandingNipple: tubingId, segmentId, profileType, profile?, sealBoreDiameter?, noGoDiameter?, shared metadata. Segment supplies physical OD/ID/length. |
| Host / reference / attachment | Owns one existing tubing segment; distinct from an insert tool. No plug, lock compatibility or installed insert inferred. |
| Symbol / layer / label | tools; open internal profile and supplied no-go restriction, true MD interval, separate not-MD-scale detail and solid lines. |
| Validation | References/ownership, supplied bore containment, no-go consistency, lifecycle, no overlapping unrelated tool; unknown bore/profile visible. |
| Current / proposed | **implemented** — bounded Phase 5; [runtime contract](completion-seals.md). |
| Fixture / edge cases | F06/F12-F15: repeated nipples, no-go/selective/unknown, missing bore, adjacent couplings, empty or unrepresented insert, units and labels. |
| Completion criteria | Phase 5 bounded runtime; see completion-seals.md and local evidence. Nipple and insert stay distinct; no mechanical lock verification. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### crossover — Crossover / coupling / pup joint

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [tubular_accessories](https://www.crossoverinc.com/products.aspx), [crossover](https://glossary.slb.com/en/terms/c/crossover), [production_tubing](https://glossary.slb.com/en/terms/p/production_tubing), [casing](https://glossary.slb.com/en/terms/c/casing).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Nối size/profile hoặc short tubular section; chi tiết chỉ khi cần. |
| Fields / units / depth | Runtime: Crossover/Coupling dùng tubingId, fromSegmentId, toSegmentId, at m/ft MD; Coupling thêm body od và innerDiameter optional in/mm. PupJoint dùng tubingId/segmentId, lấy physical quantities từ owned tubing segment. Connection texts optional. |
| Host / reference / attachment | Explicit directed adjacent tubing endpoints; tối đa một Crossover/Coupling mỗi junction. PupJoint phân loại một owned tubing segment, không cộng thêm length. |
| Symbol / layer / label | tubular; solid OD/known-ID boundaries và open lumen. Point connectors constrained theo adjacent segments; Pup Joint giữ physical interval và có detail riêng not MD scale. |
| Validation | Refs, matching MD, unique junction/segment ownership, lifecycle/evidence, finite quantities/units; Coupling same-OD và body/host clearance; unknown ID/profile không tự suy; Pup length counted once. |
| Current / proposed | **implemented** — bounded Crossover và ordinary external same-OD Coupling point junctions, Pup Joint physical segment; [crossover contract](completion-crossover.md), [joint contract](completion-joints.md). Manufacturer geometry/thread mating, cross-string/service-tool variants chưa hỗ trợ. |
| Fixture / edge cases | F03/F06/F13/F14/F15: endpoints, units, unknown bore/profiles, body clearance, short physical pup, neighboring tools, all-Pup string, immutability và escaped long labels; [crossover tests](../../tests/crossover.test.ts), [joint tests](../../tests/coupling-pup-joint.test.ts). |
| Completion criteria | Endpoints và taper remain physically consistent. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### expansion-joint — Expansion joint

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [production_tubing](https://glossary.slb.com/en/terms/p/production_tubing).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Assembly cho phép relative movement theo model supplied. |
| Fields / units / depth | hostStringId; interval; stroke quantity?; state unknown allowed. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Inline tubing; connects-to upper/lower segments. |
| Symbol / layer / label | tools; telescoping glyph + stroke label if provided. |
| Validation | No guessed stroke/design allowance; avoid double counting length. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F06: extended/retracted/unknown; crossing packer depth. |
| Completion criteria | Explicit envelope/length và state, no mechanics simulation. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### control-line — Control / chemical line / gauge cable

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [subsurface_safety_valve_sssv](https://glossary.slb.com/en/terms/s/subsurface_safety_valve_sssv).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Đường secondary service/measurement từ surface tới tool. |
| Fields / units / depth | serviceType; endpoints; path anchors; diameter?; medium? Common quantities/datum contract áp dụng. |
| Host / reference / attachment | connects named tool/head ports; attached externally to string per configuration. |
| Symbol / layer / label | tools; thin separate line, service label; distinguish ESP power cable. |
| Validation | Endpoints resolved; service compatible only when supplied; not silently route through seals. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F07/F09/F10: shared line, feedthrough missing, crossed packer. |
| Completion criteria | Traceable endpoint path and missing-port diagnostic. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |


## valves-flow

### safety-valve — SSSV / SCSSV

Phạm vi: **configuration**; xác minh kỹ thuật: **definition-backed**. Nguồn: [subsurface_safety_valve_sssv](https://glossary.slb.com/en/terms/s/subsurface_safety_valve_sssv).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Emergency closure device family trong producing conduit. |
| Fields / units / depth | hostTubingId; at/interval; controlType; valveState; controlPortId?; bore. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Inline tubing; surface-controlled variant connects control line/port. |
| Symbol / layer / label | tools; valve glyph + SSSV/SCSSV + open/closed/unknown text. |
| Validation | State not inferred; control type explicit; no rating/fail-safe certification from symbol. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F07: wireline-retrievable insert vs tubing-retrievable; unknown state. |
| Completion criteria | Correct inline/control relations and state legend. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### sliding-sleeve — Sliding sleeve

Phạm vi: **configuration**; xác minh kỹ thuật: **definition-backed**. Nguồn: [sliding_sleeve](https://glossary.slb.com/en/terms/s/sliding_sleeve).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Ports nối conduit với annulus khi state tương ứng được khai báo. |
| Fields / units / depth | hostStringId; at/interval; portState; targetAnnulusId. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Inline tubing; connects-to annulus through named ports. |
| Symbol / layer / label | tools; sleeve/ports glyph + state label. |
| Validation | Annulus exists at depth; closed/unknown cannot be shown flowing by default. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F07: multiple zones, open/closed/unknown ports. |
| Completion criteria | Port endpoints/state independent from flow arrows. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### icd-icv — ICD / ICV

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [sand_control](https://glossary.slb.com/en/terms/s/sand_control).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Family inflow restriction/control; passive ICD và actuated ICV phải khác variant. |
| Fields / units / depth | hostScreenOrStringId; interval/at; deviceType; portId; state/setting optional with units. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | connects zone inflow path to conduit; actuated device control connection explicit. |
| Symbol / layer / label | tools; distinct restriction/control glyph + type text. |
| Validation | No flow coefficient/setting invented; device-specific source required before detailed variant. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F08: multi-zone devices; passive no state; missing control port. |
| Completion criteria | Variant semantics and zone association explicit. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### check-valve — Check / standing / traveling valve

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [float_shoe](https://glossary.slb.com/en/terms/f/float_shoe), [rod_pump](https://glossary.slb.com/en/terms/r/rod_pump).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Cho flow direction theo thiết bị; standing/traveling thuộc pump assembly nếu supplied. |
| Fields / units / depth | hostId; at; allowedDirection; valveRole; state. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Inline conduit hoặc pump child; connects flow endpoints. |
| Symbol / layer / label | tools; one-way marker + role/direction. |
| Validation | Direction tied to named endpoints; not infer orientation from screen y. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F09: two pump valves; reversed direction; unknown orientation. |
| Completion criteria | Flow role and assembly identity stay separate. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### flow-insert — Blanking plug / choke insert

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [landing_nipple](https://glossary.slb.com/en/terms/l/landing_nipple).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Insert làm closure hoặc restriction theo role supplied. |
| Fields / units / depth | nippleId; at; insertType; bore/orifice?; state. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Locked/supported by landing nipple; seals or restricts named conduit. |
| Symbol / layer / label | tools; insert glyph + role/state label. |
| Validation | Nipple exists; profile compatibility unresolved if missing; plug differs choke. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F07: empty nipple; mismatched profile; removed insert. |
| Completion criteria | Correct host/profile and closure/restriction distinction. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |


## perforation-sand

### perforation — Perforation interval

Phạm vi: **configuration**; xác minh kỹ thuật: **definition-backed**. Nguồn: [perforation](https://glossary.slb.com/en/terms/p/perforation).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Liên thông casing/liner tới formation. |
| Fields / units / depth | hostStringId; interval; zoneId; shotDensity? with shots/m or shots/ft; phasing? deg; lifecycle. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | annotates/penetrates casing wall/cement, connects reservoir/conduit context. |
| Symbol / layer / label | tools; radial ticks at interval; depth/zone label. |
| Validation | Within host/zone; not screen hatching; unknown phase/density không tạo exact number of holes. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F08: multiple intervals; reperforated vs squeezed; thin span. |
| Completion criteria | Ticks đúng walls/depth, display aggregation not actual charge count. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### screen — Sand screen / slotted liner

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [gravel_pack](https://glossary.slb.com/en/terms/g/gravel_pack), [sand_screen](https://glossary.slb.com/en/terms/s/sand_screen).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Sand exclusion family; screen và slotted tubular là distinct variant. |
| Fields / units / depth | stringId; interval; screenType; basePipe OD/ID; aperture/slot? with unit. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Inline completion or lower string; contained-in hole/casing. |
| Symbol / layer / label | tools; screened band within host envelope, variant label. |
| Validation | Aperture needs manufacturer/source; not imply particle retention from hatch. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F08: openhole vs cased; screen end at packer; unknown aperture. |
| Completion criteria | Screen host/interval correct; variant details marked unverified. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### gravel-pack — Gravel pack interval

Phạm vi: **configuration**; xác minh kỹ thuật: **definition-backed**. Nguồn: [gravel_pack](https://glossary.slb.com/en/terms/g/gravel_pack).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Prepared gravel quanh screen theo sand-control assembly. |
| Fields / units / depth | screenId; inner/outer boundary IDs; interval; gravel size optional with unit or mesh convention. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | occupies-annulus outside screen, associated perforated/openhole zone. |
| Symbol / layer / label | annular-fill; dots distinct from cement; pack label. |
| Validation | Within bounds; no treatment success from fill; mesh not converted blindly to length. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F08: partial pack; missing screen; adjacent cement fill. |
| Completion criteria | Correct gravel region/legend with uncertainty. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### blank-basepipe — Blank pipe / bull plug / lower termination

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [gravel_pack](https://glossary.slb.com/en/terms/g/gravel_pack), [production_tubing](https://glossary.slb.com/en/terms/p/production_tubing).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Non-screened section hoặc sealed terminal trong lower completion. |
| Fields / units / depth | hostStringId; interval/at; terminationType; OD/ID; closureState. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Inline screen string; terminal anchor for bull plug. |
| Symbol / layer / label | tubular/tools; plain segment or terminal cap + label. |
| Validation | At real endpoint; blank pipe không là screened interval; closure unknown explicit. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F08: alternating blank/screen sections; open vs capped tail. |
| Completion criteria | Segments và endpoint role distinguished. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |


## artificial-lift

### esp — ESP assembly

Phạm vi: **configuration**; xác minh kỹ thuật: **definition-backed**. Nguồn: [electric_submersible_pump](https://glossary.slb.com/en/terms/e/electric_submersible_pump).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Electrically driven downhole pump family. |
| Fields / units / depth | hostStringId; interval; assembly parts order if known; pump/motor envelope; powerPort; model optional. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Suspended on tubing; contained-in casing; connects intake/discharge and cable. |
| Symbol / layer / label | tools; stacked assembly blocks + ESP label. |
| Validation | Fit/part order from actual assembly; no performance or stage count defaults. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F09: below packer; missing motor envelope; multiple parts too short to scale. |
| Completion criteria | Assembly envelope/flow/power endpoints explicit; inset legible. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### esp-cable — ESP power cable / feedthrough

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [electric_submersible_pump](https://glossary.slb.com/en/terms/e/electric_submersible_pump).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Power path từ surface qua head/packer interfaces tới motor. |
| Fields / units / depth | motorPortId; headFeedthroughId; path anchors; cable envelope optional. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | connects motor/surface endpoints; attached-to tubing path. |
| Symbol / layer / label | tools; labeled separate power line. |
| Validation | Feedthroughs explicit; cannot pass through sealed barrier by assumed route. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F09/F10: feedthrough missing; crossed control line; splice annotation. |
| Completion criteria | Power path/ports traceable, different from control line. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### gas-lift-mandrel — Gas-lift mandrel

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [gas_lift](https://glossary.slb.com/en/terms/g/gas_lift).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Tubing carrier/interface cho gas-lift valve theo assembly. |
| Fields / units / depth | hostTubingId; at/interval; valveSeatId; mandrelType; envelope. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Inline tubing; supports valve insert/seat; annulus gas connection. |
| Symbol / layer / label | tools; side pocket/mandrel generic glyph + label. |
| Validation | Do not infer side-pocket variant or dimensions; valve seat not duplicate inline valve. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F09: many unloading mandrels; missing valve; nonretrievable variant. |
| Completion criteria | Mandrel and valve modeled separately where needed. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### gas-lift-valve — Gas-lift valve

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [gas_lift](https://glossary.slb.com/en/terms/g/gas_lift).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Gas injection interface giữa annulus và tubing. |
| Fields / units / depth | mandrelId; seatId; at; role operating/unloading/unknown; state; pressure setting optional with reference/unit. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Inserted in mandrel; connects annulus gas path to tubing. |
| Symbol / layer / label | tools; valve at mandrel + role/state label. |
| Validation | No guessed valve spacing/operating pressure; role not infer from depth. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F09: several valves; state unknown; removed insert. |
| Completion criteria | Gas path/role/seat and source retained. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### rod-pump — Rod pump / sucker-rod string

Phạm vi: **configuration**; xác minh kỹ thuật: **definition-backed**. Nguồn: [rod_pump](https://glossary.slb.com/en/terms/r/rod_pump).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Surface drive/rod motion tới downhole pump family. |
| Fields / units / depth | pump interval; rodStringId/segments; tubingId; intake/discharge; valve children optional. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Rod inside tubing, connects surface drive context và pump. |
| Symbol / layer / label | tools; central rod + pump glyph, pump depth label. |
| Validation | Rod/tubing fit; no mechanical loads calculation; surface drive only context. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F09: rod taper; pump below tubing; standing/traveling valves. |
| Completion criteria | Rod path và pump endpoints correct, not ESP. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### pcp — Progressing cavity pump

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [artificial_lift](https://glossary.slb.com/en/terms/a/artificial_lift), [progressing_cavity_pump](https://glossary.slb.com/en/terms/p/progressing_cavity_pump).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Rotary positive-displacement lift family, chi tiết variant cần nguồn riêng. |
| Fields / units / depth | pump interval; driveType; rotor/stator envelope; hostTubingId; ports. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Inline/attached completion; rod/electric drive connection only if supplied. |
| Symbol / layer / label | tools; PCP generic block + drive label. |
| Validation | No rotor pitch/torque/rating defaults; source chưa đọc được ghi unverified. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F09: rod-driven vs electric drive; unknown stator size. |
| Completion criteria | Generic family annotation có uncertainty, detailed variant requires verified source. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### hydraulic-lift — Hydraulic / jet-pump lift

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [artificial_lift](https://glossary.slb.com/en/terms/a/artificial_lift).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Lift family dùng supplied power-fluid/return paths. |
| Fields / units / depth | pump interval; type; powerFluidPort; returnPort; host strings. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | connects named fluid conduits; ownership independent from flow graph. |
| Symbol / layer / label | tools; pump block + named arrows only if flow direction known. |
| Validation | No nozzle sizing/operating rate defaults; source for actual topology needed. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F09: concentric/parallel conduits; unknown return route. |
| Completion criteria | Energy/return path explicit and unresolved facts visible. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |


## wellhead-subsea

### wellhead — Wellhead / casing-tubing heads

Phạm vi: **core**; xác minh kỹ thuật: **definition-backed**. Nguồn: [wellhead](https://glossary.slb.com/en/terms/w/wellhead).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Termination/support interfaces ở surface hoặc seabed theo configuration. |
| Fields / units / depth | configuration; surfaceCasingId; head/seat IDs; elevation/datum; named ports; rating optional with evidence. Legacy wellheadType/surfaceCasingID/seatingCasingID. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | supported-by surface casing; supports hangers; connects tree interfaces. |
| Symbol / layer / label | interfaces; head block/inset; datum and config label. |
| Validation | No type-specific claim from legacy metadata; seats/ports explicit; no rating inference. |
| Current / proposed | **legacy-rendered**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F10: onshore/platform/subsea; datum negative elevation; no casing. |
| Completion criteria | Support refs/display origin vs elevation explicit; future variant dispatch reviewed. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### casing-hanger — Casing hanger

Phạm vi: **core**; xác minh kỹ thuật: **definition-backed**. Nguồn: [casing_hanger](https://glossary.slb.com/en/terms/c/casing_hanger).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Support casing tại wellhead seat; seal relation nếu supplied. |
| Fields / units / depth | casingId; headId; seatId; at/elevation; sealAssemblyId optional. Legacy refCasingID only. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | supports casing; supported-by wellhead; seal separate. |
| Symbol / layer / label | interfaces; hanger glyph + casing/seat label. |
| Validation | Requires head and casing; order independent explicit seats; no two occupants same seat. |
| Current / proposed | **legacy-rendered**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F10: no wellhead; reordered hangers; duplicate seat. |
| Completion criteria | Seat identities stable; legacy slot-by-array limitation recorded. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### tree — Production / Christmas tree

Phạm vi: **configuration**; xác minh kỹ thuật: **definition-backed**. Nguồn: [christmas_tree](https://glossary.slb.com/en/terms/c/christmas_tree).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Assembly valves/spools/chokes cho production flow control. |
| Fields / units / depth | treeId; configuration; bore IDs; named ports; valve children; envelope optional. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | connects-to wellhead/tubing interface và flowline terminal. |
| Symbol / layer / label | interfaces; simplified tree/inset with valve roles. |
| Validation | Not synonymous wellhead; supplied ports/roles only; no manufacturer/certification inference. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F10: dual bore; horizontal/vertical tree; unknown ports. |
| Completion criteria | Tree distinct graph và role-labeled ports. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### tree-valves — Master / wing / swab / annulus valve

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [christmas_tree](https://glossary.slb.com/en/terms/c/christmas_tree).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Valve roles trong tree flow/annulus/access path. |
| Fields / units / depth | treeId; role; portFrom/to; state; actuation optional. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Child of tree/head; connects named ports, annulus role explicit. |
| Symbol / layer / label | interfaces; role-labeled valve glyph, known/unknown state. |
| Validation | Role not determined by drawing x/y; no missing state = closed assumption. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F10: multiple master valves; absent swab; unknown actuator. |
| Completion criteria | Each valve traced to port graph and state. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### choke — Production choke

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [christmas_tree](https://glossary.slb.com/en/terms/c/christmas_tree).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Flow restriction ở tree/outlet theo configuration. |
| Fields / units / depth | hostTreeId; ports; chokeType; setting/orifice optional with unit. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Inline tree/flowline outlet boundary; not downhole insert unless specified. |
| Symbol / layer / label | interfaces; restriction glyph + setting/unknown label. |
| Validation | No Cv/bean size/unit guesses; ports identified. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F10: adjustable vs fixed; unknown setting; missing outlet. |
| Completion criteria | Choke role separate from shutoff valve. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### subsea-interface — Subsea wellhead / connector / tubing-head interface

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [wellhead](https://glossary.slb.com/en/terms/w/wellhead), [christmas_tree](https://glossary.slb.com/en/terms/c/christmas_tree).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Interfaces subsea tới tree/hangers tại mudline context. |
| Fields / units / depth | headId; connector IDs; seat IDs; elevation/datum; configuration; named bores. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Connects wellhead/tree và casing/tubing; support/lock/seal relations separate. |
| Symbol / layer / label | interfaces; seabed context + simplified connector/inset. |
| Validation | Do not claim Subsea metadata generates interface; manufacturer mating profiles require source. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F10: mudline different from RKB; horizontal tree interface; unknown connector. |
| Completion criteria | Explicit interface topology và datum, generic depiction clearly labeled. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### subsea-control — Subsea control module / umbilical endpoint

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [christmas_tree](https://glossary.slb.com/en/terms/c/christmas_tree).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Context block cho control connections tới subsea assembly. |
| Fields / units / depth | moduleId; treeId; controlPortIds; umbilical endpoint; serviceType. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Connects named tree ports; context boundary to external network. |
| Symbol / layer / label | interfaces; context block/dashed external line + label. |
| Validation | No full subsea-network or control-system design; unresolved ports explicit. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F10: shared umbilical; spare ports; missing module. |
| Completion criteria | Only schematic endpoint/relationship, no claimed control function test. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |


## abandonment

### bridge-plug — Bridge plug / mechanical isolation

Phạm vi: **configuration**; xác minh kỹ thuật: **definition-backed**. Nguồn: [bridge_plug](https://glossary.slb.com/en/terms/b/bridge_plug).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Tool cách ly lower wellbore; permanent/retrievable variant. |
| Fields / units / depth | hostBoreId; at/interval; variant; setState; evidenceIds. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | contained-in casing/bore; seals full named conduit; may support cement plug. |
| Symbol / layer / label | barrier-overlay; full-bore closure glyph + state. |
| Validation | Host/fit valid; retrievability/state from source; placement not certified isolation. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F11: cement above plug; removed plug; unknown test. |
| Completion criteria | Plug topology/state/evidence explicit. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### retainer — Cement retainer / squeeze tool

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [cement](https://glossary.slb.com/en/terms/c/cement), [bridge_plug](https://glossary.slb.com/en/terms/b/bridge_plug).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Isolation/placement tool context cho squeeze/repair operation. |
| Fields / units / depth | hostCasingId; at; valve state; repairTargetId; lifecycle. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | contained-in casing; connects placement path/repair target as supplied. |
| Symbol / layer / label | tools; retainer glyph + role/state label. |
| Validation | Not automatically permanent bridge plug; repair success not inferred. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F11: removed after operation; unknown valve; absent target. |
| Completion criteria | Retainer distinct purpose/lifecycle from abandonment plug. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### cut-casing — Cut / recovered casing interval

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [plug_and_abandon](https://glossary.slb.com/en/terms/p/plug_and_abandon).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Thay đổi tubular tồn tại trong abandonment snapshot. |
| Fields / units / depth | stringId; cutAt; recoveredInterval; snapshotAt; source/evidence. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | annotates parent string; updates extant interval in selected snapshot. |
| Symbol / layer / label | tubular; cut endpoint, removed portion dashed only if historical view requested. |
| Validation | No installed depiction of removed pipe; interval arithmetic valid. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F11: cut through nested strings; unknown recovery bottom. |
| Completion criteria | Selected snapshot extents truthful; historical legend explicit. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |

### abandonment-cap — Wellhead removal / abandonment cap or marker

Phạm vi: **configuration**; xác minh kỹ thuật: **family-only**. Nguồn: [plug_and_abandon](https://glossary.slb.com/en/terms/p/plug_and_abandon).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Surface/seabed closure context theo supplied abandonment record. |
| Fields / units / depth | headId; removalTime?; cap/markerType; elevation/datum; evidenceIds. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Connected-to remaining head/casing terminal; removed component relation historical. |
| Symbol / layer / label | interfaces; cap/marker block + lifecycle/date label. |
| Validation | No jurisdiction depth/plug rule defaults; cap not proof completion of P&A. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F11: wellhead removed but casing remains; mudline cut; unknown date. |
| Completion criteria | Closure context/source clear, no compliance conclusion. Cộng completion gate trong QA. |
| Source / uncertainty | family-only; variant/sizing/rating không verified nếu chưa có source riêng. |


## annotations

### depth-axis — Depth axis / datum / reference elevation

Phạm vi: **core**; xác minh kỹ thuật: **definition-backed**. Nguồn: [measured_depth](https://glossary.slb.com/en/terms/m/measured_depth), [true_vertical_depth](https://glossary.slb.com/en/terms/t/true_vertical_depth).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Tọa độ đọc bản vẽ và depth anchors. |
| Fields / units / depth | basis; datumId; unit; ticks; elevation offsets with sign; surveyId for transformation. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Well header + depth mapping; not physical tool. |
| Symbol / layer / label | annotation; ticks/header MD/TVD @ datum. |
| Validation | No silent datum offset or MD↔TVD conversion; ticks consistent with geometry. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F12/F13: ft vs m; datum missing; deep well; surface negative depth. |
| Completion criteria | Basis/unit/datum on exported figure and consistent anchors. Cộng completion gate trong QA. |
| Source / uncertainty | definition-backed; variant/sizing/rating không verified nếu chưa có source riêng. |

### component-label — Component label / leader / legend

Phạm vi: **core**; xác minh kỹ thuật: **proposed-local**. Nguồn: [ucorn-convention](sources.md).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Giải thích glyph và truy dữ liệu. |
| Fields / units / depth | targetId; text; quantities; lifecycle; legendKey; priority. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | annotates component/interval; leader attaches named anchor. |
| Symbol / layer / label | annotation; side lanes; repeated-label strategy keeps IDs. |
| Validation | XML escape; no text-generated technical claims; no disconnected leader. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F13: long Vietnamese name; ampersand; duplicate names; tiny intervals. |
| Completion criteria | Readable exported labels, no clipping/collision ambiguity. Cộng completion gate trong QA. |
| Source / uncertainty | proposed-local; variant/sizing/rating không verified nếu chưa có source riêng. |

### measurement — Gauge / measurement / log annotation

Phạm vi: **configuration**; xác minh kỹ thuật: **proposed-local**. Nguồn: [ucorn-convention](sources.md).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Ghi measurement/evidence được cung cấp tại depth hoặc interval. |
| Fields / units / depth | targetId; quantity/value/unit; pressure reference; measuredAt; source; uncertainty. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | annotates tool/zone; gauge sensor host optional separate physical device. |
| Symbol / layer / label | annotation; callout, measurement timestamp/unit. |
| Validation | Measurement ≠ rating; datum/time/reference explicit; no inferred pressure. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F07/F11/F12: stale gauge data; psi gauge vs absolute; unknown uncertainty. |
| Completion criteria | Provenance/time/unit readable without engineering verdict. Cộng completion gate trong QA. |
| Source / uncertainty | proposed-local; variant/sizing/rating không verified nếu chưa có source riêng. |

### flow-arrow — Flow / service direction annotation

Phạm vi: **configuration**; xác minh kỹ thuật: **proposed-local**. Nguồn: [ucorn-convention](sources.md).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Biểu diễn direction do input cung cấp, không mô phỏng flow. |
| Fields / units / depth | fromPortId; toPortId; serviceType; direction; snapshot/state. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | annotates declared flow graph; not host ownership. |
| Symbol / layer / label | annotation; arrows/service label, unknown direction text if needed. |
| Validation | Endpoints valid; closed state conflict diagnostic; no calculated rate without source. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F07/F09: unknown state; reverse flow; branch connections. |
| Completion criteria | Arrows trace ports and remain consistent with supplied state. Cộng completion gate trong QA. |
| Source / uncertainty | proposed-local; variant/sizing/rating không verified nếu chưa có source riêng. |

### revision — Revision / lifecycle / uncertainty note

Phạm vi: **core**; xác minh kỹ thuật: **proposed-local**. Nguồn: [ucorn-convention](sources.md).

| Mục | Hợp đồng |
| --- | --- |
| Chức năng | Thông tin thời điểm và mức chắc chắn bản vẽ. |
| Fields / units / depth | revisionId; snapshotAt; author/source; lifecycle legend; unresolved facts. Common quantities/datum contract áp dụng. |
| Host / reference / attachment | Annotates entire well or targets; no ownership relation. |
| Symbol / layer / label | annotation; title block + explicit unknown/planned legend. |
| Validation | Do not merge incompatible snapshots; no installed default from blank field. |
| Current / proposed | **proposed**; đối chiếu source-audit, proposed contract chưa triển khai. |
| Fixture / edge cases | F11/F13: planned overlay on as-built; conflicting source dates. |
| Completion criteria | Revision/source/unknowns present on export. Cộng completion gate trong QA. |
| Source / uncertainty | proposed-local; variant/sizing/rating không verified nếu chưa có source riêng. |
