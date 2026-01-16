# Story 1.5: Create Shared TypeScript Types Package

Status: ready-for-dev

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

- [ ] Initialize types package (AC: 1)
  - [ ] Navigate to `packages/types/` directory
  - [ ] Create `package.json` with package name `@tricktrack/types`
  - [ ] Install TypeScript as dev dependency
  - [ ] Create `tsconfig.json` for type declarations
- [ ] Set up package structure (AC: 1)
  - [ ] Create `src/` directory
  - [ ] Create `index.ts` as main export file
  - [ ] Configure build to output `.d.ts` files
  - [ ] Add build script to package.json
- [ ] Create user types (AC: 1)
  - [ ] Define `User` interface
  - [ ] Define `WalletType` enum (in-app, external)
  - [ ] Define `UserRole` enum (skater, validator, admin)
  - [ ] Export from `src/user.ts`
- [ ] Create validation types (AC: 1)
  - [ ] Define `Validation` interface
  - [ ] Define `ValidationStatus` enum
  - [ ] Define `ValidationScore` interface
  - [ ] Define `TrickType` enum
  - [ ] Export from `src/validation.ts`
- [ ] Create token types (AC: 1)
  - [ ] Define `TokenTransaction` interface
  - [ ] Define `TokenBalance` interface
  - [ ] Define `TransactionType` enum
  - [ ] Export from `src/token.ts`
- [ ] Create NFT types (AC: 1)
  - [ ] Define `NFTBadge` interface
  - [ ] Define `BadgeType` enum (bronze, silver, gold)
  - [ ] Define `BadgeMetadata` interface
  - [ ] Export from `src/nft.ts`
- [ ] Create blockchain types (AC: 1)
  - [ ] Define `BlockchainNetwork` enum
  - [ ] Define `TransactionStatus` enum
  - [ ] Define `ContractAddress` type
  - [ ] Export from `src/blockchain.ts`
- [ ] Create API response types (AC: 1)
  - [ ] Define `ApiResponse<T>` generic interface
  - [ ] Define `PaginatedResponse<T>` interface
  - [ ] Define `ErrorResponse` interface
  - [ ] Export from `src/api.ts`
- [ ] Configure workspace dependencies (AC: 1)
  - [ ] Add `@tricktrack/types` to `apps/web/package.json`
  - [ ] Add `@tricktrack/types` to `apps/api/package.json`
  - [ ] Use workspace protocol (`workspace:*`)
  - [ ] Run `pnpm install` to link packages
- [ ] Verify type sharing
  - [ ] Import types in `apps/web`
  - [ ] Import types in `apps/api`
  - [ ] Verify TypeScript compilation
  - [ ] Test type checking works across workspaces

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

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

