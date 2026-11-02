### Resolved Issues

All issues identified against the consolidated Wegcode in data/law have been resolved:

- `rule-snelheid-bebouwd`: restricted question scope to Flanders (50 km/u, art. 11.1); noted Brussels default of 30 km/u in explanation.
- `rule-snelheid-buiten-vl`: corrected explanation: Brussels uses 70 km/u (art. 11.2); only Wallonia uses 90 km/u.
- `rule-gsm`: corrected distractor to remove requirement of turned-off engine; cited article 8.4 and article 2.22/2.23 definitions.
- `rule-mistlichten`: updated question to mandatory use ("moeten verplicht branden") under article 30.1.2°.
- `iden-c31`: renamed `assets/signs/C31.svg` to `C31a.svg` matching Wegcode art. 68.3; updated question to left turn prohibition.
- `iden-d10`: renamed `assets/signs/D9a.svg` to `D9.svg` matching official Wegcode art. 69.3 designation; updated references.
- Cited exact Wegcode articles across all 23 rule explanations.

### Visual Validation

Visual checks confirmed that the running quiz renders all questions, options, and signs correctly:

- Local server returned HTTP 200 for all assets, signs, scripts, and JSON data.
- Baseline view captured in [T0002-view-before.png](T0002-view-before.png).
- Verified view after changes captured in [T0002-view-after.png](T0002-view-after.png).

![Baseline Quiz View](T0002-view-before.png)

![Updated Quiz View](T0002-view-after.png)

### Automated Checks

All automated checks and linters passed:

- `check_questions.py`: confirmed all 54 questions have 4 distinct options and valid sign asset paths.
- `lint-markdown.py`: passed for `data/SOURCES.md` and `tasks/T0002-review-all-questions-and-answers.md`.
- `lint-taskfile.py`: passed for `tasks/T0002-review-all-questions-and-answers.md`.
