import { el } from "./dom.js";
import { allQuestions } from "./state.js";
import { applyTranslation } from "./quiz.js";
import { getSignCode, localizeSourceUrl } from "./utils.js";
import { t, getLang } from "./i18n.js";

// Belgian traffic signs are grouped into series A-F by the consolidated
// Wegcode (KB 1 December 1975, articles 66-71); wegcode.be presents its own
// sign explanation pages in that same series order, then by ascending code
// within each series, so the printed catalog mirrors it exactly.
const SERIES_ORDER = ["A", "B", "C", "D", "E", "F"];

/**
 * Split a sign code into its series prefix, leading number and trailing suffix.
 *
 * @param {string} code - Sign code such as "A1a" or "C43-70".
 * @returns {{prefix: string, num: number, suffix: string}} Parsed parts used for sorting.
 */
function parseSignCode(code) {
  const match = code.match(/^([A-Za-z]+)(\d+)(.*)$/);
  if (!match) return { prefix: code, num: 0, suffix: "" };
  return { prefix: match[1], num: parseInt(match[2], 10), suffix: match[3] };
}

/**
 * Extract the Wegcode article number from a source URL's `#art-NN` fragment.
 *
 * @param {string} source - Source URL, such as one ending in "#art-66".
 * @returns {string|null} The article number as a string, or null when absent.
 */
function extractArticleNumber(source) {
  const match = source.match(/#art-(\d+)/);
  return match ? match[1] : null;
}

/**
 * Build the deduplicated, wegcode.be-ordered catalog of every road sign in the question bank.
 *
 * Each sign can back several quiz questions (recognize, identify, rule); the "recognize"
 * question is preferred as the representative since it always carries the sign's own
 * Wegcode article source, unlike a handful of "rule" questions that cite an unrelated page.
 *
 * @returns {Array<{sign: string, code: string, title: string, explanation: string, source: string, articleNumber: string|null}>}
 *          Signs sorted by Wegcode series (A-F) then by ascending code.
 */
export function buildSignCatalog() {
  const bySign = new Map();
  for (const q of allQuestions) {
    if (!q.sign) continue;
    const existing = bySign.get(q.sign);
    if (!existing || (existing.type !== "recognize" && q.type === "recognize")) {
      bySign.set(q.sign, q);
    }
  }

  const lang = getLang();
  const items = [...bySign.values()].map((q) => {
    const tq = applyTranslation(q);
    const code = getSignCode(q.sign);
    const source = localizeSourceUrl(q.source, lang);
    return {
      sign: q.sign,
      code,
      ...parseSignCode(code),
      title: tq.signTitle || tq.explanation,
      explanation: tq.signExplanation || tq.explanation,
      source,
      articleNumber: extractArticleNumber(source),
    };
  });

  items.sort((a, b) => {
    const oa = SERIES_ORDER.indexOf(a.prefix);
    const ob = SERIES_ORDER.indexOf(b.prefix);
    if (oa !== ob) return (oa === -1 ? 99 : oa) - (ob === -1 ? 99 : ob);
    if (a.num !== b.num) return a.num - b.num;
    return a.suffix.localeCompare(b.suffix);
  });
  return items;
}

/**
 * Escape the characters that carry meaning in HTML.
 *
 * @param {*} str - Value to escape; converted to a string first.
 * @returns {string} Text safe to insert into markup.
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Render one series section (heading + table rows) of the printable signs document.
 *
 * @param {string} prefix - Series letter ("A".."F").
 * @param {Array<Object>} items - Catalog entries belonging to that series.
 * @returns {string} HTML fragment for the series section.
 */
function renderSeriesSection(prefix, items) {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td class="signs-doc-col-sign"><img src="${escapeHtml(item.sign)}" alt="${escapeHtml(item.code)}" class="signs-doc-thumb" /></td>
          <td class="signs-doc-col-code">${escapeHtml(item.code)}</td>
          <td class="signs-doc-col-desc">
            <strong>${escapeHtml(item.title)}</strong>
            <span class="signs-doc-explanation">${escapeHtml(item.explanation)}</span>
          </td>
          <td class="signs-doc-col-source"><a href="${escapeHtml(item.source)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
            item.articleNumber ? t("signs_doc.article_label", { number: item.articleNumber }) : t("signs_doc.source_link")
          )}</a></td>
        </tr>`
    )
    .join("");

  return `
    <h2 class="signs-doc-series-title">${escapeHtml(t(`signs_doc.series.${prefix}`))}</h2>
    <table class="signs-doc-table">
      <thead>
        <tr>
          <th class="signs-doc-col-sign">${escapeHtml(t("signs_doc.col_sign"))}</th>
          <th class="signs-doc-col-code">${escapeHtml(t("signs_doc.col_code"))}</th>
          <th class="signs-doc-col-desc">${escapeHtml(t("signs_doc.col_description"))}</th>
          <th class="signs-doc-col-source">${escapeHtml(t("signs_doc.col_source"))}</th>
        </tr>
      </thead>
      <tbody>${rows}
      </tbody>
    </table>`;
}

/**
 * Fill the hidden print-only document with the full, wegcode.be-ordered sign catalog.
 *
 * @returns {number} Number of signs rendered, so callers can skip printing an empty document.
 */
export function renderSignsPrintDocument() {
  if (!el.printSignsDocument) return 0;
  const items = buildSignCatalog();
  if (items.length === 0) {
    el.printSignsDocument.innerHTML = "";
    return 0;
  }

  const bySeries = new Map();
  for (const item of items) {
    if (!bySeries.has(item.prefix)) bySeries.set(item.prefix, []);
    bySeries.get(item.prefix).push(item);
  }

  const sections = SERIES_ORDER.filter((prefix) => bySeries.has(prefix))
    .map((prefix) => renderSeriesSection(prefix, bySeries.get(prefix)))
    .join("");

  const generatedOn = new Date().toLocaleDateString(getLang() === "nl" ? "nl-BE" : getLang());

  el.printSignsDocument.innerHTML = `
    <h1 class="signs-doc-title">${escapeHtml(t("signs_doc.title"))}</h1>
    <p class="signs-doc-intro">${escapeHtml(t("signs_doc.intro", { count: items.length, date: generatedOn }))}</p>
    ${sections}`;

  return items.length;
}

/**
 * Render the printable signs document and trigger the browser print dialog for it.
 *
 * Toggles a body class so print CSS can hide the rest of the app and show only this
 * document, then removes the class again once the print flow ends. The document title
 * is temporarily replaced so browsers suggest a descriptive filename when the print
 * dialog is used to save as PDF.
 *
 * @returns {void}
 */
export function printSignsDocument() {
  const count = renderSignsPrintDocument();
  if (count === 0) return;

  const originalTitle = document.title;
  document.title = t("signs_doc.print_filename", { title: t("signs_doc.title") });
  document.body.classList.add("printing-signs-doc");
  /**
   * Restore the document title and remove the print-mode body class once the
   * browser's print flow has finished.
   *
   * @returns {void}
   */
  const cleanup = () => {
    document.body.classList.remove("printing-signs-doc");
    document.title = originalTitle;
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  window.print();
}
