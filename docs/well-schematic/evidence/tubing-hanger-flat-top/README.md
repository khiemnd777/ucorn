# Tubing Hanger — flat upper face

Ngày 2026-10-04; [fixture tổng hợp](../../../../sample-data/well-tubing-hanger.json), IAB Chromium/macOS, Arial/sans-serif. Người dùng đã chấp nhận phần dưới của [stacked revision](../tubing-hanger-stacked/README.md), yêu cầu sửa phần trên thành mép ngang và hai cạnh đứng.

| Evidence | Quan sát |
| --- | --- |
| [Wellhead detail](wellhead-detail.jpg) | Hai phía trên phẳng ngang miệng wellhead; hai cạnh đứng nối tới phần dưới, cạnh dưới nghiêng 45° giữ nguyên |
| [SVG export](tubing-hanger.svg), [export render](export.jpg) | Polygon Tubing Hanger 6 điểm; casing hangers giữ hình cũ |
| [Desktop](desktop.jpg) | Viewport 1440×1000, preview hiển thị glyph mới |
| [Mobile fit](mobile.jpg) | Viewport 390×844; preview 328 px, document 390 px |

XML comparison với artifact stacked trước PASS: 5 điểm phần dưới của cả hai Tubing Hanger giống hệt, tất cả casing hanger paths giống hệt. Mép trên chạy ngang từ outer bore tới tubing OD; outer bore vẫn cao 10 px. Cạnh trong giờ đứng từ mouth tới đáy, không còn cạnh nghiêng trên. Named seat, support graph, tubing 0–4000 m MD và layering giữ nguyên.

`bun run test` PASS 77 tests / 501 assertions; `bun run build`, `tsc --noEmit` PASS. Regression cập nhật cho upper face mới và giữ kiểm tra lower ramp 45°/unchanged lower profile. Viewport reset sau QA. Local review, chưa operator UAT hoặc mobile device thật.
