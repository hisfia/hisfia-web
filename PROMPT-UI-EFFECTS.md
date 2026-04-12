# INTEGRACIÓN DE EFECTOS UI — AuroraBackground + Sparkles + CinematicFooter
## Prompt para programador experto en HTML/CSS/JS vanilla

Eres un programador senior especializado en animaciones web y efectos visuales. Tu misión es integrar tres efectos de UI (inspirados en componentes React de Aceternity UI) en la landing estática de HisfIA (`index.html` + `css/main.css` + `js/main.js` si existe).

**Importante:** Este proyecto es vanilla HTML/CSS/JS — sin React, sin Next.js, sin TypeScript. Traduce los efectos a implementaciones nativas del navegador usando Canvas API, CSS Animations y GSAP CDN donde sea necesario.

---

## 🌌 EFECTO 1 — Aurora Background (en la sección Hero)

### Qué es
Un fondo animado con gradientes que se desplazan lentamente, creando un efecto de "aurora boreal" sutil detrás del contenido del hero. El efecto original (AuroraBackground de Aceternity) usa Framer Motion + CSS. Aquí lo implementamos con CSS puro + Canvas.

### Dónde
En `#hero` — detrás del contenido, usando el `<canvas id="hero-canvas">` ya existente o creando un elemento dedicado.

### Cómo implementarlo

**Paso 1 — Añade este CSS en `<style>` o en `css/main.css`:**

```css
/* ─── AURORA BACKGROUND ─── */
#hero {
  position: relative;
  overflow: hidden;
}

.aurora-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.aurora-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.18;
  mix-blend-mode: screen;
  animation: aurora-drift linear infinite;
  will-change: transform;
}

.aurora-blob:nth-child(1) {
  width: 700px; height: 700px;
  background: radial-gradient(circle, #00B8CC 0%, transparent 70%);
  top: -200px; left: -150px;
  animation-duration: 18s;
  animation-delay: 0s;
}

.aurora-blob:nth-child(2) {
  width: 900px; height: 600px;
  background: radial-gradient(circle, #6366f1 0%, transparent 70%);
  top: -100px; right: -200px;
  animation-duration: 24s;
  animation-delay: -6s;
}

.aurora-blob:nth-child(3) {
  width: 600px; height: 800px;
  background: radial-gradient(circle, #00B8CC 0%, transparent 70%);
  bottom: -100px; left: 40%;
  animation-duration: 20s;
  animation-delay: -12s;
}

.aurora-blob:nth-child(4) {
  width: 500px; height: 500px;
  background: radial-gradient(circle, #a855f7 0%, transparent 70%);
  top: 30%; right: 5%;
  animation-duration: 28s;
  animation-delay: -4s;
}

@keyframes aurora-drift {
  0%   { transform: translate(0, 0) scale(1) rotate(0deg); }
  25%  { transform: translate(40px, -30px) scale(1.08) rotate(15deg); }
  50%  { transform: translate(-20px, 50px) scale(0.94) rotate(-10deg); }
  75%  { transform: translate(60px, 20px) scale(1.05) rotate(25deg); }
  100% { transform: translate(0, 0) scale(1) rotate(0deg); }
}

/* Reduce en mobile para rendimiento */
@media (max-width: 768px) {
  .aurora-blob { opacity: 0.12; filter: blur(60px); }
  .aurora-blob:nth-child(3),
  .aurora-blob:nth-child(4) { display: none; }
}
```

**Paso 2 — Añade el HTML de aurora justo dentro de `<section id="hero">`, como primer hijo:**

```html
<div class="aurora-layer" aria-hidden="true">
  <div class="aurora-blob"></div>
  <div class="aurora-blob"></div>
  <div class="aurora-blob"></div>
  <div class="aurora-blob"></div>
</div>
```

**Paso 3 — Asegúrate de que el contenido del hero tiene `position:relative; z-index:1` para que quede encima de la aurora.**

El `<canvas id="hero-canvas">` (partículas) debe tener `z-index:2`. Las partículas ya existentes quedan encima de la aurora.

---

## ✨ EFECTO 2 — Sparkles (mejora del canvas de partículas)

### Qué es
El efecto SparklesCore (de Aceternity, basado en tsparticles) crea partículas brillantes que aparecen y desaparecen con efecto de destellos. Ya existe un canvas de partículas en `#hero-canvas`. Vamos a mejorar su comportamiento: las partículas actuales son puntos simples que se mueven — las convertimos en destellos que aparecen, brillan y desaparecen.

### Dónde
Reemplaza o mejora el bloque `/* ─── PARTICLES ─── */` que ya existe en el `<script>` inline del HTML.

### Cómo implementarlo

Encuentra el bloque `/* ─── PARTICLES ─── */` en el `<script>` y reemplázalo completo con esto:

```javascript
/* ─── SPARKLES (mejora partículas hero) ─────────────────────── */
(function(){
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, sparks = [];

  const COLORS = ['rgba(0,184,204,', 'rgba(255,255,255,', 'rgba(99,102,241,'];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randomSpark() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 2.5 + 0.5,
      life: 0,
      maxLife: Math.random() * 120 + 60,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2,
      color: color,
      // Star shape
      star: Math.random() > 0.5,
    };
  }

  function drawStar(x, y, r, opacity, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color + opacity + ')';
    ctx.shadowBlur = r * 6;
    ctx.shadowColor = color + '0.6)';
    // Draw 4-point star
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const x1 = Math.cos(angle) * r;
      const y1 = Math.sin(angle) * r;
      const x2 = Math.cos(angle + Math.PI / 4) * (r * 0.35);
      const y2 = Math.sin(angle + Math.PI / 4) * (r * 0.35);
      if (i === 0) ctx.moveTo(x1, y1);
      else ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawDot(x, y, r, opacity, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color + opacity + ')';
    ctx.shadowBlur = r * 4;
    ctx.shadowColor = color + '0.5)';
    ctx.fill();
  }

  function init() {
    resize();
    sparks = [];
    const count = Math.min(80, Math.floor(W * H / 10000));
    for (let i = 0; i < count; i++) {
      const s = randomSpark();
      s.life = Math.floor(Math.random() * s.maxLife); // stagger start
      sparks.push(s);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    sparks.forEach((s, idx) => {
      s.life++;
      s.x += s.vx;
      s.y += s.vy;

      // Wrap around
      if (s.x < -10) s.x = W + 10;
      if (s.x > W + 10) s.x = -10;
      if (s.y < -10) s.y = H + 10;
      if (s.y > H + 10) s.y = -10;

      if (s.life >= s.maxLife) {
        sparks[idx] = randomSpark();
        return;
      }

      // Fade in/out
      const t = s.life / s.maxLife;
      const opacity = t < 0.3 ? t / 0.3 : t > 0.7 ? (1 - t) / 0.3 : 1;
      const finalOp = opacity * 0.7;

      if (s.star) {
        drawStar(s.x, s.y, s.size, finalOp.toFixed(2), s.color);
      } else {
        drawDot(s.x, s.y, s.size, finalOp.toFixed(2), s.color);
      }
    });
    requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', init, { passive: true });
})();
```

---

## 🎬 EFECTO 3 — Cinematic Footer (con GSAP)

### Qué es
Un footer con dos efectos: (1) **botones magnéticos** — el botón CTA se "atrae" ligeramente al cursor cuando está cerca, y (2) **texto grande de fondo** con efecto de revelado al hacer scroll. El efecto original (motion-footer.tsx) usa Framer Motion + GSAP.

### Dónde
En el `<footer>` existente del HTML.

### Paso 1 — Añade GSAP desde CDN

Justo antes del `</body>` del HTML, añade GSAP CDN (si no está ya):

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

Añade esto **antes** del `<script>` inline donde están los otros scripts.

### Paso 2 — Actualiza el HTML del footer

Reemplaza el `<footer>` actual con este (mantiene exactamente el mismo contenido, solo añade clases y wrappers para los efectos):

```html
<footer id="footer-main">
  <!-- Texto enorme de fondo con efecto revelado -->
  <div class="ft-word" aria-hidden="true">HisfIA</div>

  <!-- Canvas de partículas del footer -->
  <canvas id="ft-canvas" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.4"></canvas>

  <div class="ft-content" style="position:relative;z-index:1">
    <div class="ft-top">
      <a href="#hero" class="ft-logo magnetic-btn">Hisf<span class="logo-ia">IA</span></a>
      <nav class="ft-nav" aria-label="Footer">
        <a href="#dolor" class="ft-pill">El problema</a>
        <a href="#solucion" class="ft-pill">Cómo funciona</a>
        <a href="#casos" class="ft-pill">Casos reales</a>
        <a href="#resenas" class="ft-pill">Reseñas</a>
        <a href="#quienes" class="ft-pill">Quiénes somos</a>
        <a href="#garantia" class="ft-pill">Demo gratis</a>
      </nav>
    </div>
    <div class="ft-cta-row" style="text-align:center;padding:48px 0 32px">
      <a href="#garantia" class="magnetic-btn ft-main-cta" style="display:inline-flex;align-items:center;gap:10px;background:var(--c, #00B8CC);color:#000;font-weight:700;font-size:1.1rem;padding:18px 42px;border-radius:100px;text-decoration:none;position:relative;overflow:hidden;transition:box-shadow .3s">
        <span class="magnetic-inner">Empieza gratis — sin compromiso</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
      <p style="margin-top:14px;font-size:.85rem;opacity:.5;font-family:'JetBrains Mono',monospace;letter-spacing:.05em">7 días para estar operativo · Sin permanencia</p>
    </div>
    <div class="ft-bottom">
      <span class="f-copy">© 2026 HisfIA · Automatización para negocios españoles · hisfia.com</span>
      <div style="display:flex;align-items:center;gap:8px">
        <a href="/privacidad" class="ft-pill" style="font-size:.75rem">Privacidad</a>
        <button id="back-top" aria-label="Volver arriba">↑</button>
      </div>
    </div>
  </div>
</footer>
```

### Paso 3 — CSS para el footer cinemático

Añade al CSS:

```css
/* ─── FOOTER CINEMATICO ─── */
#footer-main {
  position: relative;
  overflow: hidden;
}

.ft-word {
  position: absolute;
  bottom: -0.15em;
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(80px, 18vw, 220px);
  font-weight: 900;
  letter-spacing: -0.04em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,255,255,0.06);
  pointer-events: none;
  white-space: nowrap;
  user-select: none;
  z-index: 0;
  font-family: 'Space Grotesk', sans-serif;
  /* Revelado desde abajo */
  clip-path: inset(0 0 100% 0);
  transition: clip-path 0s;
}

.ft-word.revealed {
  animation: ft-word-reveal 1.2s cubic-bezier(.16,1,.3,1) forwards;
}

@keyframes ft-word-reveal {
  from { clip-path: inset(0 0 100% 0); }
  to   { clip-path: inset(0 0 -10% 0); }
}

/* Botones magnéticos */
.magnetic-btn {
  position: relative;
  transition: transform 0.15s cubic-bezier(.16,1,.3,1);
}

.ft-main-cta:hover {
  box-shadow: 0 0 40px rgba(0,184,204,0.4), 0 0 80px rgba(0,184,204,0.15);
}

/* Línea separadora del footer con gradiente */
#footer-main::before {
  content: '';
  position: absolute;
  top: 0; left: 10%; right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,184,204,0.3), transparent);
}
```

### Paso 4 — JavaScript para los efectos GSAP del footer

Añade este bloque al `<script>` inline (después del resto de scripts, antes del cierre `</script>`):

```javascript
/* ─── FOOTER CINEMATIC ─────────────────────────────────────── */
(function(){
  // Revelado del texto gigante .ft-word con ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const ftWord = document.querySelector('.ft-word');
    if (ftWord) {
      ScrollTrigger.create({
        trigger: '#footer-main',
        start: 'top 80%',
        onEnter: () => ftWord.classList.add('revealed'),
        once: true
      });
    }

    // Parallax sutil en el texto de fondo
    gsap.to('.ft-word', {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: '#footer-main',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  }

  // Botones magnéticos (sin GSAP — puro JS vanilla)
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    const strength = 0.25; // cuánto se atrae (0 = nada, 1 = mucho)

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  // Mini canvas de partículas en el footer
  const ftCanvas = document.getElementById('ft-canvas');
  if (ftCanvas) {
    const ctx = ftCanvas.getContext('2d');
    let W, H, pts = [];

    function resize() {
      W = ftCanvas.width = ftCanvas.offsetWidth;
      H = ftCanvas.height = ftCanvas.offsetHeight;
    }

    function init() {
      resize();
      pts = [];
      const n = Math.min(30, Math.floor(W * H / 16000));
      for (let i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.1,
          r: Math.random() * 1.2 + 0.4,
          o: Math.random() * 0.3 + 0.05
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,184,204,${p.o})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    // Solo activa cuando el footer es visible (optimización rendimiento)
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        init(); draw();
        obs.disconnect();
      }
    });
    obs.observe(ftCanvas);
    window.addEventListener('resize', () => { resize(); }, { passive: true });
  }
})();
```

---

## ✅ VERIFICACIÓN FINAL

Después de aplicar todos los cambios:

1. **Abre la web** — scroll lento de arriba a abajo
2. **Hero**: Debe verse el efecto aurora moviéndose suavemente detrás del contenido
3. **Hero canvas**: Las partículas deben tener forma mixta (puntos + destellos de 4 puntas) que aparecen y desaparecen con fade
4. **Footer**: Al hacer scroll hasta el footer, el texto "HisfIA" enorme debe revelarse desde abajo con animación
5. **Footer botones**: Pasa el cursor sobre el botón CTA grande — debe "atraerse" ligeramente hacia el cursor
6. **Consola**: Sin errores. Si GSAP no carga (offline), los efectos JS no-GSAP siguen funcionando
7. **Mobile (390px)**: La aurora reduce a 2 blobs y opacidad menor. El texto del footer ocupa todo el ancho
8. **Rendimiento**: Las partículas del footer solo se inician cuando el footer es visible

**Commit cuando todo esté correcto:**
```bash
git add -A
git commit -m "feat: aurora background + sparkles + cinematic footer effects"
git push
```

---

## RESUMEN DE CAMBIOS

| Efecto | Dónde | Método |
|--------|-------|--------|
| Aurora Background | `#hero` — antes del `<canvas>` | 4 divs con CSS animation + blur |
| Sparkles | `<canvas id="hero-canvas">` | Reemplaza el bloque PARTICLES actual |
| Footer text reveal | `.ft-word` en `<footer>` | GSAP ScrollTrigger + clip-path |
| Footer parallax | `.ft-word` en `<footer>` | GSAP scrub |
| Botones magnéticos | `.magnetic-btn` | mousemove vanilla JS |
| Partículas footer | `<canvas id="ft-canvas">` | Canvas API con IntersectionObserver lazy |
