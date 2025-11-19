#!/usr/bin/env python3
"""
Add image-sections.css link to all HTML files
"""

import sys
import os

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

CSS_LINK = '  <link rel="stylesheet" href="css/image-sections.css">'

def add_css_to_file(filepath):
    """Add CSS link before responsive.css in HTML file"""
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return False

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if already added
    if 'image-sections.css' in content:
        print(f"{filepath}: CSS already linked")
        return False

    # Find the marker (responsive.css link)
    marker = '  <link rel="stylesheet" href="css/responsive.css">'

    if marker not in content:
        print(f"{filepath}: Marker not found!")
        return False

    # Insert before responsive.css
    content = content.replace(marker, CSS_LINK + '\n' + marker)

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"{filepath}: Added image-sections.css link")
    return True

def main():
    html_files = [
        'index.html',
        'about.html',
        'technology.html',
        'phases.html',
        'impact.html',
    ]

    print("Adding image-sections.css link to HTML files...")
    print("=" * 60)

    total = 0
    for html_file in html_files:
        if add_css_to_file(html_file):
            total += 1

    print("=" * 60)
    print(f"\nUpdated {total} files")

if __name__ == '__main__':
    main()
