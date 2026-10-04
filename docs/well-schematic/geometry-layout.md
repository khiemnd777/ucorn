# Geometry, layers và SVG — convention UCORN đề xuất

## Mapping

Chọn depth basis/datum của bản vẽ trước layout. Vertical schematic dùng y scale của depth theo MD hoặc TVD đã khai báo; biểu diễn MD thẳng đứng không là true trajectory. Dùng viewport margin explicit thay vì hardcode origin. Diameter scale độc lập depth scale; in legend ghi schematic / not to physical scale. Trajectory view cần survey và adapter riêng; không bẻ đường giếng từ MD đơn độc.

Domain quantities → normalized physical geometry → layout coordinates → SVG primitives. Point tools có minimum visual height nhưng anchor depth giữ đúng; glyph height không sửa physical length. Không di chuyển packer/perforation để tránh label collision; chỉ di chuyển label/leader hoặc dùng detail inset.

## Layer order

| Layer ID | Nội dung | Quy tắc |
| --- | --- | --- |
| context | Formation, ground/mudline, reservoir bands | Background, không che boundaries |
| bore | Hole/underream/trajectory boundary | Tách roughness decoration khỏi exact diameter |
| annular-fill | Cement, gravel, fluids | Clip đúng annulus; legend hatch riêng |
| tubular | Casing/liner/tieback/tubing | Outer/inner boundaries nếu có; không giả wall thickness kỹ thuật |
| tools | Packers, nipples, valves, lift | Host anchors, family-specific symbols |
| interfaces | Wellhead, hangers, tree, subsea | Insets khi assembly quá ngắn so depth range |
| barrier-overlay | Declared barrier spans/evidence | Không che component, unknown trạng thái phải nhìn thấy |
| annotation | Labels, depth ticks, leaders, legend | Priority/lanes, không xuyên symbol tùy tiện |

Đây là target layout; current append order khác (audit). Mỗi catalog card quy định layer cụ thể, không tự gọi là API/ISO symbol. Các dashed/hatched markers planned/removed cần legend và text, không chỉ màu. Phân biệt cement fill với geological hatch và gravel dots trong monochrome.

## Symbols và labels

Use paired lines cho tubular; shoe terminal glyph; packer seal blocks giữa boundaries; valve body + state text; perforation ticks xuyên casing/cement đúng interval; screen hatching trong conduit host; gravel dots ở annulus; tree/subsea block ports có named connector. Các minimum sizes, line weights và palette là render config, không manufacturer dimensions. Không vẽ emergency/safety valve open/closed từ assumption.

Label chuẩn đề xuất: component name/ID + OD/ID nếu biết + `top–bottom m MD @ datum` hoặc point depth + lifecycle khi không installed. Trường unknown hiển thị `unknown`, không bỏ khiến hình như đầy đủ. Depth ticks có basis/unit/datum ở header. Nhãn có component ID để trace; cùng tên nhưng khác string không merge.

## Layout/SVG validation

Tính bounding box trước xuất, fit viewport có margin; tránh clipped wellhead và label. Sort draw order theo layer rồi stable IDs/physical depth đã định nghĩa. Output deterministic cho cùng input/config; không random symbol/pattern IDs, nhưng namespaced defs IDs để nhiều SVG không collision. XML escape user labels, cấm untrusted raw SVG/external resource URLs. Paths finite; không NaN/Infinity, negative extents hoặc self-intersection annular fill không giải thích. Input immutable: sort bản copy, không mutate underreamed hay component arrays. Export title/desc, unit/datum legend và reference metadata cho accessibility và audit.

Completion v2 convention đã xác nhận 2026-10-04: toàn bộ component boundaries/crosses/leaders dùng solid strokes. Planned/unknown/unresolved thể hiện bằng text/diagnostics, thay cho đề xuất dashed markers ở trên trong riêng completion renderer.
