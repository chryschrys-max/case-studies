/*
 * Contact Form — sticky "Let's work together" button with overlay
 *
 * Requires a separate EmailJS template for contact form submissions.
 * Template variables: {{from_name}}, {{from_email}}, {{message}}
 */

(function () {
  var CONFIG = {
    emailjs: {
      publicKey: 'puqK8otqvMg_20bti',
      serviceId: 'service_0fnh6zd',
      templateId: 'YOUR_CONTACT_TEMPLATE_ID', // Update with your contact template ID
    },
  };

  // ── INJECT EMAILJS SDK (if not already loaded) ──────────
  if (typeof emailjs === 'undefined') {
    var ejs = document.createElement('script');
    ejs.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    ejs.onload = function () {
      emailjs.init(CONFIG.emailjs.publicKey);
    };
    document.head.appendChild(ejs);
  }

  // ── BUILD STICKY BUTTON ─────────────────────────────────
  var btn = document.createElement('button');
  btn.id = 'contact-btn';
  btn.textContent = "Let\u2019s work together";

  // ── BUILD OVERLAY ───────────────────────────────────────
  var overlay = document.createElement('div');
  overlay.id = 'contact-overlay';
  overlay.innerHTML =
    '<div class="contact-backdrop"></div>' +
    '<div class="contact-card">' +
      '<button class="contact-close">&times;</button>' +
      '<div class="contact-label">Get in touch</div>' +
      '<h2 class="contact-title">Let\u2019s work together</h2>' +
      '<p class="contact-sub">Have a project in mind? I\u2019d love to hear about it.</p>' +
      '<form id="contact-form">' +
        '<input type="text" id="contact-name" placeholder="Your name" required>' +
        '<input type="email" id="contact-email" placeholder="Your email" required>' +
        '<textarea id="contact-message" placeholder="Tell me about your project\u2026" rows="4" required></textarea>' +
        '<button type="submit" id="contact-submit">Send message</button>' +
      '</form>' +
      '<p id="contact-msg" class="contact-msg"></p>' +
    '</div>';

  // ── STYLES ──────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent =
    '#contact-btn {' +
      'position: fixed; top: 16px; right: 16px; z-index: 9990;' +
      'font-family: "DM Sans", -apple-system, sans-serif;' +
      'font-size: 13px; font-weight: 600; letter-spacing: 0.3px;' +
      'padding: 10px 20px; border: none; border-radius: 50px;' +
      'background: #1B2A4A; color: #fff; cursor: pointer;' +
      'box-shadow: 0 2px 12px rgba(27,42,74,0.25);' +
      'transition: background 0.2s, transform 0.2s;' +
    '}' +
    '#contact-btn:hover { background: #2D4470; transform: translateY(-1px); }' +

    '#contact-overlay {' +
      'display: none; position: fixed; inset: 0; z-index: 9995;' +
      'align-items: center; justify-content: center;' +
    '}' +
    '#contact-overlay.open { display: flex; }' +

    '.contact-backdrop {' +
      'position: absolute; inset: 0; background: rgba(27,42,74,0.5);' +
    '}' +
    '.contact-card {' +
      'position: relative; width: 100%; max-width: 460px;' +
      'margin: 20px; padding: 40px; background: #FFF8F0;' +
      'border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.15);' +
      'font-family: "DM Sans", -apple-system, sans-serif;' +
    '}' +
    '.contact-close {' +
      'position: absolute; top: 16px; right: 16px;' +
      'background: none; border: none; font-size: 24px;' +
      'color: #6B7B8D; cursor: pointer; line-height: 1;' +
    '}' +
    '.contact-close:hover { color: #1B2A4A; }' +

    '.contact-label {' +
      'font-size: 11px; font-weight: 600; letter-spacing: 2.5px;' +
      'text-transform: uppercase; color: #F4A261; margin-bottom: 12px;' +
    '}' +
    '.contact-title {' +
      'font-size: 24px; font-weight: 700; color: #1B2A4A;' +
      'margin: 0 0 8px;' +
    '}' +
    '.contact-sub {' +
      'font-size: 15px; color: #4A5568; line-height: 1.6; margin-bottom: 28px;' +
    '}' +

    '#contact-form input, #contact-form textarea {' +
      'width: 100%; padding: 12px 14px; font-size: 15px;' +
      'font-family: inherit; border: 1px solid #E8DDD0;' +
      'border-radius: 8px; background: #fff; color: #2C3E50;' +
      'outline: none; margin-bottom: 12px; box-sizing: border-box;' +
      'resize: vertical;' +
    '}' +
    '#contact-form input:focus, #contact-form textarea:focus {' +
      'border-color: #F4A261; box-shadow: 0 0 0 3px rgba(244,162,97,0.15);' +
    '}' +
    '#contact-submit {' +
      'width: 100%; padding: 14px; font-size: 14px; font-weight: 600;' +
      'font-family: inherit; letter-spacing: 0.5px;' +
      'color: #fff; background: #1B2A4A; border: none;' +
      'border-radius: 8px; cursor: pointer; transition: background 0.2s;' +
    '}' +
    '#contact-submit:hover { background: #2D4470; }' +
    '#contact-submit:disabled { opacity: 0.6; cursor: not-allowed; }' +

    '.contact-msg {' +
      'font-size: 13px; text-align: center; margin-top: 12px; min-height: 20px;' +
    '}' +
    '.contact-msg.success { color: #2D8A4E; }' +
    '.contact-msg.error { color: #C0392B; }';

  // ── INSERT INTO PAGE ────────────────────────────────────
  document.head.appendChild(style);
  document.body.appendChild(btn);
  document.body.appendChild(overlay);

  // ── INTERACTIONS ────────────────────────────────────────
  btn.addEventListener('click', function () {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('contact-name').focus();
  });

  function closeOverlay() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  overlay.querySelector('.contact-backdrop').addEventListener('click', closeOverlay);
  overlay.querySelector('.contact-close').addEventListener('click', closeOverlay);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeOverlay();
  });

  // ── FORM SUBMISSION ─────────────────────────────────────
  document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var submitBtn = document.getElementById('contact-submit');
    var msg = document.getElementById('contact-msg');
    var name = document.getElementById('contact-name').value.trim();
    var email = document.getElementById('contact-email').value.trim();
    var message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      msg.textContent = 'Please fill in all fields.';
      msg.className = 'contact-msg error';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending\u2026';
    msg.textContent = '';

    emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, {
      from_name: name,
      from_email: email,
      message: message,
    }).then(function () {
      msg.textContent = 'Message sent! I\u2019ll get back to you soon.';
      msg.className = 'contact-msg success';
      submitBtn.textContent = 'Sent!';
      document.getElementById('contact-form').reset();
      setTimeout(function () {
        closeOverlay();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message';
        msg.textContent = '';
      }, 2500);
    }, function (error) {
      msg.textContent = 'Error: ' + (error.text || error.message || 'Something went wrong.');
      msg.className = 'contact-msg error';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    });
  });
})();
