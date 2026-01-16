# Story 1.2: Set Up Next.js 15 PWA in apps/web

Status: ready-for-dev

## Story

As a **developer**,
I want **a Next.js 15 PWA configured in `apps/web/`**,
So that **users can access TrickTrack as a mobile-first progressive web app**.

## Acceptance Criteria

1. **Given** the monorepo is initialized
   **When** I run `pnpm dev` in `apps/web/`
   **Then** Next.js 15 dev server starts on `http://localhost:3000`
   **And** the app includes App Router, PWA config with `next-pwa`, service worker, web manifest, Tailwind CSS
   **And** the app is mobile-first responsive (4.7" to 6.7" screens)

## Tasks / Subtasks

- [ ] Initialize Next.js 15 app (AC: 1)
  - [ ] Navigate to `apps/web/` directory
  - [ ] Run `pnpm create next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"`
  - [ ] Verify Next.js 15 installation with TypeScript and Tailwind CSS
  - [ ] Test dev server starts on port 3000
- [ ] Configure PWA with next-pwa (AC: 1)
  - [ ] Install `next-pwa` v5.6+ and `@ducanh2912/next-pwa`
  - [ ] Create `next.config.mjs` with PWA configuration
  - [ ] Configure service worker with offline support
  - [ ] Set up workbox for caching strategies
- [ ] Create web app manifest (AC: 1)
  - [ ] Create `public/manifest.json` with app metadata
  - [ ] Add app name, icons, theme colors, display mode
  - [ ] Configure icons (192x192, 512x512) for PWA
  - [ ] Link manifest in root layout
- [ ] Configure mobile-first responsive design (AC: 1)
  - [ ] Set up Tailwind CSS with mobile breakpoints (sm, md, lg)
  - [ ] Configure viewport meta tag for mobile devices
  - [ ] Set minimum touch target size (44px × 44px)
  - [ ] Test responsive layout on 4.7" to 6.7" screen sizes
- [ ] Set up App Router structure (AC: 1)
  - [ ] Create `src/app/layout.tsx` root layout
  - [ ] Create `src/app/page.tsx` home page
  - [ ] Configure metadata for SEO and PWA
  - [ ] Set up error boundaries
- [ ] Configure TypeScript and ESLint (AC: 1)
  - [ ] Verify `tsconfig.json` with strict mode
  - [ ] Configure ESLint with Next.js plugin
  - [ ] Add import alias `@/*` for clean imports
  - [ ] Test TypeScript compilation
- [ ] Add PWA installation prompt (AC: 1)
  - [ ] Implement install prompt detection
  - [ ] Create install button component
  - [ ] Handle beforeinstallprompt event
  - [ ] Test PWA installation on mobile
- [ ] Verify PWA functionality
  - [ ] Test offline mode with service worker
  - [ ] Verify manifest loads correctly
  - [ ] Check PWA installability in Chrome DevTools
  - [ ] Test on mobile device (iOS Safari, Android Chrome)

## Dev Notes

### Architecture Requirements

**Frontend Framework:** Next.js 15 with App Router (from `@architecture.md`)

**Key Features:**
- **App Router:** Server Components by default, Client Components opt-in
- **Styling:** Tailwind CSS v4 with JIT compilation
- **Build Tool:** Turbopack for development (10x faster than Webpack)
- **PWA Support:** `next-pwa` plugin for service worker generation
- **TypeScript:** Strict mode enabled
- **Mobile-First:** Primary device is smartphones on 4G networks

**Performance Requirements (from `@prd.md`):**
- App load time: < 3 seconds on 4G networks (NFR4)
- Mobile-first PWA (primary device: smartphones)
- Offline-first architecture (validation requests queue offline)
- Support screen sizes 4.7" to 6.7" (NFR33)

### PWA Configuration

**next-pwa Setup:**
```bash
cd apps/web
pnpm add @ducanh2912/next-pwa
pnpm add -D webpack
```

**next.config.mjs:**
```javascript
import withPWA from '@ducanh2912/next-pwa';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        },
      },
    },
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-font-assets',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        },
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-image-assets',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\/_next\/image\?url=.+$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'next-image',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:mp4|webm)$/i,
      handler: 'CacheFirst',
      options: {
        rangeRequests: true,
        cacheName: 'static-video-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:js)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-js-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:css|less)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-style-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'next-data',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\/api\/.*$/i,
      handler: 'NetworkFirst',
      method: 'GET',
      options: {
        cacheName: 'apis',
        expiration: {
          maxEntries: 16,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'others',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
})(nextConfig);
```

**public/manifest.json:**
```json
{
  "name": "TrickTrack - Skateboarding Validation Platform",
  "short_name": "TrickTrack",
  "description": "Validate skateboarding tricks with friends, earn crypto rewards, and support the community",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### Mobile-First Responsive Design

**Tailwind CSS Configuration (tailwind.config.ts):**
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',  // iPhone SE
        'sm': '640px',  // Small tablets
        'md': '768px',  // Tablets
        'lg': '1024px', // Laptops
        'xl': '1280px', // Desktops
      },
    },
  },
  plugins: [],
};

export default config;
```

**Viewport Configuration (src/app/layout.tsx):**
```typescript
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: 'TrickTrack',
  description: 'Validate skateboarding tricks with friends, earn crypto rewards',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TrickTrack',
  },
};
```

### App Router Structure

**Directory Layout:**
```
apps/web/
├── public/
│   ├── manifest.json
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with metadata
│   │   ├── page.tsx         # Home page
│   │   ├── error.tsx        # Error boundary
│   │   └── loading.tsx      # Loading UI
│   ├── components/          # Shared components (future)
│   ├── lib/                 # Utilities (future)
│   └── styles/              # Global styles (future)
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Testing Requirements

**Verification Steps:**
1. Run `pnpm dev` - dev server starts on port 3000
2. Visit `http://localhost:3000` - app loads successfully
3. Open Chrome DevTools > Application > Manifest - manifest loads correctly
4. Open Chrome DevTools > Application > Service Workers - service worker registered
5. Test offline mode - disconnect network, reload page (should work)
6. Test responsive design - resize browser from 375px to 768px width
7. Test PWA installation - Chrome shows "Install" prompt
8. Test on mobile device - iOS Safari and Android Chrome

**Success Criteria:**
- Next.js 15 dev server runs without errors
- PWA manifest is valid and loads
- Service worker registers successfully
- App is installable as PWA
- Responsive design works on mobile screens (4.7" to 6.7")
- Offline mode functions correctly

### UX Requirements (from `@ux-design-specification.md`)

**Mobile-First Design Principles:**
- Primary device: smartphones on 4G networks
- Touch targets: minimum 44px × 44px (iOS/Android accessibility)
- Thumb-friendly navigation (bottom navigation bar)
- Fast load times: < 3 seconds on 4G
- Offline support: validation requests queue when offline

**Core Experience:**
- Instant gratification: optimistic UI updates
- Simple navigation: max 3 taps to any feature
- Clear visual hierarchy: skateboarding-focused design
- Accessible: WCAG 2.1 Level AA compliance

### Dependencies

**Story 1.1** - Monorepo must be initialized with workspace structure

### References

- [Source: `@architecture.md` - Frontend (Next.js 15)]
- [Source: `@architecture.md` - Starter Template Evaluation]
- [Source: `@stories-epic-01-foundation.md` - Story 1.2]
- [Source: `@ux-design-specification.md` - Mobile-First Design]
- [Source: `@prd.md` - Performance Requirements]
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [next-pwa Documentation](https://github.com/DuCanhGH/next-pwa)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)

## Dev Agent Record

### Agent Model Used

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

