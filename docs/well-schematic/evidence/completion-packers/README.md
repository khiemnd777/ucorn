# Completion packers — local evidence

Line-style trong evidence này thuộc revision ban đầu. [Solid line revision](../completion-solid-lines/README.md) là style hiện tại theo yêu cầu tiếp theo; geometry và state semantics giữ nguyên.

Ngày 2026-10-04; [fixture](../../../../sample-data/well-completion-packers.json), completion v2/Phase 2, Arial/sans-serif, Codex IAB Chromium/macOS. Desktop viewport 1440×1000; mobile 390×844. Full-page screenshots có thể cao hơn viewport; override đã reset.

| Evidence | Quan sát |
| --- | --- |
| [Desktop](desktop.jpg), [detail](packers-detail.jpg) | Đủ production, liner-top, isolation, test; labels role/MD/refs/state riêng, lumen mở |
| [Mobile fit](mobile.jpg) | Preview 328 px, page 390 px; toolbar wraps và editor/preview xếp dọc |
| [Mobile actual size](mobile-actual-size.jpg) | SVG 950 px trong preview scroll; page vẫn 390 px |
| [Missing host](missing-host.jpg), [recovery](recovery.jpg) | UI báo `components[15].outerHostId`, download disabled khi lỗi; nạp sample phục hồi successful generation |
| [Long label](long-label.jpg) | `<A&B>` hiển thị là text và wrap; actual-size scroll có thể chỉ hiển thị một phần SVG; unit test kiểm label bounds toàn canvas |
| [SVG export](packers.svg), [export render](export.jpg) | Standalone finite geometry, 4 component groups / 8 blocks, role/host/MD attributes |
| [Unresolved SVG](packers-unresolved.svg), [render](unresolved.jpg) | Xóa C04 boreDiameter: production và liner-top chuyển dashed outline, ghi clearance unresolved; không fill/cross thành seal contact |
| [Monochrome SVG](packers-monochrome.svg), [render](monochrome.jpg) | QA artifact chuyển màu blue context sang gray; set crossed blocks, unknown/unset outlines và text còn phân biệt được |

Fixture: production 2400–2440 m (T01/C04), liner-top 2800–2820 m (L01/C04), isolation 3200–3240 m và test 3600–3620 m (T01/L01). Metadata planned/unverified; set states là dữ liệu minh họa, không phải thiết kế vận hành.

Gates: `bun run test` PASS 115 tests / 672 assertions, `bun run build` và `tsc --noEmit` PASS. Tests kiểm interval endpoints/overlap, taper rejection, units, invalid refs/lifecycle, missing bore, explicit annulus/open lumen, adjacent tiny tools, immutability/reorder, escaped labels và real HTTP Bun/Express/UI. Một regression hanger cũ FAIL khi checkout còn renderer casing hanger legacy; đã đồng bộ profile 45° theo quyết định trước và full suite PASS, không giảm assertion.

Local visual review không thay operator UAT, real device hoặc engineering approval. Không kiểm packer running OD/rating/actual hydraulic seal; openhole/setting-method/manufacturer profiles chưa hỗ trợ. Chưa xác minh nút browser Download lưu file; artifact SVG tạo qua shared handler. Không commit/push/deploy.
