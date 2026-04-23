# Vite Static Starter

A modern static site starter repository powered by Vite. It is designed to provide a highly optimized out-of-the-box setup for building rich, animated, and performant static websites.

## 🚀 Features & Functionality

### Core Tooling
- **Vite 8.x**: Lightning-fast cold server start and instant HMR (Hot Module Replacement) out of the box.
- **Rollup Build**: Deeply optimized production builds.

### 🎨 Styling & Animations
- **SCSS Support**: Native support for SCSS, including global variable injection via `vite.config.js` preprocessing.
- **GSAP**: Industry-standard high-performance animation library pre-installed for rich UI interactions.
- **Lenis**: Smooth scrolling architecture pre-installed to provide a premium scroll feel.
- **Autoprefixer**: PostCSS built-in to automatically handle CSS vendor prefixes targeting the last 2 versions.

### 🖼️ Asset Optimization (Built-in Plugins)
- **Automatic Responsive Images (`data-image-responsive`)**: 
  Any `<img data-image-responsive>` tag dynamically generates optimized `.webp` variants at multiple layout breakpoints (320w, 768w, 1024w, 1440w). The plugin smartly rewrites the HTML to map the original asset to the generated `srcset` variations and handles `sizes="100vw"`.
- **Performance Image Attributes**: Automatically adds `loading="lazy"` and `decoding="async"` attributes to images to defer network fetching until elements reach the viewport natively.
- **Image Compression**: Includes `vite-plugin-image-optimizer` ensuring JPGs, WebPs, and PNGs are minimized heavily without losing visual quality during production builds.
- **Inline SVGs (`data-svg`)**: 
  Any `<img src="icon.svg" data-svg>` tag is intelligently read during build and replaced natively with standard inline `<svg>...</svg>` nodes strings, granting CSS total style control over icons (fill/stroke customization).

### 🧩 Architecture
- **HTML Partials (`vite-plugin-html-include`)**: Native syntax (`<include file="src/parts/_head.html"></include>`) allows modularization of headers, footers, meta-blocks, etc.

### 🛠️ Developer Experience (DX)
- **ESLint & Prettier**: Configured out of the box to enforce rigorous code formatting.
- **Vite Checker**: Validates ESLint styling logic natively inside the Vite terminal overlay.
- **Husky & lint-staged**: Git hooks mapped via `prepare` to ensure code is automatically formatted and fixed prior to committing.

## 📦 Getting Started

### Installation
Navigate to your project folder and run:
```bash
npm install
```

### Useful Commands
- **`npm run dev`**: Starts the local Vite development server with Hot Module Replacement (HMR).
- **`npm run build`**: Compiles, minifies, formats, and generates heavily optimized webp images to the `dist` folder ready for static hosting deployment.
- **`npm run preview`**: Run a local preview testing server pointing precisely at the bundled `dist/` directory.
- **`npm run format`**: Prettify the entire codebase.
- **`npm run lint`**: Trigger ESLint static analysis checking.

## 📐 Image Lazy-Loading Best Practices
When using the automated image generation (`data-image-responsive`), make sure to always append intrinsic proportions (`width="..."` and `height="..."`) to your image tag. This empowers the browser to compute aspect-ratio pre-load rectangles so elements don't shift or eagerly pre-fetch when rendering!
