# Story 1.1: Initialize Turborepo Monorepo with pnpm Workspaces

Status: ready-for-dev

## Story

As a **developer**,
I want **a Turborepo monorepo initialized with pnpm workspaces**,
So that **I can manage multiple packages and apps with shared dependencies efficiently**.

## Acceptance Criteria

1. **Given** I have Node.js 18+ and pnpm installed
   **When** I run `pnpm install` in the project root
   **Then** the monorepo structure is created with workspaces: `apps/web/`, `apps/api/`, `packages/contracts/`, `packages/types/`, `packages/ui/`, `packages/config/`
   **And** `turbo.json` is configured with build pipelines
   **And** `pnpm-workspace.yaml` defines all workspace paths

## Tasks / Subtasks

- [ ] Initialize monorepo root structure (AC: 1)
  - [ ] Create project root directory
  - [ ] Initialize root `package.json` with pnpm packageManager
  - [ ] Install Turborepo v2.x as dev dependency
  - [ ] Create `.gitignore` with node_modules, dist, .turbo, .next exclusions
- [ ] Configure pnpm workspace (AC: 1)
  - [ ] Create `pnpm-workspace.yaml` with apps/* and packages/* patterns
  - [ ] Verify workspace configuration
- [ ] Configure Turborepo pipelines (AC: 1)
  - [ ] Create `turbo.json` with dev, build, test, lint pipelines
  - [ ] Configure caching for build outputs
  - [ ] Set up task dependencies (build before test)
- [ ] Create workspace directory structure (AC: 1)
  - [ ] Create `apps/web/` directory
  - [ ] Create `apps/api/` directory
  - [ ] Create `packages/contracts/` directory
  - [ ] Create `packages/types/` directory
  - [ ] Create `packages/ui/` directory
  - [ ] Create `packages/config/` directory
- [ ] Add root-level scripts (AC: 1)
  - [ ] Add `dev` script to run all workspaces in dev mode
  - [ ] Add `build` script for production builds
  - [ ] Add `test` script for running all tests
  - [ ] Add `lint` script for code quality checks
  - [ ] Add `clean` script to remove build artifacts
- [ ] Verify monorepo setup
  - [ ] Run `pnpm install` successfully
  - [ ] Verify Turborepo cache is working
  - [ ] Test workspace scripts execute correctly

## Dev Notes

### Architecture Requirements

**Monorepo Strategy:** Turborepo + pnpm Workspaces (from `@architecture.md`)

**Rationale:**
- **Shared Type Safety:** TypeScript types from smart contracts (ABIs, events) consumed by frontend and backend
- **Coordinated Deployments:** Smart contract updates require synchronized frontend/backend changes
- **Code Reuse:** Validation logic, token calculations, business rules shared across layers
- **Developer Experience:** Single repository, unified CI/CD, consistent tooling
- **Web3 Complexity:** Wallet integrations, blockchain interactions, off-chain sync require tight coupling

**Why Turborepo + pnpm:**
- **Turborepo:** Intelligent caching, parallel task execution, dependency-aware builds
- **pnpm:** Fast, disk-efficient, strict dependency management (prevents phantom dependencies)
- **Industry Standard:** Used by Vercel, widely adopted for Next.js + multi-package projects
- **Remote Caching:** Vercel integration for team-wide build cache sharing

### Project Structure

```
tricktrack/
├── apps/
│   ├── web/              # Next.js 15 PWA (frontend)
│   └── api/              # Nest.js backend
├── packages/
│   ├── contracts/        # Hardhat smart contracts (Solidity)
│   ├── ui/               # shadcn/ui components (shared)
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared configs (ESLint, TypeScript, Tailwind)
├── turbo.json            # Turborepo pipeline configuration
├── pnpm-workspace.yaml   # pnpm workspace definition
├── package.json          # Root package.json with workspace scripts
└── .gitignore            # Git exclusions
```

### Technical Requirements

**Node.js Version:** 18+ (required for Next.js 15)
**Package Manager:** pnpm v9.0.0+
**Turborepo Version:** v2.0.0+

**Root package.json Configuration:**
```json
{
  "name": "tricktrack-monorepo",
  "version": "1.0.0",
  "private": true,
  "packageManager": "pnpm@9.0.0",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

**pnpm-workspace.yaml Configuration:**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**turbo.json Configuration:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
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

### Testing Requirements

**Verification Steps:**
1. Run `pnpm install` - should complete without errors
2. Verify workspace structure exists (all 6 directories created)
3. Run `pnpm dev` - should execute without errors (no workspaces yet, so will complete quickly)
4. Check `.turbo/cache` directory is created (Turborepo caching active)
5. Verify `turbo.json` pipeline configuration is valid

**Success Criteria:**
- All workspace directories exist
- `pnpm install` completes successfully
- Turborepo cache is initialized
- Root scripts are executable

### File Structure to Create

```
tricktrack/
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── README.md (optional but recommended)
├── apps/
│   ├── web/.gitkeep
│   └── api/.gitkeep
└── packages/
    ├── contracts/.gitkeep
    ├── types/.gitkeep
    ├── ui/.gitkeep
    └── config/.gitkeep
```

### Dependencies

**None** - This is the foundational story that all other stories depend on.

### References

- [Source: `@architecture.md` - Monorepo Strategy Selection]
- [Source: `@architecture.md` - Project Structure]
- [Source: `@stories-epic-01-foundation.md` - Story 1.1]
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces Documentation](https://pnpm.io/workspaces)

## Dev Agent Record

### Agent Model Used

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

