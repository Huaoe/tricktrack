# Story 1.1: Initialize Turborepo Monorepo with pnpm Workspaces

Status: review

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

- [x] Initialize monorepo root structure (AC: 1)
  - [x] Create project root directory
  - [x] Initialize root `package.json` with pnpm packageManager
  - [x] Install Turborepo v2.x as dev dependency
  - [x] Create `.gitignore` with node_modules, dist, .turbo, .next exclusions
- [x] Configure pnpm workspace (AC: 1)
  - [x] Create `pnpm-workspace.yaml` with apps/* and packages/* patterns
  - [x] Verify workspace configuration
- [x] Configure Turborepo pipelines (AC: 1)
  - [x] Create `turbo.json` with dev, build, test, lint pipelines
  - [x] Configure caching for build outputs
  - [x] Set up task dependencies (build before test)
- [x] Create workspace directory structure (AC: 1)
  - [x] Create `apps/web/` directory
  - [x] Create `apps/api/` directory
  - [x] Create `packages/contracts/` directory
  - [x] Create `packages/types/` directory
  - [x] Create `packages/ui/` directory
  - [x] Create `packages/config/` directory
- [x] Add root-level scripts (AC: 1)
  - [x] Add `dev` script to run all workspaces in dev mode
  - [x] Add `build` script for production builds
  - [x] Add `test` script for running all tests
  - [x] Add `lint` script for code quality checks
  - [x] Add `clean` script to remove build artifacts
- [x] Verify monorepo setup
  - [x] Run `pnpm install` successfully
  - [x] Verify Turborepo cache is working
  - [x] Test workspace scripts execute correctly

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

Claude Sonnet 4.5 (via Claude Code)

### Debug Log References

None - implementation completed without issues

### Completion Notes List

**2026-01-16 - Story 1.1 Implementation Complete**

All tasks completed successfully:

1. **Initialize monorepo root structure**
   - Created comprehensive `.gitignore` with all necessary exclusions (node_modules, dist, .turbo, .next, env files, IDE files)
   - Updated `package.json` with monorepo name, private flag, and all root scripts
   - Turbo 2.7.4 already installed as dev dependency
   - Verified installation with `pnpm install`

2. **Configure pnpm workspace**
   - Created `pnpm-workspace.yaml` with apps/* and packages/* patterns
   - Workspace configuration verified with successful pnpm install

3. **Configure Turborepo pipelines**
   - Created `turbo.json` with all required tasks: build, test, lint, dev, clean
   - **IMPORTANT**: Used `tasks` field instead of deprecated `pipeline` field (Turbo 2.x requirement)
   - Configured caching for build outputs and coverage
   - Set up task dependencies (build runs before test, with ^build dependency)
   - Verified configuration with dry-run test

4. **Create workspace directory structure**
   - Created all 6 workspace directories: apps/web, apps/api, packages/contracts, packages/types, packages/ui, packages/config
   - Added .gitkeep files to ensure empty directories are tracked in git

5. **Add root-level scripts**
   - All scripts added to package.json: dev, build, test, lint, clean
   - All scripts use turbo run for monorepo task orchestration

6. **Verify monorepo setup**
   - `pnpm install` runs successfully
   - Turbo cache directory created at `.turbo/cache/`
   - Dry-run tests confirm turbo.json is valid
   - Workspace scripts execute correctly

**Technical Notes:**
- Turbo 2.x uses `tasks` field instead of `pipeline` (migration from v1)
- Package manager version: pnpm@10.22.0
- Turbo version: 2.7.4
- Monorepo is ready for subsequent stories to add package implementations

**Acceptance Criteria Verification:**
✅ All workspace directories created (apps/web, apps/api, packages/*)
✅ turbo.json configured with build pipelines
✅ pnpm-workspace.yaml defines all workspace paths
✅ pnpm install runs successfully

### File List

**Created:**
- `.gitignore` - Comprehensive ignore patterns for monorepo
- `pnpm-workspace.yaml` - Workspace configuration for apps and packages
- `turbo.json` - Turborepo task pipeline configuration (v2 format with `tasks`)
- `apps/web/.gitkeep` - Placeholder for Next.js app
- `apps/api/.gitkeep` - Placeholder for NestJS backend
- `packages/contracts/.gitkeep` - Placeholder for Hardhat contracts
- `packages/types/.gitkeep` - Placeholder for shared TypeScript types
- `packages/ui/.gitkeep` - Placeholder for shadcn/ui components
- `packages/config/.gitkeep` - Placeholder for shared configs

**Modified:**
- `package.json` - Updated with monorepo name, scripts, and metadata

