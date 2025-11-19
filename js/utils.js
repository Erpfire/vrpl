// Utility functions for VRPL Website

// Debounce function for scroll events
function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

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

// Lazy load images
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// API call helper function
async function apiCall(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(endpoint, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'API request failed');
    }

    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
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

// Show notification message
function showNotification(message, type = 'success') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(n => n.remove());

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === 'success' ? '#496D53' : '#9C6A4A'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease;
    max-width: 400px;
    font-size: 14px;
    line-height: 1.5;
  `;

  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Add notification animations to document
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Handle contact form submission
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Disable submit button
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';

      try {
        const formData = {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          organization: document.getElementById('organization')?.value || '',
          phone: document.getElementById('phone')?.value || '',
          subject: document.getElementById('subject').value,
          message: document.getElementById('message').value
        };

        // Validate form
        const errors = validateContactForm(formData);
        if (errors.length > 0) {
          showNotification(errors.join('\n'), 'error');
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
          return;
        }

        // Send to API
        const response = await apiCall('/api/contact', 'POST', formData);

        if (response.success) {
          showNotification(response.message, 'success');
          contactForm.reset();
        } else {
          throw new Error(response.error || 'Failed to send message');
        }

      } catch (error) {
        console.error('Contact form error:', error);
        showNotification(error.message || 'An error occurred. Please try again.', 'error');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  }

  // Initialize lazy loading
  lazyLoadImages();
});

// Newsletter subscription (for future use)
async function subscribeNewsletter(email) {
  try {
    const response = await apiCall('/api/subscribe', 'POST', { email });
    if (response.success) {
      showNotification(response.message, 'success');
      return true;
    }
    return false;
  } catch (error) {
    showNotification(error.message || 'Failed to subscribe', 'error');
    return false;
  }
}

// Fetch dynamic stats (for future use)
async function fetchStats() {
  try {
    const response = await apiCall('/api/stats');
    return response;
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return null;
  }
}
