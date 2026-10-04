# Phạm vi và glossary

## Phạm vi theo vòng đời

**Core schematic:** borehole intervals, casing/liner strings và shoe, annular cement, tubing nếu bản vẽ completion yêu cầu, wellhead/hangers, depth axis và labels. Core là nhu cầu mô hình, không hàm ý tất cả đã có renderer.

**Tùy cấu hình:** underream, tieback, liner hanger/top packer, production/isolation packer, completion accessories, valves, perforation/screens/gravel, lift, subsea interfaces, abandonment plugs và evidence annotations. Chỉ thêm khi input hoặc cấu hình yêu cầu.

**Ngoài baseline:** chi tiết thiết kế rig/BHA và máy khoan, P&ID plant, compressor/separator/pipeline network, hydraulic/cement placement simulation, geomechanics, burst/collapse/tension design, 3D reservoir model, detailed manufacturer assembly/certification. BOP và temporary intervention tools có thể xuất hiện dạng context block nếu được yêu cầu, không nhập nhầm với permanent completion. Multilateral, eccentric geometry, deviated trajectory cần capability/contract riêng trước khi gọi là supported.

## Thuật ngữ

| Term | Ý nghĩa cho schematic | Nguồn |
| --- | --- | --- |
| Borehole / openhole | Lỗ khoan; openhole là đoạn chưa có casing, không đồng nghĩa toàn giếng | [openhole](https://glossary.slb.com/en/terms/o/openhole) |
| Formation / reservoir interval | Formation là thể đá/đơn vị địa chất; reservoir là vai trò chứa lưu thể, không phải mọi formation | [formation](https://glossary.slb.com/en/terms/f/formation) |
| Casing | Ống chống cấu trúc/isolation; khác conduit tubing | [casing](https://glossary.slb.com/en/terms/c/casing) |
| Liner | Casing string kết thúc phía trên ở trong casing trước thay vì tới surface | [liner](https://glossary.slb.com/en/terms/l/liner) |
| Tieback | Extension nối liner về phía trên; không nhầm subsea flowline tieback. Chi tiết connector chưa xác minh | [liner — context](https://glossary.slb.com/en/terms/l/liner) |
| Tubing | Conduit của production string; không thay bằng Casing chỉ để vẽ | [production tubing](https://glossary.slb.com/en/terms/p/production_tubing) |
| Annulus | Khoảng giữa các boundary quanh pipe; phải biết inner và outer host | [annulus](https://glossary.slb.com/en/terms/a/annulus) |
| Cement / TOC | Cement annular hoặc plug phải tách purpose; TOC = top of cement, có provenance/uncertainty | [cement](https://glossary.slb.com/en/terms/c/cement) |
| Hanger / packer | Hanger support string; packer seal annulus; có thể cùng assembly nhưng không cùng chức năng | [liner hanger](https://glossary.slb.com/en/terms/l/liner_hanger), [packer](https://glossary.slb.com/en/terms/p/packer) |
| Wellhead / tree | Wellhead termination/support/interfaces; tree điều khiển flow phía trên | [wellhead](https://glossary.slb.com/en/terms/w/wellhead), [tree](https://glossary.slb.com/en/terms/c/christmas_tree) |
| Perforation | Kênh liên thông casing/liner tới formation; không là screen | [perforation](https://glossary.slb.com/en/terms/p/perforation) |
| MD | Chiều dài theo đường giếng từ datum được khai báo | [measured depth](https://glossary.slb.com/en/terms/m/measured_depth) |
| TVD | Khoảng cách thẳng đứng từ datum; chuyển MD↔TVD cần survey, không dùng linear scalar | [true vertical depth](https://glossary.slb.com/en/terms/t/true_vertical_depth) |
| RKB / KB / RT / GL / MSL / mudline | Tên datum phổ biến: rotary/kelly bushing, rotary table, ground level, mean sea level, seabed. Không coi chúng cùng cao độ; xác minh datum naming từ well header | Operator-specific naming cần xác minh |
| OD / ID / drift | Outside/inside diameter và clearance drift; drift không được suy từ OD nếu thiếu wall thickness/spec | Proposed quantity convention; equipment spec cần xác minh |
| SCSSV / SSSV | Surface-controlled variant thuộc safety-valve family; symbol không chứng minh fail-safe function | [SSSV](https://glossary.slb.com/en/terms/s/subsurface_safety_valve_sssv) |
| ESP / gas lift / rod pump | Các family artificial lift; chọn host và energy path theo cấu hình | [artificial lift](https://glossary.slb.com/en/terms/a/artificial_lift) |
| P&A | Plug and abandon; schematic lưu hiện trạng/evidence, không xác nhận đáp ứng quy định | [plug and abandon](https://glossary.slb.com/en/terms/p/plug_and_abandon) |
| Snapshot / lifecycle / evidence | Convention dữ liệu UCORN: thời điểm bản vẽ, trạng thái thiết bị, nguồn và mức xác minh; độc lập implementation status | Local convention |

Các chữ viết tắt/định nghĩa không có link ở bảng là thuật ngữ dùng trong proposed contract, cần xác minh khi nhập dữ liệu operator-specific. Không suy pressure hoặc quality từ glossary.
