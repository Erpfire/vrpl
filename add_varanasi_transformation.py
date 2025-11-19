#!/usr/bin/env python3
"""
Add Varanasi Transformation section to impact.html
"""

import sys
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

TRANSFORMATION_HTML = '''
    <!-- VARANASI TRANSFORMATION VISION -->
    <section class="section varanasi-transformation">
      <div class="container">
        <div class="section-header center">
          <span class="section-tag">Our Vision</span>
          <h2 class="section-title">Transforming Varanasi's Future</h2>
          <div class="copper-divider center"></div>
          <p class="section-description">From ancient heritage to sustainable future</p>
        </div>

        <div class="transformation-showcase">
          <div class="transformation-item">
            <div class="transformation-image-container">
              <img src="assets/images/additionalimages/varanasi ghat.jpg" alt="Varanasi Ghats" class="transformation-image">
              <div class="transformation-overlay">
                <span class="transformation-label">Heritage</span>
              </div>
            </div>
            <div class="transformation-content">
              <h3>Preserving Our Sacred Heritage</h3>
              <p>
                Varanasi, one of the world's oldest continuously inhabited cities, deserves waste management
                solutions that honor its cultural and spiritual significance while protecting the holy Ganges.
              </p>
              <ul class="transformation-points">
                <li>Sacred ghats protected from pollution</li>
                <li>Clean air for pilgrims and residents</li>
                <li>Preserving architectural heritage</li>
              </ul>
            </div>
          </div>

          <div class="transformation-arrow-container">
            <div class="transformation-arrow">→</div>
            <span class="transformation-plus">+</span>
            <span class="transformation-text">Clean Technology</span>
          </div>

          <div class="transformation-item">
            <div class="transformation-image-container">
              <img src="assets/images/additionalimages/green landscape.jpg" alt="Clean Green Future" class="transformation-image">
              <div class="transformation-overlay success">
                <span class="transformation-label">Sustainable Future</span>
              </div>
            </div>
            <div class="transformation-content">
              <h3>Building a Sustainable Tomorrow</h3>
              <p>
                With plasma gasification technology, Varanasi can become a model smart city - combining
                ancient wisdom with cutting-edge environmental solutions.
              </p>
              <ul class="transformation-points success">
                <li>Zero-waste circular economy</li>
                <li>Clean energy generation</li>
                <li>Green hydrogen production</li>
                <li>Improved public health</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="transformation-stats">
          <div class="trans-stat">
            <div class="trans-stat-icon">🏛️</div>
            <div class="trans-stat-value">3000+</div>
            <div class="trans-stat-label">Years of Heritage</div>
          </div>
          <div class="trans-stat">
            <div class="trans-stat-icon">♻️</div>
            <div class="trans-stat-value">Zero</div>
            <div class="trans-stat-label">Landfill Waste</div>
          </div>
          <div class="trans-stat">
            <div class="trans-stat-icon">🌱</div>
            <div class="trans-stat-value">Clean</div>
            <div class="trans-stat-label">Air & Water</div>
          </div>
          <div class="trans-stat">
            <div class="trans-stat-icon">⚡</div>
            <div class="trans-stat-value">Green</div>
            <div class="trans-stat-label">Energy Future</div>
          </div>
        </div>
      </div>
    </section>

    <div class="section-divider"></div>

'''

def add_section():
    with open('impact.html', 'r', encoding='utf-8') as f:
        content = f.read()

    marker = '    <!-- CHALLENGES FACED BY OTHER WTE PLANTS -->'

    if marker not in content:
        print("Marker not found!")
        return False

    if 'varanasi-transformation' in content:
        print("Varanasi transformation section already exists!")
        return False

    content = content.replace(marker, TRANSFORMATION_HTML + marker)

    with open('impact.html', 'w', encoding='utf-8') as f:
        f.write(content)

    print("✅ Added Varanasi Transformation section!")
    print("   - Using varanasi ghat.jpg")
    print("   - Using green landscape.jpg")
    print("   - Beautiful before/after transformation showcase!")
    return True

if __name__ == '__main__':
    add_section()
