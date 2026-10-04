# Fixtures và tiêu chí QA

Đây là kế hoạch kiểm thử và fixture specs; chưa có runtime fixtures/assertions được triển khai trong đợt docs này. Mỗi card có biến thể riêng; phải thêm runnable fixture khi runtime slice được yêu cầu.

## Fixture matrix

| ID | Dữ liệu/kịch bản | Oracle cần kiểm tra |
| --- | --- | --- |
| F01 | Hole 0–1000 m MD, diameter 12.25 in, datum RKB khai báo | Extents/labels finite, basis/datum hiện rõ |
| F02 | Hai hole sections 0–1000 và 1000–2000, underream 1200–1400; thêm biến thể intervals shuffled/overlap | Boundary split đúng, stable IDs, input unchanged; overlap diagnostic |
| F03 | Nested casing OD/ID đủ dữ liệu; tapered string 1000 m + 200 m, shoe ở terminal | Containment, cumulative depth và exact joint boundary |
| F04 | Liner top 1500 bottom 2500 trong parent 0–1800, named hanger; tieback connector | Support/overlap graph rõ; disconnected extension bị phát hiện |
| F05 | Cement TOC 500, bottom 1800 qua hole/casing diameter changes; TOC unknown variant | Annular fill không vào lumen; unknown không bị vẽ full cement |
| F06 | Tubing + 2 packers tại 1800/2200, optional openhole interval | Seal hosts tồn tại, tubing khác casing, states rõ |
| F07 | SCSSV/sleeve, open/closed/unknown và control-line ports | State glyph/label, endpoint refs; không infer safe |
| F08 | Perforations 2300–2400, screen/gravel 2450–2550, multiple intervals | Through correct walls; pack/gravel chỉ đúng annulus |
| F09 | ESP cable path; gas lift valve trên mandrel; rod pump/rod path | Energy/flow attachment khác ownership; endpoint/clearance checks |
| F10 | Onshore và subsea wellhead/tree ports, duplicate hanger slots | Configuration-specific interfaces, stable seat identity, slot conflict |
| F11 | Cement plugs + bridge plug, cut casing và barrier evidence unknown/failed | Snapshot không hiện removed như installed; không dùng glyph làm pass |
| F12 | Cùng well đổi m↔ft, in↔mm; MD≠TVD; datum offset thiếu hoặc khác | Physical anchors tương đương với conversion hợp lệ; missing survey/datum diagnostic |
| F13 | Long Vietnamese/English labels, XML special chars, repeated names, tiny tool intervals, extreme depths | Escaping, leaders/no overlap, full bounds, legible monochrome |
| F14 | Empty holes/segments, NaN, reversed depth, duplicate/dangling/cyclic refs, before-start/exact-end lookup | Structured diagnostics, không crash hoặc silent omission |
| F15 | Render cùng input 2 lần và hoán đổi unrelated components; embedded 2 SVGs | Determinism, no input mutation, no defs-ID collision |

## Completion criteria cho một runtime component

Card được review, nguồn chưa rõ được đánh dấu; canonical model và legacy migration explicit; validator errors/path rõ; geometry thuần có boundary oracle; handler dispatch đúng kind/variant; host/label/lifecycle không bị bỏ qua; fixture valid và invalid cho edges trong card; visual review có screenshot/SVG tại viewport đã ghi. Không chỉ snapshot hash: kiểm anchor, relation, clipping và label bằng invariants.

Baseline visual phải ghi schema/renderer version, fixture revision, viewport, font và platform. Chấp nhận pixel threshold sau khi xác định noise từ font/antialias, không tăng threshold để che sai shape. Lưu before/after + giải thích thay đổi; chỉ cập nhật baseline khi semantic change đã được review. Test monochrome và SVG export. Nếu không có browser/rasterizer, chạy structural checks và báo visual review chưa thực hiện.

Docs-only completion: 6 skills YAML/frontmatter hợp lệ, link nội bộ resolve, tất cả component cards có 9 phần, source IDs tồn tại, status phù hợp audit, git diff chỉ docs/instructions. Không chạy server/API chỉ để kiểm docs.
