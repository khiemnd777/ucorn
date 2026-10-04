# Source audit

Kiểm tra 2026-10-04 trên `master`, HEAD `059473a3607bad28ea5b34f2251ef3b09eb338f9`, remote `https://github.com/khiemnd777/ucorn`. Repo sạch sau clone; không thấy AGENTS.md hoặc .agents/skills có sẵn trong repo, cũng không thấy AGENTS.md tại các ancestor trực tiếp đã kiểm tra. Audit là đọc code, chưa chạy build hoặc renderer.

## Đường đi thực tế

Cập nhật runtime 2026-10-04 sau audit ban đầu: Bun entrypoint trả hướng dẫn API
cho GET/HEAD `/`; POST `/` và `/hole` giữ luồng tạo SVG. Method không hỗ trợ trả
405, JSON rỗng/hỏng trả 400, lỗi renderer trả 500 với thông báo chung. Regression
tests HTTP tại `tests/bun-http.test.ts` dùng renderer thật. Chưa có runtime schema
hoặc domain validation; mô tả không giới hạn method dưới đây là baseline trước sửa.

Kiểm tra sau sửa: `bun run test` PASS 16 tests qua HTTP localhost, gồm payload mẫu;
validator docs PASS. `bun run build` vẫn FAIL với 4 lỗi optional `underreamed` trong
`hole.ts` và 1 implicit-any trong `segment-overlaps-utils.ts`, giống kết quả trước sửa.

Cập nhật UI 2026-10-04: `bun run ui` khởi động `src/ui/server.ts` tại localhost:3001.
UI dùng local HTML/CSS/JS với JSON editor (syntax colors, số dòng, format, Tab,
Ctrl/⌘+Enter), nạp sample và SVG preview. POST `/hole` dùng chung `routeRequest`
với API Bun, không phụ thuộc server port 3000. Preview hiển thị SVG qua blob image,
không chèn SVG/JSON bằng innerHTML; assets có allowlist và CSP. Không lưu JSON vào
browser storage, không gọi dịch vụ ngoài, không thay đổi geometry/domain contracts.

Kiểm tra UI: `bun run test` PASS 21 tests (HTTP/API, assets, sample render và errors);
browser JS bundle PASS. Codex IAB trên macOS đã kiểm tra JSON lỗi, format, phím tắt,
sample render, renderer failure/recovery, preview image load và stale-preview state.
Visual review tại 1440×1000 và 390×844; mobile không overflow ngang ở page, editor
scroll riêng, preview xếp dưới editor. Action tải SVG dùng browser blob download;
chưa xác minh file download qua IAB vì tool chờ download timeout. Build vẫn chỉ có
5 lỗi TypeScript baseline nói trên. Chưa kiểm thử thiết bị di động thật.

Cập nhật sample 2026-10-04: người dùng xác nhận phần cần bổ sung là liner-top packer
làm kín annulus, không phải plug bịt lòng liner. Sample thêm `Packer` / `Liner Top
Packer` tại 2800 m, nối `L01-PRODUCTION` với `C04-PRODUCTION`, dùng renderer generic
hiện có. Không sửa renderer hoặc schema. `bun run test` PASS 22 tests; regression
kiểm tra đúng liner/parent/depth, hai seal blocks chỉ chiếm annulus và lumen vẫn mở.
Visual preview IAB đã thấy hai seal blocks tại liner top (viewport 390×844), còn
geometry/shoe của liner giữ nguyên. Chưa có riêng glyph/label cho subtype Packer.

Cập nhật cement sample 2026-10-04: thêm 5 `Cement` cho C01–C04 và L01, dùng renderer
legacy hiện có; không thay schema/geometry runtime. TOC demo lần lượt là 0 m cho
4 casing và 2800 m cho liner; bottom suy từ cuối mỗi string. `bun run test` PASS
25 tests / 205 assertions. `tests/cement.test.ts` kiểm tra 10 annular polygons,
TOC/bottom, không vào lumen, outer boundary casing→hole (liner tại 3000 m),
đối xứng, chỉnh TOC, input immutability và thứ tự casing. Visual preview IAB macOS
390×844 xác nhận fill xám và packer vẫn thấy rõ; pattern chấm random của renderer
legacy giữ nguyên, chưa có deterministic raster baseline.

`src/index.ts` nhận POST `/hole`, cast request sang `WellData`, gọi `handleHole`. `src/index.bun.ts` cũng gọi handler ở `/` và `/hole`, không có runtime schema validation; nhánh route không giới hạn POST. `index.ts` root chỉ in Hello via Bun, khác entrypoint server. `package.json`: `build: tsc`, `go: node --import=./register.js ./src/index.ts`, `go:bun: bun run ./src/index.bun.ts`.

| Nhóm wired | File/evidence | Giới hạn hiện tại |
| --- | --- | --- |
| Hole + Underreamed | `src/components/hole.ts`, `drawHoles`, `transformHoleData` | `diameter`, cumulative `depth`, optional intervals; helper sort mảng underreamed tại chỗ, mất holeID khi tạo segments; currentDepth khởi tạo 0 mỗi hole cần edge-case review |
| Casing segments + shoe | `src/components/casing.ts`, `drawCasings` | `pipeType` metadata 6 giá trị; chung một renderer; segments có diameter/length, chưa OD/ID riêng; shoe mặc định vẽ khi undefined, chưa float/guide distinction |
| Cement | `src/components/cement.ts`, `drawCement` | `refCasingID`, `startDepth`; hình annular suy từ geometry đến cuối casing; không có explicit bottom, quality/test/barrier contract |
| Packer | `src/components/packer.ts`, `drawPacker` | casing references + `startDepth`; `toolType` 4 giá trị không dispatch hình riêng; chưa tubing host, length, set-state |
| Wellhead | `src/components/wellhead.ts`, `drawWellhead` | surface/seating casing references; `wellheadType` 4 giá trị không dispatch cấu hình; hình cố định near origin, chưa tree/subsea system |
| CasingHanger | `src/components/casing-hanger.ts`, `drawCasingHanger` | chỉ refCasingID; được vẽ khi có Wellhead; slot = array index + 1, chưa seat ID/physical elevation |

`src/handlers/hole-handler.ts` tạo SVG 400×900 với padding 100; draw order cement → holes → casing → packer → wellhead → hanger. Depth scale lấy last hole depth, không tính max trên dữ liệu tùy thứ tự. `inchToPixel` trong `src/utils/common-utils.ts` nhân 5; comment depth scale ghi meters. `WellData.unit` chứa string diameter/depth nhưng chưa được áp dụng conversion ở handler. Không có depth datum, MD/TVD contract rõ.

## Có type nhưng chưa hỗ trợ biểu diễn tương ứng

`Tieback` và `Casing.tieback` tồn tại trong `src/components/casing.ts`, nhưng draw path không tiêu thụ tieback. Drilling/Production Liner dùng generic Casing path; không có liner hanger/overlap topology. Packer metadata không tạo production tubing. `WellData.components` tại `src/types/well-data.ts` chỉ khai báo type discriminator cho 5 loại, sau đó handler cast `as any` sang component interfaces. Các tài liệu AI tại `src/ai/` không thay runtime schema; có bản duplicate cần đồng bộ nếu sau này thay contract.

## Khoảng trống và kế hoạch được đề xuất

- Chưa có tubing/completion graph, formation, perforation, sand-control, lift, valve, abandonment hoặc annotation domains riêng.
- Không thấy automated test script/assertion suite đáng tin. `src/test.ts` là đoạn hình học comment; không xem là coverage. Chưa chạy typecheck, không khẳng định build pass.
- Missing-reference paths có thể bỏ qua hình âm thầm; empty holes/segments và malformed data chưa được guard đầy đủ. Hàm diameter lookup dùng boundary khác nhau; cần fixture exact segment end và before start.
- Domain logic và D3 geometry đang cùng file; lộ `any`/ambient props. Khi được yêu cầu runtime, tách module theo [contract](data-contract.md) trước khi mở rộng số symbol.

Catalog ghi `legacy-rendered`, `legacy-generic`, `type-only`, hoặc `proposed`; đó là mức implementation, độc lập trạng thái dữ liệu giếng planned/installed/removed. Không nâng status chỉ vì tên thiết bị xuất hiện trong metadata.


## Completion v2 Phase 1 — cập nhật runtime 2026-10-04

Tubing và TubingHanger đã triển khai theo [runtime contract](completion-v2-contract.md).
Các mô tả thiếu tubing/validation ở baseline phía trên là lịch sử trước slice này.
`src/validation/completion.ts` kiểm version, units/MD/datum, snapshot/wellbore, IDs,
segments, host spans/fit và named head/seat; domain và pure layout không import
D3/DOM/LLM. SVG adapter dispatch riêng hai kinds qua handler dùng chung trên Bun,
Express và UI; client semantic failures là 400 có diagnostics. Payload legacy
không version giữ semantics/geometry cũ; không có full catalog schema validation.

Scope: single concentric uniform/tapered production/injection tubing, optional
one Onshore tubing hanger. Thiếu host bore ID báo fit unresolved; thiếu hanger
báo support unknown. Dual tubing, TVD/trajectory, underream/tieback v2 context,
subsea ports và tubing-host packer extension chưa hỗ trợ. `src/ai/**` vẫn là
legacy reference cho task LLM riêng; không dùng chúng làm schema v2.

Năm lỗi TypeScript baseline đã xử lý bằng local underream array copy để tránh
input mutation/optional narrowing errors và explicit type cho overlap callback.
Tests regression legacy vẫn chạy. Xem [tracker](completion-phase-1-plan.md) cho
commands/results cuối và [visual evidence](evidence/completion-phase-1/README.md).
Catalog bổ sung status `implemented` cho đúng hai cards trong slice, độc lập
selection, verified-local và lifecycle của thiết bị.

Gates cuối: `bun run test` PASS 73 tests / 399 assertions, `bun run build` và
`tsc --noEmit` PASS; docs validator PASS 6 skills/64 cards; SVG XML parse PASS.
Visual review desktop 1440×1000/mobile 390×844, error recovery, export/monochrome
đã thực hiện trong IAB/macOS. Đây là VERIFIED_LOCAL Phase 1, không là UAT/deploy.

Revision tiếp theo cùng ngày: Tubing Hanger đổi từ blocks ở depth anchor sang
hai polygon thu hẹp xuống đáy, ngang miệng wellhead và trên casing hangers theo
yêu cầu người dùng. Handler truyền mouth bounds thực từ legacy wellhead geometry
vào pure layout; display riser không tăng MD của tubing. Regression và full suite
PASS 75 tests / 413 assertions; build/typecheck PASS. Xem
[evidence revision](evidence/tubing-hanger-mouth/README.md); evidence cũ giữ lại
như lịch sử, không mô tả hình hanger hiện tại.

Revision stacked profile cùng ngày: theo yêu cầu bore height bằng casing hanger
và cạnh nghiêng 45°, hai loại dùng chung `src/geometry/hanger-profile.ts`. Mỗi
bore đứng cao 10 px; polygon dạng băng 8 điểm, run = rise trên cả hai cạnh nghiêng.
Sửa công thức casing ramp legacy (trước đó chưa trừ đủ hai gờ ngang nên góc thực
không phải 45°). Tubing Hanger ở slot 0 ngang mouth và append trên casing hangers;
seat MD, tubing length và physical support contracts không đổi. Full suite PASS
77 tests / 503 assertions, build/typecheck PASS;
[evidence hiện tại](evidence/tubing-hanger-stacked/README.md).

Revision flat upper face cùng ngày: người dùng chấp nhận phần dưới và yêu cầu
phần trên Tubing Hanger có mép ngang, hai cạnh đứng. `tubingHangerProfile` giữ
nguyên 5 điểm phần dưới của profile trước, thay phần trên bằng mép ngang tại
mouth; polygon còn 6 điểm. Casing hanger paths không đổi. SVG XML comparison
xác minh cả hai lower profiles và tất cả casing paths giữ nguyên. Full suite
PASS 77 tests / 501 assertions, build/typecheck PASS;
[evidence hiện tại](evidence/tubing-hanger-flat-top/README.md).

## Completion packers Phase 2 — 2026-10-04

Implemented bounded `CompletionPacker` v2: production, liner-top, isolation, test.
Explicit innerConduitId/outerHostId, interval MD, setState và metadata; adapter
normalize/ref/fit validation rồi pure packer layout và SVG. Existing generic
`Packer` path giữ riêng; không silently đổi casing refs thành tubing refs.
Cased/liner hosts, uniform diameters; openhole và rated manufacturer variants
chưa hỗ trợ. Liner-top ở liner top/parent overlap; các roles khác ở declared
tubing host. Unknown bore báo PACKER_FIT_UNRESOLVED và dashed outline.

UI thêm Packers sample qua allowlist; sources SLB và Halliburton official đọc
trực tiếp cho function/family, không infer sizing hoặc setting method. Casing
hanger trong checkout vẫn dùng legacy path gây một regression FAIL; đã đồng bộ
lại shared profile 45° theo quyết định trước, không thay expected shape.

Gates cuối PASS: 115 tests / 672 assertions, build, tsc --noEmit, docs validator
6 skills/64 cards; XML annular bounds 3 SVGs PASS. Desktop/mobile/errors/recovery/
export/monochrome local review xem [evidence](evidence/completion-packers/README.md).
Bốn packer cards đã chọn và VERIFIED_LOCAL; cập nhật [contract](completion-packers.md)
và [tracker](completion-phase-1-plan.md). Chưa UAT/device/production/actual seal
verification; không commit/push/deploy.

Solid line revision 2026-10-04: Completion SVG adapter bỏ mọi stroke-dasharray trên tubing body/riser, hanger, packer blocks/crosses và leaders. Legend/fit diagnostic đổi sang text về outline/solid; các states không thay đổi. XML comparison xác minh main fixture giữ geometry/fill và đủ 6 groups không dashed strokes. Full suite PASS 115 tests / 674 assertions, build/typecheck PASS; [visual evidence](evidence/completion-solid-lines/README.md).

Component split 2026-10-04: theo yêu cầu người dùng và pattern curried của
casing/packer/wellhead, thay `src/components/completion.ts` bằng các adapters
riêng [tubing](../../src/components/tubing.ts),
[tubing hanger](../../src/components/tubing-hanger.ts),
[completion packer](../../src/components/completion-packer.ts) và
[notes/legend](../../src/components/completion-notes.ts).
Handler chỉ điều phối; packer model/layout ghép bằng ID. Các adapters nhận một
component và layout liên quan, không toàn bộ CompletionModel. Bốn packer roles
dùng chung renderer như các toolType legacy; không tạo bốn wrappers trùng nhau.
Domain, validators và pure layout không đổi.

Gates: `bun run test` PASS **115 tests / 674 assertions** (7 files, gồm HTTP thực
Bun/Express/UI); `bun run build` và `tsc --noEmit` PASS. Lần chạy HTTP trong
sandbox không mở được localhost (EADDRINUSE tại port 0); chạy lại với quyền mở
cổng đã PASS, không đổi tests hoặc gates. Năm fixtures trước/sau (tubing/hanger,
bốn packers, standalone tubing, unknown casing bore, long XML-special labels)
cho completion SVG **byte-identical 5/5**. So sánh riêng phần completion để loại
cement random. Không chạy lại browser review vì output giữ nguyên; visual
baseline solid-line vẫn áp dụng. Sáu cards giữ selected / implemented /
VERIFIED_LOCAL; docs validator PASS 6 skills / 64 cards / sources / links.
Không UAT/production hoặc commit/push/deploy.

Crossover Phase 3 — 2026-10-04: triển khai theo yêu cầu người dùng. Added kind
`Crossover`, explicit owner/upper/lower segment IDs và MD point anchor; known
endpoint OD/ID từ tubing, optional connection text. Validator riêng kiểm
adjacency/direction/unique junction/lifecycle/units; missing profiles là warning.
Pure layout riêng thay ordinary joint step bằng solid transition, glyph tối đa
8 px constrained theo adjacent segments, lumen mở và tubing MD không tăng.
SVG adapter riêng theo curried component pattern; handler dispatch bằng ID.
Legacy/Phase 1/2 payload không crossover giữ nguyên completion output 5/5 cases.

SLB crossover definition đọc trực tiếp; nguồn mới ghi trong register. Scope chỉ
point junction tubing; coupling/pup interval, cross-string, service tool,
physical body length/dimensions, thread compatibility và ratings chưa hỗ trợ.
UI Crossover sample + explicit GET/HEAD allowlist. Full suite PASS 142 tests /
792 assertions (8 files), build/typecheck PASS. [Visual/XML evidence](evidence/completion-crossover/README.md)
desktop 1440×1000 / mobile 390×844, actual-size, wrong-anchor/download-disabled
và recovery đã review. Bảy cards selected/implemented/VERIFIED_LOCAL; bốn còn lại
NOT_SELECTED. Không real-device/operator UAT/production/engineering approval
hoặc commit/push/deploy.


Coupling / Pup Joint Phase 4 — 2026-10-04: hai new discriminators `Coupling`/`PupJoint` trong versioned single tubing path, với separate domain/validator/layout/SVG adapters. Coupling explicit same-OD adjacent endpoints + supplied body OD/optional ID, clearance ở cả hai phía host boundary, junction exclusivity và tubing packer conflict diagnostics. Pup owns existing physical segment; length/depth/diameter không lặp, tổng length tính một lần. Solid main/detail lines; detail not MD scale, physical Pup giữ actual MD interval. Unknown bore/profile giữ diagnostics; connection compatibility chưa kiểm chứng.

Crossover Inc. products function/family source đọc trực tiếp, registered; không lấy manufacturer sizing/rating defaults. UI thêm Coupling / Pup sample và GET/HEAD allowlist. Tests **197 pass / 0 fail / 999 assertions (9 files)**; build/typecheck PASS, docs validator PASS 6 skills / 64 cards / sources / links. XML/whitespace/extents PASS, ba old completion fragments byte-identical; [browser evidence](evidence/completion-joints/README.md) desktop/mobile Fit/Actual, unknown/wide labels, fit-error và recovery. Bảy catalog cards / chín kinds hoặc roles selected/implemented/VERIFIED_LOCAL trong bounded contracts. Chưa operator UAT, manufacturer assembly verification hay production; không commit/push/deploy.
