#!/usr/bin/env python3
"""
VRPL Image Processor - Process downloaded Unsplash images
Applies duotone effect and resizes to correct dimensions
"""

from PIL import Image
import numpy as np
import os
from pathlib import Path

# ---------- SETTINGS ----------
PRIMARY = "#C89F80"   # light copper
SECONDARY = "#2E2E2E" # dark charcoal

INPUT_FOLDER = 'assets/images/additionalimages'
OUTPUT_BASE = 'assets/images'

# Mapping: (input_filename, output_path, size)
IMAGES = [
    # HERO IMAGES (1920 x 1080)
    ('varanasi ghat.jpg', 'hero/contact-hero.jpg', (1920, 1080)),
    ('renewable energy workers.jpg', 'hero/about-hero.jpg', (1920, 1080)),
    ('industrial machinery.jpg', 'hero/technology-hero.jpg', (1920, 1080)),
    ('ganges river aerial.jpg', 'hero/impact-hero.jpg', (1920, 1080)),
    ('parliament india.jpg', 'hero/government-hero.jpg', (1920, 1080)),
    ('workshop training.jpg', 'hero/training-hero.jpg', (1920, 1080)),
    ('hydrogen plant.jpg', 'hero/phases-hero.jpg', (1920, 1080)),

    # OVERLAY IMAGES (1920 x 1080)
    ('factory night.png', 'overlay/home.jpg', (1920, 1080)),
    ('team engineers.jpg', 'overlay/about.jpg', (1920, 1080)),
    ('plasma energy.jpg', 'overlay/technology.jpg', (1920, 1080)),
    ('hydrogen tanks.jpg', 'overlay/phases.jpg', (1920, 1080)),
    ('green landscape.jpg', 'overlay/impact.jpg', (1920, 1080)),
    ('government interior.jpg', 'overlay/government.jpg', (1920, 1080)),
    ('hands working.jpg', 'overlay/training.jpg', (1920, 1080)),
    ('varanasi street.jpg', 'overlay/contact.jpg', (1920, 1080)),

    # TECHNOLOGY IMAGES (800 x 600)
    ('plasma physics.jpg', 'technology/plasma-illustration.jpg', (800, 600)),
    ('industrial pipes.jpg', 'technology/syngas.jpg', (800, 600)),
    ('electrical substation.jpg', 'technology/electricity.jpg', (800, 600)),
    ('industrial material.jpg', 'technology/slag.jpg', (800, 600)),

    # TEAM IMAGES (800 x 800)
    ('entrepreneur portrait.jpg', 'team/founder.jpg', (800, 800)),
    ('scientist laboratory.jpg', 'team/csir-collaboration.jpg', (800, 800)),

    # PROCESS IMAGES (800 x 600)
    ('waste facility.jpg', 'process/waste-input.jpg', (800, 600)),
    ('industrial furnace.jpg', 'process/plasma-chamber.jpg', (800, 600)),
    ('glass pipes.jpg', 'process/syngas-output.jpg', (800, 600)),
    ('electrical panel.jpg', 'process/energy-generation.jpg', (800, 600)),
]
# ------------------------------

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def apply_duotone(image, primary, secondary):
    """Apply duotone effect to image"""
    # Convert to RGB if needed
    if image.mode != 'RGB':
        image = image.convert('RGB')

    # Convert to grayscale
    gray = image.convert("L")
    gray_np = np.array(gray, dtype="float") / 255.0

    primary = np.array(primary)
    secondary = np.array(secondary)

    # Linear interpolation for duotone mapping
    duotone_np = (secondary * (1 - gray_np[..., None]) +
                  primary * gray_np[..., None]).astype("uint8")

    return Image.fromarray(duotone_np)

def process_image(input_path, output_path, size):
    """Process single image: resize and apply duotone"""
    try:
        # Open and convert to RGB
        img = Image.open(input_path)
        if img.mode != 'RGB':
            img = img.convert('RGB')

        # Resize
        img = img.resize(size, Image.Resampling.LANCZOS)

        # Apply duotone
        primary_rgb = hex_to_rgb(PRIMARY)
        secondary_rgb = hex_to_rgb(SECONDARY)
        duotone_img = apply_duotone(img, primary_rgb, secondary_rgb)

        # Save
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        duotone_img.save(output_path, quality=90, optimize=True)

        file_size = os.path.getsize(output_path) / 1024  # KB
        print(f"✓ {os.path.basename(output_path):30s} ({size[0]}x{size[1]}) [{file_size:.0f}KB]")
        return True

    except FileNotFoundError:
        print(f"⚠ Missing: {os.path.basename(input_path)}")
        return False
    except Exception as e:
        print(f"✗ Error: {os.path.basename(input_path)} - {e}")
        return False

def main():
    """Process all images"""
    print("═" * 70)
    print("VRPL IMAGE PROCESSOR - Applying Bio-Industrial Fusion Theme")
    print("═" * 70)
    print(f"Primary Color:   {PRIMARY} (Copper)")
    print(f"Secondary Color: {SECONDARY} (Steel Gray)")
    print("═" * 70)

    total = len(IMAGES)
    processed = 0
    missing = []

    # Group by category for organized output
    categories = {
        'HERO': [],
        'OVERLAY': [],
        'TECHNOLOGY': [],
        'TEAM': [],
        'PROCESS': []
    }

    for input_name, output_path, size in IMAGES:
        category = output_path.split('/')[0].upper()
        categories[category].append((input_name, output_path, size))

    # Process each category
    for category, items in categories.items():
        if not items:
            continue

        print(f"\n📁 {category} IMAGES:")
        print("─" * 70)

        for input_name, output_path, size in items:
            input_path = os.path.join(INPUT_FOLDER, input_name)
            full_output_path = os.path.join(OUTPUT_BASE, output_path)

            if process_image(input_path, full_output_path, size):
                processed += 1
            else:
                missing.append(input_name)

    print("\n" + "═" * 70)
    print(f"✅ COMPLETE: {processed}/{total} images processed successfully!")

    if missing:
        print(f"\n⚠ Missing {len(missing)} images:")
        for name in missing:
            print(f"   - {name}")
    else:
        print("\n🎉 All images processed and ready to use!")
        print(f"\n📂 Images saved to: {OUTPUT_BASE}/")

    print("═" * 70)

if __name__ == "__main__":
    main()
