# Tubing Hanger — wellhead mouth geometry revision

Evidence lịch sử: hình này đã được thay bằng [stacked profile 45°](../tubing-hanger-stacked/README.md) theo yêu cầu tiếp theo. Các thông số và gates dưới đây thuộc revision cũ.

Ngày 2026-10-04; [fixture tổng hợp](../../../../sample-data/well-tubing-hanger.json), Codex IAB Chromium/macOS, Arial/sans-serif. Yêu cầu xác nhận: Tubing Hanger ngang miệng wellhead, trên casing hangers; thứ tự ngang là left wellhead bore → left hanger → tubing → right hanger → right wellhead bore. Hai phần đối xứng có mép trên phẳng, cạnh ngoài đứng ngắn rồi nghiêng vào đáy, cạnh trong thẳng đứng.

| Evidence | Quan sát |
| --- | --- |
| [Wellhead detail](wellhead-detail.jpg) | Hai polygon ở miệng head, trên các casing hangers màu xanh; đáy thu hẹp, tubing lumen mở |
| [Desktop](desktop.jpg) | Viewport 1440×1000; actual-size preview, nối tubing từ mouth tới body liên tục |
| [Mobile fit](mobile.jpg) | Viewport 390×844; preview width 328 px; document width 390 px, không overflow page |
| [Mobile actual size](mobile-actual-size.jpg) | SVG width 950 px; scroll trong preview, document width vẫn 390 px |
| [SVG export](tubing-hanger.svg), [export render](export.jpg) | Mouth bounds dùng từ wellhead renderer; SVG standalone có glyph mới và notes về enlarged head/riser |

Fixture: local mouth y = −52 px, đáy hanger = −42 px, first casing-hanger slot bắt đầu −40 px; tọa độ trong drawing group có padding 100 px. Chiều cao glyph 10 px và riser là detail hiển thị; dữ liệu tubing vẫn 0–4000 m MD. Đây là quy ước UCORN, không phải manufacturer profile hoặc technical approval.

Gates: `bun run test` PASS 75 tests / 413 assertions; `bun run build` và `tsc --noEmit` PASS. Regression kiểm miệng head, symmetry, bottom narrowing, clearance trên casing slots, đổi frame và MD length không đổi. Viewport override reset sau QA. Chưa kiểm thiết bị di động thật hoặc operator UAT.
