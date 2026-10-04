# Completion crossover — bounded runtime contract

Triển khai 2026-10-04 theo yêu cầu người dùng. Catalog card `crossover` được chọn;
slice hỗ trợ **Crossover tại junction của hai tubing segments liền kề**, trong
Completion v2 single-string / MD / named datum. Coupling/Pup Joint có contracts và modules riêng ở [Phase 4](completion-joints.md). Crossover service tool, connector giữa hai strings, thread mating rules, manufacturer geometry và ratings chưa thuộc capability này.

## Chức năng và nguồn

[SLB crossover](https://glossary.slb.com/en/terms/c/crossover), Energy Glossary,
đọc trực tiếp 2026-10-04: subassembly nối hai component có kiểu/kích thước ren
khác nhau. Nguồn chỉ xác minh chức năng, không xác minh dữ liệu demo hoặc symbol.
Point attachment, enlarged glyph và các checks dưới đây là **convention UCORN**.
Không tự tạo crossover từ tubing taper hoặc tên segment.

## Dữ liệu và quan hệ

Envelope `schemaVersion: 2`, `depthContext`, units, snapshot và metadata giữ
[Completion v2 contract](completion-v2-contract.md).

```json
{
  "type": "Crossover",
  "id": "XO-01",
  "tubingId": "T01",
  "fromSegmentId": "T01-S01",
  "toSegmentId": "T01-S02",
  "at": { "value": 2800, "unit": "m" },
  "fromConnection": "4.5 in connection (demo)",
  "toConnection": "3.5 in connection (demo)",
  "lifecycle": "planned",
  "verification": "unverified",
  "sources": ["synthetic-fixture"]
}
```

| Field | Contract |
| --- | --- |
| `id`, `label?`, lifecycle/evidence | Stable ID; metadata rules chung. ID không trùng component/segment/seat/context ID. |
| `tubingId` | Owner tubing duy nhất trong snapshot. |
| `fromSegmentId`, `toSegmentId` | Hai segments của owner; upper endpoint → lower endpoint. Thứ tự component array không có ý nghĩa attachment. |
| `at` | Quantity m/ft MD @ envelope datum; khớp from.bottom và to.top với tolerance 1e-7 m. Normalize về endpoint canonical để tránh roundoff. |
| `fromConnection?`, `toConnection?` | Text do người nhập cung cấp, ≤256 ký tự, thiếu là unknown. Không parse thành chuẩn ren hoặc suy compatibility. |

OD/ID hai đầu lấy từ tubing segments đã validation; không có OD/ID connector
mặc định. Không thêm `length`, `top/bottom`, pressure hay port fields: các fields
ngoài capability bị từ chối. Đây là **point schematic**, không phải assembly có
chiều dài bằng 0; chiều dài thực **unknown**, không cộng vào MD của tubing.

## Validation

[Validator riêng](../../src/validation/crossovers.ts) dùng typed readers chung,
sau normalization/host validation của tubing. Hai endpoint IDs phải tồn tại,
liền kề, đúng hướng; mỗi junction có tối đa một crossover hoặc coupling explicit. Owner sai/dangling,
self/reversed/nonadjacent connection, anchor khác MD, ID/junction trùng, dữ liệu
không finite, unit sai và unsupported fields trả structured diagnostic HTTP 400.
Installed crossover cần installed tubing và metadata evidence như contract chung.
Thiếu connection text tạo warning `CONNECTION_UNRESOLVED`; không giả compatibility.
Thiếu tubing bore giữ unknown; fit của tubing dùng existing host bore checks.
Không xác minh connector body envelope, thread strength, ratings hoặc suitability.

## Symbol, layer, label

[Pure layout](../../src/geometry/crossover-layout.ts) tạo hai đường OD đối xứng
nối hai size; thêm hai đường ID khi **cả hai** endpoint có bore. End-wall marks
chỉ nằm trên wall đã biết, không cap lumen. Nét liền; không hatch/fill chứng nhận.
Glyph đặt giữa MD anchor, tối đa 8 px, giảm chiều cao theo adjacent segment bounds
để hai junctions gần nhau không bị nhập hình. Chiều cao này không là physical
length hoặc manufacturer taper angle.

Chỉ crossover explicit mới thay ordinary tubing step ở junction đó và trim phần
tubing nằm trong glyph window; physical model, MD endpoints và host coverage giữ
nguyên. Payload cũ không crossover vẫn giữ nguyên SVG completion (5/5 fixture
fragments đối chiếu trước/sau).

[SVG adapter riêng](../../src/components/crossover.ts) dùng
`drawCrossover({ crossover, layout, labelX })({ svg })`; handler điều phối sau
tubing/hanger và trước packers. Group có component/tubing/segment IDs và MD trong
`data-*`, title có provenance. Label gồm ID, endpoints, OD/ID, datum, connection
texts, lifecycle/evidence và `length unknown` / `compatibility unverified`.
Labels/leaders đi riêng lane; text escaped bằng D3, viewport tăng theo label/notes.

## Fixtures, trạng thái và acceptance

[Fixture](../../sample-data/well-completion-crossover.json) chứa tubing 4.5→3.5 in,
hanger và cả bốn packers; crossover tại 2800 m. UI **Crossover sample** đi qua
allowlist `/sample-crossover.json`, GET/HEAD only; mọi transports dùng cùng handler.
F03/F06/F13–F15 được cụ thể hóa trong [tests](../../tests/crossover.test.ts):
endpoint/MD continuity, ft/m, unknown bore/profile, same-size, duplicate/dangling/
reverse/nonadjacent refs, nearby glyph bounds, immutable input, reorder và escaped
long labels. [HTTP tests](../../tests/completion-http.test.ts) kiểm success và
invalid anchor qua Bun root/hole, Express và UI.

**Selected / implemented / VERIFIED_LOCAL** trong slice trên. Full suite
`bun run test`: **142 tests / 792 assertions PASS**; build/typecheck PASS.
[Visual/XML evidence](evidence/completion-crossover/README.md): desktop/mobile,
actual size, wrong-anchor error/recovery, export và unknown bore/profile.
Không operator UAT, real-device test, production hoặc engineering approval.
