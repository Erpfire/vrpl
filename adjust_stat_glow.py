#!/usr/bin/env python3
"""
Adjust stat numbers to be slightly less white but keep the beautiful glow
Using a soft cream/off-white color instead of pure white
"""

import sys
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def adjust_stat_colors():
    # Fix components.css
    with open('css/components.css', 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace pure white with soft cream/off-white
    old_color = '''  color: #FFFFFF;
  text-shadow: 0 0 30px rgba(200, 159, 128, 0.8),
               0 0 60px rgba(167, 200, 161, 0.6),
               0 2px 4px rgba(0, 0, 0, 0.5);'''

    new_color = '''  color: #F5F1E8;
  text-shadow: 0 0 40px rgba(200, 159, 128, 1.0),
               0 0 80px rgba(167, 200, 161, 0.8),
               0 4px 8px rgba(0, 0, 0, 0.6);'''

    content = content.replace(old_color, new_color)

    with open('css/components.css', 'w', encoding='utf-8') as f:
        f.write(content)

    print("✓ Fixed components.css - Softer cream color with enhanced glow")

    # Fix image-sections.css
    with open('css/image-sections.css', 'r', encoding='utf-8') as f:
        content = f.read()

    old_stat = '''  color: #FFFFFF;
  margin-bottom: var(--space-xs);
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 30px rgba(200, 159, 128, 0.8),
               0 0 60px rgba(167, 200, 161, 0.6),
               0 2px 4px rgba(0, 0, 0, 0.5);'''

    new_stat = '''  color: #F5F1E8;
  margin-bottom: var(--space-xs);
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 40px rgba(200, 159, 128, 1.0),
               0 0 80px rgba(167, 200, 161, 0.8),
               0 4px 8px rgba(0, 0, 0, 0.6);'''

    content = content.replace(old_stat, new_stat)

    with open('css/image-sections.css', 'w', encoding='utf-8') as f:
        f.write(content)

    print("✓ Fixed image-sections.css - Softer cream color with enhanced glow")

    print("\n✅ Stat numbers are now:")
    print("   - Soft cream color (#F5F1E8) instead of harsh white")
    print("   - Beautiful enhanced copper-orange and green glow")
    print("   - More pleasing to the eye while still highly visible!")

if __name__ == '__main__':
    adjust_stat_colors()
