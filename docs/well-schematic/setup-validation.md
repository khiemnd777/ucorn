# Setup và validation record

Ngày 2026-10-04. Clone mới tại `/Users/khiemnguyen/Works/ucorn`; branch `master`, remote `https://github.com/khiemnd777/ucorn`, HEAD `059473a3607bad28ea5b34f2251ef3b09eb338f9`. Clone dùng Git authentication sẵn có; không ghi/đọc token vào tài liệu. Kiểm tra đích chưa tồn tại trước clone; không ghi đè repository cũ.

Project Codex: chưa thêm được. `list_projects` chưa có đường dẫn ucorn; công cụ computer-use từ chối app `com.openai.codex` vì safety restriction. Không có supported add-project API trong tools hiện có. Không sửa database/preferences nội bộ để lách restriction. Người dùng cần Add project và chọn thư mục đã clone trong giao diện app; sau đó có thể xác minh bằng project list.

Model: nhiệm vụ được giao với yêu cầu `gpt-6.1-sol`, reasoning `high`; phiên executor không có công cụ đọc effective model setting nên không xác minh độc lập cấu hình thực tế. Không thay model toàn cục. Khi mở task trong project, chọn GPT-6.1 Sol và High trong task composer nếu chưa đúng.

Deliverables: AGENTS.md, 6 project skills (mỗi skill có SKILL.md + agents/openai.yaml), domain index, glossary, source audit, common contract, catalog Markdown/JSON, geometry/layout, fixture/QA matrix, source register Markdown/JSON, docs validator và record này. Catalog là baseline family/variant, không runtime API và không certification.

Validation: chạy `python3 docs/well-schematic/validate_docs.py .` để kiểm cấu trúc skills, JSON/schema card, source IDs và links nội bộ; chạy `quick_validate.py` từ skill-creator cho từng skill khi có dependency PyYAML. Xem kết quả cuối trong handoff. PyYAML phục vụ validator được cài tạm `/tmp/ucorn-docs-validation-deps`, không thêm dependency vào package.json. Các sources `verified-definition` đã đọc trực tiếp qua web; unavailable candidates và variant chưa xác minh được ghi riêng. Không xác minh HTTP lại bằng docs validator.

Kết quả trước khi copy: docs validator PASS cho 6 skills, 64 component cards, source IDs và links nội bộ; skill-creator quick_validate PASS cho cả 6 skills; UI metadata parse bằng PyYAML PASS. 30 nguồn ở mức verified-definition, 3 candidate URLs unavailable, 1 local convention. Kiểm tra thủ công phân biệt generic/type-only/proposed và runtime status; chưa forward-test skills bằng một task runtime thực tế.

Không chạy build/server/runtime visual suite vì change chỉ docs/instructions, repo chưa cài node_modules và runtime checks không cần để xác minh tài liệu. Không gọi API trả phí, commit/push/deploy. Kiểm git diff để xác nhận chỉ files mới được thêm; không stage thay đổi.
