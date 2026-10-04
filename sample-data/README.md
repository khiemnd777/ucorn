# Sample data — 5 holes, production liner, cement, liner-top packer và casing hangers

Sample bổ sung [well-tubing-hanger.json](well-tubing-hanger.json) dùng [Completion v2 contract](../docs/well-schematic/completion-v2-contract.md). Nút **Tubing sample** nạp sample này; sample legacy và nút **Load sample** giữ dữ liệu ban đầu. V2 sample có một Packer thay vì hai entry trùng, thêm boreDiameter tổng hợp cho casing, `WH01/SEAT-T01`, tubing T01 0–4000 m (4.5→3.5 in tại 2800 m) và Tubing Hanger TH01. Datum `DEMO-RKB`, snapshot và tất cả dimensions/sources là minh họa; lifecycle planned, verification unverified. Không dùng các boreDiameter demo làm thông số thiết bị thật.

File [well-5-holes-liner-hangers.json](well-5-holes-liner-hangers.json) dùng payload legacy hiện tại của UCORN, gửi trực tiếp tới POST `/hole`.

Đây là dữ liệu giả lập để minh họa renderer. Diameter tính bằng inch; depth/length tính bằng mét, giả định MD từ một datum demo tại depth 0. Legacy schema chưa chứa MD/datum riêng và renderer chưa áp dụng unit conversion; sample đã dùng đúng numeric convention của renderer.

| Hole | Interval (m) | Diameter (in) | String | String interval (m) | Diameter (in) |
| --- | --- | --- | --- | --- | --- |
| H01 | 0–100 | 36 | Conductor casing | 0–100 | 30 |
| H02 | 100–600 | 26 | Surface casing | 0–600 | 20 |
| H03 | 600–1800 | 17.5 | Intermediate casing | 0–1800 | 13.375 |
| H04 | 1800–3000 | 12.25 | Production casing | 0–3000 | 9.625 |
| H05 | 3000–4200 | 8.5 | Production liner | 2800–4200 | 7 |

`holes[].depth` là bottom depth tích lũy, không phải chiều dài từng hole. String bottom = `startDepth + sum(segments[].length)`. Liner overlap với production casing là 2800–3000 m (200 m). `refHoleID` chỉ tham chiếu hole section ở cuối string, không có nghĩa toàn string nằm trong riêng section đó; renderer hiện không dùng field này để chọn host.

Wellhead tham chiếu surface casing C02 và seating casing C01. Hai CasingHanger lần lượt tham chiếu C04 và C03; renderer xếp slot theo thứ tự array. Production liner dùng `type: Casing`, `pipeType: Production Liner`; hiện vẽ bằng generic casing renderer. Liner hanger riêng chưa được hỗ trợ, nên không gán liner vào surface CasingHanger.

Liner Top Packer tại 2800 m dùng `type: Packer`, `toolType: Liner Top Packer`,
`refCasingID: L01-PRODUCTION`, `seatingCasingID: C04-PRODUCTION`. Hai seal blocks
được vẽ trong annulus giữa liner 7 in và Production Casing 9.625 in, ngay tại liner
top. Đây là cách biểu diễn đã được người dùng chọn cho mẫu; không có plug bịt lòng
liner. Renderer Packer hiện dùng ký hiệu generic, chiều cao glyph 8 px là quy ước
hiển thị, không phải chiều dài thiết bị thực.

JSON người dùng cung cấp có hai entry Packer giống nhau tại 2800 m, trước và sau
nhóm Cement. Sample giữ nguyên cả hai entry và thứ tự; renderer vẽ chồng hai cặp
seal blocks tại cùng vị trí.

Chức năng làm kín annulus tại liner top được đối chiếu với [Halliburton — liner-top
packer](https://www.halliburton.com/en/products/matchset-hydraulic-set-liner-hanger-with-integral-liner-top-packer);
nguồn này xác minh chức năng, không xác nhận sizing hay assembly của dữ liệu demo.

Sample có 5 component `Cement`, mỗi component tham chiếu một casing/liner bằng
`refCasingID`. `startDepth` là top of cement (TOC); legacy renderer suy bottom từ
cuối string. TOC dưới đây là giả định minh họa, không phải dữ liệu giếng thực:

| Cement reference | TOC (m) | Bottom (m) |
| --- | --- | --- |
| C01-CONDUCTOR | 0 | 100 |
| C02-SURFACE | 0 | 600 |
| C03-INTERMEDIATE | 0 | 1800 |
| C04-PRODUCTION | 0 | 3000 |
| L01-PRODUCTION | 2800 | 4200 |

Cement fill nằm ngoài string được tham chiếu, tới casing bao ngoài gần nhất hoặc
hole wall theo từng interval. Với liner, outer boundary là Production Casing tại
2800–3000 m và hole H05 tại 3000–4200 m. Fill xám được vẽ trước pipe/packer để giữ
các đường biên và ký hiệu rõ; lòng string vẫn mở. Không có ý nghĩa xác nhận cement
quality hay barrier integrity. Trên UI localhost:3001, **Load sample** nạp JSON này
và cập nhật preview; chỉnh `startDepth` của từng `Cement` rồi **Generate schematic**
để thay đổi TOC.

Khi server UCORN đã chạy ở port 3000, từ repo root:

```sh
curl --fail-with-body --request POST http://localhost:3000/hole \
  --header 'Content-Type: application/json' \
  --data-binary @sample-data/well-5-holes-liner-hangers.json \
  --output /tmp/ucorn-demo-5-holes.svg
```

Sample chưa có pipe ID/wall thickness, nên kiểm tra diameter nesting chỉ là kiểm tra hình học schematic; không xác minh physical clearance hoặc thiết kế giếng. Sample chưa có tubing hoặc liner-hanger topology. Runtime SVG được kiểm tra qua HTTP tests; fixture cement kiểm tra TOC/bottom, annular bounds, chuyển outer boundary tại liner overlap, đối xứng, giữ nguyên input và độc lập thứ tự casing. Vị trí packer và cement fill được kiểm tra bằng visual preview.

## Completion packers v2

[well-completion-packers.json](well-completion-packers.json) là fixture Phase 2 synthetic: giữ tubing/hanger và context, thay legacy Packer bằng bốn CompletionPacker có explicit annulus endpoints và intervals. Production/test/isolation seal envelope giữa tubing và casing/liner; liner-top giữa liner top và parent casing. UI **Packers sample** nạp fixture này qua `/sample-packers.json`; không đổi các samples cũ. Xem [contract](../docs/well-schematic/completion-packers.md) và [visual evidence](../docs/well-schematic/evidence/completion-packers/README.md). State và dimensions chỉ là dữ liệu minh họa, không operating design.
