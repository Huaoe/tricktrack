# Story 1.6: Set Up shadcn/ui Components Package

Status: ready-for-dev

## Story

As a **developer**,
I want **a shadcn/ui components package in `packages/ui/`**,
So that **I can share beautiful, accessible UI components across the frontend**.

## Acceptance Criteria

1. **Given** the monorepo is initialized with Next.js app
   **When** I import components from `@tricktrack/ui` in `apps/web`
   **Then** components render correctly
   **And** the package includes shadcn/ui setup, Tailwind CSS, Radix UI primitives, and base components (Button, Card, Input, Dialog)

## Tasks / Subtasks

- [ ] Initialize UI package (AC: 1)
  - [ ] Navigate to `packages/ui/` directory
  - [ ] Create `package.json` with package name `@tricktrack/ui`
  - [ ] Install React and React DOM as dependencies
  - [ ] Install TypeScript and type definitions
- [ ] Set up Tailwind CSS (AC: 1)
  - [ ] Install `tailwindcss` and dependencies
  - [ ] Create `tailwind.config.ts`
  - [ ] Create `postcss.config.js`
  - [ ] Create `src/styles/globals.css` with Tailwind directives
- [ ] Initialize shadcn/ui (AC: 1)
  - [ ] Install `class-variance-authority` for component variants
  - [ ] Install `clsx` and `tailwind-merge` for className utilities
  - [ ] Create `src/lib/utils.ts` with `cn()` helper
  - [ ] Set up component structure
- [ ] Install Radix UI primitives (AC: 1)
  - [ ] Install `@radix-ui/react-slot`
  - [ ] Install `@radix-ui/react-dialog`
  - [ ] Install `@radix-ui/react-dropdown-menu`
  - [ ] Install other needed Radix primitives
- [ ] Add base components (AC: 1)
  - [ ] Create `src/components/ui/button.tsx`
  - [ ] Create `src/components/ui/card.tsx`
  - [ ] Create `src/components/ui/input.tsx`
  - [ ] Create `src/components/ui/dialog.tsx`
- [ ] Configure TypeScript (AC: 1)
  - [ ] Create `tsconfig.json` with React JSX
  - [ ] Configure path aliases
  - [ ] Set up declaration files
  - [ ] Add build script
- [ ] Set up exports (AC: 1)
  - [ ] Create `src/index.ts` with component exports
  - [ ] Export styles from package
  - [ ] Configure package.json exports
  - [ ] Test imports from other packages
- [ ] Configure workspace integration (AC: 1)
  - [ ] Add `@tricktrack/ui` to `apps/web/package.json`
  - [ ] Import styles in Next.js layout
  - [ ] Extend Tailwind config in web app
  - [ ] Run `pnpm install` to link packages
- [ ] Verify component rendering
  - [ ] Import Button in `apps/web`
  - [ ] Render Button component
  - [ ] Verify styles apply correctly
  - [ ] Test component variants

## Dev Notes

### Architecture Requirements

**UI Components:** shadcn/ui (from `@architecture.md`)

**Key Features:**
- **Component Library:** shadcn/ui components (copy-paste, not npm package)
- **Styling:** Tailwind CSS for utility-first styling
- **Primitives:** Radix UI for accessible, unstyled components
- **Variants:** class-variance-authority for component variants
- **Shared Package:** Reusable across all frontend apps

**Design System (from `@ux-design-specification.md`):**
- Mobile-first responsive design
- Touch targets: minimum 44px × 44px
- Skateboarding-focused aesthetic
- WCAG 2.1 Level AA accessibility

### Package Configuration

**package.json:**
```json
{
  "name": "@tricktrack/ui",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./styles": "./src/styles/globals.css"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**tailwind.config.ts:**
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};

export default config;
```

### Component Examples

**src/lib/utils.ts:**
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**src/components/ui/button.tsx:**
```typescript
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

**src/styles/globals.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**src/index.ts:**
```typescript
// Export components
export { Button } from './components/ui/button';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui/card';
export { Input } from './components/ui/input';
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/ui/dialog';

// Export utilities
export { cn } from './lib/utils';
```

### Directory Structure

```
packages/ui/
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── dialog.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── styles/
│   │   └── globals.css
│   └── index.ts
├── dist/                 # Generated by build
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── postcss.config.js
```

### Integration with Next.js App

**Add to apps/web/package.json:**
```json
{
  "dependencies": {
    "@tricktrack/ui": "workspace:*"
  }
}
```

**Import styles in apps/web/src/app/layout.tsx:**
```typescript
import '@tricktrack/ui/styles';
```

**Extend Tailwind in apps/web/tailwind.config.ts:**
```typescript
import type { Config } from 'tailwindcss';
import uiConfig from '@tricktrack/ui/tailwind.config';

const config: Config = {
  ...uiConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
};

export default config;
```

### Testing Requirements

**Verification Steps:**
1. Run `pnpm build` in `packages/ui/` - builds successfully
2. Import Button in `apps/web/src/app/page.tsx`
3. Render `<Button>Click me</Button>`
4. Start Next.js dev server - component renders
5. Verify Tailwind styles apply correctly
6. Test button variants (primary, secondary, outline)
7. Test responsive design on mobile viewport

**Success Criteria:**
- UI package builds without errors
- Components render in Next.js app
- Tailwind styles apply correctly
- Component variants work as expected
- TypeScript provides type checking
- Accessibility features work (keyboard navigation, ARIA)

### Dependencies

**Story 1.1** - Monorepo must be initialized
**Story 1.2** - Next.js app must exist for integration testing

### References

- [Source: `@architecture.md` - Additional Integrations]
- [Source: `@stories-epic-01-foundation.md` - Story 1.6]
- [Source: `@ux-design-specification.md` - Design System]
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## Dev Agent Record

### Agent Model Used

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

