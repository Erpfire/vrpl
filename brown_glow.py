#!/usr/bin/env python3
"""
Change stat number color to brown with brown/copper glow
"""

import sys
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def apply_brown_glow():
    # Fix components.css
    with open('css/components.css', 'r', encoding='utf-8') as f:
        content = f.read()

    # Change to brown color with brown/copper glow
    old_color = '''  color: #F5F1E8;
  text-shadow: 0 0 20px rgba(200, 159, 128, 0.6),
               0 0 40px rgba(167, 200, 161, 0.4),
               0 2px 4px rgba(0, 0, 0, 0.5);'''

    new_color = '''  color: #D4A574;
  text-shadow: 0 0 20px rgba(156, 106, 74, 0.8),
               0 0 40px rgba(106, 62, 44, 0.6),
               0 2px 4px rgba(0, 0, 0, 0.5);'''

    content = content.replace(old_color, new_color)

    with open('css/components.css', 'w', encoding='utf-8') as f:
        f.write(content)

    print("✓ Applied brown glow to components.css")

    # Fix image-sections.css
    with open('css/image-sections.css', 'r', encoding='utf-8') as f:
        content = f.read()

    old_stat = '''  color: #F5F1E8;
  margin-bottom: var(--space-xs);
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 20px rgba(200, 159, 128, 0.6),
               0 0 40px rgba(167, 200, 161, 0.4),
               0 2px 4px rgba(0, 0, 0, 0.5);'''

    new_stat = '''  color: #D4A574;
  margin-bottom: var(--space-xs);
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 20px rgba(156, 106, 74, 0.8),
               0 0 40px rgba(106, 62, 44, 0.6),
               0 2px 4px rgba(0, 0, 0, 0.5);'''

    content = content.replace(old_stat, new_stat)

    with open('css/image-sections.css', 'w', encoding='utf-8') as f:
        f.write(content)

    print("✓ Applied brown glow to image-sections.css")

    print("\n✅ Brown glow applied!")
    print("   - Number color: Warm brown/copper (#D4A574)")
    print("   - Glow: Copper-brown tones")
    print("   - Matches the bio-industrial fusion theme perfectly!")

if __name__ == '__main__':
    apply_brown_glow()
