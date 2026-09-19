---
id: T0031
owner: "@antigravity"
needs: []
branch: task/T0031-installable-offline-pwa
worktree: ./work/T0031-installable-offline-pwa
status: active
started: 2026-09-19
ended: —
---

# T0031: Installable PWA with 100% Offline Support

## Goals

Transform the quiz into an installable Progressive Web App with complete offline capability.
Pre-cache all 193 traffic sign SVGs and static assets upon Service Worker installation.
Adopt the playful D5 roundabout traffic sign as the application favicon and icon suite.
Queue error reports locally in local storage when offline and sync sequentially upon reconnection.
Provide an intuitive install prompt and clear offline status indicators in the user interface.

## Task Execution Steps

- [x] **[Decide]**    Select traffic sign D5 for favicon and PWA icons.
- [ ] **[Implement]** Generate PWA icon suite and configure Web App Manifest.
- [ ] **[Implement]** Implement root Service Worker pre-caching all signs and static assets.
- [ ] **[Implement]** Build offline FIFO report queue in localStorage for zero data loss.
- [ ] **[Implement]** Add PWA install prompt button and offline indicator to interface.
- [ ] **[Verify]**    Verify offline quiz functionality, report queue drain, and automated tests.
- [ ] **[Doc]**       Document PWA capabilities in requirements, changelog, and task file.

## Execution Log

- [2026-09-19] **[Decided]**
  Claimed task T0031 and selected traffic sign D5 as the playful roundabout app icon.

