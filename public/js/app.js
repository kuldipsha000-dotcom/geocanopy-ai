/**
 * MAIN APPLICATION CONTROLLER
 * ============================
 * Navigation, section switching, scroll behaviour, mobile menu.
 */

'use strict';

const App = (() => {
  let currentSection = 'home';

  // ── Navigation ──────────────────────────────────────────────────────────────
  function initNav() {
    const toggle = document.getElementById('navToggle');
    const nav    = document.getElementById('navMenu');

    toggle?.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
    });

    // Close menu on link click (mobile)
    nav?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.textContent = '☰';
      });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.navbar-nav a');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(l => l.classList.remove('active'));
          const activeLink = document.querySelector(`.navbar-nav a[href="#${id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    }, { threshold: 0.3, rootMargin: `-${64}px 0px 0px 0px` });

    sections.forEach(s => observer.observe(s));
  }

  // ── Smooth scroll for buttons ──────────────────────────────────────────────
  function initScrollButtons() {
    document.querySelectorAll('[data-scroll-to]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.scrollTo);
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - 64;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  // ── Tab switcher ──────────────────────────────────────────────────────────
  function initTabs() {
    document.querySelectorAll('.tab-bar').forEach(bar => {
      const group = bar.dataset.tabGroup;
      bar.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tabId = btn.dataset.tab;
          // Deactivate all in group
          document.querySelectorAll(`[data-tab-group="${group}"] .tab-btn`).forEach(b => b.classList.remove('active'));
          document.querySelectorAll(`[data-tab-panel="${group}"]`).forEach(p => p.classList.remove('active'));
          // Activate clicked
          btn.classList.add('active');
          const panel = document.getElementById(`tab-${group}-${tabId}`);
          if (panel) panel.classList.add('active');
        });
      });
    });
  }

  // ── Animated number counters (on first view) ──────────────────────────────
  function animateCounter(el, target, duration = 1400) {
    const start = performance.now();
    const startVal = 0;
    const isFloat = String(target).includes('.');
    const decimals = isFloat ? String(target).split('.')[1].length : 0;

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (target - startVal) * eased;
      el.textContent = isFloat
        ? current.toFixed(decimals)
        : Math.round(current).toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el  = entry.target;
          const val = parseFloat(el.dataset.counter);
          animateCounter(el, val);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => obs.observe(c));
  }

  // ── Data notice collapse ──────────────────────────────────────────────────
  function initDataNotices() {
    document.querySelectorAll('.data-notice[data-collapsible]').forEach(notice => {
      const btn = document.createElement('button');
      btn.textContent = '✕';
      btn.style.cssText = 'background:none;border:none;color:var(--clr-text-muted);cursor:pointer;margin-left:auto;padding:0 4px;flex-shrink:0;';
      btn.title = 'Dismiss';
      btn.addEventListener('click', () => notice.remove());
      notice.appendChild(btn);
    });
  }

  // ── Current year in footer ────────────────────────────────────────────────
  function initFooterYear() {
    const el = document.getElementById('currentYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  // ── INIT ──────────────────────────────────────────────────────────────────
  function init() {
    initNav();
    initScrollButtons();
    initTabs();
    initCounters();
    initDataNotices();
    initFooterYear();

    console.log('%c🌿 India Forest Monitoring Dashboard', 'color:#3db56c;font-weight:bold;font-size:14px');
    console.log('%cData Sources: FSI ISFR 2021/2023 | Sentinel-2 EOX | OpenStreetMap', 'color:#5a8a6d;font-size:11px');
  }

  return { init };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', App.init);
} else {
  App.init();
}
