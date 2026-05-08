/* ============================================
   INNOVENTRA DESIGN AND ENGINEERING
   Main JavaScript — Multi-Page Version
   Debugged & Rewritten
   ============================================ */

'use strict';

/* ============ NAVBAR ============ */
const navbar  = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
const navOverlay = document.getElementById('navOverlay');

function handleNavbarScroll() {
  if (!navbar) return;
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    navbar.classList.remove('transparent');
  } else {
    if (document.querySelector('.hero')) {
      navbar.classList.add('transparent');
      navbar.classList.remove('scrolled');
    }
  }
}

if (navbar) {
  // Transparent on home hero, solid on all inner pages
  if (document.querySelector('.hero')) {
    navbar.classList.add('transparent');
  } else {
    navbar.classList.add('scrolled');
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
}

/* Mobile hamburger */
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    navOverlay.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}
if (navOverlay) navOverlay.addEventListener('click', closeNav);

function closeNav() {
  if (!hamburger) return;
  hamburger.classList.remove('active');
  navMenu.classList.remove('open');
  navOverlay.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* Close mobile nav on link click */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeNav);
});

/* ============ ACTIVE NAV LINK ============
   Highlights the current page in the navbar.
   Works for multi-page sites — checks the
   filename of the current URL.
================================================ */
(function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').split('#')[0];
    if (!href) return;
    const linkPage = href.split('/').pop();
    if (
      linkPage === page ||
      (page === '' && linkPage === 'index.html') ||
      (page === 'index.html' && (linkPage === '' || linkPage === 'index.html'))
    ) {
      link.classList.add('active');
    }
  });
})();

/* ============ SCROLL ANIMATIONS ============ */
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => io.observe(el));
}
initScrollAnimations();

/* ============ COUNTER ANIMATION ============ */
function animateCounter(el, target, duration) {
  let start = 0;
  const suffix = el.dataset.suffix || '';
  const step   = target / (duration / 16);
  const timer  = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + suffix;
    }
  }, 16);
}

(function initCounters() {
  const counters = document.querySelectorAll('.counter[data-target]');
  if (!counters.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target, parseInt(e.target.dataset.target), 2200);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
})();

/* ============ PROJECT FILTER ============ */
(function initProjectFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('[data-category]');
  if (!btns.length || !cards.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'translateY(0)';
          });
        } else {
          card.style.transition = 'opacity 0.25s ease';
          card.style.opacity    = '0';
          setTimeout(() => { card.style.display = 'none'; }, 260);
        }
      });
    });
  });
})();

/* ============ CONTACT FORM ============ */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Sending…';
    btn.disabled  = true;
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled  = false;
      form.reset();
      showNotification("Message sent! We'll get back to you within 24 hours.", 'success');
    }, 2000);
  });
})();

/* ============ QUOTE FORM ============ */
(function initQuoteForm() {
  const form = document.getElementById('quoteForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Processing…';
    btn.disabled  = true;
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled  = false;
      form.reset();
      showNotification('Quote request submitted! Our team will contact you within 24 hours.', 'success');
    }, 2000);
  });
})();

/* ============ NOTIFICATION TOAST ============ */
function showNotification(message, type = 'success') {
  let notif = document.getElementById('__notif');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = '__notif';
    notif.style.cssText = `
      position:fixed; bottom:32px; left:50%; transform:translateX(-50%) translateY(80px);
      background:#0F172A; color:#fff; padding:14px 28px; border-radius:6px;
      font-size:.875rem; font-weight:500; box-shadow:0 10px 40px rgba(0,0,0,.3);
      z-index:9999; transition:transform .4s ease; display:flex; align-items:center;
      gap:10px; white-space:nowrap; border-left:4px solid #22c55e;
      font-family:'Poppins',sans-serif;
    `;
    document.body.appendChild(notif);
  }
  notif.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="#22c55e" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>${message}`;
  requestAnimationFrame(() => {
    notif.style.transform = 'translateX(-50%) translateY(0)';
  });
  clearTimeout(notif._timer);
  notif._timer = setTimeout(() => {
    notif.style.transform = 'translateX(-50%) translateY(80px)';
  }, 4500);
}

/* ============ BACK TO TOP ============ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ============ HERO PARALLAX ============ */
(function initParallax() {
  const bg = document.querySelector('.hero-bg-img');
  if (!bg) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      bg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    }
  }, { passive: true });
})();

/* ============ SMOOTH PAGE REVEAL ============ */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .35s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});

/* ============ SPIN KEYFRAMES (for button loader) ============ */
const s = document.createElement('style');
s.textContent = '@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}.spin{animation:spin 1s linear infinite}';
document.head.appendChild(s);
