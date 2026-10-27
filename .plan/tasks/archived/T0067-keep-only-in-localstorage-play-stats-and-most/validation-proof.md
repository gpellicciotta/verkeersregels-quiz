### Changes Made
- `js/stats.js`: new module — see Execution Log for the full API.
- `js/quiz.js`: `showResult()` now records the finished round into local stats.
- `tests/stats.test.cjs`, `tests/test_stats.py`: new automated coverage (see above).
- `docs/requirements.md`, `CHANGELOG.md` (+ `de`/`en`/`fr`/`it` translations): documented.

### Automated Checks
- `node --test tests/stats.test.cjs`: 3/3 passed.
- `python -m pytest -q`: 132 passed, 8 subtests passed.

### Manual/Visual Validation
Not applicable: this task adds no new UI surface, only a localStorage data layer consumed
internally after each round. Behavior was validated through the automated Node fixtures
above (accumulation, corrupt-storage recovery, and reset against a fake `localStorage`).

### Review Tier
Solo AI agent, pre-authorized autonomous-loop integration: implementation, tests, and
documentation all passed, so this task integrates directly per the coordination protocol.
