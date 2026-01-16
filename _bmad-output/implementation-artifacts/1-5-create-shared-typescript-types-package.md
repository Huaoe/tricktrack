# Story 1.5: Create Shared TypeScript Types Package

Status: review

## Story

As a **developer**,
I want **a shared TypeScript types package in `packages/types/`**,
So that **frontend, backend, and smart contracts can share type definitions**.

## Acceptance Criteria

1. **Given** the monorepo is initialized
   **When** I import types from `@tricktrack/types` in any workspace
   **Then** TypeScript compilation succeeds
   **And** the package includes shared types for users, validations, tokens, NFTs, blockchain, and API responses

## Tasks / Subtasks

- [x] Initialize types package (AC: 1)
  - [x] Navigate to `packages/types/` directory
  - [x] Create `package.json` with package name `@tricktrack/types`
  - [x] Install TypeScript as dev dependency
  - [x] Create `tsconfig.json` for type declarations
- [x] Set up package structure (AC: 1)
  - [x] Create `src/` directory
  - [x] Create `index.ts` as main export file
  - [x] Configure build to output `.d.ts` files
  - [x] Add build script to package.json
- [x] Create user types (AC: 1)
  - [x] Define `User` interface
  - [x] Define `WalletType` enum (in-app, external)
  - [x] Define `UserRole` enum (skater, validator, admin)
  - [x] Export from `src/user.ts`
- [x] Create validation types (AC: 1)
  - [x] Define `Validation` interface
  - [x] Define `ValidationStatus` enum
  - [x] Define `ValidationScore` interface
  - [x] Define `TrickType` enum
  - [x] Export from `src/validation.ts`
- [x] Create token types (AC: 1)
  - [x] Define `TokenTransaction` interface
  - [x] Define `TokenBalance` interface
  - [x] Define `TransactionType` enum
  - [x] Export from `src/token.ts`
- [x] Create NFT types (AC: 1)
  - [x] Define `NFTBadge` interface
  - [x] Define `BadgeType` enum (bronze, silver, gold)
  - [x] Define `BadgeMetadata` interface
  - [x] Export from `src/nft.ts`
- [x] Create blockchain types (AC: 1)
  - [x] Define `BlockchainNetwork` enum
  - [x] Define `TransactionStatus` enum
  - [x] Define `ContractAddress` type
  - [x] Export from `src/blockchain.ts`
- [x] Create API response types (AC: 1)
  - [x] Define `ApiResponse<T>` generic interface
  - [x] Define `PaginatedResponse<T>` interface
  - [x] Define `ErrorResponse` interface
  - [x] Export from `src/api.ts`
- [x] Configure workspace dependencies (AC: 1)
  - [x] Add `@tricktrack/types` to `apps/web/package.json`
  - [x] Add `@tricktrack/types` to `apps/api/package.json`
  - [x] Use workspace protocol (`workspace:*`)
  - [x] Run `pnpm install` to link packages
- [x] Verify type sharing
  - [x] Import types in `apps/web`
  - [x] Import types in `apps/api`
  - [x] Verify TypeScript compilation
  - [x] Test type checking works across workspaces

## Dev Notes

### Architecture Requirements

**Shared Types Package** (from `@architecture.md`)

**Purpose:**
- TypeScript types from smart contracts (ABIs, events) consumed by frontend and backend
- Shared validation logic, token calculations, business rules
- Type safety across all layers of the monorepo
- Single source of truth for data structures

**Key Benefits:**
- **Type Safety:** Compile-time checks across frontend/backend
- **Code Reuse:** Shared interfaces prevent duplication
- **Refactoring:** Changes propagate automatically
- **Documentation:** Types serve as API contracts

### Package Configuration

**package.json:**
```json
{
  "name": "@tricktrack/types",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Type Definitions

**src/user.ts:**
```typescript
export enum WalletType {
  IN_APP = 'in-app',
  EXTERNAL = 'external',
}

export enum UserRole {
  SKATER = 'skater',
  VALIDATOR = 'validator',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  walletAddress: string;
  walletType: WalletType;
  username?: string;
  role: UserRole;
  createdAt: Date;
  suspended: boolean;
}
```

**src/validation.ts:**
```typescript
export enum ValidationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum TrickType {
  OLLIE = 'ollie',
  KICKFLIP = 'kickflip',
  HEELFLIP = 'heelflip',
  SHUVIT = 'shuvit',
  // Add more trick types
}

export interface ValidationScore {
  validatorId: string;
  landing: number; // 0-50
  style: number; // 0-30
  difficulty: number; // 0-20
  feedback?: string;
}

export interface Validation {
  id: string;
  skaterId: string;
  trickType: TrickType;
  videoUrl: string;
  status: ValidationStatus;
  scores: ValidationScore[];
  finalScore?: number;
  tokensEarned?: number;
  createdAt: Date;
  completedAt?: Date;
}
```

**src/token.ts:**
```typescript
export enum TransactionType {
  TRICK_REWARD = 'trick-reward',
  VALIDATOR_BONUS = 'validator-bonus',
  CHALLENGE_REWARD = 'challenge-reward',
  TRANSFER = 'transfer',
}

export interface TokenTransaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  txHash?: string;
  createdAt: Date;
}

export interface TokenBalance {
  userId: string;
  balance: number;
  pendingBalance: number;
  lastUpdated: Date;
}
```

**src/nft.ts:**
```typescript
export enum BadgeType {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  SPONSOR = 'sponsor',
}

export interface BadgeMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Record<string, string | number>;
}

export interface NFTBadge {
  id: string;
  userId: string;
  badgeType: BadgeType;
  tokenId: number;
  metadataUri: string;
  metadata?: BadgeMetadata;
  mintedAt: Date;
}
```

**src/blockchain.ts:**
```typescript
export enum BlockchainNetwork {
  POLYGON_MAINNET = 'polygon',
  POLYGON_MUMBAI = 'mumbai',
  LOCALHOST = 'localhost',
}

export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
}

export type ContractAddress = `0x${string}`;

export interface BlockchainTransaction {
  hash: string;
  status: TransactionStatus;
  network: BlockchainNetwork;
  confirmations: number;
  gasUsed?: string;
  createdAt: Date;
}
```

**src/api.ts:**
```typescript
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ErrorResponse;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, any>;
}
```

**src/index.ts:**
```typescript
// User types
export * from './user';

// Validation types
export * from './validation';

// Token types
export * from './token';

// NFT types
export * from './nft';

// Blockchain types
export * from './blockchain';

// API types
export * from './api';
```

### Directory Structure

```
packages/types/
├── src/
│   ├── user.ts
│   ├── validation.ts
│   ├── token.ts
│   ├── nft.ts
│   ├── blockchain.ts
│   ├── api.ts
│   └── index.ts
├── dist/                 # Generated by build
│   ├── *.js
│   ├── *.d.ts
│   └── *.d.ts.map
├── package.json
└── tsconfig.json
```

### Workspace Integration

**Add to apps/web/package.json:**
```json
{
  "dependencies": {
    "@tricktrack/types": "workspace:*"
  }
}
```

**Add to apps/api/package.json:**
```json
{
  "dependencies": {
    "@tricktrack/types": "workspace:*"
  }
}
```

**Usage Example (apps/web):**
```typescript
import { User, Validation, TokenBalance } from '@tricktrack/types';

const user: User = {
  id: '1',
  walletAddress: '0x...',
  walletType: WalletType.IN_APP,
  role: UserRole.SKATER,
  createdAt: new Date(),
  suspended: false,
};
```

**Usage Example (apps/api):**
```typescript
import { ApiResponse, User } from '@tricktrack/types';

async function getUser(id: string): Promise<ApiResponse<User>> {
  // Implementation
}
```

### Testing Requirements

**Verification Steps:**
1. Run `pnpm build` in `packages/types/` - builds successfully
2. Check `dist/` directory - `.d.ts` files generated
3. Import types in `apps/web` - no TypeScript errors
4. Import types in `apps/api` - no TypeScript errors
5. Run `pnpm build` at root - all packages build successfully
6. Verify type checking catches errors across workspaces

**Success Criteria:**
- Types package builds without errors
- Type definitions are exported correctly
- Frontend can import and use types
- Backend can import and use types
- TypeScript provides autocomplete and type checking
- Changes to types trigger rebuilds in dependent packages

### Future Enhancements

**Contract-Generated Types:**
When smart contracts are deployed, use `typechain` to generate TypeScript types from ABIs and include them in this package.

**Validation Utilities:**
Add shared validation functions and constants that use these types.

### Dependencies

**Story 1.1** - Monorepo must be initialized

### References

- [Source: `@architecture.md` - Shared TypeScript Types]
- [Source: `@architecture.md` - Code Organization]
- [Source: `@stories-epic-01-foundation.md` - Story 1.5]
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [pnpm Workspaces](https://pnpm.io/workspaces)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (via Claude Code)

### Debug Log References

N/A - No debugging issues encountered

### Completion Notes List

**Task 1: Initialize types package**
- Created package.json with @tricktrack/types as package name
- Installed TypeScript 5.9.3 as dev dependency
- Created tsconfig.json with strict TypeScript configuration targeting ES2020
- Configured build to output declaration files and declaration maps

**Task 2: Set up package structure**
- Created src/ directory for source files
- Created index.ts as main export file with re-exports of all type modules
- Verified build outputs .d.ts files to dist/ directory
- All build scripts configured in package.json

**Tasks 3-8: Create type definition files**
- Created src/user.ts with User interface, WalletType and UserRole enums
- Created src/validation.ts with Validation, ValidationScore interfaces, ValidationStatus and TrickType enums (added 10 trick types)
- Created src/token.ts with TokenTransaction, TokenBalance interfaces, TransactionType enum
- Created src/nft.ts with NFTBadge, BadgeMetadata interfaces, BadgeType enum
- Created src/blockchain.ts with BlockchainTransaction interface, BlockchainNetwork and TransactionStatus enums, ContractAddress type
- Created src/api.ts with generic ApiResponse<T>, PaginatedResponse<T>, and ErrorResponse interfaces
- All types exported through src/index.ts

**Task 9: Configure workspace dependencies**
- Added @tricktrack/types: "workspace:*" to apps/web/package.json dependencies
- Added @tricktrack/types: "workspace:*" to apps/api/package.json dependencies
- Ran pnpm install to link workspace packages

**Task 10: Verify type sharing**
- Created apps/web/src/lib/typeTest.ts with comprehensive type usage examples
- Created apps/api/src/types/typeTest.ts with comprehensive type usage examples
- Fixed import statements to use regular imports for enums (values) and type imports for interfaces
- Verified TypeScript compilation succeeds in both apps/web and apps/api
- Ran full monorepo build with pnpm build - all 3 packages built successfully

**Technical Decisions:**
- Used TypeScript 5.9.3 (latest available via pnpm)
- Configured strict TypeScript mode for maximum type safety
- Used ES2020 target and ESNext module for modern JavaScript features
- Used bundler module resolution for optimal compatibility with Next.js and NestJS
- Added 10 trick types to validation.ts for skateboarding tricks
- Created test files demonstrating proper import patterns (mixing type-only and value imports)

**Build Verification:**
- packages/types builds successfully (generates .d.ts files)
- apps/web builds successfully with Next.js 16 (TypeScript compilation passed)
- apps/api builds successfully with NestJS 11 (TypeScript compilation passed)
- Full monorepo build completed in 3m29s

### File List

**Created:**
- packages/types/package.json
- packages/types/tsconfig.json
- packages/types/src/user.ts
- packages/types/src/validation.ts
- packages/types/src/token.ts
- packages/types/src/nft.ts
- packages/types/src/blockchain.ts
- packages/types/src/api.ts
- packages/types/src/index.ts
- apps/web/src/lib/typeTest.ts
- apps/api/src/types/typeTest.ts

**Modified:**
- apps/web/package.json (added @tricktrack/types dependency)
- apps/api/package.json (added @tricktrack/types dependency)

**Generated (by build):**
- packages/types/dist/*.js
- packages/types/dist/*.d.ts
- packages/types/dist/*.d.ts.map

