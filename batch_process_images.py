#!/usr/bin/env python3
"""
VRPL Image Batch Processor
Downloads Unsplash images and applies VRPL duotone styling
"""

from PIL import Image
import numpy as np
import os
from pathlib import Path

# ---------- SETTINGS ----------
PRIMARY = "#C89F80"   # light copper
SECONDARY = "#2E2E2E" # dark charcoal

# Image configurations: (input_filename, output_path, size)
IMAGE_CONFIG = {
    'hero': {
        'size': (1920, 1080),
        'images': [
            ('varanasi-ghats.jpg', 'assets/images/hero/contact-hero.jpg'),
            ('renewable-energy.jpg', 'assets/images/hero/about-hero.jpg'),
            ('industrial-machinery.jpg', 'assets/images/hero/technology-hero.jpg'),
            ('ganges-aerial.jpg', 'assets/images/hero/impact-hero.jpg'),
            ('parliament-india.jpg', 'assets/images/hero/government-hero.jpg'),
            ('workshop-training.jpg', 'assets/images/hero/training-hero.jpg'),
            ('hydrogen-plant.jpg', 'assets/images/hero/phases-hero.jpg'),
        ]
    },
    'overlay': {
        'size': (1920, 1080),
        'images': [
            ('factory-night.jpg', 'assets/images/overlay/home.jpg'),
            ('team-engineers.jpg', 'assets/images/overlay/about.jpg'),
            ('plasma-energy.jpg', 'assets/images/overlay/technology.jpg'),
            ('hydrogen-tanks.jpg', 'assets/images/overlay/phases.jpg'),
            ('green-landscape.jpg', 'assets/images/overlay/impact.jpg'),
            ('government-interior.jpg', 'assets/images/overlay/government.jpg'),
            ('hands-working.jpg', 'assets/images/overlay/training.jpg'),
            ('varanasi-street.jpg', 'assets/images/overlay/contact.jpg'),
        ]
    },
    'technology': {
        'size': (800, 600),
        'images': [
            ('plasma-physics.jpg', 'assets/images/technology/plasma-illustration.jpg'),
            ('industrial-pipes.jpg', 'assets/images/technology/syngas.jpg'),
            ('electrical-substation.jpg', 'assets/images/technology/electricity.jpg'),
            ('industrial-material.jpg', 'assets/images/technology/slag.jpg'),
        ]
    },
    'team': {
        'size': (800, 800),
        'images': [
            ('entrepreneur-portrait.jpg', 'assets/images/team/founder.jpg'),
            ('scientists-lab.jpg', 'assets/images/team/csir-collaboration.jpg'),
        ]
    },
    'process': {
        'size': (800, 600),
        'images': [
            ('waste-facility.jpg', 'assets/images/process/waste-input.jpg'),
            ('industrial-furnace.jpg', 'assets/images/process/plasma-chamber.jpg'),
            ('glass-pipes.jpg', 'assets/images/process/syngas-output.jpg'),
            ('electrical-panel.jpg', 'assets/images/process/energy-generation.jpg'),
        ]
    }
}

INPUT_FOLDER = 'downloads'
# ------------------------------

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def apply_duotone(image, primary, secondary):
    """Apply duotone effect to image"""
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
        # Open and resize
        img = Image.open(input_path)
        img = img.resize(size, Image.Resampling.LANCZOS)

        # Apply duotone
        primary_rgb = hex_to_rgb(PRIMARY)
        secondary_rgb = hex_to_rgb(SECONDARY)
        duotone_img = apply_duotone(img, primary_rgb, secondary_rgb)

        # Save
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        duotone_img.save(output_path, quality=90, optimize=True)

        print(f"✓ {output_path}")
        return True

    except FileNotFoundError:
        print(f"⚠ Missing: {input_path}")
        return False
    except Exception as e:
        print(f"✗ Error processing {input_path}: {e}")
        return False

def main():
    """Process all images"""
    print("═" * 60)
    print("VRPL Image Batch Processor")
    print("═" * 60)

    total = 0
    processed = 0
    missing = []

    for category, config in IMAGE_CONFIG.items():
        print(f"\n📁 Processing {category.upper()} images ({config['size'][0]}x{config['size'][1]}):")
        print("─" * 60)

        for input_name, output_path in config['images']:
            total += 1
            input_path = os.path.join(INPUT_FOLDER, input_name)

            if process_image(input_path, output_path, config['size']):
                processed += 1
            else:
                missing.append(input_name)

    print("\n" + "═" * 60)
    print(f"✅ Processed: {processed}/{total} images")

    if missing:
        print(f"\n⚠ Missing {len(missing)} images from '{INPUT_FOLDER}/' folder:")
        for name in missing:
            print(f"   - {name}")
        print("\nDownload missing images from Unsplash and run again!")
    else:
        print("\n🎉 All images processed successfully!")

    print("═" * 60)

if __name__ == "__main__":
    main()
