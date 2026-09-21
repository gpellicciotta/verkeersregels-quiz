import { el } from "./dom.js";
import { drainReportQueue } from "./report-queue.js";

export let deferredInstallPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  if (el.btnInstall) {
    el.btnInstall.classList.remove("hidden");
  }
});

if (el.btnInstall) {
  el.btnInstall.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === "accepted") {
      deferredInstallPrompt = null;
      el.btnInstall.classList.add("hidden");
    }
  });
}

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  if (el.btnInstall) {
    el.btnInstall.classList.add("hidden");
  }
  console.info("PWA succesvol geïnstalleerd.");
});

export function updateOnlineStatus() {
  const isOnline = typeof navigator.onLine === "boolean" ? navigator.onLine : true;
  if (el.offlineIndicator) {
    el.offlineIndicator.classList.toggle("hidden", isOnline);
  }
}

window.addEventListener("online", () => {
  updateOnlineStatus();
  drainReportQueue();
});

window.addEventListener("offline", () => {
  updateOnlineStatus();
});

const SW_UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000;

export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  // Reload once the new worker takes control, so open tabs (installed PWA
  // included) pick up the updated assets without a manual close/reopen.
  let refreshingAfterUpdate = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshingAfterUpdate) {
      return;
    }
    refreshingAfterUpdate = true;
    window.location.reload();
  });

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((reg) => {
        reg.addEventListener("updatefound", () => {
          const worker = reg.installing;
          if (worker) {
            worker.addEventListener("statechange", () => {
              if (worker.state === "installed" && navigator.serviceWorker.controller) {
                console.info("Nieuwe versie van de quiz beschikbaar, wordt automatisch geactiveerd.");
              }
            });
          }
        });

        // Installed PWAs can stay open for a long time without navigating,
        // so poll for updates periodically and whenever the tab regains focus.
        setInterval(() => {
          reg.update().catch(() => {});
        }, SW_UPDATE_CHECK_INTERVAL_MS);
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") {
            reg.update().catch(() => {});
          }
        });
      })
      .catch((err) => {
        console.warn("Service Worker registratie mislukt:", err);
      });
  });
}
