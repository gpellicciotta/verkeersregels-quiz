import { el } from "./dom.js";
import { t } from "./i18n.js";

let changelogHtmlCache = null;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatInlineMarkdown(text) {
  let s = escapeHtml(text);
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return s;
}

function renderChangelogMarkdown(md) {
  const lines = md.split(/\r?\n/);
  let html = "";
  let inList = false;

  function closeList() {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line || line === "---") {
      closeList();
      continue;
    }

    if (line.startsWith("# ")) {
      closeList();
      continue;
    }

    if (line.startsWith(">")) {
      closeList();
      continue;
    }

    if (line.startsWith("## ")) {
      closeList();
      const title = escapeHtml(line.slice(3).trim());
      html += `<h4 class="changelog-version-title">${title}</h4>`;
      continue;
    }

    if (line.startsWith("- ")) {
      if (!inList) {
        html += '<ul class="changelog-list">';
        inList = true;
      }
      const content = line.slice(2).trim();
      const match = content.match(/^([A-Za-z]+):\s*(.*)$/);
      if (match) {
        const area = escapeHtml(match[1]);
        const desc = formatInlineMarkdown(match[2]);
        html += `<li><span class="changelog-badge changelog-badge-${area.toLowerCase()}">${area}</span> ${desc}</li>`;
      } else {
        html += `<li>${formatInlineMarkdown(content)}</li>`;
      }
      continue;
    }

    closeList();
    html += `<p class="changelog-p">${formatInlineMarkdown(line)}</p>`;
  }

  closeList();
  return html;
}

function extractVersionFromChangelog(md) {
  const match = md.match(/^##\s+([^\s\[]+)/m);
  return match ? match[1] : "onbekend";
}

export async function loadChangelog() {
  if (changelogHtmlCache) {
    if (el.changelogBody) el.changelogBody.innerHTML = changelogHtmlCache;
    if (el.aboutChangelogBody) el.aboutChangelogBody.innerHTML = changelogHtmlCache;
    return;
  }
  const loadingHtml = `<p class="changelog-loading">${t("changelog.loading")}</p>`;
  if (el.changelogBody) el.changelogBody.innerHTML = loadingHtml;
  if (el.aboutChangelogBody) el.aboutChangelogBody.innerHTML = loadingHtml;
  try {
    const res = await fetch("CHANGELOG.md");
    if (!res.ok) throw new Error("Kon CHANGELOG.md niet laden: " + res.status);
    const md = await res.text();
    const version = extractVersionFromChangelog(md);
    if (el.aboutVersionTag) el.aboutVersionTag.textContent = version;
    if (el.btnVersion) el.btnVersion.textContent = version;
    changelogHtmlCache = renderChangelogMarkdown(md);
    if (el.changelogBody) el.changelogBody.innerHTML = changelogHtmlCache;
    if (el.aboutChangelogBody) el.aboutChangelogBody.innerHTML = changelogHtmlCache;
  } catch (err) {
    console.warn("Changelog laden mislukt:", err);
    if (el.aboutVersionTag) el.aboutVersionTag.textContent = t("version.unknown");
    if (el.btnVersion) el.btnVersion.textContent = t("version.unknown");
    const errHtml = `
      <p class="error">${t("changelog.error")}</p>
      <p class="modal-desc">${t("changelog.error_link").replace("CHANGELOG.md", '<a href="CHANGELOG.md" target="_blank" rel="noopener noreferrer">CHANGELOG.md</a>')}</p>
    `;
    if (el.changelogBody) el.changelogBody.innerHTML = errHtml;
    if (el.aboutChangelogBody) el.aboutChangelogBody.innerHTML = errHtml;
  }
}

export function openChangelogModal() {
  if (!el.modalChangelog) return;
  el.modalChangelog.classList.remove("hidden");
  loadChangelog();
  if (el.btnChangelogClose) el.btnChangelogClose.focus();
}

export function closeChangelogModal() {
  if (!el.modalChangelog) return;
  el.modalChangelog.classList.add("hidden");
  if (el.btnVersion) el.btnVersion.focus();
}
