# Completion Coupling / Pup Joint — bounded runtime contract

Triển khai 2026-10-04 theo yêu cầu tiếp tục Coupling và Pup Joint. Hai loại thuộc card gộp `crossover`; [tracker](completion-phase-1-plan.md) ghi riêng trạng thái từng loại. Đây là Completion v2 single-string, MD/named datum; không thêm persistence hoặc operating workflow.

## Chức năng, phạm vi và nguồn

[Crossover Inc. products](https://www.crossoverinc.com/products.aspx), đọc trực tiếp 2026-10-04: couplings nối pipe joints; pup joints là short tubular sections để positioning. Chỉ xác minh function/family. Không lấy manufacturer dimensions, rating, thread rules hay length cutoff làm defaults. Glyph và layout dưới đây là quy ước UCORN.

Coupling slice là **ordinary external same-OD tubing coupling**, body dimensions do input cung cấp, trong casing/liner. Khác OD dùng [Crossover](completion-crossover.md). Pup Joint là **physical tubing segment explicit**; không tự suy loại từ segment ngắn và không áp maximum length chưa có nguồn. Cross-string, casing couplings, integral/flush connections, crossover-coupling variants, thread mating và manufacturer assemblies chưa hỗ trợ.

## Data và attachments

Kế thừa [envelope, metadata và quantities v2](completion-v2-contract.md): stable ID, label optional, lifecycle/verification/sources, depth m/ft cùng MD datum, diameter in/mm. Normalized domain dùng m/mm; input không mutate.

| Loại | Fields riêng | Quan hệ và invariants |
| --- | --- | --- |
| `Coupling` | `tubingId`, `fromSegmentId`, `toSegmentId`, `at: {value, unit}`, `od: {value, unit}`, `innerDiameter?`, `fromConnection?`, `toConnection?` | Explicit upper/lower endpoints liền kề trong named tubing; anchor khớp cả hai MD ends. Body OD ≥ endpoint ODs; hai endpoints cùng OD. |
| `PupJoint` | `tubingId`, `segmentId`, `fromConnection?`, `toConnection?` | Phân loại một segment có sẵn trong tubing. MD top/bottom, OD/optional ID và physical length lấy từ segment; không khai báo quantities lần hai trên Pup Joint. |

Coupling không có supplied physical length trong slice này: label ghi `length unknown`, point glyph không tăng MD. Mỗi junction chỉ có tối đa một explicit Coupling hoặc Crossover. Pup Joint có length thật và chiếm một owned segment; một segment không có hai Pup components. Owner/ref sai, đảo hướng, không liền kề, duplicate ID, sai MD/units/quantities, unsupported fields trả HTTP 400 diagnostics với path.

Coupling body OD phải nhỏ hơn **mọi known host bore tại junction**, gồm cả hai phía khi host hoặc casing bore đổi. Unknown bore tạo `COUPLING_FIT_UNRESOLVED`; không xác nhận fit. Body không vượt displayed casing envelope. Coupling nằm tại/trong tubing packer interval hoặc boundary bị từ chối `UNSUPPORTED_TOOL_OVERLAP` vì chưa có equipment assembly profile. Physical segment/host coverage và Pup OD fit kế thừa tubing validator.

Installed Coupling/Pup cần installed owner tubing; installed/verified metadata cần source references theo contract chung. Không xác minh nội dung references. Thiếu connection text tạo `CONNECTION_UNRESOLVED`; supplied texts cũng không chứng minh compatibility. Unknown ID không được suy từ OD.

## Layout và SVG

Domain/validation/layout/SVG tách theo component: [coupling type](../../src/domain/coupling.ts), [validator](../../src/validation/couplings.ts), [layout](../../src/geometry/coupling-layout.ts), [adapter](../../src/components/coupling.ts); [pup type](../../src/domain/pup-joint.ts), [validator](../../src/validation/pup-joints.ts), [layout](../../src/geometry/pup-joint-layout.ts), [adapter](../../src/components/pup-joint.ts). Curried pattern `drawX({ component, layout, labelX })({ svg })`; [handler](../../src/handlers/hole-handler.ts) điều phối. Domain/layout không import DOM/D3/LLM.

Coupling có paired body OD, shoulders tới tubing OD, body ID/bore steps khi biết; không đóng lumen. [Junction windows](../../src/geometry/junction-layout.ts) giới hạn glyph tối đa 8 px, mỗi phía ≤ một phần tư adjacent segment length trên MD scale và tránh nearby packer glyphs. Ordinary walls được trim tại explicit connector; hai connector cạnh Pup ngắn vẫn để lại đoạn physical pipe nhìn thấy.

Pup physical OD/known-ID boundaries đúng top/bottom MD. Renderer Pup sở hữu vertical lines của segment; parent tubing không vẽ trùng. Label ghi length đã có trong tubing. Thay Pup length 6→7 m làm tubing tổng tăng đúng 1 m. Không phóng đại main Pup interval. Cả hai có hình detail riêng `Detail · not MD scale` ở lane phải; detail không thay MD hay source dimensions. Known pipe ID stubs có thể vẫn vẽ khi coupling body ID unknown; không vẽ body ID giả. All strokes và leaders là nét liền; states/provenance ghi bằng text/metadata.

Nhãn dài wrap theo words, hard-wrap token quá dài; viewport đủ cho detail lane và group translation. SVG group có component ID/kind, owner/ref, MD; Pup có `data-length-m`. Labels escape qua D3 `.text`. Không có Coupling/Pup thì completion fragments của fixtures trước giữ byte-identical.

## Fixtures và completion criteria

[Runnable sample](../../sample-data/well-completion-joints.json) có CPL-01 tại 2000 m, body OD 5.25 in/ID 4 in, PJ-01 segment PUP-S01 dài 6 m ở 2000–2006 m; tubing tổng 4000 m. Giữ hanger, bốn packers và Crossover tại 2800 m. Toàn bộ là synthetic/planned/unverified, connection texts `demo-*` không là profile kỹ thuật. UI **Coupling / Pup sample** nạp GET/HEAD `/sample-joints.json` allowlist; các HTTP transports dùng chung handler.

F03/F06/F13–F15 cụ thể hóa trong [joint tests](../../tests/coupling-pup-joint.test.ts): refs/MD/units, duplicate ownership/junction, body clearance cả hai host sides, unknown ID/profile/bore, lifecycle/evidence, tool conflicts, mixed units, extremely short/all-Pup string, total length once, neighboring connectors/packers, input immutability, escaping và layout extents. [HTTP tests](../../tests/completion-http.test.ts) kiểm transports/sample/error paths.

Acceptance: valid input render cả hai kinds và truy được refs; invalid input trả diagnostics; Pup length counted once; lumen mở; detail không đổi MD; geometry/labels nằm trong SVG; old fixtures không đổi; desktop/mobile fit/actual, unknown/long labels và error/recovery được review. [Evidence local](evidence/completion-joints/README.md) ghi commands và kết quả thực tế. Không có operator UAT, production deploy hoặc manufacturer assembly verification.
