/* Progressive enhancement for project CTAs; no app code, API calls or health probes. */
(() => {
  'use strict';
  function publicURL(value) {
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' || url.username || url.password) return null;
      const host = url.hostname.toLowerCase();
      if (!host.includes('.') || host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.test') || host.endsWith('.invalid') || host.endsWith('.example') || /(^|\.)example\.(com|org|net)$/.test(host) || /^[\d.]+$/.test(host) || host.includes(':')) return null;
      return url.href;
    } catch (_) { return null; }
  }
  function setLink(link, url, label, pending) {
    if (!link) return;
    link.replaceChildren(document.createTextNode(label));
    if (url) {
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      ['aria-disabled','role','tabindex'].forEach(attr => link.removeAttribute(attr));
      link.title = `${label} (opens in a new tab)`;
    } else {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
      link.setAttribute('role', 'link');
      link.tabIndex = 0;
      const badge = document.createElement('span'); badge.className = 'pending'; badge.textContent = pending;
      link.append(' ', badge);
    }
  }
  document.querySelectorAll('[data-project]').forEach(container => {
    const project = window.PROJECTS_CONFIG?.[container.dataset.project];
    if (!project) return; // Honest static pending state if config is missing.
    const demoURL = publicURL(project.demoUrl);
    const available = project.liveDemo === true && project.demoAvailability === 'available' && !!demoURL;
    const reference = project.liveDemo !== true;
    const maintenance = project.demoAvailability === 'maintenance';
    const status = available ? 'LIVE · INTERACTIVE APPLICATION' : reference ? 'Architecture / Technical Case Study' : maintenance ? 'Interactive application · Temporarily unavailable' : 'Interactive application · Deployment pending';
    container.querySelectorAll('[data-demo-status]').forEach(el => { el.textContent = status; el.classList.toggle('is-live', available); });
    container.querySelectorAll('[data-project-name]').forEach(el => { el.textContent = project.name; });
    container.querySelectorAll('[data-project-tech]').forEach(el => {
      if (!Array.isArray(project.technology)) return;
      el.replaceChildren(...project.technology.map(technology => { const li = document.createElement('li'); li.textContent = technology; return li; }));
    });
    container.querySelectorAll('[data-demo-launch]').forEach(link => {
      link.hidden = reference;
      setLink(link, available ? demoURL : null, link.dataset.ctaLabel || 'Launch Live Demo ↗', maintenance ? 'Temporarily unavailable' : 'Deployment pending');
    });
    container.querySelectorAll('[data-source-link]').forEach(link => setLink(link, publicURL(project.githubUrl), link.dataset.ctaLabel || (container.tagName === 'MAIN' ? 'View Source Code ↗' : 'Source Code ↗'), 'URL pending'));
    const message = container.querySelector('[data-demo-message]');
    if (message && !reference) message.textContent = available
      ? 'Open the actual application in a new tab. This case study stays open so you can return to the architecture and source code.'
      : maintenance ? 'The public demo is temporarily unavailable. Explore the case study while it is offline.'
      : 'Public deployment is pending. The launch link will become available here once the actual application is hosted.';
    const embed = container.querySelector('[data-demo-embed]');
    const embedURL = publicURL(project.embedUrl);
    // Opt-in only, tied to an available deployment and the same reviewed application origin.
    if (embed && available && project.embedEnabled === true && embedURL && new URL(embedURL).origin === new URL(demoURL).origin) {
      embed.hidden = false;
      const button = document.createElement('button'); button.className = 'button secondary'; button.textContent = 'Load embedded demo';
      embed.append(button);
      button.addEventListener('click', () => {
        const frame = document.createElement('iframe'); frame.title = `${project.name} — interactive demo`; frame.src = embedURL;
        frame.loading = 'lazy'; frame.referrerPolicy = 'no-referrer';
        frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-downloads');
        const note = document.createElement('p'); note.textContent = 'If the embedded application does not load or sign in, use Launch Live Demo above.';
        embed.replaceChildren(note, frame);
      }, { once: true });
    }
  });
})();
