# Nguồn kỹ thuật và mức xác minh

Đọc trực tiếp SLB Energy Glossary ngày 2026-10-04 qua web tool. `verified-definition` chỉ xác minh định nghĩa/chức năng tổng quát; field/schema/symbol/validation trong catalog là proposed UCORN contract, chưa xác minh theo manufacturer assembly. Không tuyên bố compliance API/ISO/NORSOK hoặc tái sử dụng hình bản quyền. Không sao chép đoạn dài; không chuyển generic glossary guidance thành engineering thresholds.

Chi tiết connector, equipment envelope, rating, setting mechanism, port orientation và barrier requirements phải được xác minh thêm trên tài liệu đúng manufacturer/model/edition hoặc dữ liệu operator trước runtime hỗ trợ cấu hình cụ thể. Các entry có family source nhưng variant chưa được đọc được ghi `family-only` trong catalog. Khi nguồn mâu thuẫn: giữ cả provenance và hỏi chuyên gia có trách nhiệm, không tự chọn số.

| Source ID | Link | Status | Scope |
| --- | --- | --- | --- |
| `openhole` | [openhole](https://glossary.slb.com/en/terms/o/openhole) | verified-definition | Uncased interval; không mặc định toàn giếng. |
| `formation` | [formation](https://glossary.slb.com/en/terms/f/formation) | verified-definition | Định nghĩa formation; không tự xác định reservoir. |
| `casing` | [casing](https://glossary.slb.com/en/terms/c/casing) | verified-definition | Casing function/family; không suy sizing. |
| `liner` | [liner](https://glossary.slb.com/en/terms/l/liner) | verified-definition | Liner top trong casing trước; extension context. |
| `underream` | [underream](https://glossary.slb.com/en/terms/u/underream) | verified-definition | Enlarged borehole interval. |
| `float_shoe` | [float_shoe](https://glossary.slb.com/en/terms/f/float_shoe) | verified-definition | Terminal guide/check-valve family; không chứng nhận rating. |
| `float_collar` | [float_collar](https://glossary.slb.com/en/terms/f/float_collar) | verified-definition | Near-bottom collar và cement-plug landing context. |
| `liner_hanger` | [liner_hanger](https://glossary.slb.com/en/terms/l/liner_hanger) | verified-definition | Support liner từ casing trước. |
| `annulus` | [annulus](https://glossary.slb.com/en/terms/a/annulus) | verified-definition | Space giữa boundaries. |
| `cement` | [cement](https://glossary.slb.com/en/terms/c/cement) | verified-definition | Annular sealing và plug use; không dùng con số vận hành làm default. |
| `packer` | [packer](https://glossary.slb.com/en/terms/p/packer) | verified-definition | Annular isolation, classification context. |
| `production_tubing` | [production_tubing](https://glossary.slb.com/en/terms/p/production_tubing) | verified-definition | Production conduit. |
| `tubing_hanger` | [tubing_hanger](https://glossary.slb.com/en/terms/t/tubing_hanger) | verified-definition | Support/sealing context ở tubing head. |
| `casing_hanger` | [casing_hanger](https://glossary.slb.com/en/terms/c/casing_hanger) | verified-definition | Casing support/seal subassembly. |
| `wellhead` | [wellhead](https://glossary.slb.com/en/terms/w/wellhead) | verified-definition | Surface termination/support interfaces. |
| `christmas_tree` | [christmas_tree](https://glossary.slb.com/en/terms/c/christmas_tree) | verified-definition | Production flow-control assembly. |
| `perforation` | [perforation](https://glossary.slb.com/en/terms/p/perforation) | verified-definition | Communication tunnel tới formation. |
| `sand_control` | [sand_control](https://glossary.slb.com/en/terms/s/sand_control) | verified-definition | Control formation sand; family overview. |
| `gravel_pack` | [gravel_pack](https://glossary.slb.com/en/terms/g/gravel_pack) | verified-definition | Screen + prepared gravel context. |
| `sliding_sleeve` | [sliding_sleeve](https://glossary.slb.com/en/terms/s/sliding_sleeve) | verified-definition | Ports giữa conduit và annulus. |
| `landing_nipple` | [landing_nipple](https://glossary.slb.com/en/terms/l/landing_nipple) | verified-definition | Internal locking/seal profile. |
| `artificial_lift` | [artificial_lift](https://glossary.slb.com/en/terms/a/artificial_lift) | verified-definition | Energy-adding production family. |
| `gas_lift` | [gas_lift](https://glossary.slb.com/en/terms/g/gas_lift) | verified-definition | Injection through gas-lift valves. |
| `electric_submersible_pump` | [electric_submersible_pump](https://glossary.slb.com/en/terms/e/electric_submersible_pump) | verified-definition | Electrically driven downhole pump family. |
| `rod_pump` | [rod_pump](https://glossary.slb.com/en/terms/r/rod_pump) | verified-definition | Rod-driven downhole pump. |
| `subsurface_safety_valve_sssv` | [subsurface_safety_valve_sssv](https://glossary.slb.com/en/terms/s/subsurface_safety_valve_sssv) | verified-definition | Safety-valve family, surface/subsurface control context. |
| `bridge_plug` | [bridge_plug](https://glossary.slb.com/en/terms/b/bridge_plug) | verified-definition | Lower wellbore isolation tool. |
| `plug_and_abandon` | [plug_and_abandon](https://glossary.slb.com/en/terms/p/plug_and_abandon) | verified-definition | Permanent closure context; operator/regulator-specific requirements. |
| `measured_depth` | [measured_depth](https://glossary.slb.com/en/terms/m/measured_depth) | verified-definition | Length along wellbore. |
| `true_vertical_depth` | [true_vertical_depth](https://glossary.slb.com/en/terms/t/true_vertical_depth) | verified-definition | Vertical distance from datum. |
| `tieback` | [tieback](https://glossary.slb.com/en/terms/t/tieback) | unverified-unavailable | Trang không đọc được qua web tool; URL là candidate, không bằng chứng. |
| `sand_screen` | [sand_screen](https://glossary.slb.com/en/terms/s/sand_screen) | unverified-unavailable | Trang không đọc được qua web tool; URL là candidate, không bằng chứng. |
| `progressing_cavity_pump` | [progressing_cavity_pump](https://glossary.slb.com/en/terms/p/progressing_cavity_pump) | unverified-unavailable | Trang không đọc được qua web tool; URL là candidate, không bằng chứng. |
| `ucorn-convention` | Local convention | proposed-local | Quy ước model/render/QA do UCORN đề xuất, không chuẩn kỹ thuật. |

## Completion packers research refresh — 2026-10-04

| Source ID | Link | Status | Scope |
| --- | --- | --- | --- |
| `production_packer` | [SLB production packer](https://glossary.slb.com/en/terms/p/production_packer) | verified-definition | Annular isolation / tubing anchoring family; không xác minh sizing hoặc rating. |
| `liner_top_packer` | [Halliburton MatchSet liner-top packer](https://www.halliburton.com/en/products/matchset-hydraulic-set-liner-hanger-with-integral-liner-top-packer) | verified-definition | Function-backed: annular seal giữa liner top và parent casing; source model-specific, không chuyển model specs sang UCORN defaults. |

SLB `packer` đọc lại cùng ngày cho family/classification; isolation/test vẫn family-only variant suitability. Candidate SLB liner-top URL không đọc được; sử dụng Halliburton official function source thay thế.

## Crossover research refresh — 2026-10-04

| Source ID | Link | Status | Scope |
| --- | --- | --- | --- |
| `crossover` | [SLB crossover — Energy Glossary](https://glossary.slb.com/en/terms/c/crossover) | verified-definition | Short subassembly nối các component có thread types/sizes khác nhau. Đọc trực tiếp; không xác minh manufacturer shape, physical length, ratings hoặc compatibility. |

Ở Phase 3, coupling/pup chưa triển khai; Phase 4 bên dưới thêm bounded capabilities. Giữ family-only cho toàn card. Point junction runtime, glyph enlargement và endpoint validation là UCORN convention trong [contract](completion-crossover.md).

## Coupling / Pup Joint research refresh — 2026-10-04

| Source ID | Link | Status | Scope |
| --- | --- | --- | --- |
| `tubular_accessories` | [Crossover Inc. products — Couplings / Pup Joints](https://www.crossoverinc.com/products.aspx) | verified-definition | Đọc trực tiếp; coupling nối pipe joints, pup joint là short tubular section để positioning. Function/family được xác minh; dimensions, rating, thread mating và universal length cutoff chưa xác minh. |

[Bounded runtime contract](completion-joints.md) chỉ hỗ trợ ordinary external same-OD tubing coupling và explicit Pup Joint segment; các symbol và thresholds từ supplied dimensions là quy ước UCORN.
