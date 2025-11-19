#!/usr/bin/env python3
"""
Make stat numbers white and more visible with enhanced glow
"""

import sys
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_stat_numbers():
    filepath = 'css/components.css'

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix .stat-number
    old_stat = '''  color: var(--copper-medium);
  text-shadow: 0 0 20px rgba(167, 200, 161, 0.5);'''

    new_stat = '''  color: #FFFFFF;
  text-shadow: 0 0 30px rgba(200, 159, 128, 0.8),
               0 0 60px rgba(167, 200, 161, 0.6),
               0 2px 4px rgba(0, 0, 0, 0.5);'''

    if old_stat in content:
        content = content.replace(old_stat, new_stat)
        print("✓ Fixed .stat-number")
    else:
        print("⚠ .stat-number pattern not found")

    # Fix .stat-number-large
    old_large = '''.stat-number-large {
  font-size: var(--text-4xl);
  font-weight: var(--weight-black);
  color: var(--copper-medium);
  text-shadow: 0 0 20px rgba(167, 200, 161, 0.3);'''

    new_large = '''.stat-number-large {
  font-size: var(--text-4xl);
  font-weight: var(--weight-black);
  color: #FFFFFF;
  text-shadow: 0 0 30px rgba(200, 159, 128, 0.8),
               0 0 60px rgba(167, 200, 161, 0.6),
               0 2px 4px rgba(0, 0, 0, 0.5);'''

    if old_large in content:
        content = content.replace(old_large, new_large)
        print("✓ Fixed .stat-number-large")
    else:
        print("⚠ .stat-number-large pattern not found")

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print("\n✅ Stat numbers are now bright white with enhanced glow!")
    print("The numbers 95, 31, and 3000 will be highly visible now!")

if __name__ == '__main__':
    fix_stat_numbers()
