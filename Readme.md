# Luke Aldover — Portfolio Website

Static portfolio website with an arcade mini-game page (Lawn Invaders).  
Built with plain HTML, CSS and JavaScript. No build step or external tooling required.

## Features

- Multi-section one-page site: About, Experience, Projects, Contact
- Desktop navigation + responsive hamburger navigation
- Responsive layout via `mediaqueries.css`
- Holographic / shader demo (used in `test.html`)
- Embedded canvas game: `zindex.html` uses `lawn.js` + `lawn.css`
- Simple project pages and demo assets in `assets/`

## Files of interest

- `index.html` — main portfolio page (desktop + hamburger nav present)
- `style.css` — global styling and nav styles
- `mediaqueries.css` — responsive rules for mobile and tablet breakpoints
- `zindex.html` — arcade game page (Lawn Invaders)
- `lawn.css` — styles used by `zindex.html`
- `lawn.js` — game logic (canvas drawing, zombie movement, input handling)
- `test.html` — shader / image overlay demos
- `assets/` — images and icons used site-wide

## Quick start (local)

1. Open the project folder in VS Code or a browser.
2. Recommended: serve files with a minimal HTTP server (prevents some browser restrictions on local resources):
   - Python 3 (PowerShell / CMD):
     - cd to project folder:
       cd "c:\Users\lukes\OneDrive\Documents\GitHub\html-css-js-laldover-Portfolio-Website-1"
     - start server:
       python -m http.server 8000
     - Open http://localhost:8000/index.html in your browser
   - Or open `index.html` directly in a browser (may work but serving is preferred for relative loads).

## Notes & tips

- Navigation
  - Desktop nav is fixed at top via `position: fixed`. Add top padding to content (or `body`) equal to nav height to prevent overlap.
  - To make the desktop nav shorter on a particular page, add `.compact` to the nav element (e.g. `<nav id="desktop-nav" class="compact">`) or add `class="compact-nav"` to `<body>` and target it in CSS.
- Hamburger menu
  - Hamburger is toggled in JS (`toggleMenu()`); the menu element uses `max-height` transitions for expand/collapse. Ensure media queries show `#hamburger-nav` at intended breakpoints.
  - For rounded hamburger menu use `border-radius` on `.menu-links` and add `pointer-events: none` to any decorative overlays so canvas interactions still work.
- Canvas & overlay (`zindex.html`)
  - `lawn.js` uses `requestAnimationFrame(update)` — browser controls frame rate (typically ~60fps).
  - To mask or overlay images on the canvas, either:
    - Place an absolutely-positioned `<img>` over the canvas (set parent `position: relative` and `img { position:absolute; z-index:2; pointer-events:none }`), or
    - Use canvas compositing (`globalCompositeOperation`) in `lawn.js` to apply a mask programmatically.
- Responsive behaviour is defined in `mediaqueries.css` (breakpoints at 1400px, 1200px, 600px).

## Common edits

- Update nav links: edit `index.html` and `nav` blocks in other pages.
- Add a new page: create `mypage.html`, include `<link rel="stylesheet" href="style.css">`, update nav links.
- Change game parameters: open `lawn.js` and change variables like `zombieVerticalSpeed`, `zombieVelocityX`, `zombieColumns`, `zombieRows` to tune difficulty.

## Known TODOs

- Update resume file and link
- Improve hamburger-nav spacing on small screens (add top padding to first section when `#hamburger-nav` is active)
- Complete README with screenshots and deployment instructions

## Credits

- Portfolio layout inspired by Ade-mir (credit in original Readme)
- Game assets and icons located in `assets/`
