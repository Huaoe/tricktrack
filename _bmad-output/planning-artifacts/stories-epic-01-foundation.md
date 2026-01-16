# Epic 1: Project Foundation & Monorepo Setup

**Epic Goal:** Development environment is ready with Turborepo monorepo structure, shared TypeScript types, and deployment pipelines configured.

---

## Story 1.1: Initialize Turborepo Monorepo with pnpm Workspaces

As a **developer**,
I want **a Turborepo monorepo initialized with pnpm workspaces**,
So that **I can manage multiple packages and apps with shared dependencies efficiently**.

**Acceptance Criteria:**

**Given** I have Node.js 18+ and pnpm installed
**When** I run `pnpm install` in the project root
**Then** the monorepo structure is created with workspaces: `apps/web/`, `apps/api/`, `packages/contracts/`, `packages/types/`, `packages/ui/`, `packages/config/`
**And** `turbo.json` is configured with build pipelines
**And** `pnpm-workspace.yaml` defines all workspace paths

**Technical Notes:** Use Turborepo v2.x, configure caching for build outputs

**Dependencies:** None (foundational story)

---

## Story 1.2: Set Up Next.js 15 PWA in apps/web

As a **developer**,
I want **a Next.js 15 PWA configured in `apps/web/`**,
So that **users can access TrickTrack as a mobile-first progressive web app**.

**Acceptance Criteria:**

**Given** the monorepo is initialized
**When** I run `pnpm dev` in `apps/web/`
**Then** Next.js 15 dev server starts on `http://localhost:3000`
**And** the app includes App Router, PWA config with `next-pwa`, service worker, web manifest, Tailwind CSS
**And** the app is mobile-first responsive (4.7" to 6.7" screens)

**Technical Notes:** Use `next-pwa` v5.6+, configure service worker, IndexedDB for offline storage, touch targets 44px min

**Dependencies:** Story 1.1

---

## Story 1.3: Set Up Nest.js Backend in apps/api

As a **developer**,
I want **a Nest.js backend configured in `apps/api/`**,
So that **I can build RESTful APIs and handle off-chain business logic**.

**Acceptance Criteria:**

**Given** the monorepo is initialized
**When** I run `pnpm dev` in `apps/api/`
**Then** Nest.js dev server starts on `http://localhost:4000`
**And** the API includes modular architecture, exception filters, validation pipes, CORS, environment config
**And** Supabase client is configured
**And** API documentation via Swagger/OpenAPI

**Technical Notes:** Use Nest.js v10+, configure Supabase with connection pooling, rate limiting, health check endpoint

**Dependencies:** Story 1.1

---

## Story 1.4: Set Up Hardhat for Smart Contract Development

As a **blockchain developer**,
I want **Hardhat configured in `packages/contracts/`**,
So that **I can develop, test, and deploy Solidity smart contracts**.

**Acceptance Criteria:**

**Given** the monorepo is initialized
**When** I run `pnpm hardhat compile` in `packages/contracts/`
**Then** Solidity contracts compile successfully
**And** Hardhat is configured with Solidity v0.8.20+, OpenZeppelin, Hardhat Ignition, Polygon/Mumbai configs, Alchemy/Infura RPC, gas reporter, Etherscan plugin
**And** test suite runs with `pnpm hardhat test`

**Technical Notes:** Use Hardhat v2.19+ with Ignition, configure multiple RPC providers for failover, gas target < $0.01

**Dependencies:** Story 1.1

---

## Story 1.5: Create Shared TypeScript Types Package

As a **developer**,
I want **shared TypeScript types in `packages/types/`**,
So that **frontend, backend, and smart contracts use consistent type definitions**.

**Acceptance Criteria:**

**Given** the monorepo is initialized
**When** I import types from `@tricktrack/types`
**Then** TypeScript resolves types correctly
**And** types include: User, Wallet, ValidationRequest, ValidationScore, TokenBalance, TokenTransaction, Badge, SponsorChallenge, smart contract ABIs
**And** types are exported from `index.ts`

**Technical Notes:** Use TypeScript v5+, configure `composite: true`, generate contract types from ABIs using `typechain`

**Dependencies:** Story 1.1, Story 1.4

---

## Story 1.6: Set Up shadcn/ui Components Package

As a **frontend developer**,
I want **shadcn/ui components in `packages/ui/`**,
So that **I can use consistent, accessible UI components across the app**.

**Acceptance Criteria:**

**Given** the monorepo is initialized
**When** I import components from `@tricktrack/ui`
**Then** shadcn/ui components render correctly
**And** includes core shadcn/ui components + custom components (QRScanner, TokenRewardAnimation, NFTBadgeDisplay, ValidationScoringInterface)
**And** components meet WCAG 2.1 Level AA standards

**Technical Notes:** Use shadcn/ui copy-paste approach, configure Tailwind with custom theme, Lucide icons, Framer Motion for animations

**Dependencies:** Story 1.1, Story 1.2

---

## Story 1.7: Configure Shared ESLint, TypeScript, and Tailwind Configs

As a **developer**,
I want **shared configuration files in `packages/config/`**,
So that **all workspaces use consistent linting, type checking, and styling rules**.

**Acceptance Criteria:**

**Given** the monorepo is initialized
**When** I run `pnpm lint` in any workspace
**Then** ESLint runs with shared rules from `@tricktrack/config`
**And** config package includes `eslint-config/`, `tsconfig/`, `tailwind-config/`
**And** all workspaces extend these shared configs

**Technical Notes:** Use ESLint v8+ with flat config, configure Prettier, `@typescript-eslint`, Tailwind with custom design tokens

**Dependencies:** Story 1.1

---

## Story 1.8: Set Up Deployment Pipelines (Vercel, Railway, Polygon)

As a **DevOps engineer**,
I want **deployment pipelines configured for all environments**,
So that **I can deploy frontend, backend, and smart contracts automatically**.

**Acceptance Criteria:**

**Given** the monorepo is configured
**When** I push code to `main` branch
**Then** deployments trigger: Frontend to Vercel, Backend to Railway, Smart contracts ready for Polygon
**And** environment variables configured for all platforms
**And** deployment status visible in CI/CD dashboard

**Technical Notes:** Use Vercel for Next.js PWA, Railway for Nest.js, Hardhat Ignition for contracts, configure staging/production

**Dependencies:** Story 1.2, Story 1.3, Story 1.4
