#!/usr/bin/env python3
"""
Update all HTML files to use locally downloaded images instead of Unsplash URLs
"""

import os
import re
import sys

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Define the image replacements mapping
IMAGE_REPLACEMENTS = {
    # Hero images
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80': 'assets/images/hero/about-hero.jpg',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80': 'assets/images/hero/technology-hero.jpg',
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&q=80': 'assets/images/hero/phases-hero.jpg',
    'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1920&q=80': 'assets/images/hero/impact-hero.jpg',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80': 'assets/images/hero/government-hero.jpg',
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&q=80': 'assets/images/hero/training-hero.jpg',
    'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80': 'assets/images/hero/contact-hero.jpg',

    # Overlay menu backgrounds (data-image attributes)
    'data-image="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"': 'data-image="assets/images/overlay/home.jpg"',
    'data-image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"': 'data-image="assets/images/overlay/about.jpg"',
    'data-image="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80"': 'data-image="assets/images/overlay/technology.jpg"',
    'data-image="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&q=80"': 'data-image="assets/images/overlay/phases.jpg"',
    'data-image="https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1920&q=80"': 'data-image="assets/images/overlay/impact.jpg"',
    'data-image="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80"': 'data-image="assets/images/overlay/government.jpg"',
    'data-image="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&q=80"': 'data-image="assets/images/overlay/training.jpg"',
    'data-image="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80"': 'data-image="assets/images/overlay/contact.jpg"',

    # Team images
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80': 'assets/images/team/founder.jpg',

    # Technology page images
    'https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?w=800&q=80': 'assets/images/technology/plasma-illustration.jpg',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80': 'assets/images/process/plasma-chamber.jpg',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80': 'assets/images/process/syngas-output.jpg',
    'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=600&q=80': 'assets/images/additionalimages/industrial machinery.jpg',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80': 'assets/images/additionalimages/industrial machinery.jpg',

    # Output products
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80': 'assets/images/technology/syngas.jpg',
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80': 'assets/images/technology/electricity.jpg',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80': 'assets/images/technology/slag.jpg',
}

def update_html_file(filepath):
    """Update a single HTML file with new image paths"""
    print(f"Processing: {filepath}")

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    replacements_made = 0

    # Replace each URL
    for old_url, new_path in IMAGE_REPLACEMENTS.items():
        if old_url in content:
            content = content.replace(old_url, new_path)
            replacements_made += 1
            print(f"  - Replaced: {old_url[:50]}... -> {new_path}")

    # Write back if changes were made
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  Updated {filepath} ({replacements_made} replacements)\n")
        return replacements_made
    else:
        print(f"  No changes needed\n")
        return 0

def main():
    """Update all HTML files in the current directory"""
    html_files = [
        'index.html',
        'about.html',
        'technology.html',
        'phases.html',
        'impact.html',
        'government.html',
        'training.html',
        'contact.html'
    ]

    total_replacements = 0

    print("Starting image URL replacement...")
    print("=" * 60)

    for html_file in html_files:
        if os.path.exists(html_file):
            replacements = update_html_file(html_file)
            total_replacements += replacements
        else:
            print(f"File not found: {html_file}\n")

    print("=" * 60)
    print(f"\nComplete! Made {total_replacements} total replacements")

if __name__ == '__main__':
    main()
