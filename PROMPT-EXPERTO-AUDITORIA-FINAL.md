# AUDITORÍA COMPLETA Y REPARACIÓN — HisfIA Landing Page
## Prompt para programador experto en HTML/CSS/JS

Eres un programador senior especializado en landing pages de alta conversión. Tu misión es auditar y reparar completamente la web de HisfIA. El proyecto es una landing page estática (`index.html` + `css/` + `js/`) desplegada en Vercel desde GitHub.

He analizado el código y he identificado bugs críticos, problemas de estructura y mejoras necesarias. Trabaja de arriba a abajo, sección por sección. No inventes estilos nuevos — extiende el sistema existente.

---

## 🔴 BUGS CRÍTICOS — Arreglar primero

### Bug 1 — IDs DUPLICADOS (rompe el scroll spy y los anchors del nav)

Hay **dos secciones con `id="sectores"`** y dos con `id="sectores-h"` en el mismo HTML. Esto rompe los anchor links del nav y el scroll spy.

**Qué hacer:**
1. Busca las dos secciones `<section id="sectores"...>` en el HTML
2. La primera (aprox. línea 1756) es la sección visual con el carrusel de sectores — **mantenla con `id="sectores"`**
3. La segunda (aprox. línea 2011) es una sección duplicada o vestigio — **elimínala completamente** junto con todo su contenido hasta el `</section>` de cierre
4. Verifica que no queda ningún `id="sectores-h"` duplicado

### Bug 2 — HERO: conflicto entre el vídeo de fondo y el mock del dashboard

En `.hero-r` hay DOS elementos compitiendo:
- Un `<video id="hero-vid">` con CSS `position:absolute; inset:0; width:100%; height:100%` — ocupa todo el espacio
- Un `.hero-video-wrap` (el mock del dashboard) que queda tapado debajo

**Qué hacer:**
El `<video id="hero-vid">` es un vídeo de fondo que debe ocupar toda la columna derecha. El `.hero-video-wrap` (mock dashboard) está encima pero mal posicionado.

Decide cuál de los dos usar:
- **Opción A (recomendada):** Oculta el `<video id="hero-vid">` con `display:none` hasta que haya un vídeo real. El `.hero-video-wrap` (mock del dashboard) será el elemento visible en `.hero-r`. Asegúrate de que `.hero-r` es `position:relative; display:flex; align-items:center; justify-content:center;` y `.hero-video-wrap` tiene `position:relative; z-index:2`.
- **Opción B:** Si el vídeo `assets/Chica.mp4` funciona bien, úsalo como fondo real de `.hero-r` y elimina el `.hero-video-wrap` (mock).

### Bug 3 — FALTA `assets/hero-poster.jpg`

El `<video id="hero-vid">` referencia `poster="assets/hero-poster.jpg"` que no existe. Esto genera un 404 en consola.

**Fix:** Elimina el atributo `poster` del tag `<video>` o crea una imagen placeholder en `assets/hero-poster.jpg` usando canvas/script.

### Bug 4 — CSS CONFLICTIVO: `.hero-r video` y `.hero-video-wrap` en el mismo elemento

En `css/main.css` hay esta regla:
```css
.hero-r video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:1 }
```
Y también:
```css
.hero-video-wrap { width:100%; max-width:420px; ... z-index:5 }
```

Si mantienes el `.hero-video-wrap` como elemento principal (Opción A del Bug 2), añade también:
```css
.hero-r video { display: none; }
```
Para que el vídeo no interfiera hasta que haya contenido real.

---

## 🟡 PROBLEMAS DE CALIDAD — Mejorar

### Problema 1 — 37 estilos inline en el HTML

El HTML tiene 37 atributos `style="..."` dispersos. Esto dificulta el mantenimiento. 

**Qué hacer:** Revisa los `style=""` más largos o repetidos y muévelos a clases CSS en `css/main.css`. Prioriza los que tienen más de 2 propiedades CSS. Añade clases descriptivas a esos elementos.

### Problema 2 — Variables CSS con nombres crípticos

Las variables CSS actuales son `--b`, `--c`, `--d`, `--m`, `--n`, `--nc`, `--t`. Son ilegibles.

**Qué hacer:** Al inicio del CSS (en `:root {}`), añade comentarios descriptivos junto a cada variable para que cualquier programador entienda qué es cada una:

```css
:root {
  --b: ...; /* background principal */
  --c: ...; /* color accent (azul HisfIA) */
  --d: ...; /* color de texto por defecto */
  /* etc */
}
```
No renombres las variables — solo documéntalas para no romper nada.

### Problema 3 — Scripts inline mezclados con HTML

Hay scripts JavaScript mezclados dentro del `index.html`. Crea un archivo `js/main.js` y mueve ahí todos los bloques `<script>` del HTML que no sean librerías externas, sustituyéndolos por una sola línea al final del body:
```html
<script src="js/main.js"></script>
```

### Problema 4 — Imágenes sin `loading="lazy"`

Las imágenes que están fuera del hero (logos en el marquee, iconos de secciones, avatares del equipo) deben cargar de forma lazy para mejorar el rendimiento:

Añade `loading="lazy"` a todos los `<img>` que NO estén en `#hero` ni en `#social-proof-bar`.

---

## 🟢 MEJORAS DE SEO Y META TAGS

Verifica que el `<head>` del HTML tenga todo esto. Si falta algo, añádelo:

```html
<!-- SEO básico -->
<meta name="description" content="HisfIA — El primer empleado de IA para pymes españolas. Atiende clientes, organiza tu agenda y genera informes solo. Operativo en 7 días.">
<meta name="keywords" content="inteligencia artificial pymes, automatización WhatsApp, chatbot español, HisfIA, IA para negocios">
<meta name="author" content="HisfIA">
<link rel="canonical" href="https://hisfia.es">

<!-- Open Graph (para compartir en redes) -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://hisfia.es">
<meta property="og:title" content="HisfIA — Mientras duermes, tu negocio trabaja.">
<meta property="og:description" content="El primer empleado de IA para pymes españolas. Atiende clientes 24/7, gestiona citas, publica contenido y genera informes. Solo.">
<meta property="og:image" content="https://hisfia.es/assets/og-image.jpg">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="HisfIA — Mientras duermes, tu negocio trabaja.">
<meta name="twitter:description" content="El primer empleado de IA para pymes españolas.">

<!-- Favicon (si no existe) -->
<link rel="icon" type="image/webp" href="assets/logo-icon sinfondo.webp">
<link rel="apple-touch-icon" href="assets/logo-icon sinfondo.webp">
```

---

## 🔵 MEJORAS DE RENDIMIENTO

### Performance 1 — Preload de fuentes y CSS crítico

Al inicio del `<head>`, asegúrate de que las fuentes que usa la web tienen `preload`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

### Performance 2 — El vídeo `assets/Chica.mp4` pesa 34MB

34MB es demasiado para autoplay en web. Si se usa como vídeo de fondo:
1. Añade `preload="none"` al tag `<video>` — no descarga hasta que el usuario interactúa
2. O considera comprimir el vídeo a menos de 5MB con `ffmpeg` antes del próximo deploy:
   ```bash
   ffmpeg -i assets/Chica.mp4 -vcodec libx264 -crf 28 -preset slow -acodec aac -b:a 128k assets/Chica-compressed.mp4
   ```

---

## ✅ VERIFICACIÓN FINAL OBLIGATORIA

Después de todos los cambios, ejecuta esta checklist:

1. **Abre la web en el navegador** — recorre toda la página de arriba a abajo
2. **Consola del navegador** — debe tener **0 errores** (ni 404, ni JS errors)
3. **Busca IDs duplicados** — `grep -o 'id="[^"]*"' index.html | sort | uniq -d` debe devolver vacío
4. **Verifica el hero** — `.hero-r` muestra correctamente el mock del dashboard (o el vídeo) sin superposición
5. **Comprueba el nav** — todos los enlaces anclan correctamente a sus secciones
6. **Mobile 390px** — en DevTools → responsive mode, la web se ve perfecta
7. **Haz git commit y push** cuando todo esté correcto:
   ```bash
   git add -A
   git commit -m "fix: bugs críticos, SEO, rendimiento y calidad de código"
   git push
   ```
   Vercel publicará automáticamente en menos de 30 segundos.

---

## RESUMEN DE CAMBIOS POR ORDEN DE PRIORIDAD

| Prioridad | Qué | Impacto |
|-----------|-----|---------|
| 🔴 1 | Eliminar sección `#sectores` duplicada | Rompe nav y scroll spy |
| 🔴 2 | Arreglar conflicto hero vídeo vs mock | Elemento principal del hero invisible |
| 🔴 3 | Eliminar referencia a `hero-poster.jpg` inexistente | 404 en consola |
| 🔴 4 | CSS `.hero-r video` conflictivo | Superposición visual |
| 🟡 5 | Mover 37 estilos inline a clases CSS | Mantenibilidad |
| 🟡 6 | Documentar variables CSS `--b`, `--c`, etc. | Legibilidad |
| 🟡 7 | Extraer JS a `js/main.js` | Organización |
| 🟡 8 | Añadir `loading="lazy"` a imágenes | Rendimiento |
| 🟢 9 | Añadir/completar meta tags SEO + OG | Visibilidad en buscadores |
| 🔵 10 | Optimizar vídeo 34MB | Velocidad de carga |
