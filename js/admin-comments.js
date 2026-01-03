// Admin Comments Management with Pagination

const API_BASE = '/api/comments';

class CommentsManager {
  constructor() {
    this.pendingList = document.getElementById('pendingCommentsList');
    this.approvedList = document.getElementById('approvedCommentsList');

    this.pendingPage = 1;
    this.approvedPage = 1;
    this.pageSize = 25;
    this.pendingTotal = 0;
    this.approvedTotal = 0;

    this.filters = {
      postId: '',
      dateFrom: '',
      dateTo: '',
      search: ''
    };

    this.init();
  }

  init() {
    if (!AdminSession.isAuthenticated()) {
      window.location.href = '/admin-login.html';
      return;
    }

    this.bindEventDelegation();
    this.bindPaginationControls();
    this.bindFilters();
    this.fetchPosts();
    this.fetchComments();
  }

  bindEventDelegation() {
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (target.tagName === 'BUTTON') {
        const id = target.dataset.id;
        const action = target.dataset.action;

        if (action === 'approve') {
          this.approveComment(parseInt(id));
        } else if (action === 'unapprove') {
          this.unapproveComment(parseInt(id));
        } else if (action === 'delete') {
          this.deleteComment(parseInt(id));
        }
      }
    });
  }

  bindPaginationControls() {
    document.getElementById('pendingPrev').addEventListener('click', () => {
      if (this.pendingPage > 1) {
        this.pendingPage--;
        this.fetchPendingComments();
      }
    });

    document.getElementById('pendingNext').addEventListener('click', () => {
      const maxPage = Math.ceil(this.pendingTotal / this.pageSize);
      if (this.pendingPage < maxPage) {
        this.pendingPage++;
        this.fetchPendingComments();
      }
    });

    document.getElementById('approvedPrev').addEventListener('click', () => {
      if (this.approvedPage > 1) {
        this.approvedPage--;
        this.fetchApprovedComments();
      }
    });

    document.getElementById('approvedNext').addEventListener('click', () => {
      const maxPage = Math.ceil(this.approvedTotal / this.pageSize);
      if (this.approvedPage < maxPage) {
        this.approvedPage++;
        this.fetchApprovedComments();
      }
    });

    document.getElementById('pendingPageSize').addEventListener('change', (e) => {
      this.pageSize = parseInt(e.target.value);
      this.pendingPage = 1;
      this.fetchPendingComments();
    });

    document.getElementById('approvedPageSize').addEventListener('change', (e) => {
      this.pageSize = parseInt(e.target.value);
      this.approvedPage = 1;
      this.fetchApprovedComments();
    });
  }

  bindFilters() {
    document.getElementById('applyFilters').addEventListener('click', () => {
      this.filters.postId = document.getElementById('postsFilter').value;
      this.filters.dateFrom = document.getElementById('dateFrom').value;
      this.filters.dateTo = document.getElementById('dateTo').value;
      this.filters.search = document.getElementById('searchFilter').value.trim();
      this.pendingPage = 1;
      this.approvedPage = 1;
      this.fetchComments();
    });

    document.getElementById('clearFilters').addEventListener('click', () => {
      document.getElementById('postsFilter').value = '';
      document.getElementById('dateFrom').value = '';
      document.getElementById('dateTo').value = '';
      document.getElementById('searchFilter').value = '';
      this.filters = { postId: '', dateFrom: '', dateTo: '', search: '' };
      this.pendingPage = 1;
      this.approvedPage = 1;
      this.fetchComments();
    });

    document.getElementById('searchFilter').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        document.getElementById('applyFilters').click();
      }
    });
  }

  buildQueryParams(page) {
    const params = new URLSearchParams({
      page: page,
      limit: this.pageSize
    });

    if (this.filters.postId) params.append('post_id', this.filters.postId);
    if (this.filters.dateFrom) params.append('date_from', this.filters.dateFrom);
    if (this.filters.dateTo) params.append('date_to', this.filters.dateTo);
    if (this.filters.search) params.append('search', this.filters.search);

    return params.toString();
  }

  async fetchPosts() {
    try {
      const token = AdminSession.getToken();
      const response = await fetch('/api/admin/posts/list', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const select = document.getElementById('postsFilter');
          result.data.forEach(post => {
            const option = document.createElement('option');
            option.value = post.id;
            option.textContent = post.title.substring(0, 50) + (post.title.length > 50 ? '...' : '');
            select.appendChild(option);
          });
        }
      }
    } catch (error) {
      console.error('Fetch posts error:', error);
    }
  }

  async fetchComments() {
    await Promise.all([
      this.fetchPendingComments(),
      this.fetchApprovedComments()
    ]);
  }

  async fetchPendingComments() {
    try {
      const token = AdminSession.getToken();
      const queryParams = this.buildQueryParams(this.pendingPage);
      const response = await fetch(`${API_BASE}/admin/pending?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();

      if (result.success) {
        this.renderPendingComments(result.data.comments);
        this.pendingTotal = result.data.total;
        this.updatePendingPagination();
        this.updateCounts(result.data.pendingCount, this.approvedTotal);
      } else if (response.status === 401) {
        AdminSession.clear();
        window.location.href = '/admin-login.html';
      } else {
        showToast('Failed to load pending comments', 'error');
      }
    } catch (error) {
      console.error('Fetch pending comments error:', error);
      showToast('Error loading pending comments', 'error');
    }
  }

  async fetchApprovedComments() {
    try {
      const token = AdminSession.getToken();
      const queryParams = this.buildQueryParams(this.approvedPage);
      const response = await fetch(`${API_BASE}/admin/approved?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();

      if (result.success) {
        this.renderApprovedComments(result.data.comments);
        this.approvedTotal = result.data.total;
        this.updateApprovedPagination();
        this.updateCounts(this.pendingTotal, result.data.approvedCount);
      } else if (response.status === 401) {
        AdminSession.clear();
        window.location.href = '/admin-login.html';
      } else {
        showToast('Failed to load approved comments', 'error');
      }
    } catch (error) {
      console.error('Fetch approved comments error:', error);
      showToast('Error loading approved comments', 'error');
    }
  }

  updatePendingPagination() {
    const totalPages = Math.ceil(this.pendingTotal / this.pageSize);
    const start = (this.pendingPage - 1) * this.pageSize + 1;
    const end = Math.min(this.pendingPage * this.pageSize, this.pendingTotal);

    document.getElementById('pendingStart').textContent = this.pendingTotal > 0 ? start : 0;
    document.getElementById('pendingEnd').textContent = this.pendingTotal > 0 ? end : 0;
    document.getElementById('pendingTotal').textContent = this.pendingTotal;

    document.getElementById('pendingPrev').disabled = this.pendingPage <= 1;
    document.getElementById('pendingNext').disabled = this.pendingPage >= totalPages;

    this.renderPageNumbers('pendingPageNumbers', this.pendingPage, totalPages);
  }

  updateApprovedPagination() {
    const totalPages = Math.ceil(this.approvedTotal / this.pageSize);
    const start = (this.approvedPage - 1) * this.pageSize + 1;
    const end = Math.min(this.approvedPage * this.pageSize, this.approvedTotal);

    document.getElementById('approvedStart').textContent = this.approvedTotal > 0 ? start : 0;
    document.getElementById('approvedEnd').textContent = this.approvedTotal > 0 ? end : 0;
    document.getElementById('approvedTotal').textContent = this.approvedTotal;

    document.getElementById('approvedPrev').disabled = this.approvedPage <= 1;
    document.getElementById('approvedNext').disabled = this.approvedPage >= totalPages;

    this.renderPageNumbers('approvedPageNumbers', this.approvedPage, totalPages);
  }

  renderPageNumbers(containerId, currentPage, totalPages) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      html += `<button class="btn-page-num" data-page="1">1</button>`;
      if (startPage > 2) {
        html += `<span class="page-ellipsis">...</span>`;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const activeClass = i === currentPage ? 'active' : '';
      html += `<button class="btn-page-num ${activeClass}" data-page="${i}">${i}</button>`;
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        html += `<span class="page-ellipsis">...</span>`;
      }
      html += `<button class="btn-page-num" data-page="${totalPages}">${totalPages}</button>`;
    }

    container.innerHTML = html;

    container.querySelectorAll('.btn-page-num').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.dataset.page);
        if (containerId === 'pendingPageNumbers') {
          this.pendingPage = page;
          this.fetchPendingComments();
        } else {
          this.approvedPage = page;
          this.fetchApprovedComments();
        }
      });
    });
  }

  renderPendingComments(comments) {
    if (!this.pendingList) return;

    if (comments.length === 0) {
      this.pendingList.innerHTML = '<p class="empty-text">No pending comments found</p>';
      return;
    }

    this.pendingList.innerHTML = comments.map(comment => `
      <div class="comment-card pending" data-id="${comment.id}">
        <div class="comment-header">
          <div class="comment-meta">
            <span class="comment-author">${this.escapeHtml(comment.name)}</span>
            <span class="comment-email">${this.escapeHtml(comment.email)}</span>
            <span class="comment-date">${this.formatDate(comment.created_at)}</span>
          </div>
          <span class="comment-status pending-badge">Pending</span>
        </div>
        <div class="comment-post-info">
          On: <a href="blog-post.html?slug=${comment.post_slug}" target="_blank">${this.escapeHtml(comment.post_title)}</a>
        </div>
        <div class="comment-body">
          ${this.escapeHtml(comment.comment)}
        </div>
        <div class="comment-actions">
          <button class="btn-approve" data-action="approve" data-id="${comment.id}">Approve</button>
          <button class="btn-reject" data-action="delete" data-id="${comment.id}">Delete</button>
        </div>
      </div>
    `).join('');
  }

  renderApprovedComments(comments) {
    if (!this.approvedList) return;

    if (comments.length === 0) {
      this.approvedList.innerHTML = '<p class="empty-text">No approved comments found</p>';
      return;
    }

    this.approvedList.innerHTML = comments.map(comment => `
      <div class="comment-card approved" data-id="${comment.id}">
        <div class="comment-header">
          <div class="comment-meta">
            <span class="comment-author">${this.escapeHtml(comment.name)}</span>
            <span class="comment-email">${this.escapeHtml(comment.email)}</span>
            <span class="comment-date">${this.formatDate(comment.created_at)}</span>
          </div>
          <span class="comment-status approved-badge">Approved</span>
        </div>
        <div class="comment-post-info">
          On: <a href="blog-post.html?slug=${comment.post_slug}" target="_blank">${this.escapeHtml(comment.post_title)}</a>
        </div>
        <div class="comment-body">
          ${this.escapeHtml(comment.comment)}
        </div>
        <div class="comment-actions">
          <button class="btn-unapprove" data-action="unapprove" data-id="${comment.id}">Unapprove</button>
          <button class="btn-reject" data-action="delete" data-id="${comment.id}">Delete</button>
        </div>
      </div>
    `).join('');
  }

  updateCounts(pending, approved) {
    const pendingCount = document.getElementById('pendingCount');
    const approvedCount = document.getElementById('approvedCount');
    if (pendingCount) pendingCount.textContent = pending;
    if (approvedCount) approvedCount.textContent = approved;
  }

  async approveComment(id) {
    try {
      const token = AdminSession.getToken();
      const response = await fetch(`${API_BASE}/admin/comments/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();

      if (result.success) {
        showToast('Comment approved successfully', 'success');
        this.fetchComments();
        this.updatePendingCountOnDashboard();
      } else if (response.status === 401) {
        AdminSession.clear();
        window.location.href = '/admin-login.html';
      } else {
        showToast(result.error || 'Failed to approve comment', 'error');
      }
    } catch (error) {
      console.error('Approve comment error:', error);
      showToast('Error approving comment', 'error');
    }
  }

  async unapproveComment(id) {
    try {
      const token = AdminSession.getToken();
      const response = await fetch(`${API_BASE}/admin/comments/${id}/unapprove`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();

      if (result.success) {
        showToast('Comment unapproved', 'success');
        this.fetchComments();
        this.updatePendingCountOnDashboard();
      } else if (response.status === 401) {
        AdminSession.clear();
        window.location.href = '/admin-login.html';
      } else {
        showToast(result.error || 'Failed to unapprove comment', 'error');
      }
    } catch (error) {
      console.error('Unapprove comment error:', error);
      showToast('Error unapproving comment', 'error');
    }
  }

  async deleteComment(id) {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const token = AdminSession.getToken();
      const response = await fetch(`${API_BASE}/admin/comments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();

      if (result.success) {
        showToast('Comment deleted', 'success');
        this.fetchComments();
        this.updatePendingCountOnDashboard();
      } else if (response.status === 401) {
        AdminSession.clear();
        window.location.href = '/admin-login.html';
      } else {
        showToast(result.error || 'Failed to delete comment', 'error');
      }
    } catch (error) {
      console.error('Delete comment error:', error);
      showToast('Error deleting comment', 'error');
    }
  }

  async updatePendingCountOnDashboard() {
    try {
      const token = AdminSession.getToken();
      const response = await fetch(`${API_BASE}/admin/pending?limit=1`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();

      if (result.success) {
        localStorage.setItem('pendingCommentsCount', result.data.pendingCount);
        const event = new CustomEvent('commentsUpdated', { detail: result.data.pendingCount });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Update pending count error:', error);
    }
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

let commentsManager;

document.addEventListener('DOMContentLoaded', () => {
  commentsManager = new CommentsManager();
});
