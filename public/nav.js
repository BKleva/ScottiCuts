(() => {
  'use strict';
  const nav = document.querySelector('.nav');
  const btn = document.querySelector('.nav-toggle');
  if (!nav || !btn) return;

  const set = (open) => {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  btn.addEventListener('click', () => set(!nav.classList.contains('open')));
  // picking an item, tapping elsewhere, pressing Escape or widening the window closes it
  nav.querySelectorAll('.nav-links a').forEach((a) => a.addEventListener('click', () => set(false)));
  document.addEventListener('click', (e) => { if (!nav.contains(e.target)) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { set(false); btn.focus(); } });
  window.matchMedia('(min-width: 861px)').addEventListener('change', () => set(false));
})();
