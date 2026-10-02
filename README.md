# Studio 3D Product Customizer

An interactive 3D product customizer built with React, Three.js, and Zustand.
Pick a product (sneaker, chair, headset, watch, backpack), then configure its
colors, materials, dimensions, and components in real-time 3D — and save,
share, or export your design.

## Features

- **Real-time 3D viewport** — orbit / zoom / pan, fullscreen mode, PNG snapshots
- **Per-part customization** — colors (swatches, HEX, RGB sliders), materials, dimensions, component styles
- **Live pricing** — price updates as you customize
- **Presets** — one-click curated configurations
- **History** — undo / redo with coalesced rapid edits
- **Saved designs** — rename, duplicate, load, and delete designs (localStorage)
- **Share links** — encode your configuration in a URL hash
- **Export** — copy summary, download JSON, export CSV
- **Responsive** — side panels become collapsible drawers on mobile (≤1024px)
- **Dark / light theme** with system-preference fallback

## Tech stack

- [Vite](https://vite.dev/) 8 + React 19 + TypeScript (strict)
- [three.js](https://threejs.org/) via [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) + [drei](https://github.com/pmndrs/drei)
- [Zustand](https://github.com/pmndrs/zustand) for state
- [Oxlint](https://oxc.rs/) for linting

## Getting started

**Requirements:** Node.js `^20.19.0 || >=22.12.0` (see `.nvmrc`).

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build    # type-check + production build
npm run lint     # oxlint
npm run preview  # preview the production build
```

### Environment variables

Public client variables (see `.env.example`):

| Variable             | Default                      | Description                              |
| -------------------- | ---------------------------- | ---------------------------------------- |
| `VITE_APP_TITLE`     | `Studio 3D Product Customizer` | Page title / OG title                  |
| `VITE_APP_VERSION`   | `1.0.0`                      | Stamped into `index.html` as a meta tag  |
| `VITE_DEFAULT_THEME` | `dark`                       | Default theme before system preference   |

## Deploying to Vercel

1. Push this project to a GitHub repository.
2. In Vercel, **Add New → Project → Import** the repository.
3. The defaults work out of the box (Framework Preset: **Vite**,
   Build Command: `npm run build`, Output Directory: `dist`).
4. (Optional) set the `VITE_*` environment variables in the Vercel dashboard.
5. Deploy.

## License

[MIT](./LICENSE)
