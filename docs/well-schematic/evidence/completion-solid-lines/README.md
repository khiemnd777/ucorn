# Completion Components — solid strokes

Ngày 2026-10-04; yêu cầu người dùng: completion components dùng line thay dashed line. Fixture [completion packers](../../../../sample-data/well-completion-packers.json), IAB Chromium/macOS, Arial/sans-serif.

| Evidence | Quan sát |
| --- | --- |
| [Completion detail](completion-detail.jpg), [export render](export.jpg), [SVG](completion.svg) | Tubing body/riser, Tubing Hanger, 4 packers, crosses và label leaders đều nét liền |
| [Unresolved SVG](unresolved.svg), [render](unresolved.jpg) | Unknown host ID giữ outline nét liền, clearance unresolved và diagnostic text; không fill/cross giả seal contact |
| [Desktop](desktop.jpg) | 1440×1000, SVG mới render qua shared API/UI |
| [Mobile](mobile.jpg) | 390×844, preview width 328 px, page width 390 px; viewport reset sau QA |

XML kiểm main và unresolved: đủ 6 completion groups, không có stroke-dasharray. Geometry/fill/leader positions của 6 groups trong main SVG giống artifact Phase 2 trước; metadata planned/unverified, set/unset/unknown giữ nguyên. Evidence Phase 1/2 trước đây có dashed lines được giữ như lịch sử, không là current line-style baseline.

`bun run test` PASS 115 tests / 674 assertions; `bun run build`, `tsc --noEmit` PASS. Assertions hiện có bổ sung kiểm absence of dashed strokes và giữ unresolved/setting text. Docs validator và whitespace check PASS. Đây là local visual review, chưa operator UAT hoặc real-device verification.
