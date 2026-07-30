#!/usr/bin/env python3
"""
generate.py — generate card-art images for Bleakwood Vale from manifest.json.

Unlike dramgid-lore-gallery's generate.py, there's no Gemini "write the prompt
from lore" step here — every prompt in manifest.json is already hand-authored
(see art/IMAGE_PROMPTS.md, and the generator that built manifest.json). This
script just does the image call, saves the file into this repo's own
art/images/ (served by this repo's own GitHub Pages, no separate gallery
repo needed), and writes the resulting URL back into the matching entity's
frontmatter in the sibling bleakwood-vault project.

Usage:
    python generate.py                  # everything in manifest.json
    python generate.py --ids the-disgraced-alienist  # only entries whose id matches
    python generate.py --category omens  # only one category
    python generate.py --limit 4         # cap how many are processed (good for a test batch)
    python generate.py --no-write-back   # skip writing image URLs into the vault
"""
import os
import re
import json
import argparse
from io import BytesIO

from dotenv import load_dotenv
from PIL import Image
from google import genai
from google.genai import types

load_dotenv()

REPO = os.path.dirname(os.path.abspath(__file__))
VAULT = os.environ.get("BLEAKWOOD_VAULT", os.path.join(REPO, "..", "bleakwood-vault"))
MANIFEST_PATH = os.path.join(REPO, "manifest.json")

FM_RE = re.compile(r"^---\n(.*?)\n---\n(.*)$", re.DOTALL)

client = genai.Client()


def create_image(prompt: str, output_path: str, aspect_ratio: str = None) -> bool:
    response = client.models.generate_content(
        model="gemini-3.1-flash-image",
        contents=f"Generate an image based on this description: {prompt}",
        config=types.GenerateContentConfig(
            response_modalities=[types.Modality.TEXT, types.Modality.IMAGE],
            image_config=types.ImageConfig(aspect_ratio=aspect_ratio) if aspect_ratio else None,
        ),
    )
    for part in response.candidates[0].content.parts:
        if part.inline_data:
            img = Image.open(BytesIO(part.inline_data.data))
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            img.save(output_path)
            return True
    return False


def write_back_image_url(vault_path: str, field: str, url: str):
    """Sets <field>: <url> in the vault entity's frontmatter."""
    if not os.path.exists(vault_path):
        print(f"  !! vault file not found, skipping write-back: {vault_path}")
        return
    with open(vault_path, encoding="utf-8") as f:
        text = f.read()
    m = FM_RE.match(text)
    if not m:
        print(f"  !! could not parse frontmatter, skipping write-back: {vault_path}")
        return
    fm_text, body = m.group(1), m.group(2)
    pattern = rf"^{re.escape(field)}:.*$"
    if re.search(pattern, fm_text, re.MULTILINE):
        fm_text = re.sub(pattern, f"{field}: {url}", fm_text, flags=re.MULTILINE)
    else:
        fm_text = fm_text.rstrip("\n") + f"\n{field}: {url}"
    with open(vault_path, "w", encoding="utf-8") as f:
        f.write(f"---\n{fm_text}\n---\n{body}")


def load_manifest(ids_filter, category_filter, limit):
    with open(MANIFEST_PATH, encoding="utf-8") as f:
        records = json.load(f)
    if ids_filter:
        records = [r for r in records if r["id"] in ids_filter]
    if category_filter:
        records = [r for r in records if r["category"] == category_filter]
    if limit:
        records = records[:limit]
    return records


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ids", nargs="*", help="only process manifest entries with these ids")
    ap.add_argument("--category", choices=["archetypes", "hooks", "omens", "victims"])
    ap.add_argument("--limit", type=int, help="cap the number of images generated")
    ap.add_argument("--no-write-back", action="store_true",
                     help="skip writing image URLs back into vault frontmatter")
    args = ap.parse_args()

    records = load_manifest(args.ids, args.category, args.limit)
    print(f"{len(records)} images queued")

    ok, failed = 0, []
    for i, rec in enumerate(records, 1):
        label = f"[{i}/{len(records)}] {rec['id']} ({rec['style']}{'/' + rec['side'] if rec['side'] else ''})"
        out_path = os.path.join(REPO, rec["savePath"])
        if os.path.exists(out_path):
            print(f"{label} already exists, skipping")
            ok += 1
            continue
        print(f"{label} generating...")
        try:
            success = create_image(rec["prompt"], out_path, rec.get("aspectRatio"))
        except Exception as e:
            print(f"{label} !! error: {e}")
            failed.append(rec["id"])
            continue
        if not success:
            print(f"{label} !! no image returned, skipping")
            failed.append(rec["id"])
            continue
        ok += 1
        print(f"{label} saved -> {rec['savePath']}")
        if not args.no_write_back:
            write_back_image_url(os.path.join(VAULT, rec["vaultPath"]), rec["field"], rec["imageUrl"])

    print(f"\nDone. {ok} succeeded, {len(failed)} failed.")
    if failed:
        print("Failed ids:", ", ".join(failed))


if __name__ == "__main__":
    main()
