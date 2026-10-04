# Completion Phase 1 — local visual evidence

Evidence này giữ lại kết quả implementation đầu. Hình Tubing Hanger trong các ảnh bên dưới đã được thay bằng [geometry revision tại miệng wellhead](../tubing-hanger-mouth/README.md) theo yêu cầu tiếp theo của người dùng; dùng evidence mới để đối chiếu hình hanger hiện tại.

Ngày 2026-10-04; fixture [well-tubing-hanger.json](../../../../sample-data/well-tubing-hanger.json), renderer completion v2, font Arial/sans-serif, Codex IAB Chromium trên macOS. Desktop viewport 1440×1000; mobile viewport override 390×844. Screenshots full-page có thể cao hơn viewport. Viewport override đã reset sau QA.

| Evidence | Kết quả quan sát |
| --- | --- |
| [Desktop](desktop.jpg) | Hai component có labels/host/support riêng, lumen mở và taper tại liner top |
| [Mobile fit](mobile.jpg) | Editor/preview xếp dọc; document width 390 px, không overflow ngang page; fit preview phục vụ overview |
| [Mobile actual-size](mobile-actual-size.jpg) | SVG intrinsic width 950 px, scroll giữ trong preview; document vẫn 390 px; labels đọc ở kích thước gốc |
| [Missing seat](missing-seat.jpg) | UI báo đúng path `components[15].seatId`; generation failed, download disabled; sửa JSON rồi generate phục hồi thành công |
| [Long label / injection](long-label-injection.jpg) | Text `<A&B>` hiển thị như text, wrap nhãn tách khỏi hanger; purpose injection giữ nguyên. Actual-size screenshot chỉ thấy phần SVG trong scroll viewport |
| [Export SVG](tubing-hanger.svg), [export render](export.jpg) | SVG tự chứa, finite geometry, tubing terminal mở, labels và notes nằm trong canvas; chưa kiểm thao tác browser Download lưu file |
| [Monochrome](monochrome.jpg) | Browser render bản SVG với grayscale filter; boundaries, planned dashes và support blocks còn phân biệt được |

Đây là visual review local với dữ liệu tổng hợp; chưa kiểm thiết bị di động thật, operator UAT, production hoặc equipment fit/profile/barrier approval. Legacy cement pattern random; screenshots là evidence review, chưa là deterministic pixel-regression baseline.
