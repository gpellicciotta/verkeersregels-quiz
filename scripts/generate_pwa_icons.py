"""Script to generate PWA icons from D5 traffic sign SVG."""

from pathlib import Path
import subprocess
import shutil

WORKTREE_ROOT = Path(__file__).resolve().parent.parent
ASSETS_DIR = WORKTREE_ROOT / "assets"
ICONS_DIR = ASSETS_DIR / "icons"
D5_SVG = ASSETS_DIR / "signs" / "D5.svg"
FAVICON_SVG = ASSETS_DIR / "favicon.svg"

ICONS_DIR.mkdir(parents=True, exist_ok=True)

# 1. Update assets/favicon.svg to D5
with open(D5_SVG, "r", encoding="utf-8") as f:
    d5_content = f.read()

with open(FAVICON_SVG, "w", encoding="utf-8") as f:
    f.write(d5_content)

print(f"Updated {FAVICON_SVG}")

# 2. Render PNG icons using headless Chrome
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

from PIL import Image

configs = [
    ("icon-512.png", 512, 512, "transparent", 94),
    ("icon-maskable-512.png", 512, 512, "#0071B3", 75),
]

temp_html = ICONS_DIR / "_temp_icon.html"
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

for filename, w, h, bg, scale in configs:
    content = html_template.format(bg=bg, scale=scale, svg_path=d5_uri)
    with open(temp_html, "w", encoding="utf-8") as f:
        f.write(content)
    
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
    subprocess.run(cmd, check=True)
    print(f"Generated {out_png.name}: {out_png.stat().st_size} bytes")

if temp_html.exists():
    temp_html.unlink()

# Downsample using PIL Lanczos for pixel-perfect small icons
im_512 = Image.open(ICONS_DIR / "icon-512.png")
im_512.resize((192, 192), Image.Resampling.LANCZOS).save(ICONS_DIR / "icon-192.png")
print("Generated icon-192.png via PIL")

im_maskable = Image.open(ICONS_DIR / "icon-maskable-512.png")
im_maskable.resize((192, 192), Image.Resampling.LANCZOS).save(ICONS_DIR / "icon-maskable-192.png")
print("Generated icon-maskable-192.png via PIL")

im_maskable.resize((180, 180), Image.Resampling.LANCZOS).save(ICONS_DIR / "apple-touch-icon.png")
print("Generated apple-touch-icon.png via PIL")

# Generate root favicon.ico with transparency (16, 32, 48px)
favicon_ico_path = WORKTREE_ROOT / "favicon.ico"
im_512.save(
    favicon_ico_path,
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)],
)
print(f"Generated {favicon_ico_path.name} with transparency via PIL")

print("All PWA icons generated successfully!")
