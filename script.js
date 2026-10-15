(() => {
  const WHATSAPP = '5561986388108';
  const MSG = 'Olá! Vim pelo site e gostaria de um orçamento de móveis planejados.';
  const waUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(MSG)}`;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  $('#ano').textContent = new Date().getFullYear();
  $$('[data-wa]').forEach(a => { a.href = waUrl; a.target = '_blank'; a.rel = 'noopener'; });

  // borda do header ao rolar
  const header = $('.header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  // menu mobile
  const burger = $('.burger'), nav = $('#menu');
  const setMenu = open => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); burger.focus(); } });

  // filtro de projetos
  const filters = $$('.f'), items = $$('.g'), status = $('#filtro-status');
  const applyFilter = f => {
    filters.forEach(b => { const on = b.dataset.f === f; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
    let n = 0;
    items.forEach(it => {
      const show = f === 'todos' || it.dataset.cat === f;
      it.hidden = !show;
      if (show) { n++; it.classList.remove('is-entering'); void it.offsetWidth; it.classList.add('is-entering'); }
    });
    status.textContent = `${n} projetos em ${filters.find(b => b.dataset.f === f).textContent}`;
  };
  filters.forEach(b => b.addEventListener('click', () => applyFilter(b.dataset.f)));
  $$('[data-go]').forEach(a => a.addEventListener('click', () => applyFilter(a.dataset.go)));

  // foto que segue o cursor na lista de ambientes (desktop)
  const ph = $('#cursor-ph'), phImg = ph && ph.querySelector('img');
  if (ph && matchMedia('(hover:hover) and (min-width:1024px)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    let x = 0, y = 0, cx = 0, cy = 0, raf = null;
    const loop = () => { cx += (x - cx) * .18; cy += (y - cy) * .18; ph.style.transform = `translate(${cx - 130}px, ${cy - 173}px) scale(${ph.classList.contains('is-on') ? 1 : .85})`; raf = requestAnimationFrame(loop); };
    $$('.amb__row').forEach(r => {
      r.addEventListener('mouseenter', e => { phImg.src = r.dataset.thumb; x = cx = e.clientX; y = cy = e.clientY; ph.classList.add('is-on'); if (!raf) loop(); });
      r.addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; });
      r.addEventListener('mouseleave', () => { ph.classList.remove('is-on'); setTimeout(() => { if (!ph.classList.contains('is-on')) { cancelAnimationFrame(raf); raf = null; } }, 400); });
    });
  }

  // lightbox
  const lb = $('#lb'), lbImg = $('#lb-img'), lbWebp = $('#lb-webp'), lbCap = $('#lb-cap');
  let idx = 0, opener = null;
  const visible = () => items.filter(i => !i.hidden);
  const show = i => {
    const list = visible(); idx = (i + list.length) % list.length;
    const it = list[idx], btn = it.querySelector('.g__btn');
    lbWebp.srcset = btn.dataset.webp;
    lbImg.src = btn.dataset.src;
    lbImg.alt = it.querySelector('img').alt;
    lbCap.textContent = `${it.querySelector('figcaption span').textContent} · ${idx + 1} de ${list.length}`;
  };
  items.forEach(it => it.querySelector('.g__btn').addEventListener('click', () => { opener = it.querySelector('.g__btn'); show(visible().indexOf(it)); lb.showModal(); }));
  lb.addEventListener('click', e => {
    const b = e.target.closest('[data-lb]');
    if (b) { const a = b.dataset.lb; if (a === 'close') lb.close(); if (a === 'prev') show(idx - 1); if (a === 'next') show(idx + 1); }
    else if (e.target === lb) lb.close();
  });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1); });
  lb.addEventListener('close', () => opener && opener.focus());
  let x0 = null;
  lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); x0 = null; });
})();

