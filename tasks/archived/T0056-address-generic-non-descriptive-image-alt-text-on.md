---
id: T0056
owner: "@gemini"
needs: []
branch: task/T0056-address-generic-non-descriptive-image-alt-text-on
worktree: ./work/T0056-address-generic-non-descriptive-image-alt-text-on
status: completed
started: 2026-09-22
ended: 2026-09-22
---
# T0056: Address Generic Image Alt Text on Sign Recognition Questions

## Goals
Replace generic image alt text across quiz questions, answer options, and carousel cards with descriptive sign identifiers.
Enable screen reader users to access sign codes without relying on visual recognition.
Ensure full localization support in Dutch and English for all dynamic image alt strings.

## Task Execution Steps
- [x] **[Read]**      Reviewed accessibility audit findings, quiz rendering logic, and image alt text requirements.
- [x] **[Implement]** Added getSignCode utility and descriptive alt text templates for quiz and carousel images.
- [x] **[Verify]**    Added automated regression tests and verified that all 84 test suite checks pass cleanly.
- [x] **[Doc]**       Documented changes in the changelog and updated task status.

## Execution Log
- [2026-09-22] **[Decided]**
  Claimed task T0056 to provide descriptive sign alt text for question and option images.

- [2026-09-22] **[Implement]**
  Added `getSignCode` helper in `js/utils.js` and updated alt rendering in `js/quiz.js` and `js/carousel.js`.
  - Added localized template strings for sign alt codes across Dutch and English dictionaries.
  - Formatted identify question option images as `Optie {n}: Verkeersbord {code}`.
  - Enhanced results table question and option image alt attributes with sign codes.

- [2026-09-22] **[Verify]**
  Created `tests/test_image_alt_accessibility.py` and validated full 84-test suite pass.

- [2026-09-22] **[Doc]**
  Recorded changelog bullet in `CHANGELOG.md` under active development version `v3.1.1-pre`.

- [2026-09-22] **[Complete]**
  Completed descriptive image alt text implementation for sign recognition questions and carousel.
