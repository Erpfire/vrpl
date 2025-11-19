/*
 * VRPL Website - Main JavaScript
 * Menu scroll + full-screen overlay menu with image-on-hover effect
 * Premium animations and interactions
 */

// ========================================
// NAVIGATION MANAGER
// ========================================

class NavigationManager {
  constructor() {
    this.header = document.getElementById('mainHeader');
    this.menuTrigger = document.getElementById('menuTrigger');
    this.overlayMenu = document.getElementById('overlayMenu');
    this.overlayClose = document.getElementById('overlayClose');
    this.overlayBackground = document.getElementById('overlayBackground');
    this.menuItems = document.querySelectorAll('.overlay-menu-item');
    this.breadcrumbLinks = document.querySelectorAll('.breadcrumb-link');

    this.init();
  }

  init() {
    this.setupHeaderScroll();
    this.setupOverlayMenu();
    this.setupImageHover();
    this.setupSmoothScroll();
  }

  setupHeaderScroll() {
    let lastScroll = 0;
    const heroSection = document.querySelector('.hero-section');
    const heroHeight = heroSection ? heroSection.offsetHeight : 800;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > heroHeight * 0.8) {
        this.header.classList.add('visible');
      } else {
        this.header.classList.remove('visible');
      }

      lastScroll = currentScroll;
    });
  }

  setupOverlayMenu() {
    if (!this.menuTrigger || !this.overlayMenu) return;

    this.menuTrigger.addEventListener('click', () => {
      this.openOverlay();
    });

    this.overlayClose?.addEventListener('click', () => {
      this.closeOverlay();
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlayMenu.classList.contains('active')) {
        this.closeOverlay();
      }
    });

    // Close when clicking background
    this.overlayMenu.addEventListener('click', (e) => {
      if (e.target === this.overlayMenu) {
        this.closeOverlay();
      }
    });
  }

  openOverlay() {
    this.overlayMenu.classList.add('active');
    this.menuTrigger.classList.add('active');
    this.overlayMenu.setAttribute('aria-hidden', 'false');
    this.menuTrigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  closeOverlay() {
    this.overlayMenu.classList.remove('active');
    this.menuTrigger.classList.remove('active');
    this.overlayMenu.setAttribute('aria-hidden', 'true');
    this.menuTrigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  setupImageHover() {
    if (!this.overlayBackground) return;

    this.menuItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        const imagePath = item.getAttribute('data-image');
        if (imagePath) {
          this.overlayBackground.style.backgroundImage = `url(${imagePath})`;
        }
      });
    });
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const targetId = href;
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const headerHeight = this.header?.offsetHeight || 80;
          const targetPosition = targetElement.offsetTop - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Close overlay if open
          if (this.overlayMenu?.classList.contains('active')) {
            this.closeOverlay();
          }
        }
      });
    });
  }
}

// ========================================
// SCROLL OBSERVER
// ========================================

class ScrollObserver {
  constructor() {
    this.sections = document.querySelectorAll('section[id]');
    this.breadcrumbLinks = document.querySelectorAll('.breadcrumb-link');
    this.observerOptions = {
      threshold: 0.3,
      rootMargin: '-100px 0px -100px 0px'
    };

    this.init();
  }

  init() {
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      this.observerOptions
    );

    this.sections.forEach(section => {
      this.observer.observe(section);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');
        this.updateBreadcrumb(sectionId);

        // Trigger animations
        if (entry.target.classList.contains('animate-on-scroll')) {
          entry.target.classList.add('animated');
        }
      }
    });
  }

  updateBreadcrumb(activeSectionId) {
    this.breadcrumbLinks.forEach(link => {
      const linkHref = link.getAttribute('href').replace('#', '');

      if (linkHref === activeSectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// ========================================
// ANIMATIONS
// ========================================

// Number Counter Animation
class NumberCounter {
  constructor(element) {
    this.element = element;
    this.target = parseInt(element.getAttribute('data-count'));
    this.current = 0;
    this.duration = 2000;
    this.hasAnimated = false;
  }

  animate() {
    if (this.hasAnimated) return;
    this.hasAnimated = true;

    const increment = this.target / (this.duration / 16);

    const updateCount = () => {
      this.current += increment;

      if (this.current < this.target) {
        this.element.textContent = Math.floor(this.current);
        requestAnimationFrame(updateCount);
      } else {
        this.element.textContent = this.target;
      }
    };

    this.element.classList.add('counting');
    updateCount();
  }
}

// Fade In Animations
class FadeInAnimations {
  constructor() {
    this.elements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in, .slide-in-left, .slide-in-right');
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.init();
  }

  init() {
    const observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      this.observerOptions
    );

    this.elements.forEach(el => observer.observe(el));
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }
}

// Particle Animation for Hero Section
class ParticleAnimation {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.particleCount = 30;
    this.init();
  }

  init() {
    for (let i = 0; i < this.particleCount; i++) {
      this.createParticle();
    }
  }

  createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 4 + 2;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;

    particle.style.cssText = `
      position: absolute;
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, rgba(167, 200, 161, 0.8), rgba(167, 200, 161, 0));
      border-radius: 50%;
      animation: float ${duration}s ${delay}s infinite ease-in-out;
      pointer-events: none;
    `;

    this.container.appendChild(particle);
  }
}

// Scroll Progress Indicator
class ScrollProgress {
  constructor() {
    this.progressBar = this.createProgressBar();
    this.init();
  }

  createProgressBar() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 4px;
      background: linear-gradient(90deg, #9C6A4A, #A7C8A1);
      z-index: 9999;
      transform-origin: left;
      width: 0;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(bar);
    return bar;
  }

  init() {
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      this.progressBar.style.width = scrollPercent + '%';
    });
  }
}

// Scroll Indicator Manager (hide on scroll)
class ScrollIndicatorManager {
  constructor() {
    this.scrollIndicator = document.querySelector('.scroll-indicator');
    if (!this.scrollIndicator) return;

    this.hideThreshold = 100; // Hide after scrolling 100px
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;

      if (scrollTop > this.hideThreshold) {
        this.scrollIndicator.style.opacity = '0';
        this.scrollIndicator.style.visibility = 'hidden';
      } else {
        this.scrollIndicator.style.opacity = '0.9';
        this.scrollIndicator.style.visibility = 'visible';
      }
    });
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Smooth scroll to section
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const headerHeight = document.getElementById('mainHeader')?.offsetHeight || 80;
    const targetPosition = section.offsetTop - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// Form validation
function validateContactForm(formData) {
  const errors = [];

  if (!formData.name || formData.name.trim().length < 2) {
    errors.push('Please enter a valid name');
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailPattern.test(formData.email)) {
    errors.push('Please enter a valid email address');
  }

  if (!formData.subject) {
    errors.push('Please select a subject');
  }

  if (!formData.message || formData.message.trim().length < 10) {
    errors.push('Please enter a message (minimum 10 characters)');
  }

  return errors;
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Navigation
  new NavigationManager();

  // Initialize Scroll Observer
  new ScrollObserver();

  // Initialize Animations
  new FadeInAnimations();

  // Initialize Particle Animation
  new ParticleAnimation('particleContainer');

  // Initialize Scroll Progress
  new ScrollProgress();

  // Initialize Scroll Indicator Manager (hide on scroll)
  new ScrollIndicatorManager();

  // Number Counters
  const counterElements = document.querySelectorAll('[data-count]');
  const counters = Array.from(counterElements).map(el => new NumberCounter(el));

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = counters.find(c => c.element === entry.target);
        if (counter) counter.animate();
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => counterObserver.observe(el));

  // Contact Form Handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = {
        name: document.getElementById('name')?.value,
        email: document.getElementById('email')?.value,
        organization: document.getElementById('organization')?.value,
        phone: document.getElementById('phone')?.value,
        subject: document.getElementById('subject')?.value,
        message: document.getElementById('message')?.value
      };

      const errors = validateContactForm(formData);

      if (errors.length > 0) {
        alert('Please correct the following errors:\\n' + errors.join('\\n'));
        return;
      }

      console.log('Form submitted:', formData);
      alert('Thank you for your message! We will get back to you soon.');
      contactForm.reset();
    });
  }

  // Add float keyframe animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% {
        transform: translateY(0) translateX(0);
        opacity: 0.3;
      }
      50% {
        transform: translateY(-20px) translateX(10px);
        opacity: 0.8;
      }
    }
  `;
  document.head.appendChild(style);

  // Trigger initial animations for visible elements
  setTimeout(() => {
    const initialElements = document.querySelectorAll('.fade-in-up, .scale-in');
    initialElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        setTimeout(() => {
          el.classList.add('animated');
        }, index * 100);
      }
    });
  }, 100);
});

// Export functions for use in HTML onclick handlers
window.scrollToSection = scrollToSection;
