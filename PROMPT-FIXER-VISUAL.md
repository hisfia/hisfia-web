# PROMPT FIXER VISUAL — HisfIA Landing
## Para Claude Code: arregla todo de arriba a abajo

Eres un programador senior experto en CSS, HTML y diseño web. Tu misión es dejar la landing de HisfIA perfecta visualmente — en desktop y móvil — sin romper nada que ya funcione. Trabaja de arriba a abajo, sección a sección, commit al final.

---

## 🚨 PROBLEMA RAÍZ — LEE ESTO PRIMERO

El HTML tiene **DOS sistemas de diseño completamente distintos y en conflicto**:

**Sistema A** — en el `<style>` inline del `<head>` (el original, tema claro/crema):
```
--bg: #F7F5F0   (fondo crema)
--bg2: #EEEAE0
--text: #0E0D0B
--border: #D8D4C8
--sub: #6A6760
font-family: 'DM Sans', 'Space Grotesk'
```

**Sistema B** — en `css/main.css` (añadido después, tema oscuro):
```
--n: #0A0A0A    (fondo negro)
--nc: #0f0f0f
--t: #f5f4f0
--b: #1e1e1e
--m: #555555
font-family: 'Outfit', 'Syne'
```

Ambos definen estilos para los mismos elementos (`body`, `nav`, `#hero`, etc.) causando que:
- El hero tiene fondo crema en vez de negro
- Los colores de texto no son consistentes
- El vídeo del hero no se ve por conflictos de z-index
- El padding es caótico (definido en 3 sitios distintos)
- El responsive se rompe porque los breakpoints de ambos sistemas no coinciden

**La solución es unificar en UN SOLO sistema.** El diseño que queremos mantener es el del `<style>` inline (el que tiene más secciones desarrolladas, el que se ve en producción). El `css/main.css` tiene estilos de secciones antiguas que ya no se usan.

---

## PASO 1 — AUDITAR Y DECIDIR QUÉ CSS VALE

Antes de tocar nada, haz esto:

1. Abre `css/main.css` y revisa cada bloque de CSS
2. Por cada selector, comprueba si ese selector existe en el HTML actual (`index.html`)
3. Crea una lista de clases en `main.css` que NO aparecen en el HTML:
   - `.hg`, `.hbadge`, `.hmock`, `.cc`, `.ch`, `.cav`, `.stag`, `.sh2` → son del diseño viejo, **eliminar de main.css**
   - `.probg`, `.pcard`, `.prg`, `.stsg`, `.sti` → secciones antiguas, **eliminar de main.css**
   - `#anec`, `#prob`, `#cf`, `#roi`, `#stats`, `#pr`, `#ga` → secciones antiguas, **eliminar de main.css**
4. Los estilos que SÍ se usan actualmente y que están en `main.css`: nav base, footer, hamburger — **migrarlos al `<style>` inline o a un archivo nuevo limpio**
5. **Al final**: `css/main.css` debe quedar vacío o con solo 2-3 reglas globales de reset que no dupliquen el inline

---

## PASO 2 — UNIFICAR LAS VARIABLES CSS

En el bloque `:root` del `<style>` inline, asegúrate de que están **todas** estas variables y que se usan de forma consistente:

```css
:root {
  /* Fondos */
  --bg:   #F7F5F0;   /* fondo principal crema */
  --bg2:  #EEEAE0;   /* fondo secundario */
  --dark: #0E0D0B;   /* oscuro puro */

  /* Texto */
  --text:  #0E0D0B;  /* texto principal */
  --sub:   #6A6760;  /* texto secundario */
  --muted: #9E9B92;  /* texto apagado */

  /* Bordes */
  --border: #D8D4C8;

  /* Accent */
  --c:  #00B8CC;              /* azul HisfIA */
  --cb: rgba(0,184,204,.16);  /* azul translúcido */
  --cg: rgba(0,184,204,.07);  /* azul muy suave */
}
```

Busca en todo el HTML referencias a `var(--n)`, `var(--nc)`, `var(--t)`, `var(--b)`, `var(--m)`, `var(--d)` (del sistema B) y reemplázalas:
- `var(--n)` → `var(--dark)`
- `var(--nc)` → `var(--bg2)`
- `var(--t)` → `var(--text)`
- `var(--b)` → `var(--border)`
- `var(--m)` → `var(--sub)`
- `var(--d)` → `var(--muted)`

---

## PASO 3 — ARREGLAR EL HERO

El hero es el elemento más roto. Arréglalo en este orden:

### 3A — Estructura del hero

El `#hero` tiene estos hijos directos en el HTML:
```
<canvas id="hero-canvas">       ← fondo animado
<div class="sys-bar">           ← barra superior de estado
<div class="hero-l">            ← columna izquierda (texto + form)
<div class="hero-r">            ← columna derecha (vídeo)
<div class="hero-bottom">       ← métricas inferiores
```

El CSS del hero debe ser:
```css
#hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-top: 62px; /* altura del nav */
}

/* Canvas de fondo — SIEMPRE detrás de todo */
#hero-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

/* Fila central que contiene hero-l y hero-r */
.hero-main {
  display: flex;
  flex: 1;
  min-height: 0;
  position: relative;
  z-index: 1;
}

/* Columna izquierda */
.hero-l {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 60px 60px 80px;
  max-width: 640px;
  position: relative;
  z-index: 2;
}

/* Columna derecha — el vídeo */
.hero-r {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: var(--bg2);
}
```

**IMPORTANTE:** Envuelve `.hero-l` y `.hero-r` en un `<div class="hero-main">` si no existe ya, para que formen la fila central.

### 3B — El vídeo en hero-r

El vídeo `assets/Chica.mp4` debe llenar toda la columna derecha:

```css
.hero-r video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}
```

Elimina el atributo `poster="assets/hero-poster.jpg"` del `<video>` porque ese archivo no existe y genera un 404.

**Elimina el `.hero-video-wrap`** (el mock del dashboard) del interior de `.hero-r` — ese bloque ya no es necesario porque el vídeo real funciona. Borra todo el HTML del `.hero-video-wrap` y su CSS.

El gradiente de transición entre `.hero-l` y `.hero-r`:
```css
.hero-r::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 200px;
  background: linear-gradient(to right, var(--bg) 0%, transparent 100%);
  z-index: 2;
  pointer-events: none;
}
.hero-r::after {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 120px;
  background: linear-gradient(to top, var(--bg), transparent);
  z-index: 2;
  pointer-events: none;
}
```

Las esquinas decorativas `.corner` y `.scan-line` y `.vid-ai-tag` que están dentro de `.hero-r` → **mantenerlas**, tienen `z-index` alto así que se verán sobre el vídeo.

### 3C — Métricas del hero (`.hero-bottom`)

```css
.hero-bottom {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  border-top: 1px solid var(--border);
  background: rgba(247,245,240,0.8);
  backdrop-filter: blur(10px);
}

.hb-item {
  padding: 20px 24px;
  border-right: 1px solid var(--border);
  text-align: center;
}
.hb-item:last-child { border-right: none; }

.hb-val {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  color: var(--dark);
  line-height: 1;
  margin-bottom: 4px;
}
.hb-val .ac { color: var(--c); }

.hb-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--sub);
}
```

### 3D — Hero responsive (mobile)

```css
/* Tablet */
@media (max-width: 900px) {
  .hero-main {
    flex-direction: column;
  }
  .hero-l {
    padding: 40px 24px 32px;
    max-width: 100%;
    order: 1;
  }
  .hero-r {
    height: 40svh;
    order: 2;
    flex: none;
  }
  .hero-r::before {
    /* En mobile el gradiente va de arriba hacia abajo, no lateral */
    width: 100%;
    height: 80px;
    background: linear-gradient(to bottom, var(--bg) 0%, transparent 100%);
    top: 0; left: 0; bottom: auto;
  }
  .hero-bottom {
    grid-template-columns: repeat(3, 1fr);
  }
  .hb-item:nth-child(3) { border-right: none; }
  .hb-item:nth-child(4) { border-top: 1px solid var(--border); }
}

/* Mobile */
@media (max-width: 560px) {
  .hero-l {
    padding: 28px 20px 24px;
  }
  .hero-r {
    height: 32svh;
  }
  .hero-bottom {
    grid-template-columns: repeat(2, 1fr);
  }
  .hb-item:nth-child(2) { border-right: none; }
  .hb-item:nth-child(3) { border-top: 1px solid var(--border); }
  .hb-item:nth-child(4) { border-top: 1px solid var(--border); border-right: none; }
  .hb-item:nth-child(5) { border-top: 1px solid var(--border); }
  .hb-item:nth-child(6) { border-top: 1px solid var(--border); border-right: none; }
}
```

---

## PASO 4 — RESPONSIVE GLOBAL: PADDING Y SPACING

El problema actual: algunas secciones tienen padding enorme en desktop y demasiado pequeño en móvil. Además hay conflictos entre `main.css` y el inline.

**Establece una única regla global de padding de sección:**

```css
/* En el <style> inline, después del :root */
section {
  padding: 100px 0;
  position: relative;
  z-index: 1;
  scroll-margin-top: 62px;
}

.container {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 44px;
}

@media (max-width: 900px) {
  section { padding: 72px 0; }
  .container { padding: 0 28px; }
}

@media (max-width: 560px) {
  section { padding: 56px 0; }
  .container { padding: 0 20px; }
}
```

**Elimina** todas las reglas `section{padding:...}` que estén en `main.css` o duplicadas en el inline.

---

## PASO 5 — SECCIÓN POR SECCIÓN: FIXES ESPECÍFICOS

### NAV
```css
nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 62px;
  z-index: 1000;
  background: rgba(247,245,240,0.92);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}

.nav-inner {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 44px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Links del nav */
.nav-links {
  display: flex;
  gap: 32px;
  list-style: none;
}
.nav-links a {
  font-size: 13px;
  color: var(--sub);
  text-decoration: none;
  transition: color 0.2s;
  position: relative;
}
.nav-links a:hover,
.nav-links a.active { color: var(--dark); }

/* Línea debajo del link activo */
.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px; left: 0;
  width: 0; height: 1px;
  background: var(--c);
  transition: width 0.3s ease;
}
.nav-links a.active::after,
.nav-links a:hover::after { width: 100%; }

/* CTA del nav */
.nav-cta {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: var(--dark);
  color: var(--bg);
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
}
.nav-cta:hover {
  background: var(--c);
  color: #000;
  transform: translateY(-1px);
}

/* Responsive nav */
@media (max-width: 900px) {
  .nav-links { display: none; }
  .nav-cta { display: none; }
  .ham-btn { display: flex; }
  .nav-inner { padding: 0 20px; }
}
```

### SOCIAL PROOF BAR (`#social-proof-bar`)
```css
#social-proof-bar {
  background: rgba(0,184,204,0.06);
  border-top: 1px solid rgba(0,184,204,0.15);
  border-bottom: 1px solid rgba(0,184,204,0.15);
  padding: 18px 0;
}
.spb-inner {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
}
.spb-n {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--dark);
}
.spb-l {
  font-size: 12px;
  color: var(--sub);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.spb-sep { color: var(--border); font-size: 1.2rem; }

@media (max-width: 640px) {
  .spb-inner {
    padding: 0 20px;
    gap: 16px;
    justify-content: flex-start;
  }
  .spb-sep { display: none; }
  .spb-n { font-size: 1rem; }
}
```

### SECCIÓN `#dolor`
Asegura que el heading, las stats y los escenarios tienen padding correcto:
```css
/* Stats de dolor — grid adaptable */
.pain-stats {
  display: grid;
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 56px;
}
@media (min-width: 901px) {
  .pain-stats { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 900px) {
  .pain-stats { grid-template-columns: repeat(2, 1fr); }
}

.pain-stat-item {
  background: var(--bg);
  padding: 36px 28px;
  text-align: center;
}

/* Número de stat — enorme */
.pain-stat-n {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: clamp(2.5rem, 5vw, 4rem);
  color: var(--dark);
  line-height: 1;
  display: block;
  margin-bottom: 12px;
}
.pain-stat-n .ac { color: var(--c); }

/* Escenarios de dolor */
.pain-scenarios {
  display: grid;
  gap: 16px;
}
@media (min-width: 901px) {
  .pain-scenarios { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 900px) {
  .pain-scenarios { grid-template-columns: 1fr; }
}
```

### SECCIÓN `#diferencia`
```css
/* Grid de comparación */
.diff-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 48px;
}

@media (max-width: 768px) {
  .diff-grid {
    grid-template-columns: 1fr;
    /* Columna HisfIA primero en mobile */
    display: flex;
    flex-direction: column-reverse;
  }
}

.diff-col {
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

/* Columna HisfIA destacada */
.diff-col.after {
  border-color: rgba(0,184,204,0.3);
  box-shadow: 0 0 40px rgba(0,184,204,0.06);
}
```

### SECCIÓN `#solucion` — Pasos
```css
.pasos-wrap {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  max-width: 900px;
  margin: 0 auto;
}

.paso {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  padding: 64px 0;
  border-bottom: 1px solid var(--border);
}
.paso:last-child { border-bottom: none; }

/* Pasos pares: imagen a la izquierda */
.paso.rev { direction: rtl; }
.paso.rev > * { direction: ltr; }

@media (max-width: 768px) {
  .paso,
  .paso.rev {
    grid-template-columns: 1fr;
    direction: ltr;
    gap: 32px;
    padding: 48px 0;
  }
  /* En mobile, el mock va siempre debajo */
  .paso-r { order: 2; }
  .paso-l { order: 1; }
}
```

### SECCIÓN `#soluciones` — Cards
```css
.sol-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 960px) {
  .sol-cards { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .sol-cards { grid-template-columns: 1fr; }
}

.sol-card {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 32px 28px;
  background: var(--bg);
  transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
}
.sol-card:hover {
  border-color: rgba(0,184,204,0.4);
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.08);
}
```

### SECCIÓN `#quienes` — Team cards
```css
.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 48px;
}

@media (max-width: 900px) {
  .team-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .team-grid { grid-template-columns: 1fr; }
}

.team-card {
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px 28px;
  background: var(--bg);
  transition: border-color 0.3s, transform 0.3s;
}
.team-card:hover {
  border-color: rgba(0,184,204,0.3);
  transform: translateY(-4px);
}

.team-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 16px;
  border: 2px solid var(--border);
  transition: border-color 0.3s;
}
.team-card:hover .team-photo {
  border-color: var(--c);
}
```

### SECCIÓN `#faq`
```css
.faq-list { max-width: 760px; }

.faq-item {
  border-bottom: 1px solid var(--border);
}
.faq-item:first-child {
  border-top: 1px solid var(--border);
}

.faq-q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 0;
  font-size: clamp(15px, 2vw, 17px);
  font-weight: 600;
  cursor: pointer;
  list-style: none;
  color: var(--dark);
}
.faq-q::-webkit-details-marker { display: none; }
.faq-q::after {
  content: '+';
  font-size: 22px;
  font-weight: 300;
  color: var(--c);
  transition: transform 0.3s;
  flex-shrink: 0;
}
.faq-item[open] .faq-q::after {
  transform: rotate(45deg);
}
.faq-a {
  padding: 0 0 24px;
  font-size: 15px;
  color: var(--sub);
  line-height: 1.8;
  max-width: 680px;
}
```

### SECCIÓN `#garantia` (formulario final)
Asegura que el formulario tiene buen aspecto en mobile:
```css
.contact-form-wrap {
  max-width: 560px;
  margin: 0 auto;
}

/* En mobile, el formulario tiene padding lateral */
@media (max-width: 560px) {
  .contact-form-wrap {
    padding: 0 4px;
  }
}
```

---

## PASO 6 — ELIMINAR EL ID DUPLICADO `#sectores`

Hay DOS `<section id="sectores">` en el HTML. Esto rompe el scroll del nav.

1. Busca las dos secciones con `id="sectores"` en `index.html`
2. Identifica cuál es la sección visual con el carrusel de sectores (la primera, aprox. línea 1756)
3. La segunda (aprox. línea 2011) es la misma sección duplicada — **elimina completamente** desde su `<section id="sectores"` hasta el `</section>` de cierre

---

## PASO 7 — MARQUEE: LOGOS VISIBLES

El carrusel de herramientas (`.mq-pill` items) usa imágenes `.mq-logo`. Verifica que se ven:

```css
.mq-logo {
  height: 20px;
  width: auto;
  opacity: 0.5;
  filter: grayscale(1) contrast(0.8);
  object-fit: contain;
  transition: opacity 0.3s, filter 0.3s;
  flex-shrink: 0;
}
/* Las imágenes SVG de logos claros (Google, HubSpot) necesitan inversión en tema claro */
/* No usar filter:invert() globalmente — hacerlo logo a logo si hace falta */
```

---

## PASO 8 — BOTÓN WHATSAPP FLOTANTE

Asegúrate de que el botón flotante NO tapa el footer ni el formulario final:

```css
#whatsapp-float {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 500; /* por debajo del nav (1000) pero por encima del contenido */
}
/* Ocultar cuando el usuario está en el formulario final */
/* Esto se hace con JS: observar #garantia con IntersectionObserver y toggle .hidden */
```

---

## PASO 9 — TIPOGRAFÍA CONSISTENTE

Asegúrate de que en TODO el HTML solo se usan estas 3 fuentes (las del Sistema A):
- **Headings**: `'Space Grotesk', sans-serif`
- **Cuerpo**: `'DM Sans', sans-serif`
- **Mono/labels**: `'JetBrains Mono', monospace`

Busca y reemplaza cualquier referencia a `'Syne'`, `'Outfit'`, `'Inter'` que haya entrado del Sistema B.

---

## PASO 10 — VERIFICACIÓN FINAL OBLIGATORIA

```bash
# 1. Abrir en Chrome en modo responsive iPhone 14 (390px)
# Verificar: nav, hero, todas las secciones, FAQ, footer

# 2. Comprobar consola: 0 errores
# Especialmente: no 404 de imágenes, no JS errors

# 3. IDs duplicados — debe devolver vacío
grep -o 'id="[^"]*"' index.html | sort | uniq -d

# 4. Variables del Sistema B que no deberían estar
grep -n "var(--n)\|var(--nc)\|var(--t)\b\|var(--b)\b\|var(--m)\b\|var(--d)\b" index.html | wc -l
# Debe dar 0

# 5. Hacer git commit y push
git add -A
git commit -m "fix: unificación CSS, hero vídeo, responsive completo"
git push
```

---

## RESUMEN PRIORIZADO

| # | Fix | Por qué importa |
|---|-----|-----------------|
| 1 | Unificar los dos sistemas CSS | Sin esto nada más funciona bien |
| 2 | Hero: vídeo visible y sin mock encima | Primera impresión del cliente |
| 3 | Eliminar sección #sectores duplicada | Rompe el nav |
| 4 | Padding global de secciones coherente | Todo el spacing está roto |
| 5 | Nav responsive | En mobile el menú debe funcionar |
| 6 | Team grid a 3 columnas + mobile | Pedro no aparece bien |
| 7 | Sol-cards responsive | Las 5 cards se rompen en tablet |
| 8 | FAQ accordion funcional | Sección nueva, revisar |
| 9 | Tipografía consistente (Syne/Outfit → fuera) | Mezcla de fuentes se nota |
| 10 | Logos del marquee visibles | Carrusel vacío en producción |
