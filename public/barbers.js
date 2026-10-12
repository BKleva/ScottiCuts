(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, attrs = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') n.className = v;
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) n.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat()) if (kid != null && kid !== false) n.append(kid.nodeType ? kid : document.createTextNode(kid));
    return n;
  };
  const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  $('#yr').textContent = new Date().getFullYear();

  /* lightbox */
  const LB = { list: [], i: 0 };
  const lb = $('#lightbox');
  const lbShow = () => {
    const im = LB.list[LB.i];
    $('img', lb).src = im.url; $('img', lb).alt = im.caption || 'Portfolio photo';
    $('figcaption', lb).textContent = im.caption || '';
    lb.classList.toggle('single', LB.list.length < 2);
  };
  const lbStep = (n) => { LB.i = (LB.i + n + LB.list.length) % LB.list.length; lbShow(); };
  const lbOpen = (list, i) => { LB.list = list; LB.i = i; lbShow(); if (!lb.open) lb.showModal(); };
  $('.lb-x', lb).onclick = () => lb.close();
  $('.prev', lb).onclick = () => lbStep(-1);
  $('.next', lb).onclick = () => lbStep(1);
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') lbStep(-1); if (e.key === 'ArrowRight') lbStep(1); });

  async function load() {
    const grid = $('#teamGrid');
    let team = null;
    try { const r = await fetch('/api/team'); if (r.ok) team = (await r.json()).team; } catch { /* handled below */ }

    if (!team || !team.length) {
      grid.replaceChildren(el('div', { class: 'team-empty' },
        el('h2', {}, team ? 'Profiles coming soon' : 'Couldn’t load the crew'),
        el('p', {}, team ? 'We’re putting the finishing touches on our barber profiles. In the meantime, book a chair or give us a call.' : 'Please refresh, or give us a call.'),
        el('div', { class: 'hero-cta' }, el('a', { class: 'btn', href: '/#book' }, 'Book an appointment'), el('a', { class: 'btn btn-ghost', href: 'tel:+16093652539' }, 'Call (609) 365-2539'))));
      return;
    }

    grid.replaceChildren(...team.map((b) => {
      const photo = el('div', { class: 'b-photo', role: b.photo ? 'img' : null, 'aria-label': b.photo ? b.name : null, style: b.photo ? `background-image:url("${b.photo}")` : '' }, b.photo ? null : initials(b.name));
      const work = b.images.length ? [
        el('p', { class: 'b-sub' }, `Portfolio · ${b.images.length} photo${b.images.length === 1 ? '' : 's'}`),
        el('div', { class: 'b-work full' }, b.images.map((im, i) =>
          el('button', { type: 'button', 'aria-label': `View ${b.name} photo ${i + 1}`, onclick: () => lbOpen(b.images, i) },
            el('img', { src: im.url, alt: im.caption || `${b.name} portfolio photo ${i + 1}`, loading: 'lazy' }),
            im.caption ? el('span', { class: 'cap' }, im.caption) : null))),
      ] : [el('p', { class: 'b-sub' }, 'Portfolio coming soon')];
      return el('article', { class: 'barber', id: b.id },
        photo,
        el('div', {},
          el('h2', { class: 'b-name' }, b.name),
          b.title ? el('p', { class: 'b-title' }, b.title) : null,
          b.bio ? el('p', { class: 'b-bio' }, b.bio) : null,
          work,
          el('div', { class: 'b-cta' }, el('a', { class: 'btn btn-sm', href: '/#book' }, 'Book a cut'), el('a', { class: 'btn btn-ghost btn-sm', href: 'tel:+16093652539' }, 'Call the shop'))));
    }));

    if (team.length > 1) {
      const nav = $('#crewNav'); nav.hidden = false;
      nav.replaceChildren(...team.map((b) => el('a', { href: `#${b.id}` }, b.name)));
    }
    // jump to a specific barber when linked as /barbers#<id>
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }
  load();
})();
