(() => {
  'use strict';
  const config = window.PORTFOLIO_CONFIG || {};
  const validURL = value => {
    try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; }
    catch (_) { return null; }
  };
  document.querySelectorAll('[data-profile]').forEach(link => {
    const url = validURL(config[link.dataset.profile]);
    if (url) link.href = url;
  });
  const base = validURL(config.siteUrl);
  if (base && !document.querySelector('link[rel="canonical"]')) {
    const canonicalURL = new URL(document.body.dataset.page === 'index.html' ? '' : document.body.dataset.page, base.endsWith('/') ? base : `${base}/`).href;
    const canonical = document.createElement('link');
    canonical.rel = 'canonical'; canonical.href = canonicalURL; document.head.append(canonical);
    const ogURL = document.createElement('meta'); ogURL.setAttribute('property', 'og:url'); ogURL.content = canonicalURL; document.head.append(ogURL);
  }
  if (validURL(config.socialImage) && !document.querySelector('meta[property="og:image"]')) {
    const image = document.createElement('meta'); image.setAttribute('property', 'og:image'); image.content = config.socialImage; document.head.append(image);
  }
  const toggle = document.querySelector('.theme-toggle');
  function syncThemeButton() {
    const dark = document.documentElement.dataset.theme === 'dark';
    toggle?.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
    toggle?.setAttribute('title', `Switch to ${dark ? 'light' : 'dark'} mode`);
  }
  syncThemeButton();
  toggle?.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('ahmed-portfolio-theme', theme); } catch (_) { /* Session theme remains usable. */ }
    syncThemeButton();
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    let saved;
    try { saved = localStorage.getItem('ahmed-portfolio-theme'); } catch (_) {}
    if (saved !== 'dark' && saved !== 'light') {
      document.documentElement.dataset.theme = event.matches ? 'dark' : 'light'; syncThemeButton();
    }
  });
  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-nav');
  function closeMenu(returnFocus = false) {
    nav?.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false');
    if (returnFocus) menu?.focus();
  }
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); nav?.classList.toggle('open', open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    closeMenu();
    if (link.hash && (!link.pathname || link.pathname === location.pathname)) {
      const section = document.getElementById(link.hash.slice(1));
      if (section) { section.setAttribute('tabindex', '-1'); section.focus({ preventScroll: true }); }
    }
  }));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav?.classList.contains('open')) closeMenu(true); });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  document.addEventListener('focusin', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  window.matchMedia('(min-width: 951px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  const sections = [...document.querySelectorAll('main > section[id], main > .work-section[id]')];
  const navLinks = [...document.querySelectorAll('[data-nav]')];
  let ticking = false;
  function updateScroll() {
    document.querySelector('.back-top')?.classList.toggle('visible', window.scrollY > 500);
    if (sections.length) {
      let active = sections[0].id;
      for (const section of sections) if (section.getBoundingClientRect().top <= 160) active = section.id;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) active = sections.at(-1).id;
      navLinks.forEach(link => link.dataset.nav === active ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current'));
    } else if (document.body.dataset.page?.startsWith('projects/')) {
      document.querySelector('[data-nav="projects"]')?.setAttribute('aria-current', 'page');
    }
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); } }, { passive: true });
  updateScroll();

  const form = document.getElementById('contact-form');
  if (form) {
    const submit = form.querySelector('button[type="submit"]');
    const status = document.getElementById('contact-status');
    let sending = false;
    submit.disabled = false;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (sending || !form.reportValidity()) return;
      if (form.elements.namedItem('_gotcha').value) return;
      sending = true;
      submit.disabled = true;
      submit.textContent = 'Sending…';
      form.dataset.state = 'submitting';
      status.textContent = '';
      const payload = new FormData(form);
      // Lock entered values while the request runs so a successful reset cannot discard new edits.
      const fields = [...form.querySelectorAll('input, textarea')];
      fields.forEach(field => { field.readOnly = true; });
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      try {
        const response = await fetch(form.action, {
          method: 'POST', body: payload, headers: { Accept: 'application/json' },
          signal: controller.signal
        });
        if (!response.ok) throw new Error('Submission failed');
        form.reset();
        form.dataset.state = 'success';
        status.dataset.analyticsEvent = 'contact_form_success';
        status.textContent = 'Message sent successfully. I’ll get back to you soon.';
      } catch (_) {
        form.dataset.state = 'error';
        status.dataset.analyticsEvent = 'contact_form_error';
        status.textContent = 'Something went wrong. Please try again.';
      } finally {
        clearTimeout(timeout);
        fields.forEach(field => { field.readOnly = false; });
        sending = false;
        submit.disabled = false;
        submit.textContent = 'Send message ↗';
      }
    });
  }
  // Reveal is progressive enhancement; content stays visible without JS or observer support.
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove('will-reveal'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => {
      if (element.getBoundingClientRect().top > window.innerHeight) { element.classList.add('will-reveal'); observer.observe(element); }
    });
  }
})();
