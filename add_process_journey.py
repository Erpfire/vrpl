#!/usr/bin/env python3
"""
Add visual process journey section to technology.html
"""

import sys
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

PROCESS_JOURNEY_HTML = '''
    <!-- VISUAL PROCESS JOURNEY SECTION -->
    <section class="section process-journey">
      <div class="container">
        <div class="section-header center">
          <span class="section-tag">Transformation Journey</span>
          <h2 class="section-title">From Waste to Energy</h2>
          <div class="copper-divider center"></div>
          <p class="section-description">Follow the complete transformation process</p>
        </div>

        <div class="process-journey-grid">
          <div class="journey-step">
            <div class="journey-number">01</div>
            <div class="journey-image-container">
              <img src="assets/images/process/waste-input.jpg" alt="Waste Input Stage" class="journey-image">
            </div>
            <h3>Waste Input</h3>
            <p>MSW, plastic, biomedical, and hazardous waste received and sorted</p>
          </div>

          <div class="journey-arrow">→</div>

          <div class="journey-step">
            <div class="journey-number">02</div>
            <div class="journey-image-container">
              <img src="assets/images/process/plasma-chamber.jpg" alt="Plasma Chamber" class="journey-image">
            </div>
            <h3>Plasma Chamber</h3>
            <p>Waste gasified at 3000°C+ in oxygen-starved environment</p>
          </div>

          <div class="journey-arrow">→</div>

          <div class="journey-step">
            <div class="journey-number">03</div>
            <div class="journey-image-container">
              <img src="assets/images/process/syngas-output.jpg" alt="Syngas Production" class="journey-image">
            </div>
            <h3>Syngas Output</h3>
            <p>Clean, hydrogen-rich syngas produced</p>
          </div>

          <div class="journey-arrow">→</div>

          <div class="journey-step">
            <div class="journey-number">04</div>
            <div class="journey-image-container">
              <img src="assets/images/process/energy-generation.jpg" alt="Energy Generation" class="journey-image">
            </div>
            <h3>Energy Generation</h3>
            <p>Electricity produced and distributed to grid</p>
          </div>
        </div>

        <div class="process-stats-summary">
          <div class="stat-summary-item">
            <span class="stat-value">95%</span>
            <span class="stat-label">Waste Conversion</span>
          </div>
          <div class="stat-summary-item">
            <span class="stat-value">3000°C</span>
            <span class="stat-label">Operating Temperature</span>
          </div>
          <div class="stat-summary-item">
            <span class="stat-value">-31 kg</span>
            <span class="stat-label">CO₂ per Ton MSW</span>
          </div>
          <div class="stat-summary-item">
            <span class="stat-value">Zero</span>
            <span class="stat-label">Harmful Emissions</span>
          </div>
        </div>
      </div>
    </section>

    <div class="section-divider"></div>

'''

def add_section():
    with open('technology.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the marker to insert before
    marker = '    <!-- BENEFITS SECTION -->'

    if marker not in content:
        print("Marker not found!")
        return False

    # Check if already added
    if 'process-journey' in content:
        print("Process journey section already exists!")
        return False

    # Insert the section
    content = content.replace(marker, PROCESS_JOURNEY_HTML + marker)

    # Write back
    with open('technology.html', 'w', encoding='utf-8') as f:
        f.write(content)

    print("Successfully added visual process journey section!")
    return True

if __name__ == '__main__':
    add_section()
