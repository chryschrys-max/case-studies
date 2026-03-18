/*
 * Portfolio Gate — lightweight email-based access control
 *
 * SETUP:
 * 1. Create a free EmailJS account at https://www.emailjs.com
 * 2. Create an email service (Gmail, Outlook, etc.)
 * 3. Create an email template with these variables:
 *    - {{to_email}}  — recipient's email
 *    - {{password}}  — the access password
 *    Example template body:
 *      "Hi! Here's your access password for my portfolio: {{password}}"
 * 4. Update the config below with your IDs
 */

(function () {
  // ── CONFIG ──────────────────────────────────────────────
  const CONFIG = {
    password: 'chrysalis2026',           // Change this to your chosen password
    storageKey: 'portfolio_access',
    emailjs: {
      publicKey: 'YOUR_PUBLIC_KEY',      // EmailJS public key
      serviceId: 'YOUR_SERVICE_ID',      // EmailJS service ID
      templateId: 'YOUR_TEMPLATE_ID',    // EmailJS template ID
    },
  };

  // Skip gate if already authenticated
  if (localStorage.getItem(CONFIG.storageKey) === 'granted') return;

  // ── INJECT EMAILJS SDK ──────────────────────────────────
  var ejs = document.createElement('script');
  ejs.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  ejs.onload = function () {
    emailjs.init(CONFIG.emailjs.publicKey);
  };
  document.head.appendChild(ejs);

  // ── BUILD GATE OVERLAY ──────────────────────────────────
  var overlay = document.createElement('div');
  overlay.id = 'portfolio-gate';
  overlay.innerHTML =
    '<div class="gate-card">' +
      '<div class="gate-label">Portfolio Access</div>' +
      '<h2 class="gate-title">This project is password-protected</h2>' +
      '<p class="gate-sub">Enter your email to receive the access password, or enter the password directly if you already have it.</p>' +

      '<div id="gate-email-step">' +
        '<input type="email" id="gate-email" placeholder="your@email.com" autocomplete="email">' +
        '<button id="gate-send-btn">Send me the password</button>' +
        '<p id="gate-email-msg" class="gate-msg"></p>' +
        '<button id="gate-show-pw" class="gate-link">I already have the password</button>' +
      '</div>' +

      '<div id="gate-pw-step" style="display:none;">' +
        '<input type="password" id="gate-pw" placeholder="Enter password">' +
        '<button id="gate-unlock-btn">Unlock</button>' +
        '<p id="gate-pw-msg" class="gate-msg"></p>' +
        '<button id="gate-show-email" class="gate-link">&larr; Request password instead</button>' +
      '</div>' +
    '</div>';

  // ── STYLES ──────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent =
    '#portfolio-gate {' +
      'position: fixed; inset: 0; z-index: 9999;' +
      'background: #FFF8F0;' +
      'display: flex; align-items: center; justify-content: center;' +
      'font-family: "DM Sans", -apple-system, sans-serif;' +
    '}' +
    '.gate-card {' +
      'width: 100%; max-width: 440px; padding: 48px 40px; text-align: center;' +
    '}' +
    '.gate-label {' +
      'font-size: 11px; font-weight: 600; letter-spacing: 2.5px;' +
      'text-transform: uppercase; color: #F4A261; margin-bottom: 16px;' +
    '}' +
    '.gate-title {' +
      'font-size: 26px; font-weight: 700; color: #1B2A4A;' +
      'line-height: 1.3; margin-bottom: 12px;' +
    '}' +
    '.gate-sub {' +
      'font-size: 15px; color: #4A5568; line-height: 1.7; margin-bottom: 32px;' +
    '}' +
    '#portfolio-gate input {' +
      'width: 100%; padding: 14px 16px; font-size: 15px;' +
      'font-family: inherit; border: 1px solid #E8DDD0;' +
      'border-radius: 8px; background: #fff; color: #2C3E50;' +
      'outline: none; margin-bottom: 12px;' +
    '}' +
    '#portfolio-gate input:focus {' +
      'border-color: #F4A261; box-shadow: 0 0 0 3px rgba(244,162,97,0.15);' +
    '}' +
    '#portfolio-gate button {' +
      'font-family: inherit; cursor: pointer; border: none;' +
    '}' +
    '#gate-send-btn, #gate-unlock-btn {' +
      'width: 100%; padding: 14px; font-size: 14px; font-weight: 600;' +
      'letter-spacing: 0.5px; color: #fff; background: #1B2A4A;' +
      'border-radius: 8px; transition: background 0.2s;' +
    '}' +
    '#gate-send-btn:hover, #gate-unlock-btn:hover { background: #2D4470; }' +
    '#gate-send-btn:disabled, #gate-unlock-btn:disabled {' +
      'opacity: 0.6; cursor: not-allowed;' +
    '}' +
    '.gate-link {' +
      'background: none; color: #6B7B8D; font-size: 13px;' +
      'margin-top: 16px; text-decoration: underline;' +
      'text-underline-offset: 3px;' +
    '}' +
    '.gate-link:hover { color: #2D4470; }' +
    '.gate-msg {' +
      'font-size: 13px; margin-top: 10px; min-height: 20px; line-height: 1.5;' +
    '}' +
    '.gate-msg.success { color: #2D8A4E; }' +
    '.gate-msg.error { color: #C0392B; }';

  // ── INSERT INTO PAGE ────────────────────────────────────
  document.head.appendChild(style);
  document.body.appendChild(overlay);

  // Hide page content while gate is showing
  document.body.style.overflow = 'hidden';

  // ── WIRE UP INTERACTIONS ────────────────────────────────
  var emailStep = document.getElementById('gate-email-step');
  var pwStep = document.getElementById('gate-pw-step');

  // Toggle between email and password views
  document.getElementById('gate-show-pw').addEventListener('click', function () {
    emailStep.style.display = 'none';
    pwStep.style.display = 'block';
    document.getElementById('gate-pw').focus();
  });
  document.getElementById('gate-show-email').addEventListener('click', function () {
    pwStep.style.display = 'none';
    emailStep.style.display = 'block';
    document.getElementById('gate-email').focus();
  });

  // Send password via EmailJS
  document.getElementById('gate-send-btn').addEventListener('click', function () {
    var email = document.getElementById('gate-email').value.trim();
    var msg = document.getElementById('gate-email-msg');
    var btn = this;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.textContent = 'Please enter a valid email address.';
      msg.className = 'gate-msg error';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending\u2026';
    msg.textContent = '';

    emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, {
      to_email: email,
      password: CONFIG.password,
    }).then(function () {
      msg.textContent = 'Password sent! Check your inbox.';
      msg.className = 'gate-msg success';
      btn.textContent = 'Sent!';
      setTimeout(function () {
        emailStep.style.display = 'none';
        pwStep.style.display = 'block';
        document.getElementById('gate-pw').focus();
      }, 1500);
    }, function () {
      msg.textContent = 'Something went wrong. Please try again.';
      msg.className = 'gate-msg error';
      btn.disabled = false;
      btn.textContent = 'Send me the password';
    });
  });

  // Check password
  document.getElementById('gate-unlock-btn').addEventListener('click', function () {
    tryUnlock();
  });
  document.getElementById('gate-pw').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') tryUnlock();
  });
  document.getElementById('gate-email').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') document.getElementById('gate-send-btn').click();
  });

  function tryUnlock() {
    var pw = document.getElementById('gate-pw').value;
    var msg = document.getElementById('gate-pw-msg');

    if (pw === CONFIG.password) {
      localStorage.setItem(CONFIG.storageKey, 'granted');
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.3s ease';
      setTimeout(function () {
        overlay.remove();
        document.body.style.overflow = '';
      }, 300);
    } else {
      msg.textContent = 'Incorrect password. Please try again.';
      msg.className = 'gate-msg error';
      document.getElementById('gate-pw').value = '';
      document.getElementById('gate-pw').focus();
    }
  }
})();
