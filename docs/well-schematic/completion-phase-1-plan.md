# Completion components — Phase 1–4 và trạng thái

Ngày ghi nhận: **2026-10-04**. Người dùng đã chọn `tubing` và `tubing-hanger` làm hai component đầu tiên, sau đó yêu cầu triển khai. Runtime slice đã có; [Completion v2 contract](completion-v2-contract.md) ghi fields/capabilities thực tế, thay cho các wire-format đề xuất ban đầu.

## Trạng thái component

Phạm vi bảng là 11 cards thuộc nhóm `completion` trong [catalog](component-catalog.md). “Đã chọn” là ưu tiên do người dùng xác nhận; độc lập với trạng thái implementation và lifecycle `planned/installed/removed` của thiết bị giếng.

| Catalog ID | Component | Đã chọn | Tiến độ | Implementation hiện tại | Đã hoàn tất runtime |
| --- | --- | --- | --- | --- | --- |
| tubing | Production / Injection Tubing String | **Có — ưu tiên 1** | **VERIFIED_LOCAL** | implemented | **Có — Phase 1** |
| tubing-hanger | Tubing Hanger | **Có — ưu tiên 2** | **VERIFIED_LOCAL** | implemented | **Có — Phase 1** |
| production-packer | Production Packer | **Có — Phase 2** | **VERIFIED_LOCAL** | implemented — bounded v2 | **Có — Phase 2** |
| liner-top-packer | Liner Top Packer | **Có — Phase 2** | **VERIFIED_LOCAL** | implemented — bounded v2 | **Có — Phase 2** |
| isolation-packer | Isolation Packer | **Có — Phase 2** | **VERIFIED_LOCAL** | implemented — bounded v2 | **Có — Phase 2** |
| test-packer | Well-Test / Service Packer | **Có — Phase 2** | **VERIFIED_LOCAL** | implemented — bounded v2 | **Có — Phase 2** |
| seal-bore | Seal-Bore / PBR / Seal Assembly | Chưa | NOT_SELECTED | proposed | Chưa |
| landing-nipple | Landing Nipple / Lock Profile | Chưa | NOT_SELECTED | proposed | Chưa |
| crossover | Crossover / Coupling / Pup Joint | **Có — Phase 3/4** | **VERIFIED_LOCAL — cả ba loại** | implemented — bounded tubing junction/segment | **Có — Phase 3/4** |
| expansion-joint | Expansion Joint | Chưa | NOT_SELECTED | proposed | Chưa |
| control-line | Control / Chemical Line / Gauge Cable | Chưa | NOT_SELECTED | proposed | Chưa |

Baseline trước implementation: [WellData](../../src/types/well-data.ts) chưa có discriminator cho tubing/hanger; [handler](../../src/handlers/hole-handler.ts) chưa dispatch hai loại này. [Packer](../../src/components/packer.ts) có bốn `toolType` nhưng dùng cùng hình generic dựa trên casing references; không coi đó là hoàn tất các contract packer. `CasingHanger` hiện có là component khác với `TubingHanger`.

Chi tiết card gộp `crossover`, đối chiếu runtime 2026-10-04:

| Loại | Đã chọn | Runtime | Kiểm chứng |
| --- | --- | --- | --- |
| Crossover | Có | Có — point junction giữa hai tubing segments | VERIFIED_LOCAL |
| Coupling | Có — Phase 4 | Có — ordinary external same-OD tubing coupling, body OD/optional ID explicit | VERIFIED_LOCAL |
| Pup Joint | Có — Phase 4 | Có — owned tubing segment, physical length counted once | VERIFIED_LOCAL |

`implemented` của catalog card hiện gồm cả ba bounded capabilities: Crossover, ordinary external same-OD Coupling và Pup Joint physical segment. Pup Joint tính length đúng một lần trong tubing; Coupling là point interface với body dimensions supplied và physical length unknown. Không bao phủ manufacturer assemblies hoặc mọi variant của ba families; xem [contract Phase 4](completion-joints.md).

Quy tắc cập nhật:

- Tiến độ: `NOT_SELECTED` → `NOT_STARTED` → `IN_PROGRESS` → `IMPLEMENTED_PENDING_VERIFICATION` → `VERIFIED_LOCAL`; dùng `BLOCKED` kèm nguyên nhân và bước gỡ nếu có blocker thực tế.
- Chỉ ghi “Đã hoàn tất runtime” khi đạt toàn bộ acceptance và gates bên dưới, có files/tests/visual evidence. Có type, hình generic hoặc sample riêng lẻ chưa đủ.
- Khi bắt đầu runtime, cập nhật bảng này và [audit](source-audit.md); khi thay contract/status catalog, đồng bộ Markdown, JSON và quy tắc status trong [docs validator](validate_docs.py).
- `VERIFIED_LOCAL` chỉ là kết quả local; không hàm ý UAT, production, chứng nhận thiết bị hoặc phê duyệt kỹ thuật giếng.

## Đã chốt và phạm vi đề xuất

**Đã chốt:** ưu tiên Tubing String trước, Tubing Hanger sau; lưu rõ trạng thái được chọn và đã triển khai. Không chọn thêm completion cards trong Phase 1. Yêu cầu tiếp theo chọn cả bốn packers cho Phase 2; xem [packer contract và tiến độ](completion-packers.md).

Yêu cầu tiếp theo chọn crossover cho Phase 3 và Coupling/Pup Joint cho Phase 4; xem [crossover contract](completion-crossover.md), [joint contract](completion-joints.md). Bảy catalog cards (chín component kinds/roles) đã chọn/implemented trong bounded slices; seal-bore, landing-nipple, expansion-joint và control-line vẫn NOT_SELECTED.

**Đề xuất cho slice đầu:** một tubing string đồng tâm trong schematic thẳng đứng, tapered segments, purpose khai báo `production` hoặc `injection`; một tubing hanger trên named seat của head. Dùng MD với datum khai báo cho depth và lengths theo trục giếng. Dual tubing, deviated trajectory, TVD/survey conversion, subsea multi-bore/ports, flow simulation và mở rộng packer host sang tubing là các slice sau. Input ngoài capability phải có diagnostic, không vẽ thành cấu hình single-string.

Actor là người nhập JSON của API/editor local hiện có; mục tiêu là mô tả cấu trúc và nhận SVG truy ngược được component. Không thêm actor, quyền ghi dữ liệu, persistence hoặc workflow phê duyệt. Purpose injection không tự tạo flow arrows hay thông số vận hành. Lifecycle/verification phải theo input; thiếu evidence không tự thành `installed` hoặc `verified`.

## Hợp đồng đề xuất cho hai component

Kế thừa [common contract](data-contract.md), [geometry conventions](geometry-layout.md) và hai catalog cards. Tên field/discriminator bên dưới là thiết kế đề xuất; cần chốt trong slice contract trước khi viết runtime, không nhập ngay vào API hiện tại.

| Thành phần | Dữ liệu và quan hệ | Validation và biểu diễn |
| --- | --- | --- |
| Tubing String | Stable string/segment IDs; purpose; top depth; ordered physical segments với OD, ID nếu biết, length và units; wellbore/depth context; explicit host spans tới casing/liner/bore; lifecycle/provenance | Không dùng `Casing` alias hoặc casing shoe. Bottom tính từ top + tổng segment lengths sau normalization. OD/length dương, ID nếu có phải dương và nhỏ hơn OD; không suy ID/wall thickness. Vẽ boundaries theo dữ liệu có thật, nhãn ID/purpose/size/top–bottom/unit/datum. |
| Tubing Hanger | Stable hanger ID; tubing ID; head ID; named seat ID và vị trí/elevation có datum; lifecycle/provenance; seal/port references chỉ khi được cung cấp | Hanger khai báo `supports tubing` và `supported-by head seat`; derived support graph không cần thêm một field ngược gây hai nguồn có thể mâu thuẫn. Kiểm refs, cùng wellbore/context, terminal tubing khớp seat anchor, không chiếm trùng seat. Glyph riêng ở layer interfaces, label truy được tubing và seat. |

Quy tắc chung:

- Units allowlist: depth/length `m`, `ft`; diameters `mm`, `in`; normalize đúng một lần và giữ original quantities. Depth basis/datum phải explicit; không suy từ tên well hoặc giá trị số.
- Segment thứ tự vật lý trong string có ý nghĩa; thứ tự các component trong array không quyết định host hoặc seat. Host spans phải liên tục phủ tubing, không chọn host bằng proximity hoặc casing-array order tại overlap liner.
- Lookup intervals theo `[top,bottom)`; terminal points dùng named anchors. Test exact top, joint, liner overlap và bottom; glyph minimum height không thay physical depth/length.
- Khi có host ID thật, kiểm fit với tubing OD; impossible fit là lỗi. Legacy `diameter` không được coi là host ID; thiếu ID chỉ báo `FIT_UNRESOLVED`, không tuyên bố fit đạt.
- Tubing standalone được biểu diễn với support `unknown` rõ ràng; hanger nếu được cung cấp phải có tubing/head/seat hợp lệ, không silently skip. Support không tự chứng minh sealing.
- Canonical geometry/layout thuần, không import D3/DOM/LLM; SVG adapter escape labels, giữ lumen mở và không dịch physical anchors để tránh nhãn.

## Tương thích với runtime hiện tại

Đề xuất versioned input cho completion mới và adapter giới hạn cho context legacy. Payload cũ không có hai component mới giữ semantics của casing/hole/cement/packer; không âm thầm đổi `diameter`, `startDepth`, unit strings hoặc cumulative `Hole.depth`.

Adapter context cần stable IDs cho hosts và head, named seat metadata và depth basis/datum khai báo. Các fields thiếu phải yêu cầu bổ sung hoặc báo unresolved/unsupported theo contract; không invent seat elevation từ `CasingHanger` slot, không gán datum mặc định. Geometry head legacy có thể dùng detail inset có nhãn schematic, nhưng inset position không là measured seat elevation.

Trước code cần xác định version envelope, discriminator wire format, cách cung cấp host/seat context và policy draft khi thiếu datum. Hướng mặc định đề xuất: legacy requests tiếp tục path hiện có; completion version yêu cầu depth context đầy đủ, cho phép unknown host ID với fit diagnostic. Không migrate toàn bộ catalog hoặc sửa renderer không liên quan để mở Phase 1.

Lỗi mới có `code`, `path`, `componentId`, `message`, `severity`. Đề xuất client schema/domain failures trả HTTP 400 với diagnostics; renderer failure vẫn 500. Cả Bun API, Express `/hole` và UI dùng cùng validator/adapter cho completion mới; không để một transport bỏ qua validation.

## Các bước triển khai và evidence

| Bước | Kết quả cần bàn giao | Phạm vi files dự kiến | Tiêu chí chuyển bước |
| --- | --- | --- | --- |
| P1.1 — Contract và baseline | Chốt version/wire fields, host/seat adapter, boundaries; fixture specs valid/invalid; ghi baseline tests/typecheck | Docs contract/catalog; thiết kế types/domain và adapter | Đủ dữ liệu để phân biệt missing/invalid/unsupported; không đổi nghĩa legacy; mọi lựa chọn chưa chốt được ghi rõ |
| P1.2 — Tubing domain | Parse/normalize/validate tubing, immutable host/support graph, structured diagnostics | Modules mới dưới `src/domain/`, `src/validation/`, `src/adapters/`; wire types | Test units, taper, host coverage/fit, IDs và boundaries PASS; không phụ thuộc D3 |
| P1.3 — Tubing SVG | Pure layout → SVG adapter; dispatch/API/editor preview và sample tubing riêng | `src/components/tubing.ts` hoặc SVG adapter tương đương; handler, API entrypoints, UI error display nếu cần; tests/sample-data | Tubing có label/purpose/depth đúng, không casing shoe; lỗi input không mất component âm thầm; legacy regression PASS |
| P1.4 — Hanger domain và SVG | Named head seat + support relation, seat conflict validation, pure layout và glyph/label riêng | Domain/validation, `src/components/tubing-hanger.ts` hoặc adapter tương đương; handler/tests/sample-data | Hanger đúng tubing/head/seat dù reorder components; lumen mở; không suy seat từ array index |
| P1.5 — Review và bàn giao | Integration, visual review/export, update tracker/audit/catalog và validation record | Tests, sample docs, domain docs | Đạt acceptance bên dưới; trạng thái nâng riêng từng component theo evidence |

Các đường dẫn modules mới là dự kiến. Chỉ tạo abstraction cần thiết cho hai component; handler orchestration giữ nhỏ, không chuyển toàn bộ legacy renderer sang kiến trúc mới trong slice này.

## Acceptance và kiểm thử

- **Tubing:** production/injection fixtures khác purpose đúng input; uniform/tapered segments có OD/ID/length đúng; tubing có thể đi qua casing→liner với explicit host spans, không đoán host ở overlap. Bottom/joints đúng; thiếu ID được ghi unknown; không có shoe tự sinh.
- **Hanger:** support tới đúng tubing và seat; seat elevation/anchor không lệ thuộc array order; hai hanger chiếm cùng seat hoặc dangling tubing/head/seat bị từ chối; không che lòng tubing. Standalone tubing không được giả là đã treo.
- **Input invalid:** duplicate IDs, empty segments, nonfinite/negative dimensions, ID≥OD, unsupported units/basis, thiếu datum, host coverage gaps, incompatible depth context và impossible fit tạo diagnostics có field paths. Lifecycle/evidence mâu thuẫn không bị bỏ qua.
- **Geometry:** input unchanged, normalized quantities tương đương m↔ft/in↔mm; joints không double-count length; reorder unrelated components giữ layout của tubing/hanger; labels có XML special characters/long text không injection hoặc clipping. Các primitive mới deterministic; whole-SVG byte identity không thể làm gate khi cement pattern legacy còn random.
- **Integration:** fixture mới đi qua HTTP `/hole`, Bun root POST và editor; Express contract dùng cùng implementation và có verification tương ứng. Semantic input failures là 400, internal failures là 500; render lặp không mutate dữ liệu. Existing sample giữ casing/liner/cement/packer output trong giới hạn baseline.
- **Visual:** review SVG ở desktop 1440×1000 và mobile 390×844, monochrome và exported SVG; có evidence cho tubing endpoint, taper, hanger/seat detail và long labels. Không đồng nhất test structural với visual review hoặc thiết bị thật.

Gates khi runtime được triển khai: `bun run test`, `bun run build`, typecheck không emit, docs validator; ghi command/result và baseline failures tách biệt. Audit hiện ghi 5 lỗi TypeScript legacy ở `hole.ts`/`segment-overlaps-utils.ts`; đây là bằng chứng lịch sử, phải recheck trước implementation. Không gọi build PASS nếu vẫn lỗi; component chỉ `VERIFIED_LOCAL` khi gates áp dụng đạt hoặc có quyết định acceptance rõ cho baseline được ghi nhận.

Liên kết fixture matrix: F03/F04 cho host taper/liner boundaries, F06 cho tubing, F10 cho hanger seat, F12 cho units/datum, F13–F15 cho labels/errors/immutability. Phase 1 không đòi triển khai hai packer của fixture F06 tổng quát; fixtures mới cho hai component phải runnable và có geometric oracles riêng.

## Nhật ký trạng thái

| Ngày | Sự kiện | Evidence |
| --- | --- | --- |
| 2026-10-04 | Người dùng chọn `tubing` và `tubing-hanger` làm Phase 1; ghi kế hoạch, runtime **NOT_STARTED** | Catalog, WellData, handler và renderer được đọc lại; lượt này chỉ sửa docs |
| 2026-10-04 | Kiểm tra tài liệu kế hoạch | `python3 docs/well-schematic/validate_docs.py .` PASS: 6 skills, 64 cards, sources và links nội bộ; không chạy runtime tests/build trong lượt docs-only |
| 2026-10-04 | Xác nhận và sửa hình Tubing Hanger ngang miệng wellhead, trên casing hangers, hai phần đối xứng thu hẹp xuống đáy | Mouth bounds từ wellhead renderer; regression kiểm flush alignment, shape, casing-slot clearance và tubing MD không đổi; [evidence lịch sử](evidence/tubing-hanger-mouth/README.md) |
| 2026-10-04 | Người dùng xác nhận hanger xếp chồng, bore height bằng casing hanger, cạnh nghiêng 45° | Shared profile 8 điểm, bores 10 px; sửa casing ramp legacy về 45°; full suite 77 tests PASS; [evidence lịch sử](evidence/tubing-hanger-stacked/README.md) |
| 2026-10-04 | Người dùng chấp nhận phần dưới, sửa riêng phần trên Tubing Hanger thành mép ngang và hai cạnh đứng | Polygon 6 điểm giữ nguyên 5 điểm phần dưới; casing paths không đổi; 77 tests / 501 assertions PASS; [evidence hiện tại](evidence/tubing-hanger-flat-top/README.md) |

Các lần mở rộng tiếp theo: thêm ngày, component ID, files, commands/results và visual evidence tại đây; cập nhật trạng thái trong bảng đầu trang. Các đoạn đề xuất bên trên là kế hoạch gốc; các lựa chọn implementation và giới hạn thực tế được chốt trong Completion v2 contract. Không suy các variant bị loại khỏi slice là đã hỗ trợ.


## Bàn giao implementation Phase 1 — 2026-10-04

`tubing` và `tubing-hanger`: **đã chọn, implemented, VERIFIED_LOCAL** trong capability
của [Completion v2 contract](completion-v2-contract.md). Các completion cards khác
chưa được chọn cho phase này; packer vẫn legacy-generic.

- Source: [domain](../../src/domain/completion.ts), [validator/context adapter](../../src/validation/completion.ts), [pure layout](../../src/geometry/completion-layout.ts), SVG adapters [tubing](../../src/components/tubing.ts) / [tubing hanger](../../src/components/tubing-hanger.ts), handler và Bun/Express/UI transports. Các links trỏ tới cấu trúc hiện tại sau component split; kết quả kiểm tra bên dưới là lịch sử Phase 1.
- `bun run test`: **PASS 77 tests / 501 assertions** sau flat upper face revision, bao gồm real HTTP Bun root/hole, UI và Express app; tests chạy bằng Bun. Lần implementation đầu: 73 tests / 399 assertions; mouth revision đầu: 75 tests / 413 assertions; stacked revision: 77 tests / 503 assertions. Assertions về cạnh trên được cập nhật theo hình mới; toàn bộ cạnh dưới vẫn kiểm giữ nguyên.
- `bun run build` và `./node_modules/.bin/tsc --noEmit`: **PASS**. Baseline trước sửa là 25 tests PASS và 5 lỗi TypeScript; optional narrowing/underream input mutation cùng overlap callback type đã xử lý, có immutability regression.
- `python3 docs/well-schematic/validate_docs.py .`: **PASS**, 6 skills, 64 cards, sources/links và Markdown/JSON implementation status. `git diff --check`: PASS; các source/test files mới không có trailing whitespace.
- [Evidence visual/export](evidence/completion-phase-1/README.md): desktop/mobile, actual-size internal scroll, missing-seat error/recovery, injection/long labels, standalone SVG và monochrome. Artifact SVG parse XML PASS, viewBox 950×1000 và đủ hai component kinds.
- [Flat upper face hiện tại](evidence/tubing-hanger-flat-top/README.md): Tubing Hanger có mép trên ngang và hai cạnh đứng; phần dưới 45° và casing hanger giữ nguyên. [Stacked revision cũ](evidence/tubing-hanger-stacked/README.md) giữ làm lịch sử. [Mouth revision cũ](evidence/tubing-hanger-mouth/README.md) giữ làm lịch sử. Trạng thái hai components giữ **VERIFIED_LOCAL**.
- Chưa chạy thiết bị di động thật, operator UAT, production, Node process riêng hoặc IAB Download save-to-file. Legacy cement pattern còn random; chưa có pixel-regression baseline. Các điều này không được gọi là đã nghiệm thu production.
- Không commit/push/deploy. Server QA riêng localhost:3002 không thay server 3001 có sẵn; để chạy bản mới bằng `bun run ui` cần khởi động lại phiên UI của người dùng khi họ muốn.

## Phase 2 — packers: 2026-10-04

Người dùng yêu cầu tiếp tục các packers thuộc completion. **Đã chọn và implemented / VERIFIED_LOCAL**: production-packer, liner-top-packer, isolation-packer, test-packer trong [bounded runtime contract](completion-packers.md). Seal-bore/PBR, nipple, crossover, expansion joint và control line vẫn NOT_SELECTED.

- Source: [domain](../../src/domain/completion.ts), [packer validation](../../src/validation/packers.ts), completion context adapter, pure layout/SVG adapter, UI **Packers sample** và [fixture](../../sample-data/well-completion-packers.json). Legacy Packer giữ semantics riêng; snapshot mới không mix hai formats.
- `bun run test`: **PASS 115 tests / 672 assertions**, 7 files; [packer tests](../../tests/packers.test.ts), HTTP Bun root/hole, Express app và UI đều chạy thực bằng Bun.
- `bun run build`, `./node_modules/.bin/tsc --noEmit`: **PASS**. Một regression hanger từ checkout cũ được đồng bộ lại với profile 45° đã xác nhận; không giảm assertion hoặc đổi expected geometry để che lỗi.
- `python3 docs/well-schematic/validate_docs.py .`: **PASS** — 6 skills, 64 cards, sources/internal links; Markdown/JSON đồng bộ implemented cho 6 components. XML parse / annular bounds cho 3 exported SVGs **PASS**, fixture main viewBox 950×1101.
- [Visual evidence](evidence/completion-packers/README.md): desktop 1440×1000, mobile 390×844, fit/actual-size, missing-host error/recovery, long labels, set/unset/unknown, unknown bore và monochrome.
- Scope: một concentric tubing, cased/liner annuli; liner-top trong parent overlap; uniform diameters tại packer interval. Openhole, manufacturer geometry/ratings, setting mechanisms, hydraulic seal verification và operator UAT chưa hỗ trợ/chưa kiểm chứng.
- Không commit/push/deploy. Preview QA localhost:3002; server 3001 của người dùng giữ nguyên.

## Solid line revision — 2026-10-04

Theo yêu cầu người dùng, tubing/hanger/packers và label leaders đều dùng nét liền. Planned/unknown/unresolved giữ text/diagnostics; geometry và metadata không đổi. Sáu components đã chọn giữ implemented / VERIFIED_LOCAL. [Evidence mới](evidence/completion-solid-lines/README.md) supersede line-style của các ảnh cũ. `bun run test` PASS 115 tests / 674 assertions; build/typecheck, docs validator, whitespace và XML solid-stroke/geometry comparison PASS. Desktop/mobile local review đã làm lại.

## Component split — 2026-10-04

Theo yêu cầu người dùng, bỏ SVG adapter tổng hợp `src/components/completion.ts`, tách thành [tubing](../../src/components/tubing.ts), [tubing hanger](../../src/components/tubing-hanger.ts), [completion packer](../../src/components/completion-packer.ts) và [notes/legend](../../src/components/completion-notes.ts). Các hàm dùng pattern curried của components hiện có; handler giữ thứ tự vẽ và ghép packer model/layout bằng ID. Bốn packer roles vẫn thuộc một runtime kind với symbol chung, như `toolType` trong legacy packer; renderer không nhận toàn bộ CompletionModel. Domain, validation và pure layout giữ nguyên.

Trạng thái không đổi: tubing, tubing-hanger, production-packer, liner-top-packer, isolation-packer, test-packer đã chọn / implemented / **VERIFIED_LOCAL**; năm cards còn lại **NOT_SELECTED**. So sánh trước/sau trên 5 fixtures (tubing/hanger, bốn packers, không hanger, unknown bore, long escaped labels): completion SVG **byte-identical 5/5**, gồm thứ tự, geometry, labels, metadata và solid strokes; bỏ qua phần cement random của context legacy. Đây là structural preservation check; không chạy lại browser visual review cho refactor giữ nguyên output, dùng [solid-line visual baseline](evidence/completion-solid-lines/README.md). `bun run test` PASS **115 tests / 674 assertions**; build/typecheck và docs validator PASS (6 skills / 64 cards / sources / links). Chưa operator UAT/production; không commit/push/deploy.

## Phase 3 — crossover: 2026-10-04

Theo yêu cầu người dùng, crossover được chọn / implemented / **VERIFIED_LOCAL**
trong [bounded tubing-junction contract](completion-crossover.md). Domain,
validator, pure layout và SVG adapter riêng; pattern curried như components
hiện có. UI thêm Crossover sample. Coupling/pup intervals và connector profiles
của manufacturer chưa hỗ trợ; physical length/compatibility còn unknown.

`bun run test` **142 tests / 792 assertions PASS**, 8 files; build/typecheck PASS.
Năm completion SVG fragments không crossover giữ byte-identical. Desktop/mobile,
actual-size và sai MD/error-recovery đã review; [evidence](evidence/completion-crossover/README.md).
Bảy cards đã chọn/implemented; bốn cards còn lại NOT_SELECTED. Chưa UAT/production
hoặc engineering approval; không commit/push/deploy.

## Phase 4 — Coupling / Pup Joint: 2026-10-04

Theo yêu cầu tiếp tục cả hai components: **đã chọn / implemented / VERIFIED_LOCAL** trong [bounded joint contract](completion-joints.md). Domain, validation, pure layout và curried SVG adapters tách riêng theo component; handler chỉ điều phối. UI có **Coupling / Pup sample**, sample route GET/HEAD allowlist và synthetic fixture gồm hanger/bốn packers/Crossover.

Coupling nối explicit adjacent same-OD tubing endpoints tại MD anchor, dùng supplied body OD/optional ID và kiểm mọi host bore chạm junction. Point symbol không thêm physical length. Pup Joint tham chiếu segment có sẵn, giữ physical MD interval và length tính đúng một lần. Detail riêng not MD scale; solid strokes, unknowns/provenance và diagnostics rõ. Thread compatibility, coupling physical body length và manufacturer assemblies chưa được xác minh.

Gates: `bun run test` **PASS 197 tests / 999 assertions (9 files)**; `bun run build` và `bunx tsc --noEmit` PASS. Docs validator PASS **6 skills / 64 cards / sources / links**; whitespace/XML/layout extents PASS. Ba completion fragments trước (tubing/hanger, full packers, Crossover) **byte-identical 3/3**; cement random context bỏ khỏi comparison.

[Visual evidence](evidence/completion-joints/README.md): desktop 1440×1000, mobile 390×844 Fit/Actual size, SVG export, unknown ID/profile/host bore, wide long labels và body-clearance error/recovery đã review. Không operator UAT/production, không commit/push/deploy. Bốn cards seal-bore, landing-nipple, expansion-joint, control-line vẫn NOT_SELECTED.
