# Tubing Hanger — stacked 45 degree profile

Evidence lịch sử: [flat upper face revision](../tubing-hanger-flat-top/README.md) thay riêng phần trên theo yêu cầu tiếp theo; phần dưới trong evidence này vẫn được giữ nguyên.

Ngày 2026-10-04; [fixture tổng hợp](../../../../sample-data/well-tubing-hanger.json), IAB Chromium/macOS, Arial/sans-serif. Thay [mouth revision trước](../tubing-hanger-mouth/README.md) theo yêu cầu người dùng: Tubing Hanger xếp chồng trên casing hanger; left/right bore height bằng casing hanger, cạnh nghiêng 45°.

| Evidence | Quan sát |
| --- | --- |
| [Wellhead detail](wellhead-detail.jpg) | Tubing Hanger màu xám nét đứt trên casing hangers màu xanh; profile dạng băng, bore đứng bằng nhau, hai cạnh nghiêng song song 45° |
| [Desktop](desktop.jpg) | 1440×1000, actual-size preview; tubing lumen mở và nối liên tục qua head detail |
| [Mobile fit](mobile.jpg) | 390×844, preview width 328 px, document width 390 px |
| [Mobile actual size](mobile-actual-size.jpg) | SVG intrinsic width 950 px, scroll giữ trong preview; document width 390 px |
| [SVG](tubing-hanger.svg), [export render](export.jpg) | Standalone SVG dùng chung hanger profile cho cả casing và tubing |

[Profile chung](../../../../src/geometry/hanger-profile.ts) có 8 điểm và hai bore đứng đều cao 10 px. Độ hạ ramp = khoảng chạy ngang sau khi trừ hai gờ (mỗi gờ = 1/6 width), nên góc chính xác 45°. Total glyph height có thêm độ hạ ramp. Outer x inset 1 px vào mouth; tubing slot 0, casing slots bắt đầu 1 với pitch 12 px. SVG tubing hanger vẽ sau casing hanger. Đây là display convention UCORN, không phải equipment dimensions.

Regression kiểm cả paths SVG casing/tubing thật, bores 10 px, hai ramp 45°, vị trí stacked và draw order; kiểm widths nhỏ/lớn và hai phía. `bun run test` PASS 77 tests / 503 assertions; `bun run build` và `tsc --noEmit` PASS. Viewport reset sau QA. Tubing vẫn 0–4000 m MD; named seat/support graph không đổi. Chưa kiểm mobile device thật hoặc operator UAT.
