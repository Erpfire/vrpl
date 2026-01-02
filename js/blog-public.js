class BlogPublic {
  constructor() {
    this.postsGrid = document.getElementById('postsGrid');
    this.paginationEl = document.getElementById('pagination');
    this.searchInput = document.getElementById('searchInput');
    this.categoryFilter = document.getElementById('categoryFilter');
    this.categoriesList = document.getElementById('categoriesList');
    this.featuredPostEl = document.getElementById('featuredPost');

    this.currentPage = 1;
    this.postsPerPage = 10;
    this.loading = false;

    this.init();
  }

  init() {
    if (this.postsGrid) {
      this.loadPosts();
      this.loadCategories();
      this.loadFeatured();
      this.setupEventListeners();
    }

    if (document.getElementById('postContent')) {
      this.loadSinglePost();
    }
  }

  setupEventListeners() {
    this.searchInput.addEventListener('input', this.debounce(() => this.search(), 500));
    this.categoryFilter.addEventListener('change', () => this.loadPosts(this.categoryFilter.value));
  }

  async loadPosts(categorySlug = null) {
    if (this.loading) return;

    this.loading = true;
    this.setLoadingState(true);

    try {
      let url = `/api/blog/posts?page=${this.currentPage}&limit=${this.postsPerPage}`;

      if (categorySlug) {
        url = `/api/blog/categories/${categorySlug}?page=${this.currentPage}&limit=${this.postsPerPage}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        this.renderPosts(data.data.posts);
        this.renderPagination(data.data.pagination);
      } else {
        this.showError('Failed to load posts');
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      this.showError('An error occurred while loading posts');
    } finally {
      this.loading = false;
      this.setLoadingState(false);
    }
  }

  async loadCategories() {
    try {
      const response = await fetch('/api/blog/categories');
      const data = await response.json();

      if (data.success) {
        this.renderCategories(data.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  async loadFeatured() {
    try {
      const response = await fetch('/api/blog/featured');
      const data = await response.json();

      if (data.success && data.data) {
        this.renderFeatured(data.data);
      }
    } catch (error) {
      console.error('Error loading featured post:', error);
    }
  }

  async loadSinglePost() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
      window.location.href = '/blog.html';
      return;
    }

    try {
      const response = await fetch(`/api/blog/posts/${slug}`);
      const data = await response.json();

      if (data.success) {
        this.renderSinglePost(data.data);
      } else {
        document.getElementById('postContent').innerHTML = `
          <div class="error-state">
            <h2>Post Not Found</h2>
            <p>The post you're looking for doesn't exist.</p>
            <a href="blog.html" class="btn-copper">Back to Blog</a>
          </div>
        `;
      }
    } catch (error) {
      console.error('Error loading post:', error);
      document.getElementById('postContent').innerHTML = `
        <div class="error-state">
          <h2>Error Loading Post</h2>
          <p>An error occurred while loading the post. Please try again later.</p>
          <a href="blog.html" class="btn-copper">Back to Blog</a>
        </div>
      `;
    }
  }

  async search() {
    const query = this.searchInput.value.trim();

    if (query.length < 2) {
      this.loadPosts();
      return;
    }

    this.loading = true;
    this.setLoadingState(true);

    try {
      const response = await fetch(`/api/blog/search?q=${encodeURIComponent(query)}&page=${this.currentPage}&limit=${this.postsPerPage}`);
      const data = await response.json();

      if (data.success) {
        this.renderPosts(data.data.posts);
        this.renderPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error searching posts:', error);
      this.showError('Search failed');
    } finally {
      this.loading = false;
      this.setLoadingState(false);
    }
  }

  renderPosts(posts) {
    if (posts.length === 0) {
      this.postsGrid.innerHTML = `
        <div class="empty-state">
          <h2>No Posts Found</h2>
          <p>There are no posts matching your criteria.</p>
        </div>
      `;
      return;
    }

    this.postsGrid.innerHTML = posts.map(post => `
      <article class="blog-card" data-slug="${this.escapeHtml(post.slug)}">
        <div class="card-image">
          ${post.cover_image ? `<img src="${post.cover_image.startsWith('http') || post.cover_image.startsWith('/') ? post.cover_image : '/uploads/blog/' + post.cover_image}" alt="${this.escapeHtml(post.title)}" loading="lazy">` : ''}
          <div class="card-category">${this.escapeHtml(post.category_name || 'Uncategorized')}</div>
        </div>
        <div class="card-content">
          <h2 class="card-title">
            <a href="blog-post.html?slug=${post.slug}">${this.escapeHtml(post.title)}</a>
          </h2>
          <p class="card-excerpt">${this.escapeHtml(post.excerpt || '')}</p>
          <div class="card-meta">
            <span class="meta-date">${this.formatDate(post.published_at || post.created_at)}</span>
            <span class="meta-views">${post.view_count} views</span>
            ${post.tags && post.tags.length > 0 ? `
              <span class="meta-tags">
                ${post.tags.slice(0, 3).map(tag => `<span class="tag">#${this.escapeHtml(tag)}</span>`).join(' ')}
              </span>
            ` : ''}
          </div>
        </div>
      </article>
    `).join('');
  }

  renderCategories(categories) {
    this.categoriesList.innerHTML = categories.map(cat => `
      <li>
        <a href="blog.html?category=${cat.slug}" class="category-link">
          ${this.escapeHtml(cat.name)}
          <span class="category-count">(${cat.post_count || 0})</span>
        </a>
      </li>
    `).join('');

    this.categoryFilter.innerHTML = `
      <option value="">All Categories</option>
      ${categories.map(cat => `<option value="${cat.slug}">${this.escapeHtml(cat.name)}</option>`).join('')}
    `;
  }

  renderFeatured(post) {
    this.featuredPostEl.innerHTML = `
      <a href="blog-post.html?slug=${post.slug}" class="featured-card">
        ${post.cover_image ? `<img src="${post.cover_image.startsWith('http') || post.cover_image.startsWith('/') ? post.cover_image : '/uploads/blog/' + post.cover_image}" alt="${this.escapeHtml(post.title)}" class="featured-image">` : ''}
        <div class="featured-content">
          <span class="featured-badge">⭐ Featured</span>
          <h4>${this.escapeHtml(post.title)}</h4>
          <p>${this.escapeHtml(post.excerpt || '')}</p>
        </div>
      </a>
    `;
  }

  renderSinglePost(post) {
    document.title = `${post.title} - VRPL`;
    document.getElementById('metaDescription').setAttribute('content', post.excerpt || post.title);
    document.getElementById('ogTitle').setAttribute('content', post.title);
    document.getElementById('ogDescription').setAttribute('content', post.excerpt || post.title);
    document.getElementById('ogImage').setAttribute('content', post.cover_image || '');

    const postContent = document.getElementById('postContent');

    postContent.innerHTML = `
      <header class="post-header">
        <h1 class="post-title">${this.escapeHtml(post.title)}</h1>
        <div class="post-meta-bar">
          <span class="meta-date">${this.formatDate(post.published_at || post.created_at)}</span>
          ${post.category_name ? `<span class="meta-category">${this.escapeHtml(post.category_name)}</span>` : ''}
          <span class="meta-views">${post.view_count} views</span>
        </div>
        ${post.tags && post.tags.length > 0 ? `
          <div class="post-tags">
            ${post.tags.map(tag => `<span class="post-tag">#${this.escapeHtml(tag)}</span>`).join(' ')}
          </div>
        ` : ''}
      </header>

      ${post.cover_image ? `
        <figure class="post-hero-image">
          <img src="${post.cover_image.startsWith('http') || post.cover_image.startsWith('/') ? post.cover_image : '/uploads/blog/' + post.cover_image}" alt="${this.escapeHtml(post.title)}">
        </figure>
      ` : ''}

      <div class="post-body">${post.content}</div>

      <div class="post-footer">
        <div class="share-section">
          <h3>Share this post</h3>
          <div class="share-buttons" id="shareButtons">
            <button class="share-btn facebook" data-platform="facebook">
              <span class="share-icon">f</span>
              Share on Facebook
            </button>
            <button class="share-btn twitter" data-platform="twitter">
              <span class="share-icon">𝕏</span>
              Share on Twitter
            </button>
            <button class="share-btn linkedin" data-platform="linkedin">
              <span class="share-icon">in</span>
              Share on LinkedIn
            </button>
            <button class="share-btn whatsapp" data-platform="whatsapp">
              <span class="share-icon">📱</span>
              Share on WhatsApp
            </button>
          </div>
        </div>
      </div>
    `;

    this.setupShareButtons(post);
    this.loadComments(post.id);
  }

  setupShareButtons(post) {
    const shareButtonsContainer = document.getElementById('shareButtons');
    if (!shareButtonsContainer) return;

    const currentUrl = encodeURIComponent(window.location.href);
    const postTitle = encodeURIComponent(post.title);
    const postDescription = encodeURIComponent(post.excerpt || post.title);

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${postTitle}&url=${currentUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`,
      whatsapp: `https://wa.me/?text=${postTitle}%20${currentUrl}`
    };

    shareButtonsContainer.querySelectorAll('.share-btn').forEach(button => {
      button.addEventListener('click', () => {
        const platform = button.getAttribute('data-platform');
        const url = shareUrls[platform];

        if (url) {
          if (platform === 'whatsapp') {
            window.location.href = url;
          } else {
            const windowFeatures = 'width=600,height=400,menubar=no,toolbar=no,scrollbars=yes,resizable=yes';
            window.open(url, '_blank', windowFeatures);
          }
        }
      });
    });
  }

  async loadComments(postId) {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const slug = urlParams.get('slug');

      const response = await fetch(`/api/comments/posts/${slug}/comments`);
      const data = await response.json();

      if (data.success) {
        this.renderComments(data.data);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }

  renderComments(comments) {
    const postContent = document.getElementById('postContent');

    const commentsHTML = `
      <section class="comments-section">
        <h3>Comments (${comments.length})</h3>

        ${comments.length === 0 ? '<p class="no-comments">No comments yet. Be the first to comment!</p>' : ''}

        <div class="comments-list">
          ${comments.map(comment => `
            <div class="comment-item">
              <div class="comment-header">
                <span class="comment-author">${this.escapeHtml(comment.name)}</span>
                <span class="comment-date">${this.formatDate(comment.created_at)}</span>
              </div>
              <div class="comment-body">${this.escapeHtml(comment.comment)}</div>
            </div>
          `).join('')}
        </div>

        <form id="commentForm" class="comment-form">
          <h3>Leave a Comment</h3>
          <div class="form-group">
            <label for="commentName">Name *</label>
            <input type="text" id="commentName" name="name" class="form-input" required>
          </div>
          <div class="form-group">
            <label for="commentEmail">Email *</label>
            <input type="email" id="commentEmail" name="email" class="form-input" required>
          </div>
          <div class="form-group">
            <label for="commentText">Comment *</label>
            <textarea id="commentText" name="comment" class="form-textarea" rows="5" required></textarea>
          </div>
          <button type="submit" class="btn-copper">Submit Comment</button>
          <p class="form-hint">Your comment will be reviewed before being published.</p>
        </form>
      </section>
    `;

    postContent.insertAdjacentHTML('beforeend', commentsHTML);

    document.getElementById('commentForm').addEventListener('submit', (e) => this.handleSubmitComment(e));
  }

  async handleSubmitComment(e) {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    const formData = {
      name: document.getElementById('commentName').value.trim(),
      email: document.getElementById('commentEmail').value.trim(),
      comment: document.getElementById('commentText').value.trim()
    };

    try {
      const response = await fetch(`/api/comments/posts/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Comment submitted successfully! It will be reviewed before being published.');
        document.getElementById('commentForm').reset();
      } else {
        alert('Failed to submit comment: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('An error occurred while submitting your comment');
    }
  }

  renderPagination(pagination) {
    if (pagination.totalPages <= 1) {
      this.paginationEl.innerHTML = '';
      return;
    }

    let buttons = '';

    if (pagination.page > 1) {
      buttons += `<button onclick="changePage(${pagination.page - 1})" class="page-btn">Previous</button>`;
    }

    for (let i = 1; i <= pagination.totalPages; i++) {
      const active = i === pagination.page ? 'active' : '';
      buttons += `<button onclick="changePage(${i})" class="page-btn ${active}">${i}</button>`;
    }

    if (pagination.page < pagination.totalPages) {
      buttons += `<button onclick="changePage(${pagination.page + 1})" class="page-btn">Next</button>`;
    }

    this.paginationEl.innerHTML = `<div class="pagination-buttons">${buttons}</div>`;
  }

  setLoadingState(isLoading) {
    if (isLoading) {
      this.postsGrid.innerHTML = '<p class="loading-text">Loading posts...</p>';
    }
  }

  showError(message) {
    this.postsGrid.innerHTML = `
      <div class="error-state">
        <h2>Error</h2>
        <p>${message}</p>
      </div>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  debounce(func, wait) {
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
}

function changePage(page) {
  const blogPublic = new BlogPublic();
  blogPublic.currentPage = page;
  blogPublic.loadPosts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

if (document.getElementById('postsGrid') || document.getElementById('postContent')) {
  new BlogPublic();
}
