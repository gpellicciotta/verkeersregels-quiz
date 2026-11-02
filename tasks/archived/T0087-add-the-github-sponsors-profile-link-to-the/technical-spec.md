# T0087: Technical Specifications

- Sponsors URL: `https://github.com/sponsors/gpellicciotta` (verified HTTP 200 on 2026-10-27).
- **[Decided]** Place the GitHub Sponsors link first in `.about-support-actions`, before Ko-fi, Stripe, and PayPal.
  GitHub Sponsors charges no fees for individual sponsors, so it yields the highest net amount.
- Link markup mirrors existing links: `id="about-support-github"`, `target="_blank"`, `rel="noopener noreferrer"`.
- Icon: reuse the existing `github` entry in `js/icons.js`.
- New i18n key `about.support_github` in all five string files:
  - nl: `Steun via GitHub Sponsors`
  - en: `Support via GitHub Sponsors`
  - fr: `Soutenir via GitHub Sponsors`
  - de: `Unterstützen via GitHub Sponsors`
  - it: `Sostieni tramite GitHub Sponsors`
- Repository funding file `.github/FUNDING.yml` lists `github: [gpellicciotta]`, `ko_fi: gpellicciotta`,
  and `custom` entries for the Stripe and PayPal links.
- Combined task: the funding file and About link expose the same profile and are each a few lines.
- Size estimate: 13 files, 40 lines.
- Size note: localization and changelog fan-out across five languages exceeds 8 files; total lines stay small.
- Mechanical command: `python scripts/generate-sw.py generate` (refreshes the `sw.js` precache version hash).
- Completion check: `python -m pytest tests -q` passes, plus a visual check of the About view.

### Declared Files
- `index.html`
- `data/strings.nl.json`
- `data/strings.en.json`
- `data/strings.fr.json`
- `data/strings.de.json`
- `data/strings.it.json`
- `tests/test_about_view.py`
- `.github/FUNDING.yml`
- `docs/specs/sponsorship-and-donations.md`
- `docs/requirements.md`
- `CHANGELOG.md`
- `CHANGELOG.en.md`
- `CHANGELOG.fr.md`
- `CHANGELOG.de.md`
- `CHANGELOG.it.md`

### Tests
- Unit: `test_screen_about_markup_and_content` asserts `id="about-support-github"` and the Sponsors URL.
- Unit: same test asserts the GitHub link precedes the Ko-fi link.
- Unit: new test asserts every `data/strings.*.json` defines a non-empty `about.support_github`.
- Unit: new test asserts `.github/FUNDING.yml` lists `gpellicciotta` under `github`.
- Integration: open `?view=about` in a browser; the card shows four links with GitHub Sponsors first,
  the GitHub icon renders, labels translate under `?lang=fr`, and the link opens the Sponsors page.
