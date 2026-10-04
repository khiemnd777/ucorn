# Hợp đồng dữ liệu và attachments — đề xuất, chưa triển khai

Common contract bên dưới vẫn là target cho toàn catalog. Hai component Tubing/TubingHanger đã có runtime slice giới hạn; API hỗ trợ thực tế được ghi riêng trong [Completion v2 contract](completion-v2-contract.md), không suy toàn bộ common contract đã được triển khai.

## Boundary module

Luồng mong muốn: input adapter → parse → explicit units/datum normalization → domain validation → immutable graph → layout primitives → SVG adapter. Gợi ý module tương lai `domain/`, `validation/`, `geometry/`, `renderers/svg/`, `adapters/legacy/`; đây chưa là thư mục hiện có. Domain không import D3, DOM, LLM SDK, không chứa pixel/color/font. Geometry nhận normalized model + layout config. LLM tương lai chỉ tạo input qua adapter và cùng validator như người dùng.

## Common contract cho mọi catalog card

- `schemaVersion`, `wellId`, `snapshotAt`, `wellboreId`; branch identity cần explicit nếu multilateral được hỗ trợ sau này.
- Component: `id` duy nhất, `kind` discriminator, `variant` được định nghĩa theo kind, `lifecycle` (`planned`, `installed`, `removed`, `unknown`), `validFrom/validTo` nếu cần lịch sử, `label`, `sources[]`, `verification` (`verified`, `unverified`, `conflicting`). `installed` cần evidence; không biến verification thành engineering approval.
- Depth dùng `at` hoặc `interval {top,bottom}`; mỗi quantity có `value`, `unit` (`m`, `ft`) cùng `depthBasis` (`MD`, `TVD`) và `datumId`. Top ≤ bottom cho interval; point không giả thành zero-length interval. MD increasing downhole; datum/elevation transform phải có sign convention explicit. Không cho datum không rõ vào hình chính thức; draft phải ghi unknown rõ.
- `OD`, `ID`, `diameter`, `length`, `clearance` có đơn vị `mm` hoặc `in` cho diameter; lengths `m` hoặc `ft`. Canonical đề xuất m cho depth/length, mm cho diameter; giữ original value/unit. 1 ft = 0.3048 m, 1 in = 25.4 mm. Physical conversion khác `inchToPixel`; không làm tròn trước containment checks.
- `pressure` nếu người dùng cung cấp: `Pa/kPa/MPa/psi`, `reference` (`absolute`, `gauge`, `differential`); `temperature`: `degC/degF/K`; `density`: `kg/m3` hoặc `lb/gal` với gallon system explicit. Dữ kiện không cần cho hình có thể optional; không đặt engineering defaults. Fraction/percent phải explicit.
- `hostId` owner/insertion host; thêm typed relations cho support, seal, connection. Không dùng một ref chung cho tất cả ý nghĩa. Field missing ≠ 0. IDs case-sensitive, references không phụ thuộc array order, unknown kind lỗi có đường dẫn dữ liệu.

## Graph và topology

| Relation | Vai trò | Validation |
| --- | --- | --- |
| contained-in | Tool/string nằm trong bore/host tại depth | Host tồn tại, cùng wellbore và depth context; kiểm OD/tool envelope với available ID nếu có; thiếu ID cảnh báo unresolved fit |
| supported-by | Casing/tubing/liner treo từ hanger/seat | Relation tách khỏi seal, không giả hanger chỉ từ vị trí hình |
| seals-between | Packer/packoff nối hai boundaries của annulus | Inner/outer IDs khác nhau và tồn tại ở interval, set-state không suy từ symbol |
| connects-to | Tieback, crossover, conduit ports | Endpoint/profile cùng hệ depth, role và direction rõ; kiểm cycle theo relation, không cấm mọi flow loop |
| occupies-annulus | Cement/gravel/fluid volume | Explicit inner/outer boundary và interval; không paint đè lumen |
| annotates | Note/evidence/measurement trỏ component/interval | Dangling target lỗi hoặc explicit detached annotation, không tự gắn host gần nhất |

Ownership graph phải acyclic. Flow/seal graph có topology riêng. Casing taper segments nối liên tục, lấy bottom = top + sum(length), không tính từ label. Liner overlap và tieback connector không suy đoán. Model barrier là tập component/evidence có objective do người nhập khai báo; chưa làm algorithm chứng nhận barrier.

## Runtime validation được đề xuất

Phân tầng lỗi: parse/schema (finite numbers, allowed units/discriminators), quantities/datum normalization, reference graph, interval/diameter containment, lifecycle consistency, then layout warnings. Trả `code`, `path`, `componentId`, `message`, `severity`; semantic failures không silently skip SVG. Symbol chưa hỗ trợ trả unsupported diagnostic hoặc placeholder có legend theo product choice explicit.

Endpoint convention đề xuất: intervals half-open `[top,bottom)` cho lookup tránh double-host; riêng shoe/terminal point ở bottom dùng named anchor và explicit boundary policy. Test exact top/bottom/epsilon. Không ép mọi casing có length >0 khi point annotations là type khác. Reject NaN/Infinity, negative OD/length, inverted intervals, duplicate IDs, dangling refs và impossible nested fit khi đủ ID/OD. Với missing datum, wall thickness hoặc survey: unresolved, không tự tạo số.

## Legacy adapter cần thiết trong task runtime tương lai

`Hole.depth` hiện là cumulative bottom, top suy từ sequence; giữ holeID khi split underream. Legacy casing `diameter` chưa xác định OD/ID ngoài convention hình, không đổi nghĩa lặng lẽ. Cement `startDepth` hiện đóng vai TOC và bottom suy từ casing; proposed explicit interval chỉ sau migration. Legacy packer `refCasingID`/`seatingCasingID` không tương đương tubingHost. Wellhead/hanger dùng display origin/slot, không là measured elevation. Unit strings tùy ý hiện tại phải được map/reject; API compatibility cần fixture trước thay đổi.
