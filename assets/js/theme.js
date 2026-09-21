/* Early theme application avoids a flash; storage may be unavailable on file://. */
(() => {
  let theme;
  try { theme = localStorage.getItem('ahmed-portfolio-theme'); } catch (_) { /* Use system preference. */ }
  if (theme !== 'light' && theme !== 'dark') theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
})();
