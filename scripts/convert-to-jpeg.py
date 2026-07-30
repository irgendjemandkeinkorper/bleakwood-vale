#!/usr/bin/env python3
"""
convert-to-jpeg.py — one-time post-processing pass: convert the PNGs
generate.py produced into JPEGs (quality 90), delete the PNG originals,
and update every reference to the old .png path/URL to .jpg — in
manifest.json and in the sibling bleakwood-vault entity frontmatter.

PNG is lossless and wasteful for painterly/photographic art; JPEG at high
quality is a fraction of the size for this content with no visible loss.
Run once after a generation pass, not as part of generate.py itself, so a
partial/interrupted run is easy to reason about.
"""
import os
import re
import json
import glob

from PIL import Image

REPO = os.path.dirname(os.path.abspath(__file__)) + "/.."
REPO = os.path.abspath(REPO)
VAULT = os.environ.get("BLEAKWOOD_VAULT", os.path.join(REPO, "..", "bleakwood-vault"))
MANIFEST_PATH = os.path.join(REPO, "manifest.json")
FM_RE = re.compile(r"^---\n(.*?)\n---\n(.*)$", re.DOTALL)

def convert_all():
    pngs = glob.glob(os.path.join(REPO, "art", "images", "*", "*", "*.png"))
    print(f"{len(pngs)} PNGs to convert")
    converted = 0
    for p in pngs:
        jpg = p[:-4] + ".jpg"
        img = Image.open(p).convert("RGB")
        img.save(jpg, "JPEG", quality=90, optimize=True)
        os.remove(p)
        converted += 1
    print(f"Converted {converted} files")

def update_manifest():
    if not os.path.exists(MANIFEST_PATH):
        return
    with open(MANIFEST_PATH, encoding="utf-8") as f:
        records = json.load(f)
    for r in records:
        r["savePath"] = r["savePath"].replace(".png", ".jpg")
        r["imageUrl"] = r["imageUrl"].replace(".png", ".jpg")
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2)
    print("Updated manifest.json")

def update_vault():
    files = glob.glob(os.path.join(VAULT, "*", "*.md"))
    updated = 0
    for path in files:
        with open(path, encoding="utf-8") as f:
            text = f.read()
        new_text = text.replace(".png", ".jpg")
        if new_text != text:
            with open(path, "w", encoding="utf-8") as f:
                f.write(new_text)
            updated += 1
    print(f"Updated {updated} vault entity files")

if __name__ == "__main__":
    convert_all()
    update_manifest()
    update_vault()
