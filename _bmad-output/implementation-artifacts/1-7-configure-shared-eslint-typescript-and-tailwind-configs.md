# Story 1.7: Configure Shared ESLint, TypeScript, and Tailwind Configs

Status: ready-for-dev

## Story

As a **developer**,
I want **shared configuration files in `packages/config/`**,
So that **all workspaces use consistent linting, TypeScript, and styling rules**.

## Acceptance Criteria

1. **Given** the monorepo has multiple workspaces
   **When** I run linting and type checking across all packages
   **Then** all workspaces use the same ESLint, TypeScript, and Tailwind configurations
   **And** the package includes base configs that can be extended by each workspace

## Tasks / Subtasks

- [ ] Initialize config package (AC: 1)
  - [ ] Navigate to `packages/config/` directory
  - [ ] Create `package.json` with package name `@tricktrack/config`
  - [ ] Set package as private
  - [ ] Add description for shared configs
- [ ] Create shared ESLint config (AC: 1)
  - [ ] Install ESLint and plugins as dev dependencies
  - [ ] Create `eslint.config.js` for base ESLint rules
  - [ ] Configure Next.js specific rules
  - [ ] Configure TypeScript ESLint rules
  - [ ] Add React hooks rules
- [ ] Create shared TypeScript config (AC: 1)
  - [ ] Create `tsconfig.base.json` with strict settings
  - [ ] Create `tsconfig.react.json` for React projects
  - [ ] Create `tsconfig.node.json` for Node.js projects
  - [ ] Configure path aliases and module resolution
- [ ] Create shared Tailwind config (AC: 1)
  - [ ] Install Tailwind CSS as dev dependency
  - [ ] Create `tailwind.config.base.ts` with shared theme
  - [ ] Configure design tokens (colors, spacing, typography)
  - [ ] Add custom utilities and plugins
- [ ] Set up package exports (AC: 1)
  - [ ] Configure package.json exports for each config
  - [ ] Export ESLint config
  - [ ] Export TypeScript configs
  - [ ] Export Tailwind config
- [ ] Integrate with Next.js app (AC: 1)
  - [ ] Update `apps/web/.eslintrc.json` to extend shared config
  - [ ] Update `apps/web/tsconfig.json` to extend shared config
  - [ ] Update `apps/web/tailwind.config.ts` to extend shared config
  - [ ] Test linting and type checking
- [ ] Integrate with Nest.js API (AC: 1)
  - [ ] Update `apps/api/.eslintrc.js` to extend shared config
  - [ ] Update `apps/api/tsconfig.json` to extend shared config
  - [ ] Test linting and type checking
- [ ] Integrate with other packages (AC: 1)
  - [ ] Update `packages/types/tsconfig.json`
  - [ ] Update `packages/ui/tsconfig.json` and Tailwind config
  - [ ] Update `packages/contracts/tsconfig.json`
  - [ ] Verify all packages use shared configs
- [ ] Add root-level linting scripts (AC: 1)
  - [ ] Add `lint` script to root package.json
  - [ ] Add `type-check` script to root package.json
  - [ ] Configure Turborepo to run lint across all workspaces
  - [ ] Test scripts execute successfully
- [ ] Verify configuration consistency
  - [ ] Run `pnpm lint` at root - all packages lint successfully
  - [ ] Run `pnpm type-check` at root - all packages type check
  - [ ] Verify consistent formatting across workspaces
  - [ ] Test that config changes propagate to all packages

## Dev Notes

### Architecture Requirements

**Shared Configs** (from `@architecture.md`)

**Purpose:**
- Unified ESLint config across all packages
- Shared TypeScript configuration with strict mode
- Consistent Tailwind theme and design tokens
- Single source of truth for code quality rules

**Benefits:**
- **Consistency:** All code follows same standards
- **Maintainability:** Update rules in one place
- **Developer Experience:** Predictable behavior across workspaces
- **CI/CD:** Consistent checks in pipelines

### Package Configuration

**package.json:**
```json
{
  "name": "@tricktrack/config",
  "version": "1.0.0",
  "private": true,
  "description": "Shared ESLint, TypeScript, and Tailwind configurations",
  "exports": {
    "./eslint": "./eslint.config.js",
    "./typescript/base": "./tsconfig.base.json",
    "./typescript/react": "./tsconfig.react.json",
    "./typescript/node": "./tsconfig.node.json",
    "./tailwind": "./tailwind.config.base.ts"
  },
  "devDependencies": {
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0",
    "eslint-config-next": "^14.1.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0"
  }
}
```

### ESLint Configuration

**eslint.config.js:**
```javascript
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  overrides: [
    {
      files: ['*.test.ts', '*.test.tsx', '*.spec.ts', '*.spec.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
```

### TypeScript Configurations

**tsconfig.base.json:**
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "checkJs": false,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "incremental": true
  }
}
```

**tsconfig.react.json:**
```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "plugins": [
      {
        "name": "next"
      }
    ]
  }
}
```

**tsconfig.node.json:**
```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2020"],
    "module": "commonjs",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  }
}
```

### Tailwind Configuration

**tailwind.config.base.ts:**
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      colors: {
        // Design tokens from UX spec
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
      spacing: {
        // Mobile-first touch targets (44px minimum)
        'touch': '44px',
      },
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

### Workspace Integration

**apps/web/.eslintrc.json:**
```json
{
  "extends": "@tricktrack/config/eslint"
}
```

**apps/web/tsconfig.json:**
```json
{
  "extends": "@tricktrack/config/typescript/react",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**apps/web/tailwind.config.ts:**
```typescript
import type { Config } from 'tailwindcss';
import baseConfig from '@tricktrack/config/tailwind';

const config: Config = {
  ...baseConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
};

export default config;
```

**apps/api/.eslintrc.js:**
```javascript
module.exports = {
  extends: ['@tricktrack/config/eslint'],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  env: {
    node: true,
    jest: true,
  },
};
```

**apps/api/tsconfig.json:**
```json
{
  "extends": "@tricktrack/config/typescript/node",
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test"]
}
```

### Root Scripts

**Update root package.json:**
```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "lint:fix": "turbo run lint:fix",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean"
  }
}
```

**Update turbo.json:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "outputs": []
    },
    "lint:fix": {
      "outputs": [],
      "cache": false
    },
    "type-check": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "clean": {
      "cache": false
    }
  }
}
```

### Directory Structure

```
packages/config/
├── eslint.config.js
├── tsconfig.base.json
├── tsconfig.react.json
├── tsconfig.node.json
├── tailwind.config.base.ts
└── package.json
```

### Testing Requirements

**Verification Steps:**
1. Run `pnpm lint` at root - all workspaces lint successfully
2. Run `pnpm type-check` at root - all workspaces type check
3. Make a linting error in `apps/web` - ESLint catches it
4. Make a type error in `apps/api` - TypeScript catches it
5. Update shared ESLint rule - propagates to all workspaces
6. Verify Tailwind theme tokens work in UI components

**Success Criteria:**
- All workspaces extend shared configs
- Linting runs consistently across all packages
- Type checking uses strict mode everywhere
- Tailwind theme is consistent
- Config changes propagate automatically
- CI/CD can run lint and type-check commands

### Dependencies

**Story 1.1** - Monorepo must be initialized
**Story 1.2** - Next.js app must exist
**Story 1.3** - Nest.js API must exist

### References

- [Source: `@architecture.md` - Code Organization]
- [Source: `@architecture.md` - Development Experience]
- [Source: `@stories-epic-01-foundation.md` - Story 1.7]
- [ESLint Documentation](https://eslint.org/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/tsconfig)
- [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)

## Dev Agent Record

### Agent Model Used

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

