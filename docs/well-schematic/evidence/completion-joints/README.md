# Completion Coupling / Pup Joint — local evidence 2026-10-04

Requested implementation của hai components; [contract](../../completion-joints.md), [status tracker](../../completion-phase-1-plan.md). Synthetic/planned/unverified fixture, không equipment specification. Trạng thái **selected / implemented / VERIFIED_LOCAL** trong bounded scope.

## Artifacts và browser review

- [Completion SVG](completion.svg): 1090×1807 px, CPL-01 anchor 2000 m, PJ-01 2000–2006 m; tubing total 4000 m. [Full export](export.jpg), [detail](detail.jpg) đọc được main label + schematic detail của cả hai. Detail not MD scale; không cộng chiều dài glyph vào tubing.
- [Desktop editor 1440×1000](desktop.jpg); [mobile Fit 390×844](mobile.jpg), [mobile Actual size](mobile-actual.jpg). Toolbar/sample button dùng được; Actual size giữ scroll trong preview theo UI hiện có. Fit co theo chiều rộng, desktop SVG cao cần scroll; không claim toàn bộ bản vẽ luôn visible ban đầu.
- [Unknown SVG](unknown.svg), [browser render](unknown.jpg): body ID/one connection thiếu, Pup ID/one connection thiếu, C04 bore thiếu. Labels ghi unknown/unresolved, không tạo body ID/Pup ID giả. Known pipe ID stubs vẫn có thể hiện khi coupling body ID unknown.
- [Long labels SVG](long-labels.svg), [browser render](long-labels.jpg): mỗi new label là 200 `W`, viewport 1090×2011 px. Hard-wrap token, không đụng detail lane hoặc cắt SVG. Escaping/special characters kiểm bằng test.
- [Clearance error](error.jpg): Coupling OD đổi thành 9.125 in, bằng C04 bore → lỗi `components[20].od`, Download disabled. [Recovery](recovery.jpg): nạp lại valid sample → success, Download enabled.

Browser review dùng IAB/macOS local server port 3002 và cùng handler; không production. Nút Download enabled/disabled đã kiểm, artifact SVG xuất trực tiếp qua handler; chưa xác minh lưu file bằng nút Download trong IAB.

## Checks thực tế

| Gate | Kết quả |
| --- | --- |
| `bun run test` | PASS 197 tests, 999 assertions, 9 files; new joint suite 53 tests / 171 assertions, HTTP transport/sample/error integration |
| `bun run build` | PASS |
| `bunx tsc --noEmit` | PASS |
| `python3 docs/well-schematic/validate_docs.py .` | PASS 6 skills / 64 cards / sources / links |
| XML, strokes và extents | Ba exported variants parse được; new groups có IDs/refs, solid strokes, finite coordinates trong viewport; physical/detail tách rõ |
| Baseline preservation | Tubing/hanger, full packers, Crossover completion fragments byte-identical 3/3; bỏ cement legacy random context |
| Whitespace | Tracked diff và text files trong joint slice không trailing whitespace/conflict markers |

Tests gồm invalid refs/direction/MD/units/quantities, duplicate ownership/junction, body OD fit ở cả hai host sides, known/unknown IDs/profiles, lifecycle/evidence, Coupling/Crossover exclusivity, packer conflict/nearby glyphs, short Pup + hai connectors, all-Pup tubing string, normalization, length once, input immutability và escaped labels. Main Pup không áp min-height; separate detail cho đọc symbol.

Giới hạn: ordinary external same-OD tubing Coupling trong casing/liner; body physical length unknown; supplied thread texts không xác minh compatibility; chưa operator UAT, manufacturer assembly verification, production hoặc deploy. Không commit/push/deploy.
