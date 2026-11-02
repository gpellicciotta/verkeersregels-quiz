### Changes Made

- `js/app.js`: added `getNameParam()` supporting `name`, `naam`, and `n` query parameters. Updated `setStartMode(mode)` to hide `#quiz-start-fields` when a name parameter is present. Updated `startQuiz()` and `restart()` to initialize `state.playerName` from `getNameParam()`. Exported `getNameParam` on `window` and invoked `setStartMode` at bootstrap.
- `CHANGELOG.md`: added `## v3.1.1-pre` entry for name query parameter support.
- `sw.js`: regenerated service worker asset precache for version `v3.1.1-pre`.
- `tests/test_name_query_param.py`: added automated unit tests for `getNameParam` alias resolution, input field toggling, and quiz start execution.

### Visual Validation

- [T0043-view-before.png](T0043-view-before.png): baseline start screen with name input field shown.
- [T0043-view-after.png](T0043-view-after.png): start screen with `?name=Giovanni`, hiding input field and centering Start quiz button.
- [T0043-view-alias-n.png](T0043-view-alias-n.png): start screen with `?n=Giovanni` demonstrating `n` alias.
- [T0043-view-alias-naam.png](T0043-view-alias-naam.png): start screen with `?naam=Giovanni` demonstrating `naam` alias.
- [T0043-view-result.png](T0043-view-result.png): quiz result screen displaying `"Giovanni, je scoorde 20/20 (100%) in 1 sec."`.

### Verification Results

- `python -m unittest discover -s tests -v`: 41 of 41 tests passed.
