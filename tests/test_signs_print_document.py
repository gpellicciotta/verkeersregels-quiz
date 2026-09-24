"""Automated tests for the "print all road signs" button and document on the About page."""

from __future__ import annotations

import json
import re
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
INDEX_PATH = REPO_ROOT / "index.html"
CSS_PATH = REPO_ROOT / "css" / "style.css"
JS_DIR = REPO_ROOT / "js"
DATA_DIR = REPO_ROOT / "data"
STRINGS_LANGS = ["nl", "en", "fr", "de", "it"]

SERIES_ORDER = ["A", "B", "C", "D", "E", "F"]

NEW_KEYS = [
    "about.print_signs_btn",
    "signs_doc.title",
    "signs_doc.intro",
    "signs_doc.col_sign",
    "signs_doc.col_code",
    "signs_doc.col_description",
    "signs_doc.col_source",
    "signs_doc.source_link",
    "signs_doc.article_label",
    "signs_doc.print_filename",
    "signs_doc.series.A",
    "signs_doc.series.B",
    "signs_doc.series.C",
    "signs_doc.series.D",
    "signs_doc.series.E",
    "signs_doc.series.F",
]


def _parse_sign_code(code: str) -> tuple[str, int, str]:
    match = re.match(r"^([A-Za-z]+)(\d+)(.*)$", code)
    if not match:
        return code, 0, ""
    return match.group(1), int(match.group(2)), match.group(3)


def _build_sign_catalog(questions: list[dict]) -> list[dict]:
    """Reimplements js/signs-doc.js buildSignCatalog() in Python for data-level verification."""
    by_sign: dict[str, dict] = {}
    for q in questions:
        sign = q.get("sign")
        if not sign:
            continue
        existing = by_sign.get(sign)
        if not existing or (existing.get("type") != "recognize" and q.get("type") == "recognize"):
            by_sign[sign] = q

    items = []
    for q in by_sign.values():
        code = Path(q["sign"]).stem
        prefix, num, suffix = _parse_sign_code(code)
        items.append({"sign": q["sign"], "code": code, "prefix": prefix, "num": num, "suffix": suffix, "source": q["source"]})

    def sort_key(item: dict) -> tuple[int, int, str]:
        order = SERIES_ORDER.index(item["prefix"]) if item["prefix"] in SERIES_ORDER else 99
        return (order, item["num"], item["suffix"])

    items.sort(key=sort_key)
    return items


class TestSignsPrintDocument(unittest.TestCase):
    """Test suite validating the About-page print button, its markup, i18n keys, and sign ordering."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.html = INDEX_PATH.read_text(encoding="utf-8")
        cls.css = CSS_PATH.read_text(encoding="utf-8")
        cls.app_js = (JS_DIR / "app.js").read_text(encoding="utf-8")
        cls.dom_js = (JS_DIR / "dom.js").read_text(encoding="utf-8")
        with open(DATA_DIR / "questions.json", "r", encoding="utf-8") as f:
            cls.questions = json.load(f)["questions"]
        cls.strings = {}
        for lang in STRINGS_LANGS:
            with open(DATA_DIR / f"strings.{lang}.json", "r", encoding="utf-8") as f:
                cls.strings[lang] = json.load(f)

    def test_button_and_document_markup_exist(self) -> None:
        """Validates index.html defines the print button and the hidden print-only document."""
        self.assertIn('id="btn-print-signs"', self.html)
        self.assertIn('id="print-signs-document"', self.html)
        self.assertIn('data-icon="print"', self.html[self.html.index('id="btn-print-signs"'):self.html.index('id="btn-print-signs"') + 400])
        self.assertNotIn('id="btn-export-signs-pdf"', self.html)

    def test_dom_and_app_wiring(self) -> None:
        """Validates dom.js caches the new elements and app.js wires the click handler."""
        self.assertIn('btnPrintSigns: document.getElementById("btn-print-signs")', self.dom_js)
        self.assertIn('printSignsDocument: document.getElementById("print-signs-document")', self.dom_js)
        self.assertIn('from "./signs-doc.js"', self.app_js)
        self.assertIn("el.btnPrintSigns.addEventListener", self.app_js)

    def test_signs_doc_module_exports(self) -> None:
        """Validates js/signs-doc.js exports the catalog builder and print entry point."""
        signs_doc_js = (JS_DIR / "signs-doc.js").read_text(encoding="utf-8")
        self.assertIn("export function buildSignCatalog", signs_doc_js)
        self.assertIn("export function renderSignsPrintDocument", signs_doc_js)
        self.assertIn("export async function printSignsDocument", signs_doc_js)

    def test_print_css_scopes_to_printing_signs_doc_body_class(self) -> None:
        """Validates the print stylesheet only reveals the signs document while body.printing-signs-doc is set."""
        self.assertIn(".print-signs-document {", self.css)
        self.assertIn("body.printing-signs-doc #print-signs-document", self.css)
        self.assertIn("body.printing-signs-doc #app > *:not(#print-signs-document)", self.css)

    def test_print_css_breaks_page_before_each_series_except_the_first(self) -> None:
        """Validates each Wegcode series after the first starts on a new printed page."""
        self.assertIn(".signs-doc-series-title:not(:first-of-type)", self.css)
        block = self.css[self.css.index(".signs-doc-series-title:not(:first-of-type)"):]
        block = block[: block.index("}") + 1]
        self.assertIn("page-break-before: always", block)

    def test_print_sets_and_restores_document_title(self) -> None:
        """Validates printSignsDocument sets a descriptive document title and restores it afterward."""
        signs_doc_js = (JS_DIR / "signs-doc.js").read_text(encoding="utf-8")
        self.assertIn("const originalTitle = document.title;", signs_doc_js)
        self.assertIn('document.title = t("signs_doc.print_filename"', signs_doc_js)
        self.assertIn("document.title = originalTitle;", signs_doc_js)

    def test_print_waits_for_thumbnails_before_calling_window_print(self) -> None:
        """Validates the print flow awaits every thumbnail's decode() before invoking window.print()."""
        signs_doc_js = (JS_DIR / "signs-doc.js").read_text(encoding="utf-8")
        self.assertIn("export async function printSignsDocument", signs_doc_js)
        self.assertIn("function waitForSignThumbnails", signs_doc_js)
        self.assertIn("img.decode()", signs_doc_js)
        self.assertIn("await waitForSignThumbnails();", signs_doc_js)
        # The wait must happen before window.print() is reached, not after.
        wait_pos = signs_doc_js.index("await waitForSignThumbnails();")
        print_pos = signs_doc_js.index("window.print();")
        self.assertLess(wait_pos, print_pos, "thumbnails must be awaited before window.print() is called")

    def test_about_sources_card_no_longer_has_redundant_law_hint(self) -> None:
        """Validates the redundant law-article hint sentence was removed from the sources card."""
        self.assertNotIn("about.law_hint", self.html)
        for lang in STRINGS_LANGS:
            self.assertNotIn("about.law_hint", self.strings[lang])

    def test_i18n_keys_present_and_non_empty_in_every_language(self) -> None:
        """Validates every new i18n key exists with non-empty text in all 5 supported languages."""
        for lang in STRINGS_LANGS:
            for key in NEW_KEYS:
                self.assertIn(key, self.strings[lang], f"{lang} is missing key {key}")
                self.assertTrue(self.strings[lang][key].strip(), f"{lang}.{key} must not be empty")

    def test_sign_catalog_covers_every_sign_exactly_once(self) -> None:
        """Validates the catalog-building logic yields exactly one entry per unique sign asset."""
        items = _build_sign_catalog(self.questions)
        signs_with_field = {q["sign"] for q in self.questions if q.get("sign")}
        self.assertEqual(len(items), len(signs_with_field))
        self.assertEqual({i["sign"] for i in items}, signs_with_field)

    def test_sign_catalog_is_ordered_by_wegcode_series_then_code(self) -> None:
        """Validates signs are grouped A-F in Wegcode article order, ascending by code within each series."""
        items = _build_sign_catalog(self.questions)
        prefixes_seen = [i["prefix"] for i in items]
        # Series letters must appear as contiguous, ascending A..F blocks (no interleaving).
        distinct_in_order = []
        for p in prefixes_seen:
            if not distinct_in_order or distinct_in_order[-1] != p:
                distinct_in_order.append(p)
        self.assertEqual(distinct_in_order, SERIES_ORDER)

        by_series: dict[str, list[dict]] = {}
        for item in items:
            by_series.setdefault(item["prefix"], []).append(item)
        for prefix, series_items in by_series.items():
            nums_and_suffixes = [(i["num"], i["suffix"]) for i in series_items]
            self.assertEqual(nums_and_suffixes, sorted(nums_and_suffixes), f"series {prefix} not sorted ascending")

    def test_source_column_renders_article_number_as_link_text(self) -> None:
        """Validates the source cell shows the article number, derived from the source URL, as link text."""
        signs_doc_js = (JS_DIR / "signs-doc.js").read_text(encoding="utf-8")
        self.assertIn("function extractArticleNumber", signs_doc_js)
        self.assertIn("articleNumber: extractArticleNumber(source)", signs_doc_js)
        self.assertIn('t("signs_doc.article_label", { number: item.articleNumber })', signs_doc_js)

    def test_sign_catalog_sources_are_wegcode_article_links(self) -> None:
        """Validates every catalog entry's source URL points at a wegcode.be Wegcode article anchor."""
        items = _build_sign_catalog(self.questions)
        for item in items:
            self.assertRegex(
                item["source"],
                r"^https://www\.wegcode\.be/nl/regelgeving/1975120109~hra8v386pu#art-\d+$",
                f"sign {item['code']} has an unexpected source: {item['source']}",
            )


if __name__ == "__main__":
    unittest.main()
