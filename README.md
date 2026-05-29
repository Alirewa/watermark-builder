# watermark-builder

A browser-based tool for adding watermarks to images in bulk. Drop your images, pick a placement template, and export — everything runs locally on your machine.

**Live:** https://alirewa.github.io/watermark-builder

---

## Why I built this

I needed to watermark a lot of product photos at once. Every online tool either had a file size limit, uploaded images to a server, or charged for bulk exports. So I built this instead — it processes everything in the browser using the Canvas API, nothing ever leaves your machine.

## What it does

- Upload up to 100 images at once and watermark them all in one go
- Use your own logo/image as the watermark
- Choose from 4 placement layouts: triangle, diagonal, corners, or horizontal
- Adjust opacity and size
- Export as a ZIP (individual files) or a single PDF (one page per image, original dimensions)
- Custom output filename prefix with auto-numbered files (`product_001.jpg`, `product_002.jpg`, ...)
- Dark and light theme
- Fully bilingual — Persian (RTL) and English, switchable at runtime

## Stack

Next.js 14 · TypeScript · Tailwind CSS · Radix UI · Framer Motion · Zustand · Canvas API · pdf-lib · JSZip

## Running locally

```bash
git clone https://github.com/Alirewa/watermark-builder.git
cd watermark-builder
npm install --legacy-peer-deps
npm run dev
```

Open http://localhost:3000.

## Deploying

The project exports as a fully static site (`output: 'export'` in next.config.mjs), so it can be hosted anywhere that serves static files — GitHub Pages, Netlify, Cloudflare Pages, or just an S3 bucket.

### GitHub Pages (this repo's setup)

Deployment is automated via GitHub Actions (`.github/workflows/deploy.yml`). Every push to `master` triggers a build and deploys the output to the `github-pages` environment automatically.

If you fork this repo, you'll need to enable GitHub Pages manually:

1. Go to **Settings → Pages**
2. Set source to **GitHub Actions**
3. Push anything to `master` — the workflow handles the rest

The workflow sets `NEXT_PUBLIC_BASE_PATH=/watermark-builder` during the build so assets load correctly under the subpath. When running locally (or deploying to a root domain), that variable isn't set and defaults to an empty string.

### Vercel / Netlify / Cloudflare Pages

```bash
npm run build        # outputs to ./out
```

Point your hosting provider to the `out` directory. No environment variables needed unless you're deploying to a subpath.

### Self-hosted

```bash
npm run build
# serve ./out with any static file server
npx serve out
```

## Project structure

```
src/
├── app/                   # Next.js App Router pages
├── components/
│   ├── layout/            # Header, Sidebar, Footer
│   ├── shared/            # Utility components (StoreHydrator, DirectionSetter, ...)
│   └── ui/                # Base components built on Radix UI
├── features/
│   └── watermark/         # The main studio — upload, preview, export
├── hooks/                 # useT (i18n), useMediaQuery, etc.
├── i18n/                  # FA + EN translation objects
├── lib/watermark/         # Canvas watermark engine
├── store/                 # Zustand stores (app, watermark, language, export)
├── types/
└── utils/                 # exportPdf, exportZip, helpers
```

## License

MIT
