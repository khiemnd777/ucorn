# Well schematic domain — UCORN

Bộ tài liệu tiếng Việt, giữ thuật ngữ English để đối chiếu nguồn và code. Mục tiêu là bản vẽ mặt cắt cấu trúc giếng từ drilling, completion, production đến abandonment. Catalog là baseline có giới hạn, không bao phủ mọi thiết bị dầu khí. Các proposed fields, ký hiệu và fixtures là hợp đồng thiết kế cho công việc tiếp theo; đợt này không sửa runtime.

## Mục lục

1. [Phạm vi, glossary và vòng đời](glossary.md)
2. [Source audit: hiện có và khoảng trống](source-audit.md)
3. [Hợp đồng dữ liệu, units, depth và attachment](data-contract.md)
4. [Component catalog theo nhóm](component-catalog.md)
5. [Hình học, layers, symbols và labels](geometry-layout.md)
6. [Fixtures và QA](qa-fixtures.md)
7. [Nguồn kỹ thuật và mức xác minh](sources.md)
8. [Thiết lập project và validation record](setup-validation.md)
9. [Agent](../../AGENTS.md) và [6 skills](../../.agents/skills/well-schematic-domain/SKILL.md)
10. [Completion Phase 1: kế hoạch và trạng thái component](completion-phase-1-plan.md) — đã chọn và triển khai Tubing String, Tubing Hanger trong phạm vi Phase 1.
11. [Completion v2 runtime contract](completion-v2-contract.md) — version, fields, units, host/seat và giới hạn hiện có.
12. [Completion packers Phase 2](completion-packers.md) — bốn roles, explicit annulus endpoints, set states, validation và evidence.
13. [Completion crossover Phase 3](completion-crossover.md) — explicit tubing segment endpoints, MD point junction, connection texts và bounded symbol.

14. [Completion Coupling / Pup Joint Phase 4](completion-joints.md) — explicit coupling body và owned physical tubing segment, validation và evidence.

15. [Seal interfaces / Landing Nipple Phase 5](completion-seals.md) — explicit receptacle/assembly graph, nipple segment ownership and unknown profiles.

## Cách dùng

Đọc audit trước khi cam kết hỗ trợ component. Chọn một nhóm catalog; mọi card kế thừa common contract, nhưng có field, quan hệ và edge case riêng. Ký hiệu/layer là convention UCORN được đề xuất, không phải chuẩn ngành được chứng nhận. Các thông số sizing, loads, pressure rating, khoảng cách barrier và quy trình thi công phải có dữ liệu/chuyên gia riêng; tài liệu này không cung cấp giá trị mặc định kỹ thuật.

`python3 docs/well-schematic/validate_docs.py .` kiểm tra cấu trúc skills, đường dẫn/link nội bộ, nguồn và độ đầy đủ catalog. Nó không kiểm tra an toàn giếng, chất lượng runtime hoặc xác minh lại URL bên ngoài.
