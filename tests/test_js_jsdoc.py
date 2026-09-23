"""Automated tests verifying every JavaScript function carries a complete JSDoc block."""

from __future__ import annotations

import re
import unittest
from pathlib import Path

WORKTREE_ROOT = Path(__file__).resolve().parent.parent

SCANNED_FILES = (
    sorted(WORKTREE_ROOT.joinpath("js").glob("*.js"))
    + [WORKTREE_ROOT / "sw.js"]
    + sorted(WORKTREE_ROOT.joinpath("tests").glob("*.cjs"))
)

# Matches `function name(args)`, `const name = (args) =>`, and `self.addEventListener("x", (args) =>`.
FUNCTION_RE = re.compile(
    r"^\s*(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s+(?P<name>\w+)\s*\((?P<params>[^)]*)\)"
    r"|^\s*(?:export\s+)?(?:const|let|var)\s+(?P<name2>\w+)\s*=\s*(?:async\s*)?\((?P<params2>[^)]*)\)\s*=>"
    r"|^\s*self\.addEventListener\(\"(?P<name3>\w+)\",\s*(?:async\s*)?\((?P<params3>[^)]*)\)\s*=>"
)

PARAM_TAG_RE = re.compile(r"@param\s+\{.+?\}\s+\[?([\w.]+)")


def split_params(raw: str) -> list[str]:
    """Splits a parameter list on the commas separating top-level parameters.

    :param raw: Text between the parentheses of a function signature.
    :returns: List of individual parameter declarations.
    """
    parts: list[str] = []
    depth = 0
    current = ""
    for char in raw:
        if char in "([{":
            depth += 1
        elif char in ")]}":
            depth -= 1
        if char == "," and depth == 0:
            parts.append(current)
            current = ""
            continue
        current += char
    parts.append(current)
    return parts


def parameter_name(declaration: str) -> str:
    """Reduces a parameter declaration to the name used in its JSDoc tag.

    :param declaration: Single parameter, possibly with a default value or destructuring.
    :returns: Parameter name, or an empty string for destructured parameters.
    """
    name = declaration.split("=")[0].strip().lstrip(".")
    return "" if name.startswith(("{", "[")) else name


def preceding_jsdoc(lines: list[str], index: int) -> str:
    """Returns the JSDoc block directly above a function, if there is one.

    :param lines: All lines of the source file.
    :param index: Zero-based line number of the function signature.
    :returns: Text of the JSDoc block, or an empty string when the function has none.
    """
    cursor = index - 1
    if cursor < 0 or not lines[cursor].strip().endswith("*/"):
        return ""
    block: list[str] = []
    while cursor >= 0:
        block.append(lines[cursor])
        stripped = lines[cursor].strip()
        if stripped.startswith("/**"):
            return "\n".join(reversed(block))
        if stripped.startswith("/*"):
            return ""
        cursor -= 1
    return ""


def iter_functions(path: Path):
    """Yields every function found in a JavaScript source file together with its JSDoc block.

    :param path: File to scan.
    :returns: Iterator of (line number, name, parameter names, JSDoc block) tuples, where the
              JSDoc block is an empty string when the function has none.
    """
    lines = path.read_text(encoding="utf-8").splitlines()
    for index, line in enumerate(lines):
        match = FUNCTION_RE.match(line)
        if not match:
            continue
        name = match.group("name") or match.group("name2") or match.group("name3")
        raw_params = match.group("params") or match.group("params2") or match.group("params3") or ""
        params = [parameter_name(p) for p in split_params(raw_params) if p.strip()]
        yield index + 1, name, params, preceding_jsdoc(lines, index)


class TestJsDoc(unittest.TestCase):
    """Test suite asserting the JavaScript sources stay fully documented."""

    def test_scanned_files_are_present(self):
        """The scan covers the application modules, the service worker, and the Node tests."""
        self.assertGreater(len(SCANNED_FILES), 20, "Expected the JavaScript sources to be discovered")
        for path in SCANNED_FILES:
            self.assertTrue(path.is_file(), f"Missing scanned file: {path}")

    def test_every_function_has_a_jsdoc_block(self):
        """Every scanned function is preceded by a JSDoc comment."""
        missing = [
            f"{path.relative_to(WORKTREE_ROOT).as_posix()}:{line} {name}"
            for path in SCANNED_FILES
            for line, name, _params, doc in iter_functions(path)
            if not doc
        ]
        self.assertEqual([], missing, "Functions without a JSDoc block")

    def test_every_parameter_is_documented(self):
        """Every named parameter of every scanned function has a matching @param tag."""
        missing = []
        for path in SCANNED_FILES:
            for line, name, params, doc in iter_functions(path):
                if not doc:
                    continue
                documented = set(PARAM_TAG_RE.findall(doc))
                for param in params:
                    if param and param not in documented:
                        missing.append(f"{path.relative_to(WORKTREE_ROOT).as_posix()}:{line} {name}({param})")
        self.assertEqual([], missing, "Parameters without an @param tag")

    def test_every_function_documents_its_return_value(self):
        """Every scanned function documents what it returns."""
        missing = [
            f"{path.relative_to(WORKTREE_ROOT).as_posix()}:{line} {name}"
            for path in SCANNED_FILES
            for line, name, _params, doc in iter_functions(path)
            if doc and "@returns" not in doc and "@return" not in doc
        ]
        self.assertEqual([], missing, "Functions without a documented return value")


if __name__ == "__main__":
    unittest.main()
