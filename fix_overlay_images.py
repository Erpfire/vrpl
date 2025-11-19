#!/usr/bin/env python3
"""
Fix overlay menu to use proper overlay images instead of hero images
"""

import sys
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_overlay_menu(filepath):
    """Fix overlay menu images in a single HTML file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"⚠ {filepath} not found, skipping")
        return False

    original = content

    # Replace hero images with proper overlay images in data-image attributes
    replacements = {
        'data-image="assets/images/hero/about-hero.jpg"': 'data-image="assets/images/overlay/about.jpg"',
        'data-image="assets/images/hero/technology-hero.jpg"': 'data-image="assets/images/overlay/technology.jpg"',
        'data-image="assets/images/hero/phases-hero.jpg"': 'data-image="assets/images/overlay/phases.jpg"',
        'data-image="assets/images/hero/impact-hero.jpg"': 'data-image="assets/images/overlay/impact.jpg"',
        'data-image="assets/images/hero/government-hero.jpg"': 'data-image="assets/images/overlay/government.jpg"',
        'data-image="assets/images/hero/training-hero.jpg"': 'data-image="assets/images/overlay/training.jpg"',
        'data-image="assets/images/hero/contact-hero.jpg"': 'data-image="assets/images/overlay/contact.jpg"',
    }

    for old, new in replacements.items():
        if old in content:
            content = content.replace(old, new)
            print(f"  ✓ Fixed: {old.split('/')[-1].replace('"', '')} → {new.split('/')[-1].replace('"', '')}")

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    html_files = [
        'index.html',
        'about.html',
        'technology.html',
        'phases.html',
        'impact.html',
    ]

    print("Fixing overlay menu background images...")
    print("=" * 60)

    fixed = 0
    for html_file in html_files:
        print(f"\nProcessing {html_file}:")
        if fix_overlay_menu(html_file):
            fixed += 1

    print("\n" + "=" * 60)
    print(f"✅ Fixed {fixed} files!")
    print("\nNow all 7 overlay background images will be used!")
    print("The menu background will change on hover for each item!")

if __name__ == '__main__':
    main()
