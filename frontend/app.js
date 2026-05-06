// ══════════════════════════════════════════════════════════════
// MALABAR INDOOR PARK - Frontend JavaScript
// Complete API Integration & Authentication
// ══════════════════════════════════════════════════════════════

// ── CONFIG ──
const API_BASE = 'http://localhost:5000/api';
let currentUser = null;
let authToken = null;

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  // Load saved auth from localStorage
  const savedToken = localStorage.getItem('authToken');
  const savedUser = localStorage.getItem('currentUser');
  
  if (savedToken && savedUser) {
    authToken = savedToken;
    currentUser = JSON.parse(savedUser);
    updateNavbarAuth();
    showToast(`Welcome back, ${currentUser.name}!`, 'success');
  }
  
  // Initialize navbar scroll effect
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  });

  // Load pricing data
  loadPricing();
  
  // Load FAQs
  loadFAQs();
});

// ══════════════════════════════════════════════════════════════
// AUTH FUNCTIONS
// ══════════════════════════════════════════════════════════════

async function handleRegister() {
  const name = document.getElementById('signup-name')?.value.trim();
  const username = document.getElementById('signup-username')?.value.trim();
  const email = document.getElementById('signup-email')?.value.trim();
  const password = document.getElementById('signup-password')?.value;
  const phone = document.getElementById('signup-phone')?.value.trim();

  if (!name || !username || !email || !password) {
    showToast('Please fill all fields', 'error');
    return;
  }

  if (password.length < 6) {
    showToast('Password must be at least 6 characters', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, email, password, phone })
    });

    const data = await response.json();

    if (!response.ok) {
      showToast(data.error || 'Registration failed', 'error');
      return;
    }

    authToken = data.token;
    currentUser = data.user;
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showToast(`Welcome, ${currentUser.name}!`, 'success');
    closeModal();
    updateNavbarAuth();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

async function handleLogin() {
  const loginValue = document.getElementById('login-user')?.value.trim();
  const password = document.getElementById('login-pass')?.value;

  if (!loginValue || !password) {
    showToast('Please enter username/email and password', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: loginValue, password })
    });

    const data = await response.json();

    if (!response.ok) {
      showToast(data.error || 'Login failed', 'error');
      return;
    }

    authToken = data.token;
    currentUser = data.user;
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showToast(`Welcome back, ${currentUser.name}!`, 'success');
    closeModal();
    updateNavbarAuth();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

function handleLogout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  
  showToast('Logged out successfully', 'success');
  updateNavbarAuth();
  location.reload();
}

function updateNavbarAuth() {
  const navRight = document.getElementById('nav-right');
  
  if (currentUser) {
    navRight.innerHTML = `
      <div class="nav-user-chip">
        <div class="nav-av">${currentUser.name.charAt(0).toUpperCase()}</div>
        <span>${currentUser.name}</span>
        <button class="btn btn-ghost btn-sm" onclick="handleLogout()">Logout</button>
      </div>
    `;
  } else {
    navRight.innerHTML = `
      <button class="btn btn-ghost btn-sm" onclick="toggleTheme()" id="theme-toggle-btn">🌙 Night</button>
      <button class="btn btn-ghost btn-sm" onclick="openModal('auth','login')">Login</button>
      <button class="btn btn-accent btn-sm" onclick="openModal('auth','signup')">Sign Up</button>
    `;
  }
}

// ══════════════════════════════════════════════════════════════
// MODAL FUNCTIONS
// ══════════════════════════════════════════════════════════════

function openModal(type, subtype) {
  const modal = document.createElement('div');
  modal.className = 'modal-ov';
  modal.id = `modal-${type}`;
  
  if (type === 'auth') {
    modal.innerHTML = `
      <div class="modal-box">
        <button class="modal-close" onclick="closeModal()">✕</button>
        <div class="modal-hd">
          <div class="modal-logo-row">
            <div class="modal-logo-ico">🏟</div>
            <div class="modal-logo-txt">Malabar Indoor Park</div>
          </div>
          <h2 class="modal-title">${subtype === 'login' ? 'Welcome Back' : 'Join Us'}</h2>
          <p class="modal-sub">${subtype === 'login' ? 'Sign in to your account' : 'Create your account'}</p>
        </div>
        <div class="modal-body">
          ${subtype === 'login' ? getLoginForm() : getSignupForm()}
        </div>
      </div>
    `;
  }
  
  document.body.appendChild(modal);
  modal.style.display = 'flex';
}

function getLoginForm() {
  return `
    <div class="form-group">
      <label class="form-label">Username or Email</label>
      <input type="text" id="login-user" placeholder="admin or email@example.com">
    </div>
    <div class="form-group">
      <label class="form-label">Password</label>
      <input type="password" id="login-pass" placeholder="Your password">
    </div>
    <button class="btn btn-accent btn-full" onclick="handleLogin()">Login</button>
    <p style="text-align:center;margin-top:1rem;font-size:.85rem;color:var(--text3);">
      Don't have an account? <a href="#" onclick="closeModal();openModal('auth','signup');return false;" style="color:var(--accent);font-weight:600;">Sign Up</a>
    </p>
  `;
}

function getSignupForm() {
  return `
    <div class="form-group">
      <label class="form-label">Full Name</label>
      <input type="text" id="signup-name" placeholder="Your full name">
    </div>
    <div class="form-group">
      <label class="form-label">Username</label>
      <input type="text" id="signup-username" placeholder="Choose a username">
    </div>
    <div class="form-group">
      <label class="form-label">Email</label>
      <input type="email" id="signup-email" placeholder="your@email.com">
    </div>
    <div class="form-group">
      <label class="form-label">Password</label>
      <input type="password" id="signup-password" placeholder="At least 6 characters">
    </div>
    <div class="form-group">
      <label class="form-label">Phone (optional)</label>
      <input type="tel" id="signup-phone" placeholder="07XXXXXXXX">
    </div>
    <button class="btn btn-accent btn-full" onclick="handleRegister()">Create Account</button>
    <p style="text-align:center;margin-top:1rem;font-size:.85rem;color:var(--text3);">
      Already have an account? <a href="#" onclick="closeModal();openModal('auth','login');return false;" style="color:var(--accent);font-weight:600;">Login</a>
    </p>
  `;
}

function closeModal() {
  const modals = document.querySelectorAll('.modal-ov');
  modals.forEach(m => m.remove());
}

// ══════════════════════════════════════════════════════════════
// PRICING FUNCTIONS
// ══════════════════════════════════════════════════════════════

async function loadPricing() {
  try {
    const response = await fetch(`${API_BASE}/pricing`);
    const pricing = await response.json();
    
    const grid = document.getElementById('pricing-display');
    if (!grid) return;
    
    grid.innerHTML = pricing.map(p => `
      <div class="price-card">
        <div class="price-card-hd">
          <div class="price-sport-icon">${p.sport === 'cricket' ? '🏏' : '🏸'}</div>
          <div class="price-sport">${p.sport.toUpperCase()}</div>
        </div>
        <div class="price-card-body">
          <div class="price-tier">
            <div>
              <div class="price-session-name">☀️ Day</div>
              <div class="price-time">6 AM - 6 PM</div>
            </div>
            <div>
              <div class="price-amt">LKR ${p.day}</div>
              <div class="price-per">/hour</div>
            </div>
          </div>
          <div class="price-tier">
            <div>
              <div class="price-session-name">🌙 Night</div>
              <div class="price-time">6 PM - 1 AM</div>
            </div>
            <div>
              <div class="price-amt">LKR ${p.night}</div>
              <div class="price-per">/hour</div>
            </div>
          </div>
        </div>
        <div class="price-card-ft">
          <strong>✓</strong> Professional courts<br>
          <strong>✓</strong> All equipment included
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error loading pricing:', err);
  }
}

// ══════════════════════════════════════════════════════════════
// FAQ FUNCTIONS
// ══════════════════════════════════════════════════════════════

function loadFAQs() {
  const faqs = [
    { q: 'How do I book a court?', a: 'Click "Book a Court" and select your date, court, and time slots. Payment must be made within 15 minutes.' },
    { q: 'What are the operating hours?', a: 'We are open from 8 AM to 1 AM daily for your convenience.' },
    { q: 'Can I reschedule my booking?', a: 'Yes, you can reschedule once per booking if cancelled 12+ hours in advance.' },
    { q: 'What is your cancellation policy?', a: 'No refunds for cancellations, but rescheduling is allowed if cancelled 12+ hours before.' },
    { q: 'Do you provide equipment?', a: 'Footballs are provided for Courts 1-3. Cricket equipment and badminton rackets must be brought.' }
  ];
  
  const container = document.getElementById('faq-container');
  if (!container) return;
  
  container.innerHTML = faqs.map((faq, i) => `
    <div class="faq-item" onclick="toggleFAQ(this)">
      <div class="faq-q">
        <span>${faq.q}</span>
        <div class="faq-tog">+</div>
      </div>
      <div class="faq-ans">
        <div class="faq-ans-inner">${faq.a}</div>
      </div>
    </div>
  `).join('');
}

function toggleFAQ(el) {
  el.classList.toggle('open');
}

// ══════════════════════════════════════════════════════════════
// BOOKING FUNCTIONS
// ══════════════════════════════════════════════════════════════

function handleBookingNav(e) {
  e?.preventDefault();
  if (!authToken) {
    openModal('auth', 'login');
    return;
  }
  document.getElementById('booking-gate')?.classList.add('hidden');
  document.getElementById('booking-widget')?.classList.remove('hidden');
  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
}

// ══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ══════════════════════════════════════════════════════════════

function toggleTheme() {
  const root = document.documentElement;
  const isDark = root.getAttribute('data-theme') === 'dark';
  root.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

function toggleMobileNav() {
  const hamburger = document.getElementById('ham');
  const mobileNav = document.getElementById('mobile-nav');
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
}

function closeMobileNav() {
  document.getElementById('ham').classList.remove('open');
  document.getElementById('mobile-nav').classList.remove('open');
}

function handleLogoClick(e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showToast(message, type = 'info') {
  let toastStack = document.getElementById('toast-stack');
  if (!toastStack) {
    toastStack = document.createElement('div');
    toastStack.id = 'toast-stack';
    document.body.appendChild(toastStack);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toastStack.appendChild(toast);
  
  setTimeout(() => toast.remove(), 4000);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
}
