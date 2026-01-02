class AdminAuth {
  constructor() {
    this.loginForm = document.getElementById('loginForm');
    this.usernameInput = document.getElementById('username');
    this.passwordInput = document.getElementById('password');
    this.loginBtn = document.getElementById('loginBtn');
    this.errorMessage = document.getElementById('errorMessage');

    this.init();
  }

  init() {
    if (this.isLoggedIn()) {
      window.location.href = '/admin-dashboard.html';
      return;
    }

    this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
  }

  isLoggedIn() {
    return localStorage.getItem('adminToken') !== null;
  }

  async handleLogin(e) {
    e.preventDefault();

    const username = this.usernameInput.value.trim();
    const password = this.passwordInput.value;

    if (!username || !password) {
      this.showError('Please enter both username and password');
      return;
    }

    this.setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminInfo', JSON.stringify(data.data.admin));
        window.location.href = '/admin-dashboard.html';
      } else {
        this.showError(data.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.showError('An error occurred. Please try again later.');
    } finally {
      this.setLoading(false);
    }
  }

  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.classList.add('visible');

    setTimeout(() => {
      this.errorMessage.classList.remove('visible');
    }, 5000);
  }

  setLoading(isLoading) {
    if (isLoading) {
      this.loginBtn.classList.add('loading');
      this.loginBtn.disabled = true;
      this.loginBtn.textContent = 'Signing in...';
    } else {
      this.loginBtn.classList.remove('loading');
      this.loginBtn.disabled = false;
      this.loginBtn.textContent = 'Sign In';
    }
  }
}

class AdminSession {
  static getToken() {
    return localStorage.getItem('adminToken');
  }

  static getInfo() {
    const info = localStorage.getItem('adminInfo');
    return info ? JSON.parse(info) : null;
  }

  static logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    window.location.href = '/admin-login.html';
  }

  static isAuthenticated() {
    return this.getToken() !== null;
  }
}

if (document.getElementById('loginForm')) {
  new AdminAuth();
}

if (document.querySelector('.admin-logout')) {
  document.querySelector('.admin-logout').addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
      AdminSession.logout();
    }
  });
}
