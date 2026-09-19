#!/usr/bin/env python3
"""Generate PWA icons and transparent favicon.ico from D5 traffic sign SVG.

Cross-platform (Windows/Linux/macOS).

Usage:
  python scripts/generate_pwa_icons.py generate [--force]
  python scripts/generate_pwa_icons.py --version
  python scripts/generate_pwa_icons.py --help
"""

from __future__ import annotations

import os
import shutil
import subprocess
import sys
from pathlib import Path
from PIL import Image

# Add scripts directory to path to import _cli_common when run directly
SCRIPTS_DIR = Path(__file__).resolve().parent
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

from _cli_common import build_action_parser, get_project_version, print_help, print_version

PROG = "generate_pwa_icons"
DESCRIPTION = "Renders multi-resolution PWA icons and transparent favicon.ico from D5 traffic sign SVG."
ACTIONS = ["generate", "version", "help"]
DEFAULT_ACTION = "generate"
EXIT_CODES = [
    (0, "Success (all icons generated and validated)"),
    (1, "Generation or rendering error"),
    (2, "Headless Chrome browser not found"),
]

REPO_ROOT = SCRIPTS_DIR.parent
ASSETS_DIR = REPO_ROOT / "assets"
ICONS_DIR = ASSETS_DIR / "icons"
D5_SVG = ASSETS_DIR / "signs" / "D5.svg"
FAVICON_SVG = ASSETS_DIR / "favicon.svg"
FAVICON_ICO = REPO_ROOT / "favicon.ico"


def find_chrome_binary() -> str | None:
    """Finds Google Chrome executable across platforms."""
    env_chrome = os.environ.get("CHROME_BIN")
    if env_chrome and Path(env_chrome).exists():
        return env_chrome

    candidates = [
        shutil.which("google-chrome"),
        shutil.which("chrome"),
        shutil.which("chromium"),
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        r"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        r"/usr/bin/google-chrome",
        r"/usr/bin/chromium-browser",
    ]
    for c in candidates:
        if c and Path(c).exists():
            return str(c)
    return None


def generate_icons(force: bool = False, verbose: bool = False) -> int:
    """Renders SVG to PNG icons and generates multi-resolution favicon.ico."""
    if not D5_SVG.exists():
        print(f"[!] Source SVG not found: {D5_SVG}", file=sys.stderr)
        return 1

    ICONS_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Update assets/favicon.svg from D5.svg
    d5_content = D5_SVG.read_text(encoding="utf-8")
    FAVICON_SVG.write_text(d5_content, encoding="utf-8")
    if verbose:
        print(f"Updated {FAVICON_SVG}")

    chrome_path = find_chrome_binary()
    if not chrome_path:
        print("[!] Headless Chrome is required to render vector SVGs into high-resolution raster icons.", file=sys.stderr)
        print("    Please set CHROME_BIN environment variable or install Google Chrome.", file=sys.stderr)
        return 2

    html_template = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  html, body {{ width: 100%; height: 100%; overflow: hidden; background: {bg}; }}
  .container {{
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
  }}
  img {{
    width: {scale}%; height: {scale}%;
    object-fit: contain;
  }}
</style>
</head>
<body>
  <div class="container">
    <img src="{svg_path}">
  </div>
</body>
</html>
"""
    d5_uri = FAVICON_SVG.resolve().as_uri()
    configs = [
        ("icon-512.png", 512, 512, "transparent", 94),
        ("icon-maskable-512.png", 512, 512, "#0071B3", 75),
    ]

    temp_html = ICONS_DIR / "_temp_icon.html"
    try:
        for filename, w, h, bg, scale in configs:
            content = html_template.format(bg=bg, scale=scale, svg_path=d5_uri)
            temp_html.write_text(content, encoding="utf-8")

            out_png = ICONS_DIR / filename
            cmd = [
                chrome_path,
                "--headless=new",
                "--disable-gpu",
                "--default-background-color=00000000",
                f"--screenshot={out_png.resolve()}",
                f"--window-size={w},{h}",
                temp_html.resolve().as_uri(),
            ]
            subprocess.run(cmd, check=True, capture_output=not verbose)
            if verbose:
                print(f"Rendered {out_png.name} ({out_png.stat().st_size} bytes)")
    finally:
        if temp_html.exists():
            temp_html.unlink()

    # Downsample using PIL Lanczos for high-fidelity small icons
    im_512 = Image.open(ICONS_DIR / "icon-512.png")
    im_512.resize((192, 192), Image.Resampling.LANCZOS).save(ICONS_DIR / "icon-192.png")

    im_maskable = Image.open(ICONS_DIR / "icon-maskable-512.png")
    im_maskable.resize((192, 192), Image.Resampling.LANCZOS).save(ICONS_DIR / "icon-maskable-192.png")
    im_maskable.resize((180, 180), Image.Resampling.LANCZOS).save(ICONS_DIR / "apple-touch-icon.png")

    # Generate root favicon.ico with transparency (16, 32, 48px)
    im_512.save(
        FAVICON_ICO,
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
    )

    print("Generated all PWA icons (192, 512, maskable, apple-touch-icon) and transparent favicon.ico.")
    return 0


def main() -> int:
    version = get_project_version()
    parser = build_action_parser(PROG, DESCRIPTION, ACTIONS, DEFAULT_ACTION)
    parser.add_argument("--force", action="store_true", help="Force re-rendering all icon assets")
    args = parser.parse_args()

    if args.version or args.action == "version":
        print_version(PROG, version)
        return 0

    if args.help or args.action == "help":
        print_help(PROG, version, DESCRIPTION, parser, EXIT_CODES)
        return 0

    return generate_icons(force=args.force, verbose=args.verbose)


if __name__ == "__main__":
    sys.exit(main())
