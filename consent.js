/* ---------- consentimento de cookies (LGPD) ---------- */
(() => {
  const KEY = 'el-cookies-v1';
  const banner = document.getElementById('consent');
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } };
  const save = status => { try { localStorage.setItem(KEY, JSON.stringify({ status, at: new Date().toISOString() })); } catch {} };

  // Ponto único para scripts de terceiros. Para ativar Google Analytics ou Meta Pixel,
  // carregue os scripts aqui: eles só rodam depois que o visitante aceitar.
  const loadThirdParty = () => {
    const frame = document.getElementById('map-frame');
    const gate = document.getElementById('map-gate');
    if (frame && !frame.src) { frame.src = frame.dataset.src; frame.hidden = false; }
    if (gate) gate.hidden = true;
  };

  const showBanner = (focus = false) => {
    banner.hidden = false;
    document.body.classList.add('has-consent');
    document.body.style.setProperty('--consent-h', banner.offsetHeight + 'px');
    if (focus) banner.querySelector('button').focus();
  };
  const hideBanner = () => { banner.hidden = true; document.body.classList.remove('has-consent'); };

  const decide = status => {
    const before = read();
    save(status);
    hideBanner();
    document.dispatchEvent(new CustomEvent('el:consent', { detail: { status } }));
    if (status === 'accepted') loadThirdParty();
    // cookies de terceiros já carregados só saem com um recarregamento
    else if (before && before.status === 'accepted') location.reload();
  };

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-consent]');
    if (!b) return;
    const a = b.dataset.consent;
    if (a === 'accept') decide('accepted');
    if (a === 'reject') decide('rejected');
    if (a === 'open') showBanner(true);
  });

  const c = read();
  if (c && c.status === 'accepted') loadThirdParty();
  if (!c) showBanner();
  window.addEventListener('resize', () => { if (!banner.hidden) document.body.style.setProperty('--consent-h', banner.offsetHeight + 'px'); });
})();
