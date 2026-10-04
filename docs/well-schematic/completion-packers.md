# Completion packers — Phase 2 contract và tiến độ

Ngày 2026-10-04. Người dùng yêu cầu tiếp tục các packers sau Tubing/Tubing Hanger; chọn bốn cards trong completion catalog. Slice additive dùng `CompletionPacker` trong envelope `schemaVersion: 2`, không đổi nghĩa `Packer` legacy. Trạng thái cả bốn cards: **đã chọn, implemented, VERIFIED_LOCAL** trong capability bounded bên dưới. Gates và visual review đã hoàn tất local.

| Card / role | Quan hệ được hỗ trợ |
| --- | --- |
| production-packer / `production` | Tubing → casing hoặc liner; annulus của tubing host đã khai báo |
| liner-top-packer / `liner-top` | Liner → parent casing; top bằng liner top và toàn interval trong overlap |
| isolation-packer / `isolation` | Tubing → casing hoặc liner, role isolation theo input; không suy vùng reservoir hay hiệu quả barrier |
| test-packer / `test` | Tubing → casing hoặc liner, role test theo input; không mặc định permanent hoặc suy quy trình test |

## Wire fields và invariants

Kế thừa [v2 envelope/units/metadata](completion-v2-contract.md): cùng wellbore/snapshot, MD/datum explicit, quantities m/ft và in/mm; `id`, `label?`, `lifecycle`, `verification`, `sources`. Fields mới: `type: "CompletionPacker"`, `role`, `innerConduitId`, `outerHostId`, `top`, `bottom`, `setState: "set" | "unset" | "unknown"`, `retrievable?: boolean`. Không có default trạng thái set hay retrievable. `installed` không chứng minh `set` hoặc seal verified. Removed snapshot chưa hỗ trợ.

Top/bottom là khoảng tool do người nhập khai báo; bottom > top ≥ 0, nằm trọn trong cả hai hosts. Terminal bottom tại host bottom được phép; lookup tại joint dùng interval `[top,bottom)`. Uniform inner OD và uniform outer bore/display envelope trong interval; crossing taper bị từ chối thay vì tự chọn đường kính một phía. Các packers cùng inner/outer annulus không được overlap, adjacent endpoints được phép. IDs ổn định/trùng bị từ chối; reorder components không đổi layout.

Production/isolation/test bắt buộc inner là tubing duy nhất, outer khớp tubing host spans suốt interval. Installed tubing packer cần installed tubing. Liner-top bắt buộc inner có pipeType Production Liner hoặc Drilling Liner và outer là casing khác; anchor bằng liner top. Legacy casing context không có lifecycle được chuẩn hóa riêng, nên không suy trạng thái liner installed.

Outer host boreDiameter nếu có phải lớn hơn inner OD ở mọi section chạm interval. Đây là kiểm clearance giữa conduits, không kiểm packer running OD, seal envelope, rating hoặc manufacturer compatibility. Thiếu host ID: `PACKER_FIT_UNRESOLVED`, render solid outline bằng legacy display envelope và ghi unresolved; không fill/cross như seal contact đã biết. Payload ngoài capability: openhole packer, dual tubing, seal-bore/PBR, ports/slips/setting method, rated tool profile và unknown fields bị từ chối. Không nhận manufacturer profile hoặc arbitrary SVG.

`Packer` legacy giữ generic casing-based path cho payload cũ. Không tự migrate hoặc đổi refCasingID thành tubingId. Có `CompletionPacker` thì không được trộn với legacy `Packer` trong snapshot (`AMBIGUOUS_PACKER_FORMAT`); người nhập phải khai báo lại các packer bằng contract mới.

## Layout/SVG và acceptance

Pure domain → validated endpoint graph → pure layout → SVG adapter. Paired blocks ngoài inner OD, tới explicit outer ID khi biết; lumen luôn mở. Tất cả components và label leaders dùng nét liền theo yêu cầu người dùng. Set dùng crossed blocks; unset/unknown dùng outline và ghi rõ trạng thái bằng chữ. Lifecycle planned và unresolved fit giữ labels/diagnostics riêng, không dùng dashed lines. Giữ physical interval midpoint; glyph min 8 px khi đủ khoảng trống là display convention và không tăng MD length; các tools sát nhau trong cùng annulus dùng actual interval height để không vẽ chồng. Labels trace ID/role, hai refs, interval/unit/datum, set/lifecycle/verification, retrievability và clearance; label lane riêng với leader, text escaped. Không suy support hoặc hydraulic seal integrity.

Acceptance: fixtures đủ bốn roles và ba set states; valid/invalid units/refs/lifecycle/fit/overlap/liner anchors, exact host endpoints, taper crossing, unknown bore, immutable/reordered inputs, SVG annular bounds/open lumen/finite geometry và HTTP 400 paths trên Bun root/hole, Express và UI. UI thêm Packers sample qua allowlist; sample legacy/tubing giữ nguyên. Visual desktop/mobile, unknown/set/unset, export và errors được review; gates test/build/typecheck/docs PASS trước cập nhật VERIFIED_LOCAL.

## Nguồn và giới hạn

Đối chiếu 2026-10-04: [SLB packer](https://glossary.slb.com/en/terms/p/packer) và [production packer](https://glossary.slb.com/en/terms/p/production_packer) cho annular isolation/classification; [Halliburton MatchSet](https://www.halliburton.com/en/products/matchset-hydraulic-set-liner-hanger-with-integral-liner-top-packer) xác nhận chức năng liner-top annular seal giữa liner top và parent casing. Không dùng thông số model này làm default, không khẳng định mọi variant đồng nhất. Role isolation/test dùng family meaning + dữ liệu khai báo; suitability chi tiết cần source riêng. Ký hiệu UCORN không phải manufacturer/API/ISO symbol. Đây là schematic input/output local, không workflow vận hành hoặc phê duyệt kỹ thuật.

## Evidence

- [Fixture runnable](../../sample-data/well-completion-packers.json), [unit/graph/SVG tests](../../tests/packers.test.ts), [real HTTP transports](../../tests/completion-http.test.ts), [visual/export record](evidence/completion-packers/README.md).
- `bun run test`: PASS 115 tests / 672 assertions, 7 files. `bun run build` và `tsc --noEmit`: PASS. Docs validator: PASS 6 skills / 64 cards; catalog Markdown/JSON implemented status đồng bộ.
- XML + finite annular bounds kiểm cả main/unresolved/monochrome SVG PASS; main viewBox 950×1101. Desktop/mobile local browser QA PASS; chưa real device, operator UAT, Node process riêng hoặc Download save-to-file.
- Preexisting regression casing hanger legacy không khớp contract 45° từ lượt trước được đồng bộ lại qua shared profile; full suite cuối PASS. Không gọi runtime này production-ready hoặc technical barrier approval.
- [Selection/status tracker](completion-phase-1-plan.md) ghi cả Phase 1 và Phase 2. Không commit/push/deploy.

Line-style revision 2026-10-04: components, seal crosses và leaders chuyển sang nét liền; geometry, intervals, lifecycle/set-state/fit semantics không đổi. Xem [evidence mới](evidence/completion-solid-lines/README.md).
