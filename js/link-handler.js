/**
 * Link Handler - Redirects broken/missing pages to Coming Soon page
 * Prevents 404 errors and provides better user experience
 */

(function() {
  'use strict';

  // List of placeholder/incomplete pages that should redirect to coming soon
  const comingSoonPages = [
    '#privacy',
    '#terms',
    '#accessibility',
    'privacy.html',
    'terms.html',
    'accessibility.html',
    'privacy',
    'terms',
    'accessibility'
  ];

  // Handle all clicks on links
  document.addEventListener('DOMContentLoaded', function() {

    // Get all links on the page
    const links = document.querySelectorAll('a[href]');

    links.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Check if this is a placeholder link
        if (comingSoonPages.includes(href)) {
          e.preventDefault();
          window.location.href = 'coming-soon.html';
          return;
        }

        // For internal HTML links, check if they exist
        if (href &&
            href.endsWith('.html') &&
            !href.startsWith('http') &&
            !href.startsWith('//')) {

          // Extract just the filename without hash
          const filename = href.split('#')[0];

          // Skip if it's a hash-only link on current page
          if (href.startsWith('#')) {
            return;
          }

          // Check if page exists by trying to fetch it
          checkPageExists(filename, e, this);
        }
      });
    });

    // Function to check if page exists
    function checkPageExists(url, event, linkElement) {
      // List of pages we know exist
      const existingPages = [
        'index.html',
        'about.html',
        'technology.html',
        'phases.html',
        'impact.html',
        'government.html',
        'training.html',
        'contact.html',
        'coming-soon.html'
      ];

      // If page is not in our existing pages list, redirect to coming soon
      if (!existingPages.includes(url)) {
        event.preventDefault();
        window.location.href = 'coming-soon.html';
      }
    }

    // Handle 404 errors - if page doesn't exist, redirect
    window.addEventListener('error', function(e) {
      // Check if we're on a page that doesn't exist
      if (document.title.includes('404') ||
          document.title.includes('Not Found') ||
          document.body.innerHTML.includes('404')) {
        window.location.href = 'coming-soon.html';
      }
    }, true);

  });

})();
