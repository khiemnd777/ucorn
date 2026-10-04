# Completion v2 — runtime contract Phase 1

Triển khai ngày 2026-10-04 cho `Tubing` và `TubingHanger`. [Tracker](completion-phase-1-plan.md) ghi trạng thái và evidence; [sample runnable](../../sample-data/well-tubing-hanger.json) là dữ liệu tổng hợp, không phải equipment specification. [Domain types](../../src/domain/completion.ts) và [validator](../../src/validation/completion.ts) là nguồn runtime.

Phase 2 cùng ngày thêm `CompletionPacker` với bốn roles và explicit seal endpoints trong cùng schemaVersion 2; xem [packer runtime contract](completion-packers.md). Payload Phase 1 không có packers giữ semantics cũ; normalized model thêm `packers: []`. Giới hạn Phase 1 dưới đây vẫn áp dụng, trừ packer extension đã ghi riêng.

## Envelope và context

Payload dùng `schemaVersion: 2`, `wellboreId` ổn định, `snapshotAt` ISO timestamp có timezone, `depthContext: {basis: "MD", datumId: "..."}`. Một envelope biểu diễn một wellbore/snapshot. Không có per-component datum conversion, trajectory hoặc branching. Unknown envelope/completion fields bị từ chối thay vì bỏ qua.

`holes` và các context components hiện có vẫn dùng cấu trúc legacy. Trong v2, bắt buộc `unit.depth` là `m`/`ft`, `unit.diameter` là `inch`/`in`/`mm`; adapter clone input và chuyển context sang numeric convention m/in của renderer legacy. Hole cumulative bottoms phải tăng; hole/casing IDs bắt buộc và không trùng. Casing giữ `diameter` như envelope của hình legacy, không đổi nó thành ID.

Casing segment có thể khai báo `boreDiameter: {value, unit: "mm" | "in"}` riêng để kiểm clearance. Thiếu boreDiameter tạo `FIT_UNRESOLVED`, không suy wall thickness từ casing diameter. Openhole host dùng holeID và bore diameter được khai báo trong hole. Legacy underream/tieback context chưa có adapter v2 và bị từ chối; payload legacy không version vẫn giữ khả năng cũ.

Head context dùng `Wellhead` hiện có, thêm `wellheadID` và `seats: [{id, at: {value, unit: "m" | "ft"}}]`. Phase 1 hỗ trợ một Onshore head. Seat ID không phải `CasingHanger` array slot; seat MD phải khớp tubing top. Head geometry vẫn là glyph schematic legacy; support-block width dùng envelope hiển thị, không xác nhận physical head bore/profile compatibility.

## Tubing

| Field | Contract |
| --- | --- |
| `type` | `Tubing` |
| `id`, `label?` | Stable string ID và label text; tối đa 256 ký tự mỗi string |
| `purpose` | `production` hoặc `injection`; không suy flow direction/rate |
| `top` | Quantity depth, cùng MD/datum của envelope |
| `segments` | Ordered physical segments: `{id, od, innerDiameter?, length}`; OD/ID dùng in/mm, length dùng m/ft |
| `hostSpans` | `{hostId, top, bottom}` khai báo host theo interval; sắp theo depth trên bản copy, không dựa vào thứ tự component |
| Metadata | `lifecycle`, `verification`, `sources` như bên dưới |

Một tubing đồng tâm mỗi payload. Segment OD/length phải finite và dương; ID optional, nếu có thì `0 < ID < OD`. Bottom = top + tổng normalized lengths; không thêm depth vì symbol/taper. Các host spans phủ đúng toàn tubing, không gap/overlap, host tồn tại và phủ span. Kiểm OD với bore ID khi có; OD ≥ bore bị từ chối. Intervals dùng half-open lookup; terminal ở đúng host bottom được phép, vượt bottom bị từ chối.

Renderer có OD boundaries, thêm ID boundaries khi được cung cấp, steps tại đúng joint depth, terminal mở, không casing shoe. Label ghi ID/purpose/lifecycle/verification, OD/ID từng segment, lengths, top–bottom m MD @ datum và hosts. Không có ID thì ghi unknown và không vẽ wall thickness giả.

## Tubing Hanger

| Field | Contract |
| --- | --- |
| `type` | `TubingHanger` |
| `id`, `label?` | Stable hanger ID, label optional |
| `tubingId` | Tubing được support; phải tồn tại trong envelope |
| `headId`, `seatId` | Head và named seat; seat phải thuộc head được tham chiếu |
| Metadata | `lifecycle`, `verification`, `sources` |

Một hanger mỗi payload, seat không được chiếm trùng. Support graph dẫn từ hanger tới tubing và head/seat; không có field ngược cần đồng bộ. Hanger installed không được support tubing chưa installed. Nếu không có hanger, tubing vẫn render và ghi `SUPPORT_UNKNOWN`.

Theo yêu cầu hình học mới nhất, Tubing Hanger xếp chồng trên casing hangers tại miệng wellhead; phần trên là mép ngang chạy toàn chiều rộng và hai cạnh đứng. [Tubing profile](../../src/geometry/hanger-profile.ts) có 6 điểm, giữ nguyên 5 điểm của phần dưới đã được chấp nhận: outer bore cao 10 px, gờ ngang và cạnh nghiêng xuống 45°, đoạn đáy ngang sát tubing. Phần trên không còn cạnh nghiêng; cạnh trong đứng từ miệng head đến đáy nên chiều cao bao gồm cả độ hạ ramp. Casing hanger giữ profile băng 8 điểm với hai bore cao 10 px và hai cạnh nghiêng 45°.

Hai bên ngoài inset 1 px so với wellhead bore; tubing hanger ở display slot 0 (ngang mouth), casing hangers giữ slot pitch 12 px. SVG append tubing hanger sau casing hangers để thể hiện lớp trên. Casing hanger paths và toàn bộ cạnh dưới Tubing Hanger không đổi so với stacked revision trước.

Layout lấy mouth bounds trực tiếp từ wellhead renderer. Display slot không thay named seat MD hoặc support graph. Riser nối tubing lên mouth chỉ phục vụ detail phóng đại, không tăng tubing MD length; lumen vẫn mở. Casing hanger cũng dùng profile chung; sửa độ hạ cạnh nghiêng từ công thức legacy chưa trừ đủ hai gờ ngang để ra đúng 45°. Label truy head/seat/tubing và ghi `seal unknown`. Phase 1 không hỗ trợ seals/ports/feedthrough, rating, subsea/dual-bore hoặc manufacturer mating profile; fields đó bị từ chối.

## Metadata, lỗi và giới hạn

- `lifecycle`: `planned`, `installed`, `unknown`; `removed` có diagnostic unsupported, chưa vẽ lịch sử removed trong snapshot active.
- `verification`: `verified`, `unverified`, `conflicting`. `sources` là array string references; installed/verified phải có ít nhất một reference. Validator kiểm sự hiện diện/shape, không xác minh nội dung evidence hoặc chứng nhận kỹ thuật.
- Domain canonical dùng metres và millimetres, giữ nguyên payload quantities bằng cách không mutate input. MD/datum dùng chung toàn envelope; thiếu datum, TVD hay unit khác bị từ chối. Không gán mặc định từ tên well.
- Mỗi array tối đa 128 entries; nested invalid objects/numbers và normalization overflow có diagnostics. Completion v2 là khả năng schematic bounded, không phải full well schema validation cho mọi catalog card.
- Semantic failures trả HTTP 400 JSON `{error, diagnostics}`; mỗi diagnostic có `code`, `path`, `componentId` nếu biết, `message`, `severity`. Bun root POST, Bun/Express `/hole`, UI `/hole` dùng chung handler/validator. Internal rendering failures trả 500 với message chung.
- Warnings `FIT_UNRESOLVED`/`SUPPORT_UNKNOWN` hiển thị trong SVG notes và model diagnostics; thành công vẫn trả SVG. Không có endpoint JSON graph riêng.
- Payload không `schemaVersion` và không Tubing/TubingHanger/CompletionPacker/Crossover/Coupling/PupJoint giữ path legacy; không có domain validation toàn cục trên legacy. Completion mới thiếu version trả 400.

## Cách dùng và kiến trúc

UI: **Tubing sample** nạp sample mới; **Load sample** giữ sample legacy. **Actual size** cho đọc nhãn ở kích thước SVG gốc với scroll trong preview; **Fit preview** trở về hình vừa khung. Preview dùng blob image; labels được escape qua D3 `.text`, không chèn SVG/JSON bằng innerHTML.

Luồng: unknown HTTP input → versioned validation/context adapter → normalized completion domain → [pure layout](../../src/geometry/completion-layout.ts) → các SVG adapters riêng: [tubing](../../src/components/tubing.ts), [tubing hanger](../../src/components/tubing-hanger.ts), [completion packer](../../src/components/completion-packer.ts). [Handler](../../src/handlers/hole-handler.ts) điều phối thứ tự vẽ qua pattern `drawX({ component, layout })({ svg })` như các components hiện có; mỗi adapter chỉ nhận dữ liệu của component và phần layout liên quan. Bốn packer roles dùng chung symbol/renderer trong file packer, giống legacy `packer.ts` xử lý `toolType`; không trộn schema legacy và CompletionPacker. [Notes/legend](../../src/components/completion-notes.ts) tách riêng, chỉ chia sẻ [text primitive helper](../../src/utils/svg-label-utils.ts). Không còn `src/components/completion.ts`. Domain/layout không import D3/DOM/LLM. Context renderer legacy giữ geometry riêng; cement random pattern còn tồn tại nên không dùng whole-SVG byte hash làm acceptance gate.

Fixtures/tests: [domain/geometry](../../tests/completion.test.ts), [HTTP transports](../../tests/completion-http.test.ts), [legacy immutability regression](../../tests/hole-immutability.test.ts). Visual evidence: [QA Phase 1](evidence/completion-phase-1/README.md), [hanger mouth geometry revision cũ](evidence/tubing-hanger-mouth/README.md), [stacked 45 degree profile cũ](evidence/tubing-hanger-stacked/README.md), [flat upper face hiện tại](evidence/tubing-hanger-flat-top/README.md). Download action đã có từ baseline; lượt này kiểm artifact SVG xuất qua handler và browser render, chưa xác minh lưu file bằng nút Download SVG của IAB.

## Completion line-style revision — 2026-10-04

Theo yêu cầu người dùng, toàn bộ Tubing (body/riser), Tubing Hanger, CompletionPacker và label leaders dùng nét liền, kể cả planned/unknown/unresolved. Các trạng thái vẫn có text/diagnostics và metadata SVG; không suy installed/set/verified từ nét vẽ. Geometry và annular bounds không đổi. Xem [evidence](evidence/completion-solid-lines/README.md).

## Crossover extension — 2026-10-04

[Contract Phase 3](completion-crossover.md): `Crossover` nối endpoints của hai tubing segments liền kề bằng ID explicit tại MD junction, không thêm physical length. Domain/validation/layout/SVG adapter đều có files riêng; bốn roles packer giữ nguyên. UI **Crossover sample**, fixture và HTTP/geometry tests đã triển khai. SVG không có crossover giữ output cũ; crossover explicit thay ordinary step bằng enlarged open-bore glyph, dùng solid lines.

## Coupling / Pup Joint extension — 2026-10-04

[Contract Phase 4](completion-joints.md): `Coupling` là ordinary external same-OD tubing connector, anchor tại junction với supplied body OD/optional ID, kiểm clearance ở cả hai phía host boundary. `PupJoint` tham chiếu một physical tubing segment có sẵn bằng `tubingId`/`segmentId`, nên chiều dài chỉ được tính một lần. Cả hai có domain, validation, pure layout và curried SVG adapters riêng, dùng nét liền. Detail riêng ghi not MD scale; main Pup interval giữ MD scale thật. UI **Coupling / Pup sample** đi qua allowlist GET/HEAD `/sample-joints.json`. Không có new kinds thì output completion cũ giữ nguyên.
