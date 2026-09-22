# Installed App Update Failures

## Cause
Registration attached a window load listener after awaiting a language dictionary fetch.
If the load event had already fired, registration and all update listeners remained inactive.
The browser reproduction delayed the dictionary response and observed zero registrations while the quiz rendered successfully.

Additional delays came from hourly polling and ordinary HTTP cache reuse during precaching.
The generator also produced identical worker bytes for changed assets when their paths and release version stayed unchanged.
Existing static tests checked for API names without executing the lifecycle, so they missed the startup race.

## Resolution
- Register before language loading without depending on the load event.
- Check every visible minute and on startup, reconnection, focus, page restoration, and visibility restoration.
- Bypass HTTP caches for worker checks and installation downloads.
- Fingerprint asset contents and generator code in each generated cache name.
- Activate after successful precaching and reload controlled clients once, preserving stored preferences.
- Preserve unrelated caches and restrict reads to the active release cache.

Automatic reloads restart an active quiz.
Offline or suspended clients update after reconnecting or resuming; deployment propagation and browser scheduling still apply.
Existing installations must discover this fix through their previous update mechanism, potentially requiring a close and reopen.

Browser cache behavior follows the documented [registration cache options](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register)
and [request cache modes](https://developer.mozilla.org/en-US/docs/Web/API/Request/cache).

## Verification
The standard Python suite invokes the dependency-free Node lifecycle tests automatically.
The separate browser test requires Chrome and Playwright, installed locally with:

```powershell
npm install --prefix work/pwa-tools --cache work/npm-cache --no-save playwright
$env:NODE_PATH="$PWD/work/pwa-tools/node_modules"
node tests/pwa-browser.cjs
```

The browser test serves simulated releases with long-lived HTTP cache headers and delays language loading beyond window load.
It asserts automatic reload, fresh stylesheet bytes, retained preferences, isolated caches, failed installation recovery, and offline startup.
The server and browser close automatically after verification.

### Execution Log
- [2026-09-22] **[Verify]** `npm install --prefix work/pwa-tools --cache work/npm-cache --no-save playwright` exited `0`; session `82777` installed two packages.
- [2026-09-22] **[Verify]** `node tests/pwa-browser.cjs --baseline` exited `0`; PID `9016` observed HTTP `200` and zero worker registrations.
- [2026-09-22] **[Verify]** `python scripts/generate-sw.py generate` exited `0`; generated 275 precached assets for `v3.3.1-pre`.
- [2026-09-22] **[Verify]** `node tests/pwa-browser.cjs` exited `0`; PID `23276` passed upgrade, cache freshness, preference, failure, and offline checks.
- [2026-09-22] **[Verify]** `python -m unittest discover -s tests -v` exited `0`; all 101 tests passed, including six executable lifecycle checks.
- [2026-09-22] **[Verify]** `node --test tests/pwa-runtime.cjs` exited `0`; all six lifecycle checks passed.
- [2026-09-22] **[Verify]** `python ../dev-guidelines/scripts/lint-markdown.py CHANGELOG.md docs/devops.md docs/requirements.md docs/index.md docs/issues/pwa-update-stalls.md` exited `0`; five documents passed.
- [2026-09-22] **[Verify]** `python ../dev-guidelines/scripts/lint-taskfile.py docs/issues/pwa-update-stalls.md` exited `0` without diagnostics.
- [2026-09-22] **[Visual]** Inspected the [before screenshot](../../work/pwa-verification/pwa-update-view-before.png) and [after screenshot](../../work/pwa-verification/pwa-update-view-after.png).
  Both captures show the rendered mobile quiz after HTTP `200`; layout remains consistent.
- [2026-09-22] **[Verify]** `Start-Process python -ArgumentList '-m','http.server','8765','--bind','127.0.0.1' -WindowStyle Hidden -PassThru` started preview PID `21256`.
  The [local preview](http://127.0.0.1:8765/) returned HTTP `200`.

Screenshots are local verification artifacts in the ignored `work/` directory.
