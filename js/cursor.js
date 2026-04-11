/* HisfIA — cursor.js */
/* Cursor personalizado + barra de progreso */

// ── CURSOR ────────────────────────────────────────
const cd = document.getElementById('cd');
const cr = document.getElementById('cr');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cd.style.left = mx + 'px';
  cd.style.top = my + 'px';
});

(function loop() {
  rx += (mx - rx) * .12;
  ry += (my - ry) * .12;
  cr.style.left = rx + 'px';
  cr.style.top = ry + 'px';
  requestAnimationFrame(loop);
})();

document.querySelectorAll('a,button,input,.pc,.pcard').forEach(el => {
  el.addEventListener('mouseenter', () => cr.classList.add('big'));
  el.addEventListener('mouseleave', () => cr.classList.remove('big'));
});

// ── PROGRESS BAR ──────────────────────────────────
const pb = document.getElementById('pb');
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  pb.style.width = (s / h * 100) + '%';
}, { passive: true });
