/** Execute the PWA module against browser lifecycle events without external dependencies. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const source = fs.readFileSync(path.join(__dirname, "../js/pwa.js"), "utf8")
  .replace(/^import .*;\r?\n/gm, "").replace(/export /g, "");

/**
 * Evaluate the PWA module in a sandbox with stubbed browser globals.
 *
 * @param {boolean} [controlled=true] - Whether a service worker already controls the page.
 * @returns {{context: Object, window: EventTarget, document: EventTarget,
 *          navigator: Object, serviceWorker: EventTarget, reg: EventTarget, calls: Object}}
 *          Sandbox, its stubbed globals and the recorded registration, update and reload calls.
 */
function setup(controlled = true) {
  const window = new EventTarget();
  const document = new EventTarget();
  document.visibilityState = "visible";
  document.readyState = "complete";
  const serviceWorker = new EventTarget();
  serviceWorker.controller = controlled ? {} : null;
  const reg = new EventTarget();
  const calls = { registrations: [], updates: 0, reloads: 0, intervals: [] };
  reg.update = async () => { calls.updates += 1; };
  serviceWorker.register = async (...args) => { calls.registrations.push(args); return reg; };
  window.location = { reload: () => { calls.reloads += 1; } };
  const navigator = { serviceWorker, onLine: true };
  const context = vm.createContext({ window, document, navigator, el: {}, drainReportQueue() {}, console,
    setInterval: (callback, delay) => calls.intervals.push({ callback, delay }) });
  vm.runInContext(source, context);
  return { context, window, document, navigator, serviceWorker, reg, calls };
}
/**
 * Let the pending microtasks and promise callbacks run.
 *
 * @returns {Promise<void>} Resolves on the next event loop turn.
 */
const flush = () => new Promise((resolve) => setImmediate(resolve));

test("registration works after load and starts only once", async () => {
  const env = setup();
  await env.context.registerServiceWorker();
  await env.context.registerServiceWorker();
  assert.equal(env.calls.registrations.length, 1);
  assert.equal(env.calls.registrations[0][0], "./sw.js");
  assert.equal(env.calls.registrations[0][1].updateViaCache, "none");
  assert.equal(env.calls.updates, 1);
  assert.equal(env.calls.intervals[0].delay, 60000);
});

test("first installation avoids reload; replacement reloads once", async () => {
  const env = setup(false);
  await env.context.registerServiceWorker();
  env.serviceWorker.controller = {};
  env.serviceWorker.dispatchEvent(new Event("controllerchange"));
  assert.equal(env.calls.reloads, 0);
  env.serviceWorker.dispatchEvent(new Event("controllerchange"));
  env.serviceWorker.dispatchEvent(new Event("controllerchange"));
  assert.equal(env.calls.reloads, 1);
});

test("an existing installation reloads immediately on replacement", async () => {
  const env = setup();
  await env.context.registerServiceWorker();
  env.serviceWorker.dispatchEvent(new Event("controllerchange"));
  assert.equal(env.calls.reloads, 1);
});

test("resume, reconnect, visibility and interval trigger checks", async () => {
  const env = setup();
  await env.context.registerServiceWorker();
  await flush();
  for (const event of ["focus", "pageshow", "online"]) {
    const before = env.calls.updates;
    env.window.dispatchEvent(new Event(event));
    await flush();
    assert.equal(env.calls.updates, before + 1, event);
  }
  env.document.dispatchEvent(new Event("visibilitychange"));
  await flush();
  await env.calls.intervals[0].callback();
  assert.equal(env.calls.updates, 6);
  env.navigator.onLine = false;
  await env.calls.intervals[0].callback();
  env.navigator.onLine = true;
  env.document.visibilityState = "hidden";
  await env.calls.intervals[0].callback();
  assert.equal(env.calls.updates, 6);
});

test("overlapping checks coalesce and failed checks retry", async () => {
  const env = setup();
  await env.context.registerServiceWorker();
  await flush();
  let reject;
  env.reg.update = () => { env.calls.updates += 1; return new Promise((_, fail) => { reject = fail; }); };
  env.window.dispatchEvent(new Event("focus"));
  env.window.dispatchEvent(new Event("pageshow"));
  assert.equal(env.calls.updates, 2);
  reject(new Error("Network unavailable"));
  await flush();
  env.reg.update = async () => { env.calls.updates += 1; };
  env.window.dispatchEvent(new Event("online"));
  await flush();
  assert.equal(env.calls.updates, 3);
});

test("unsupported browsers return without registration", () => {
  const env = setup();
  delete env.navigator.serviceWorker;
  env.context.registerServiceWorker();
  assert.equal(env.calls.registrations.length, 0);
});
