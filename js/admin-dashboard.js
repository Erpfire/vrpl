class AdminDashboard {
  constructor() {
    this.postsList = document.getElementById('postsList');
    this.totalPostsEl = document.getElementById('totalPosts');
    this.publishedPostsEl = document.getElementById('publishedPosts');
    this.draftPostsEl = document.getElementById('draftPosts');
    this.pendingCommentsEl = document.getElementById('pendingComments');

    this.init();
  }

  init() {
    if (!AdminSession.isAuthenticated()) {
      window.location.href = '/admin-login.html';
      return;
    }

    this.loadStats();
    this.loadPosts();
  }

  async loadStats() {
    try {
      const token = AdminSession.getToken();
      const response = await fetch('/api/admin/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        const posts = data.data;

        this.totalPostsEl.textContent = posts.length;
        this.publishedPostsEl.textContent = posts.filter(p => p.published).length;
        this.draftPostsEl.textContent = posts.filter(p => !p.published).length;
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  async loadPosts() {
    try {
      const token = AdminSession.getToken();
      const response = await fetch('/api/admin/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        this.renderPosts(data.data);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      this.postsList.innerHTML = '<p class="error-text">Failed to load posts</p>';
    }
  }

  renderPosts(posts) {
    if (posts.length === 0) {
      this.postsList.innerHTML = `
        <div class="empty-state">
          <p>No posts yet. Create your first post!</p>
          <a href="admin-create-post.html" class="btn-copper">Create Post</a>
        </div>
      `;
      return;
    }

    this.postsList.innerHTML = posts.map(post => `
      <div class="post-item ${post.published ? 'published' : 'draft'}">
        <div class="post-info">
          <h3>${this.escapeHtml(post.title)}</h3>
          <p>${this.escapeHtml(post.excerpt || 'No excerpt')}</p>
          <div class="post-meta">
            <span class="status-badge ${post.published ? 'published' : 'draft'}">
              ${post.published ? 'Published' : 'Draft'}
            </span>
            <span>${new Date(post.created_at).toLocaleDateString()}</span>
            <span>${post.view_count} views</span>
            ${post.featured ? '<span class="featured-badge">⭐ Featured</span>' : ''}
          </div>
        </div>
        <div class="post-actions">
          <a href="admin-edit-post.html?id=${post.id}" class="btn-edit">Edit</a>
          <button onclick="deletePost(${post.id}, '${this.escapeHtml(post.title)}')" class="btn-delete">Delete</button>
        </div>
      </div>
    `).join('');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

async function deletePost(id, title) {
  if (!confirm(`Are you sure you want to delete "${title}"?`)) {
    return;
  }

  try {
    const token = AdminSession.getToken();
    const response = await fetch(`/api/admin/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      alert('Post deleted successfully');
      location.reload();
    } else {
      alert('Failed to delete post: ' + data.error);
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    alert('An error occurred while deleting the post');
  }
}

if (document.getElementById('postsList')) {
  new AdminDashboard();
}
