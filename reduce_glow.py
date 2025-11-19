#!/usr/bin/env python3
"""
Reduce the glow intensity while keeping visibility
"""

import sys
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def reduce_glow():
    # Fix components.css
    with open('css/components.css', 'r', encoding='utf-8') as f:
        content = f.read()

    # Reduce glow intensity
    old_glow = '''  color: #F5F1E8;
  text-shadow: 0 0 40px rgba(200, 159, 128, 1.0),
               0 0 80px rgba(167, 200, 161, 0.8),
               0 4px 8px rgba(0, 0, 0, 0.6);'''

    new_glow = '''  color: #F5F1E8;
  text-shadow: 0 0 20px rgba(200, 159, 128, 0.6),
               0 0 40px rgba(167, 200, 161, 0.4),
               0 2px 4px rgba(0, 0, 0, 0.5);'''

    content = content.replace(old_glow, new_glow)

    with open('css/components.css', 'w', encoding='utf-8') as f:
        f.write(content)

    print("✓ Reduced glow in components.css")

    # Fix image-sections.css
    with open('css/image-sections.css', 'r', encoding='utf-8') as f:
        content = f.read()

    old_stat_glow = '''  color: #F5F1E8;
  margin-bottom: var(--space-xs);
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 40px rgba(200, 159, 128, 1.0),
               0 0 80px rgba(167, 200, 161, 0.8),
               0 4px 8px rgba(0, 0, 0, 0.6);'''

    new_stat_glow = '''  color: #F5F1E8;
  margin-bottom: var(--space-xs);
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 20px rgba(200, 159, 128, 0.6),
               0 0 40px rgba(167, 200, 161, 0.4),
               0 2px 4px rgba(0, 0, 0, 0.5);'''

    content = content.replace(old_stat_glow, new_stat_glow)

    with open('css/image-sections.css', 'w', encoding='utf-8') as f:
        f.write(content)

    print("✓ Reduced glow in image-sections.css")

    print("\n✅ Glow intensity reduced!")
    print("   - Softer, more subtle glow effect")
    print("   - Numbers remain clearly visible")
    print("   - More elegant appearance")

if __name__ == '__main__':
    reduce_glow()
