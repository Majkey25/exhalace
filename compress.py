"""
Exhalace image compression script.
Run once from the project root. Safe to re-run (skips already-small files).
"""
import os
from PIL import Image, ImageOps

BASE = os.path.dirname(os.path.abspath(__file__))

def compress_image(path, max_side, quality, force_jpeg=False):
    original_bytes = os.path.getsize(path)
    img = Image.open(path)
    img = ImageOps.exif_transpose(img)
    orig_w, orig_h = img.width, img.height

    # Resize if too large
    if max(img.width, img.height) > max_side:
        ratio = max_side / max(img.width, img.height)
        img = img.resize((int(img.width * ratio), int(img.height * ratio)), Image.LANCZOS)

    # Convert to RGB for JPEG
    if img.mode in ('RGBA', 'P', 'LA', 'L'):
        img = img.convert('RGB')

    save_path = path
    fmt = "JPEG"
    if force_jpeg and not path.lower().endswith(('.jpg', '.jpeg')):
        save_path = os.path.splitext(path)[0] + '.jpg'
        fmt = "JPEG"

    img.save(save_path, fmt, quality=quality, optimize=True)
    new_bytes = os.path.getsize(save_path)
    saved = (1 - new_bytes / original_bytes) * 100
    print(f"  {os.path.basename(path)}: {original_bytes//1024}KB -> {new_bytes//1024}KB ({saved:.0f}% smaller)  [{orig_w}x{orig_h}]")
    if save_path != path:
        print(f"    -> saved as {os.path.basename(save_path)}")
    return save_path

print("=== EXHALACE image compression ===\n")

# 1. Hero background
print("[1] Hero image")
hero_png = os.path.join(BASE, "assets/images/EXHALACE.png")
hero_jpg = os.path.join(BASE, "assets/images/EXHALACE.jpg")
if os.path.exists(hero_png):
    compress_image(hero_png, max_side=1920, quality=70, force_jpeg=True)
elif os.path.exists(hero_jpg):
    print("  EXHALACE.jpg already converted, skipping")
else:
    print("  EXHALACE hero image not found")

# 2. Favicon (259 KB is absurd for a favicon)
print("\n[2] Favicon icon.png")
ico = Image.open(os.path.join(BASE, "assets/images/icon.png"))
ico = ico.convert("RGBA")
ico = ico.resize((64, 64), Image.LANCZOS)
ico_path = os.path.join(BASE, "assets/images/icon.png")
orig = os.path.getsize(ico_path)
ico.save(ico_path, "PNG", optimize=True)
print(f"  icon.png: {orig//1024}KB -> {os.path.getsize(ico_path)//1024}KB")

# 3. Gallery images — 39 images, no lazy loading, some > 2 MB
print("\n[3] Gallery images (compressing > 200 KB)")
gallery_dir = os.path.join(BASE, "assets/images/galery")
total_before = total_after = 0
for fname in sorted(os.listdir(gallery_dir)):
    if fname.lower().endswith(('.jpg', '.jpeg', '.png', '.JPG', '.JPEG')):
        fpath = os.path.join(gallery_dir, fname)
        fsize = os.path.getsize(fpath)
        total_before += fsize
        if fsize > 200 * 1024:
            new_path = compress_image(fpath, max_side=1200, quality=78)
            total_after += os.path.getsize(new_path)
        else:
            total_after += fsize
            print(f"  {fname}: {fsize//1024}KB (skip, already small)")
print(f"  Gallery total: {total_before//1024//1024}MB -> {total_after//1024//1024}MB")

# 4. Member photos — small but let's normalize them
print("\n[4] Member photos")
members_dir = os.path.join(BASE, "assets/images/clenove")
for fname in sorted(os.listdir(members_dir)):
    if fname.lower().endswith(('.jpg', '.jpeg', '.png', '.JPG', '.JPEG')):
        fpath = os.path.join(members_dir, fname)
        fsize = os.path.getsize(fpath)
        if fsize > 100 * 1024:
            compress_image(fpath, max_side=800, quality=80)
        else:
            print(f"  {fname}: {fsize//1024}KB (skip)")

print("\n=== Done ===")
