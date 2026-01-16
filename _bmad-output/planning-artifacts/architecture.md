---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
inputDocuments: ['c:\Users\thoma\OneDrive\Documents\Projects\tricktrack\_bmad-output\planning-artifacts\product-brief-tricktrack-2026-01-15.md', 'c:\Users\thoma\OneDrive\Documents\Projects\tricktrack\_bmad-output\planning-artifacts\prd.md', 'c:\Users\thoma\OneDrive\Documents\Projects\tricktrack\_bmad-output\planning-artifacts\ux-design-specification.md']
workflowType: 'architecture'
project_name: 'tricktrack'
user_name: 'Thomas'
date: '2026-01-15'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

TrickTrack requires **65 functional capabilities** spanning 8 major domains:

1. **User Onboarding & Authentication (FR1-FR5):** In-app wallet creation (< 30 seconds), external wallet connection (MetaMask, WalletConnect), social recovery, secure key management
2. **Social Connection & Trust Network (FR6-FR10):** QR code generation/scanning for friend connections, mutual validation rights, friend list management
3. **Trick Validation & Scoring (FR11-FR20):** Video upload, trick selection, multi-validator requests (3-5 friends), three-criteria scoring (Clean Landing 50%, Style 30%, Difficulty 20%), 90% consensus threshold, retry mechanism
4. **Token Economy & Rewards (FR21-FR26):** Real-time TRKTRK balance display, tiered rewards (10-100 tokens), automatic smart contract distribution, transaction history
5. **NFT Badge System (FR27-FR32):** Auto-minting on milestones (Bronze/Silver/Gold), IPFS metadata, badge gallery, social sharing, on-chain verification
6. **Sponsor Challenges (FR33-FR39):** Challenge discovery feed, participation workflow, bonus rewards, custom NFT badges
7. **Admin Operations & Fraud Detection (FR40-FR49):** Fraud dashboard, account suspension, gas monitoring, emergency pause, platform analytics
8. **Treasury & Blockchain Integration (FR50-FR65):** DAO treasury management, multi-sig controls, batch processing, RPC failover, compliance tracking

**Non-Functional Requirements:**

**50 NFRs** drive critical architectural decisions:

**Performance (NFR1-NFR7):**
- Video upload: < 30 seconds for 100MB on 4G
- Validation submission: < 2 seconds
- Token balance updates: < 30 seconds post-confirmation
- App load time: < 3 seconds on 4G
- Blockchain confirmation: < 2 minutes (Polygon)

**Security (NFR8-NFR16):**
- AES-256 wallet encryption at rest
- TLS 1.3 for all API communications
- Zero critical vulnerabilities in smart contract audit
- Multi-sig treasury (2-of-3 for > 10,000 TRKTRK)
- Rate limiting: max 10 validations/user/day

**Scalability (NFR17-NFR22):**
- Support 10x user growth (500 → 5,000 wallets) with < 10% performance degradation
- Database queries maintain sub-second response at 1M validation records
- Smart contract gas costs remain < $0.01 per validation at 10x volume
- Video storage scales to 10TB without manual intervention

**Reliability (NFR23-NFR28):**
- 99.5% platform uptime
- 99%+ blockchain transaction success rate
- 100% token distribution accuracy (no double-spending)
- Automated daily backups of off-chain data
- RPC failover within 10 seconds

**Usability (NFR29-NFR35):**
- Wallet creation: < 30 seconds without documentation
- Validation scoring: ≤ 3 taps per validation
- Offline video recording with auto-upload
- Clear non-technical error messages
- Mobile support: 4.7" to 6.7" screens

**Compliance (NFR46-NFR50):**
- GDPR compliance (data export, deletion, consent)
- Token utility classification (non-security per Howey Test)
- 12-month audit log retention
- Data residency requirements (EU data in EU)

**Scale & Complexity:**

- **Primary domain:** Full-stack Web3 Progressive Web Application
- **Complexity level:** High
  - Web3 integration (smart contracts, wallets, blockchain)
  - Social network (friend graphs, peer validation)
  - Real-time systems (token distribution, notifications)
  - Governance (DAO voting, treasury management)
  - Payment processing (sponsor subscriptions, fiat-to-crypto)
- **Estimated architectural components:** 15+ major components
  - Frontend: PWA shell, wallet integration, validation UI, DAO interface
  - Backend: API gateway, validation engine, fraud detection, notification service
  - Blockchain: 5 smart contracts (Token, ValidationManager, NFTBadgeFactory, DAOIntegration, TreasuryManager)
  - Infrastructure: Database, file storage, RPC providers, CDN

### Technical Constraints & Dependencies

**Blockchain Constraints:**
- **Network:** Polygon mainnet (Mumbai testnet for staging)
- **Gas Cost Target:** < $0.01 per validation (requires batch processing)
- **Transaction Finality:** 2-3 seconds on Polygon (12+ confirmations for high-value)
- **Smart Contract Upgradeability:** Transparent proxy pattern required for ValidationManager, NFTBadgeFactory
- **DAO Framework:** Aragon DAO on Polygon (battle-tested governance)

**Technology Stack (Specified in PRD):**
- **Frontend:** Next.js (App Router) + React + TypeScript + shadcn/ui + Tailwind CSS
- **Backend:** Nest.js API layer
- **Database:** Supabase (user mappings, friend connections, validation metadata)
- **Storage:** AWS S3 for video files with CDN distribution
- **Wallet Integration:** Web3Modal + ethers.js/viem
- **Blockchain Libraries:** Hardhat for smart contract development, OpenZeppelin for security patterns

**External Dependencies:**
- **Web3Auth or Magic:** In-app wallet creation (social login)
- **Aragon Client:** DAO governance UI
- **Stripe:** Sponsor payment processing (fiat on-ramp)
- **IPFS/Arweave:** NFT metadata storage (Pinata for pinning)
- **The Graph:** Blockchain event indexing for efficient queries
- **Alchemy/Infura:** Polygon RPC providers with failover

**Regulatory Constraints:**
- Token must qualify as utility (not security) under Howey Test
- GDPR compliance for EU users (right to deletion, data portability)
- Potential KYC/AML for sponsor partnerships and large charitable donations
- Tax reporting for US users earning > $600 (1099-MISC)

**Performance Constraints:**
- Mobile-first PWA (primary device: smartphones on 4G networks)
- Offline-first architecture (validation requests must queue offline)
- Optimistic UI updates (hide blockchain latency from users)
- Video upload optimization (100MB files on mobile networks)

### Cross-Cutting Concerns Identified

**1. Authentication & Identity Management**
- Dual wallet strategy: in-app (Web3Auth/Magic) + external (MetaMask, WalletConnect)
- Anonymous profiles by default (no email/KYC for skaters)
- Session management with JWT after wallet signature verification
- Social recovery for lost wallet access
- **Architectural Impact:** Unified authentication layer abstracting wallet providers

**2. Fraud Detection & Security**
- Validator collusion detection (statistical anomaly analysis)
- Sybil attack prevention (rate limiting, social graph analysis)
- Smart contract security (reentrancy guards, access control, emergency pause)
- Account suspension workflow (admin dashboard → freeze → investigation)
- **Architectural Impact:** Dedicated fraud detection service with ML-based pattern recognition

**3. Gas Optimization & Blockchain Efficiency**
- Batch processing (10-50 validations per transaction)
- Dynamic gas pricing (monitor Polygon network, adjust timing)
- Off-chain computation with on-chain verification (ECDSA signatures, Merkle proofs)
- Event emission for historical data (avoid expensive storage)
- **Architectural Impact:** Transaction queue manager with intelligent batching

**4. Offline Resilience & Sync**
- Draft validation requests offline, auto-submit when connected
- Cached validation history for offline viewing
- Intelligent sync prioritization (validation responses > history browsing)
- Conflict resolution for concurrent offline edits
- **Architectural Impact:** Service worker with IndexedDB for offline storage, sync engine

**5. Real-Time Notifications & Updates**
- Push notifications for validation responses, DAO votes, S.K.A.T.E. game turns
- Optimistic UI updates (show "25 tokens earned" immediately)
- WebSocket connections for real-time blockchain events
- Background transaction confirmation tracking
- **Architectural Impact:** Notification service with Firebase Cloud Messaging, WebSocket server for live updates

**6. Multi-Role User Experience**
- Users simultaneously act as skaters, validators, DAO members
- Role-switching UI with dedicated dashboards
- Contextual interfaces adapting to current mode
- Pending action aggregation across roles
- **Architectural Impact:** Role-based UI architecture with shared state management

**7. DAO Governance Integration**
- Aragon DAO as treasury holder and governance layer
- Token-weighted voting (1 TRKTRK = 1 vote)
- Proposal creation, voting, execution workflow
- Treasury transparency dashboard
- **Architectural Impact:** DAO integration service wrapping Aragon APIs, governance UI components

**8. Sponsor Payment & Token Economics**
- Fiat-to-crypto on-ramp (Stripe → DAO treasury → sponsor wallet)
- Token pool management for challenges
- Revenue allocation (40-50% operations, 5-10% charity, 20-30% development)
- Token velocity monitoring (target: 2-3x per month)
- **Architectural Impact:** Payment processing service, token economics dashboard

**9. Compliance & Data Privacy**
- GDPR compliance (data export, deletion, consent tracking)
- Off-chain data (Supabase) vs on-chain data (immutable blockchain)
- Audit logging for administrative actions
- Right to be forgotten (delete off-chain, anonymize on-chain references)
- **Architectural Impact:** Compliance service with data lifecycle management

**10. Observability & Monitoring**
- Smart contract gas cost tracking
- Transaction success rate monitoring
- Fraud detection alerts
- Platform-wide analytics (users, validations, tokens distributed)
- **Architectural Impact:** Observability stack with metrics, logging, alerting (Datadog, Sentry, custom dashboards)

## Starter Template Evaluation

### Primary Technology Domain

**Full-stack Web3 Progressive Web Application** based on project requirements analysis.

TrickTrack requires coordinated development across:
- Frontend PWA (Next.js with App Router)
- Backend API (Nest.js)
- Smart Contracts (Solidity with Hardhat)
- Shared TypeScript types across all layers

### Monorepo Strategy Selection

**Selected Approach: Turborepo + pnpm Workspaces**

**Rationale for Monorepo:**

1. **Shared Type Safety:** TypeScript types defined in smart contracts (ABIs, events) need to be consumed by both frontend and backend
2. **Coordinated Deployments:** Smart contract updates require synchronized frontend/backend changes
3. **Code Reuse:** Validation logic, token calculations, and business rules shared across layers
4. **Developer Experience:** Single repository, unified CI/CD, consistent tooling
5. **Web3 Complexity:** Managing wallet integrations, blockchain interactions, and off-chain sync requires tight coupling

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
└── package.json          # Root package.json with workspace scripts
```

### Initialization Commands

**Step 1: Create Monorepo Root**

```bash
mkdir tricktrack && cd tricktrack
pnpm init
pnpm add -D turbo
```

**Step 2: Configure Workspace**

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Update root `package.json`:

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

**Step 3: Initialize Next.js App (Frontend PWA)**

```bash
mkdir -p apps/web
cd apps/web
pnpm create next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
cd ../..
```

This creates Next.js 15 with:
- TypeScript enabled
- Tailwind CSS configured
- App Router (recommended)
- `src/` directory structure
- Import alias `@/*` for clean imports

**Step 4: Initialize Nest.js API (Backend)**

```bash
mkdir -p apps/api
cd apps/api
pnpm add -g @nestjs/cli
nest new . --package-manager pnpm --skip-git
cd ../..
```

This creates Nest.js with:
- TypeScript configuration
- Module-based architecture
- Testing setup (Jest)
- Development server with hot reload

**Step 5: Initialize Hardhat (Smart Contracts)**

```bash
mkdir -p packages/contracts
cd packages/contracts
pnpm init
pnpm add -D hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
# Select: "Create a TypeScript project"
cd ../..
```

This creates Hardhat 3 with:
- TypeScript support
- OpenZeppelin contracts integration
- Hardhat Toolbox (testing, deployment, verification)
- Sample contracts and tests

**Step 6: Create Shared Packages**

```bash
# Shared UI components (shadcn/ui)
mkdir -p packages/ui
cd packages/ui
pnpm init
pnpm add react react-dom
pnpm add -D typescript @types/react @types/react-dom

# Shared TypeScript types
mkdir -p packages/types
cd packages/types
pnpm init
pnpm add -D typescript

# Shared config
mkdir -p packages/config
cd packages/config
pnpm init
```

**Step 7: Configure Turborepo**

Create `turbo.json` at root:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "build/**", "artifacts/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

### Architectural Decisions Provided by Starter

**Language & Runtime:**
- **TypeScript:** Strict mode enabled across all packages
- **Node.js:** v22+ required (Hardhat 3 requirement)
- **Package Manager:** pnpm v9+ for workspace management

**Frontend (Next.js 15):**
- **App Router:** Server Components by default, Client Components opt-in
- **Styling:** Tailwind CSS v4 with JIT compilation
- **Linting:** ESLint with Next.js plugin
- **Build Tool:** Turbopack for development (10x faster than Webpack)
- **PWA Support:** Will add `next-pwa` plugin for service worker generation

**Backend (Nest.js):**
- **Architecture:** Module-based with dependency injection
- **Testing:** Jest with supertest for e2e tests
- **Validation:** class-validator + class-transformer
- **Configuration:** @nestjs/config for environment variables
- **API Documentation:** Will add Swagger/OpenAPI

**Smart Contracts (Hardhat 3):**
- **Solidity:** v0.8.20+ with optimizer enabled
- **Testing:** Hardhat Chai Matchers + ethers.js v6
- **Deployment:** Hardhat Ignition for deployment management
- **Verification:** Etherscan plugin for contract verification
- **Security:** OpenZeppelin Contracts v5 for battle-tested patterns

**Code Organization:**
- **Monorepo Structure:** Apps in `apps/`, shared code in `packages/`
- **Import Aliases:** `@/` for app-level imports, package names for cross-package imports
- **Dependency Management:** Workspace protocol for local package dependencies
- **Build Orchestration:** Turborepo handles build order and caching

**Development Experience:**
- **Hot Reloading:** Next.js Fast Refresh, Nest.js watch mode, Hardhat watch
- **TypeScript:** Strict type checking with shared `tsconfig.json` base
- **Linting:** Unified ESLint config across all packages
- **Testing:** Jest for unit tests, Hardhat for contract tests, Playwright for e2e
- **CI/CD Ready:** Turborepo remote caching for GitHub Actions/Vercel

**Additional Integrations (Post-Initialization):**

The following will be added after initial setup:
- **Web3 Libraries:** ethers.js/viem, Web3Modal, Web3Auth/Magic
- **Database:** Supabase client libraries
- **Storage:** AWS SDK for S3 integration
- **UI Components:** shadcn/ui components in `packages/ui`
- **Blockchain Indexing:** The Graph client for event queries
- **DAO Integration:** Aragon SDK for governance

**Note:** Project initialization using these commands should be the first implementation story. The monorepo structure provides a solid foundation for coordinated full-stack Web3 development with type safety and efficient build caching.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- ✅ Wallet integration strategy (Web3Auth)
- ✅ State management approach (Zustand)
- ✅ Real-time communication (Socket.io)
- ✅ Blockchain RPC provider (Alchemy)
- ✅ Smart contract testing framework (Hardhat + Chai)

**Important Decisions (Shape Architecture):**
- Database schema design (deferred to implementation phase)
- API versioning strategy (deferred to implementation phase)
- Caching layer implementation (deferred to implementation phase)

**Deferred Decisions (Post-MVP):**
- Advanced fraud detection ML models
- Multi-region deployment strategy
- Advanced analytics and observability tooling

### Authentication & Wallet Integration

**Decision: Web3Auth v10.13.0**

**Rationale:**
- **Social Login Support:** Google, Twitter, Discord, Apple - critical for mainstream user onboarding
- **MPC-based Security:** Multi-Party Computation eliminates single point of failure
- **Non-Custodial:** Users maintain full control of private keys
- **Seamless UX:** < 30 seconds wallet creation (meets NFR29)
- **Production Ready:** Battle-tested with 10M+ wallets created

**Implementation:**
```bash
pnpm add @web3auth/modal @web3auth/base @web3auth/ethereum-provider
```

**Integration Points:**
- Frontend: `apps/web/src/lib/web3auth.ts` - Web3Auth initialization
- Backend: `apps/api/src/auth/` - JWT verification after wallet signature
- Shared: `packages/types/src/auth.ts` - Authentication type definitions

**External Wallet Support:**
- Web3Modal for MetaMask, WalletConnect, Coinbase Wallet
- Unified wallet abstraction layer in `packages/types`

**Affects:**
- FR1-FR5 (User Onboarding & Authentication)
- NFR8-NFR16 (Security requirements)
- NFR29 (< 30 seconds wallet creation)

### State Management

**Decision: Zustand v5.0.10**

**Rationale:**
- **Minimal Boilerplate:** No providers, actions, or reducers required
- **TypeScript First:** Excellent type inference out of the box
- **Tiny Bundle:** 1.2KB gzipped vs 8KB+ for Redux Toolkit
- **Perfect for Web3:** Ideal for managing wallet state, blockchain data, validation requests
- **DevTools Support:** Redux DevTools integration for debugging
- **Middleware Ecosystem:** Persist, immer, devtools built-in

**Implementation:**
```bash
cd apps/web
pnpm add zustand
```

**Store Structure:**
```typescript
// apps/web/src/stores/wallet.ts - Wallet connection state
// apps/web/src/stores/validation.ts - Validation requests and responses
// apps/web/src/stores/tokens.ts - TRKTRK balance and transaction history
// apps/web/src/stores/dao.ts - DAO proposals and voting state
```

**Affects:**
- All frontend state management (FR11-FR65)
- NFR3 (< 2 second validation submission)
- NFR4 (< 3 second app load time)
- Developer experience and maintainability

### Real-Time Communication

**Decision: Socket.io v4.8.3**

**Rationale:**
- **Bidirectional Communication:** Server can push updates to clients
- **Automatic Reconnection:** Handles network interruptions gracefully
- **Fallback Support:** WebSocket → HTTP long-polling if needed
- **Room-Based Broadcasting:** Efficient for friend-to-friend validation notifications
- **Binary Support:** Can handle video upload progress updates
- **Battle-Tested:** Used by Microsoft, Trello, and thousands of production apps

**Implementation:**
```bash
cd apps/api
pnpm add socket.io
cd ../web
pnpm add socket.io-client
```

**Use Cases:**
- **Validation Notifications:** Real-time alerts when friends respond to validation requests
- **Token Balance Updates:** Instant UI update when tokens are distributed
- **DAO Voting:** Live vote count updates during governance proposals
- **S.K.A.T.E. Game:** Turn-by-turn notifications for multiplayer challenges
- **Blockchain Confirmations:** Progress updates for pending transactions

**Event Architecture:**
```typescript
// Server events (apps/api/src/websocket/)
- validation:request - New validation request received
- validation:response - Friend submitted validation score
- token:distributed - TRKTRK tokens credited to wallet
- dao:proposal - New DAO proposal created
- dao:vote - Vote cast on proposal

// Client events (apps/web/src/lib/socket.ts)
- connect - Authenticate socket with JWT
- disconnect - Clean up subscriptions
```

**Affects:**
- FR11-FR20 (Trick Validation & Scoring)
- FR21-FR26 (Token Economy & Rewards)
- FR50-FR65 (Treasury & Blockchain Integration)
- NFR5 (< 30 second token balance updates)
- NFR23-NFR28 (Reliability requirements)

### Blockchain RPC Strategy

**Decision: Alchemy (Primary) + Infura (Fallback)**

**Rationale:**
- **Alchemy Primary:**
  - Enhanced APIs (NFT API, Token API, Notify API)
  - Superior WebSocket support for real-time event listening
  - Built-in request caching and optimization
  - Free tier: 300M compute units/month (sufficient for MVP)
  - Polygon support with 2-second block times
  
- **Infura Fallback:**
  - Industry standard reliability (99.9% uptime SLA)
  - Automatic failover if Alchemy experiences issues
  - Free tier: 100K requests/day
  - Meets NFR27 (RPC failover within 10 seconds)

**Implementation:**
```bash
cd packages/contracts
pnpm add alchemy-sdk
pnpm add ethers@6
```

**Configuration:**
```typescript
// packages/types/src/blockchain.ts
export const RPC_PROVIDERS = {
  primary: process.env.ALCHEMY_POLYGON_URL,
  fallback: process.env.INFURA_POLYGON_URL,
  selfHosted: process.env.SELF_HOSTED_NODE_URL // Future: own Polygon node
}
```

**Failover Logic:**
- Monitor RPC response times and error rates
- Automatic switch to fallback if primary fails health check
- Alert admin dashboard on failover events

**Affects:**
- FR50-FR65 (Treasury & Blockchain Integration)
- NFR5 (< 2 minute blockchain confirmation)
- NFR24 (99%+ blockchain transaction success rate)
- NFR27 (RPC failover within 10 seconds)

### Smart Contract Testing

**Decision: Hardhat + Chai Matchers + ethers.js v6**

**Rationale:**
- **TypeScript Native:** Consistent with monorepo TypeScript stack
- **Hardhat Chai Matchers:** Blockchain-specific assertions (revert reasons, event emissions, balance changes)
- **ethers.js v6:** Modern, well-documented, excellent TypeScript support
- **Gas Reporting:** Built-in gas usage analysis for optimization
- **Coverage Reports:** Solidity code coverage via hardhat-coverage
- **Mainnet Forking:** Test against live Polygon state for integration tests

**Implementation:**
```bash
cd packages/contracts
pnpm add -D @nomicfoundation/hardhat-chai-matchers chai ethers
pnpm add -D hardhat-gas-reporter solidity-coverage
```

**Test Structure:**
```
packages/contracts/test/
├── unit/
│   ├── TRKTRKToken.test.ts
│   ├── ValidationManager.test.ts
│   ├── NFTBadgeFactory.test.ts
│   ├── DAOIntegration.test.ts
│   └── TreasuryManager.test.ts
├── integration/
│   ├── validation-flow.test.ts
│   ├── token-distribution.test.ts
│   └── dao-governance.test.ts
└── fixtures/
    └── deploy.ts
```

**Testing Requirements:**
- **Unit Tests:** 100% coverage of smart contract logic
- **Integration Tests:** End-to-end validation and token distribution flows
- **Gas Optimization:** All transactions < $0.01 on Polygon (NFR19)
- **Security Audit Prep:** Zero critical vulnerabilities (NFR10)

**Affects:**
- FR50-FR65 (Treasury & Blockchain Integration)
- NFR10 (Zero critical vulnerabilities in smart contract audit)
- NFR19 (Gas costs < $0.01 per validation)
- NFR25 (100% token distribution accuracy)

### API & Communication Patterns

**Decision: RESTful API with OpenAPI/Swagger Documentation**

**Rationale:**
- **Nest.js Native:** Built-in decorators for Swagger generation
- **Type Safety:** Shared TypeScript types between frontend and backend
- **Developer Experience:** Auto-generated API documentation
- **Industry Standard:** Well-understood by all developers
- **Versioning:** URL-based versioning (`/api/v1/`) for future compatibility

**Implementation:**
```bash
cd apps/api
pnpm add @nestjs/swagger swagger-ui-express
```

**API Structure:**
```
/api/v1/auth          - Authentication endpoints
/api/v1/users         - User profile management
/api/v1/validations   - Validation request/response
/api/v1/tokens        - Token balance and history
/api/v1/nfts          - NFT badge queries
/api/v1/dao           - DAO proposals and voting
/api/v1/challenges    - Sponsor challenges
/api/v1/admin         - Admin operations
```

**Error Handling:**
- Standardized error responses with HTTP status codes
- User-friendly error messages (NFR32)
- Detailed logging for debugging

**Affects:**
- All functional requirements (FR1-FR65)
- NFR2 (< 2 second validation submission)
- NFR32 (Clear non-technical error messages)

### Data Architecture

**Decision: Supabase (PostgreSQL) with Row-Level Security**

**Rationale:**
- **Already Specified in PRD:** Supabase for user mappings, friend connections, validation metadata
- **Real-time Subscriptions:** Built-in WebSocket support for live data updates
- **Row-Level Security:** Database-level authorization (complements smart contract security)
- **TypeScript Client:** Auto-generated types from database schema
- **Scalability:** Handles 1M+ validation records (NFR18)

**Schema Design:**
```sql
-- Core tables
users (wallet_address, username, created_at, suspended)
friendships (user_id, friend_id, created_at, mutual)
validations (id, skater_id, trick_id, video_url, status, created_at)
validation_scores (validation_id, validator_id, landing, style, difficulty)
token_transactions (id, user_id, amount, type, tx_hash, created_at)
nft_badges (id, user_id, badge_type, token_id, metadata_uri)
dao_proposals (id, title, description, status, votes_for, votes_against)
sponsor_challenges (id, sponsor_id, title, reward_pool, start_date, end_date)
```

**Affects:**
- FR6-FR10 (Social Connection & Trust Network)
- FR11-FR20 (Trick Validation & Scoring)
- NFR18 (Database queries < 1 second at 1M records)
- NFR46-NFR50 (GDPR compliance)

### Infrastructure & Deployment

**Decision: Vercel (Frontend) + Railway (Backend) + Polygon Mainnet**

**Rationale:**
- **Vercel for Next.js PWA:**
  - Zero-config Next.js deployment
  - Global CDN for < 3 second load times (NFR4)
  - Automatic HTTPS and domain management
  - Turborepo remote caching integration
  - Free tier sufficient for MVP

- **Railway for Nest.js API:**
  - Simple Docker-based deployment
  - Auto-scaling based on traffic
  - Built-in PostgreSQL (Supabase alternative for staging)
  - Environment variable management
  - Free tier for development

- **Polygon Mainnet:**
  - Low gas costs (< $0.01 per transaction)
  - 2-second block times
  - EVM-compatible (Ethereum tooling works)
  - Production-ready for Web3 apps

**CI/CD Pipeline:**
```yaml
# .github/workflows/deploy.yml
- Turborepo build with remote caching
- Run all tests (unit, integration, e2e)
- Deploy frontend to Vercel
- Deploy backend to Railway
- Run smoke tests on staging
```

**Affects:**
- NFR4 (< 3 second app load time)
- NFR17-NFR22 (Scalability requirements)
- NFR23 (99.5% platform uptime)

### Decision Impact Analysis

**Implementation Sequence:**

1. **Phase 1: Foundation (Week 1-2)**
   - Initialize Turborepo monorepo
   - Set up Hardhat contracts with testing framework
   - Configure Supabase database schema
   - Implement Web3Auth wallet integration

2. **Phase 2: Core Features (Week 3-6)**
   - Build validation flow (frontend + backend + smart contracts)
   - Implement token distribution logic
   - Set up Socket.io real-time notifications
   - Deploy to staging environment

3. **Phase 3: Advanced Features (Week 7-10)**
   - NFT badge minting system
   - DAO governance integration
   - Sponsor challenge platform
   - Admin dashboard and fraud detection

4. **Phase 4: Production Readiness (Week 11-12)**
   - Security audit of smart contracts
   - Performance optimization
   - GDPR compliance implementation
   - Production deployment

**Cross-Component Dependencies:**

- **Wallet → All Features:** Web3Auth must be implemented first
- **Smart Contracts → Token/NFT Features:** Contracts deployed before frontend integration
- **Socket.io → Real-time Updates:** Required for validation notifications and DAO voting
- **Zustand → Frontend State:** Centralized state management enables offline-first architecture
- **Alchemy → Blockchain Reads:** All blockchain queries depend on RPC provider

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 8 major areas where AI agents could make different choices that would cause integration conflicts.

### Naming Patterns

**Database Naming Conventions:**

- **Tables:** Lowercase plural nouns (`users`, `validations`, `nft_badges`)
- **Columns:** Snake_case (`user_id`, `created_at`, `wallet_address`)
- **Primary Keys:** `id` (auto-increment integer)
- **Foreign Keys:** `{table_singular}_id` (`user_id`, `validation_id`)
- **Indexes:** `idx_{table}_{column(s)}` (`idx_users_wallet_address`)
- **Timestamps:** Always include `created_at`, `updated_at` (nullable)

**Examples:**
```sql
CREATE TABLE validations (
  id SERIAL PRIMARY KEY,
  skater_id INTEGER REFERENCES users(id),
  trick_id INTEGER NOT NULL,
  video_url TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

CREATE INDEX idx_validations_skater_id ON validations(skater_id);
CREATE INDEX idx_validations_status ON validations(status);
```

**API Naming Conventions:**

- **Endpoints:** Lowercase plural nouns (`/api/v1/users`, `/api/v1/validations`)
- **Resource IDs:** Numeric path parameters (`/api/v1/users/:id`)
- **Query Parameters:** camelCase (`?userId=123&includeDeleted=false`)
- **HTTP Methods:** Standard REST verbs (GET, POST, PUT, PATCH, DELETE)
- **Versioning:** URL-based (`/api/v1/`, `/api/v2/`)

**Examples:**
```
GET    /api/v1/users/:id
POST   /api/v1/users
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id

GET    /api/v1/validations?skaterId=123&status=pending
POST   /api/v1/validations/:id/scores
```

**Code Naming Conventions:**

- **Components:** PascalCase (`UserCard`, `ValidationForm`, `TokenBalance`)
- **Files:** Match component name (`UserCard.tsx`, `ValidationForm.tsx`)
- **Functions/Methods:** camelCase (`getUserData`, `submitValidation`)
- **Variables:** camelCase (`userId`, `walletAddress`, `tokenBalance`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_VALIDATORS`, `DEFAULT_REWARD`)
- **Interfaces/Types:** PascalCase with `I` prefix for interfaces (`IUser`, `IValidation`)
- **Enums:** PascalCase (`ValidationStatus`, `BadgeType`)

**Examples:**
```typescript
// Component
export const ValidationCard: React.FC<IValidationCardProps> = ({ validation }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmitScore = async (score: IValidationScore) => {
    // Implementation
  };
  
  return <div>...</div>;
};

// Constants
export const MAX_VALIDATORS = 5;
export const MIN_CONSENSUS_THRESHOLD = 0.9;

// Types
export interface IValidation {
  id: number;
  skaterId: number;
  trickId: number;
  videoUrl: string;
  status: ValidationStatus;
}

export enum ValidationStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected'
}
```

### Structure Patterns

**Project Organization:**

```
apps/web/src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth layout group
│   ├── (dashboard)/       # Dashboard layout group
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── features/         # Feature-specific components
│   │   ├── validation/
│   │   ├── wallet/
│   │   └── dao/
│   └── layout/           # Layout components
├── lib/                   # Utilities and helpers
│   ├── web3auth.ts
│   ├── socket.ts
│   └── utils.ts
├── stores/                # Zustand stores
│   ├── wallet.ts
│   ├── validation.ts
│   └── tokens.ts
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── styles/                # Global styles

apps/api/src/
├── auth/                  # Authentication module
├── users/                 # Users module
├── validations/           # Validations module
├── tokens/                # Tokens module
├── websocket/             # Socket.io gateway
├── common/                # Shared utilities
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
└── config/                # Configuration

packages/contracts/
├── contracts/             # Solidity contracts
│   ├── TRKTRKToken.sol
│   ├── ValidationManager.sol
│   └── NFTBadgeFactory.sol
├── test/                  # Contract tests
│   ├── unit/
│   └── integration/
├── scripts/               # Deployment scripts
└── ignition/              # Hardhat Ignition modules
```

**Test Location:**
- **Frontend:** Co-located `*.test.tsx` files next to components
- **Backend:** Co-located `*.spec.ts` files next to modules
- **Contracts:** Dedicated `test/` directory with unit and integration folders
- **E2E:** Root-level `e2e/` directory using Playwright

### Format Patterns

**API Response Formats:**

**Success Response:**
```typescript
{
  "data": T,
  "meta": {
    "timestamp": "2026-01-15T20:40:00Z",
    "requestId": "uuid"
  }
}
```

**Error Response:**
```typescript
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "User-friendly error message",
    "details": {
      "field": "skaterId",
      "reason": "Skater not found"
    }
  },
  "meta": {
    "timestamp": "2026-01-15T20:40:00Z",
    "requestId": "uuid"
  }
}
```

**Paginated Response:**
```typescript
{
  "data": T[],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "hasMore": true
  },
  "meta": {
    "timestamp": "2026-01-15T20:40:00Z",
    "requestId": "uuid"
  }
}
```

**Data Exchange Formats:**

- **JSON Fields:** camelCase in API responses, snake_case in database
- **Dates:** ISO 8601 strings (`2026-01-15T20:40:00Z`)
- **Timestamps:** Unix timestamps for blockchain events
- **Booleans:** `true`/`false` (never `1`/`0`)
- **Null Handling:** Use `null` for missing values, never `undefined` in JSON
- **BigNumbers:** String representation for token amounts (`"1000000000000000000"`)
- **Addresses:** Checksummed Ethereum addresses (`0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`)

### Communication Patterns

**Socket.io Event Naming:**

- **Format:** `{domain}:{action}` (lowercase, colon-separated)
- **Examples:**
  - `validation:request` - New validation request created
  - `validation:response` - Validator submitted score
  - `token:distributed` - Tokens credited to wallet
  - `dao:proposal` - New DAO proposal
  - `dao:vote` - Vote cast on proposal

**Event Payload Structure:**
```typescript
interface ISocketEvent<T> {
  event: string;
  data: T;
  timestamp: number;
  userId?: string;
}

// Example
{
  "event": "validation:response",
  "data": {
    "validationId": 123,
    "validatorId": 456,
    "scores": {
      "landing": 45,
      "style": 28,
      "difficulty": 18
    }
  },
  "timestamp": 1705349040000,
  "userId": "0x742d35Cc..."
}
```

**State Management Patterns (Zustand):**

- **Immutable Updates:** Always use spread operators or immer
- **Action Naming:** Verb-based (`setWalletAddress`, `addValidation`, `updateTokenBalance`)
- **Async Actions:** Separate loading/error states
- **Store Slicing:** One store per domain (wallet, validation, tokens, dao)

**Example Store:**
```typescript
interface IWalletStore {
  address: string | null;
  isConnected: boolean;
  balance: string;
  setAddress: (address: string) => void;
  disconnect: () => void;
  updateBalance: (balance: string) => void;
}

export const useWalletStore = create<IWalletStore>((set) => ({
  address: null,
  isConnected: false,
  balance: '0',
  setAddress: (address) => set({ address, isConnected: true }),
  disconnect: () => set({ address: null, isConnected: false, balance: '0' }),
  updateBalance: (balance) => set({ balance })
}));
```

### Process Patterns

**Error Handling:**

**Frontend:**
```typescript
// Global error boundary for React errors
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>

// API error handling
try {
  const response = await api.submitValidation(data);
  toast.success('Validation submitted!');
} catch (error) {
  if (error.code === 'INSUFFICIENT_BALANCE') {
    toast.error('Insufficient token balance');
  } else {
    toast.error('An error occurred. Please try again.');
  }
  logger.error('Validation submission failed', { error, data });
}
```

**Backend:**
```typescript
// Global exception filter
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      error: {
        code: this.getErrorCode(exception),
        message: this.getUserMessage(exception),
        details: this.getDetails(exception)
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: request.id
      }
    };

    this.logger.error(exception);
    response.status(status).json(errorResponse);
  }
}
```

**Loading State Patterns:**

**Component-Level:**
```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

const handleSubmit = async () => {
  setIsLoading(true);
  setError(null);
  try {
    await submitValidation(data);
  } catch (err) {
    setError(err);
  } finally {
    setIsLoading(false);
  }
};
```

**Global Loading (for blockchain transactions):**
```typescript
interface ITransactionStore {
  pendingTxs: Map<string, ITransaction>;
  addPendingTx: (tx: ITransaction) => void;
  updateTxStatus: (hash: string, status: TxStatus) => void;
}
```

### Enforcement Guidelines

**All AI Agents MUST:**

1. **Follow Naming Conventions:** Use exact patterns for database, API, and code naming
2. **Maintain Project Structure:** Place files in designated directories
3. **Use Standard Response Formats:** All API responses must follow the defined structure
4. **Implement Error Handling:** Use global error boundaries and consistent error formats
5. **Document Deviations:** If a pattern must be broken, document why in code comments
6. **Type Everything:** No `any` types unless absolutely necessary (document why)
7. **Test Coverage:** Minimum 80% coverage for business logic
8. **Consistent Imports:** Use absolute imports with `@/` prefix in Next.js

**Pattern Enforcement:**

- **Linting:** ESLint rules enforce naming conventions
- **Type Checking:** TypeScript strict mode catches type violations
- **Code Review:** PR checklist includes pattern compliance
- **CI/CD:** Automated checks for test coverage and build success

**Pattern Updates:**

- Patterns can be updated via architecture document amendments
- All agents must be notified of pattern changes
- Legacy code should be refactored to match new patterns

### Pattern Examples

**Good Examples:**

```typescript
// ✅ Correct: Follows all naming and structure patterns
export const ValidationCard: React.FC<IValidationCardProps> = ({ validation }) => {
  const { address } = useWalletStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmitScore = async (scores: IValidationScore) => {
    setIsSubmitting(true);
    try {
      const response = await api.post(`/api/v1/validations/${validation.id}/scores`, {
        validatorId: address,
        ...scores
      });
      toast.success('Score submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit score');
      logger.error('Score submission failed', { error, validationId: validation.id });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold">{validation.trickName}</h3>
      <ValidationScoreForm onSubmit={handleSubmitScore} disabled={isSubmitting} />
    </Card>
  );
};
```

**Anti-Patterns:**

```typescript
// ❌ Wrong: Inconsistent naming, no error handling, any types
export const validation_card = (props: any) => {
  const wallet = useWalletStore();
  
  const submit = (data: any) => {
    // No loading state
    // No error handling
    api.post('/validations/' + props.id, data); // Wrong URL format
  };
  
  return <div onClick={submit}>...</div>; // No accessibility
};

// ❌ Wrong: Direct mutation, no types
const updateBalance = (newBalance) => {
  walletStore.balance = newBalance; // Direct mutation
};

// ❌ Wrong: Inconsistent response format
return res.json({ success: true, balance: 100 }); // Should use standard format
```

**Key Principles:**

- **Consistency Over Cleverness:** Predictable patterns beat clever solutions
- **Type Safety First:** TypeScript types prevent runtime errors
- **User Experience:** Loading states, error messages, accessibility
- **Maintainability:** Code should be easy to understand and modify
- **Performance:** Optimize only when necessary, measure first

## Project Structure & Boundaries

### Complete Project Directory Structure

```
tricktrack/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy-frontend.yml
│       └── deploy-backend.yml
├── .windsurf/
│   └── workflows/
├── apps/
│   ├── web/                           # Next.js 15 PWA Frontend
│   │   ├── .env.local
│   │   ├── .env.example
│   │   ├── .eslintrc.json
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   ├── package.json
│   │   ├── public/
│   │   │   ├── manifest.json
│   │   │   ├── sw.js
│   │   │   ├── icons/
│   │   │   └── assets/
│   │   └── src/
│   │       ├── app/
│   │       │   ├── (auth)/
│   │       │   │   ├── login/
│   │       │   │   │   └── page.tsx
│   │       │   │   ├── signup/
│   │       │   │   │   └── page.tsx
│   │       │   │   └── layout.tsx
│   │       │   ├── (dashboard)/
│   │       │   │   ├── feed/
│   │       │   │   │   └── page.tsx
│   │       │   │   ├── validations/
│   │       │   │   │   ├── page.tsx
│   │       │   │   │   ├── [id]/
│   │       │   │   │   │   └── page.tsx
│   │       │   │   │   └── new/
│   │       │   │   │       └── page.tsx
│   │       │   │   ├── profile/
│   │       │   │   │   └── page.tsx
│   │       │   │   ├── dao/
│   │       │   │   │   ├── page.tsx
│   │       │   │   │   └── proposals/
│   │       │   │   │       └── [id]/
│   │       │   │   │           └── page.tsx
│   │       │   │   ├── challenges/
│   │       │   │   │   └── page.tsx
│   │       │   │   └── layout.tsx
│   │       │   ├── api/
│   │       │   │   └── health/
│   │       │   │       └── route.ts
│   │       │   ├── globals.css
│   │       │   ├── layout.tsx
│   │       │   └── page.tsx
│   │       ├── components/
│   │       │   ├── ui/                # shadcn/ui components
│   │       │   │   ├── button.tsx
│   │       │   │   ├── card.tsx
│   │       │   │   ├── dialog.tsx
│   │       │   │   ├── form.tsx
│   │       │   │   ├── input.tsx
│   │       │   │   ├── toast.tsx
│   │       │   │   └── ...
│   │       │   ├── features/
│   │       │   │   ├── validation/
│   │       │   │   │   ├── ValidationCard.tsx
│   │       │   │   │   ├── ValidationCard.test.tsx
│   │       │   │   │   ├── ValidationForm.tsx
│   │       │   │   │   ├── ValidationScoreForm.tsx
│   │       │   │   │   └── ValidationList.tsx
│   │       │   │   ├── wallet/
│   │       │   │   │   ├── WalletConnect.tsx
│   │       │   │   │   ├── WalletBalance.tsx
│   │       │   │   │   └── WalletProvider.tsx
│   │       │   │   ├── dao/
│   │       │   │   │   ├── ProposalCard.tsx
│   │       │   │   │   ├── VoteButton.tsx
│   │       │   │   │   └── TreasuryDashboard.tsx
│   │       │   │   ├── nft/
│   │       │   │   │   ├── BadgeGallery.tsx
│   │       │   │   │   └── BadgeCard.tsx
│   │       │   │   └── challenges/
│   │       │   │       ├── ChallengeCard.tsx
│   │       │   │       └── ChallengeList.tsx
│   │       │   └── layout/
│   │       │       ├── Header.tsx
│   │       │       ├── Footer.tsx
│   │       │       ├── Sidebar.tsx
│   │       │       └── MobileNav.tsx
│   │       ├── lib/
│   │       │   ├── web3auth.ts
│   │       │   ├── socket.ts
│   │       │   ├── api.ts
│   │       │   ├── utils.ts
│   │       │   └── constants.ts
│   │       ├── stores/
│   │       │   ├── wallet.ts
│   │       │   ├── validation.ts
│   │       │   ├── tokens.ts
│   │       │   └── dao.ts
│   │       ├── hooks/
│   │       │   ├── useWallet.ts
│   │       │   ├── useValidation.ts
│   │       │   ├── useSocket.ts
│   │       │   └── useContract.ts
│   │       └── types/
│   │           ├── validation.ts
│   │           ├── wallet.ts
│   │           ├── dao.ts
│   │           └── api.ts
│   └── api/                           # Nest.js Backend
│       ├── .env
│       ├── .env.example
│       ├── .eslintrc.js
│       ├── nest-cli.json
│       ├── tsconfig.json
│       ├── package.json
│       ├── Dockerfile
│       └── src/
│           ├── main.ts
│           ├── app.module.ts
│           ├── auth/
│           │   ├── auth.module.ts
│           │   ├── auth.controller.ts
│           │   ├── auth.service.ts
│           │   ├── auth.service.spec.ts
│           │   ├── strategies/
│           │   │   ├── jwt.strategy.ts
│           │   │   └── wallet.strategy.ts
│           │   └── dto/
│           │       ├── login.dto.ts
│           │       └── verify-signature.dto.ts
│           ├── users/
│           │   ├── users.module.ts
│           │   ├── users.controller.ts
│           │   ├── users.service.ts
│           │   ├── users.service.spec.ts
│           │   ├── entities/
│           │   │   └── user.entity.ts
│           │   └── dto/
│           │       ├── create-user.dto.ts
│           │       └── update-user.dto.ts
│           ├── validations/
│           │   ├── validations.module.ts
│           │   ├── validations.controller.ts
│           │   ├── validations.service.ts
│           │   ├── validations.service.spec.ts
│           │   ├── entities/
│           │   │   ├── validation.entity.ts
│           │   │   └── validation-score.entity.ts
│           │   └── dto/
│           │       ├── create-validation.dto.ts
│           │       └── submit-score.dto.ts
│           ├── tokens/
│           │   ├── tokens.module.ts
│           │   ├── tokens.controller.ts
│           │   ├── tokens.service.ts
│           │   └── tokens.service.spec.ts
│           ├── nfts/
│           │   ├── nfts.module.ts
│           │   ├── nfts.controller.ts
│           │   ├── nfts.service.ts
│           │   └── nfts.service.spec.ts
│           ├── dao/
│           │   ├── dao.module.ts
│           │   ├── dao.controller.ts
│           │   ├── dao.service.ts
│           │   └── dao.service.spec.ts
│           ├── challenges/
│           │   ├── challenges.module.ts
│           │   ├── challenges.controller.ts
│           │   ├── challenges.service.ts
│           │   └── challenges.service.spec.ts
│           ├── websocket/
│           │   ├── websocket.module.ts
│           │   ├── websocket.gateway.ts
│           │   ├── websocket.gateway.spec.ts
│           │   └── events/
│           │       ├── validation.events.ts
│           │       ├── token.events.ts
│           │       └── dao.events.ts
│           ├── blockchain/
│           │   ├── blockchain.module.ts
│           │   ├── blockchain.service.ts
│           │   ├── blockchain.service.spec.ts
│           │   └── listeners/
│           │       ├── token.listener.ts
│           │       ├── validation.listener.ts
│           │       └── nft.listener.ts
│           ├── common/
│           │   ├── decorators/
│           │   │   ├── roles.decorator.ts
│           │   │   └── current-user.decorator.ts
│           │   ├── filters/
│           │   │   └── all-exceptions.filter.ts
│           │   ├── guards/
│           │   │   ├── auth.guard.ts
│           │   │   └── roles.guard.ts
│           │   ├── interceptors/
│           │   │   ├── logging.interceptor.ts
│           │   │   └── transform.interceptor.ts
│           │   ├── pipes/
│           │   │   └── validation.pipe.ts
│           │   └── middleware/
│           │       └── logger.middleware.ts
│           └── config/
│               ├── database.config.ts
│               ├── jwt.config.ts
│               └── blockchain.config.ts
├── packages/
│   ├── contracts/                     # Hardhat Smart Contracts
│   │   ├── .env
│   │   ├── .env.example
│   │   ├── hardhat.config.ts
│   │   ├── tsconfig.json
│   │   ├── package.json
│   │   ├── contracts/
│   │   │   ├── TRKTRKToken.sol
│   │   │   ├── ValidationManager.sol
│   │   │   ├── NFTBadgeFactory.sol
│   │   │   ├── DAOIntegration.sol
│   │   │   ├── TreasuryManager.sol
│   │   │   └── interfaces/
│   │   │       ├── IValidationManager.sol
│   │   │       └── INFTBadgeFactory.sol
│   │   ├── test/
│   │   │   ├── unit/
│   │   │   │   ├── TRKTRKToken.test.ts
│   │   │   │   ├── ValidationManager.test.ts
│   │   │   │   ├── NFTBadgeFactory.test.ts
│   │   │   │   ├── DAOIntegration.test.ts
│   │   │   │   └── TreasuryManager.test.ts
│   │   │   ├── integration/
│   │   │   │   ├── validation-flow.test.ts
│   │   │   │   ├── token-distribution.test.ts
│   │   │   │   └── dao-governance.test.ts
│   │   │   └── fixtures/
│   │   │       └── deploy.ts
│   │   ├── scripts/
│   │   │   ├── deploy.ts
│   │   │   ├── verify.ts
│   │   │   └── upgrade.ts
│   │   └── ignition/
│   │       └── modules/
│   │           └── TrickTrack.ts
│   ├── ui/                            # Shared UI Components
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── components/
│   │   │       └── ...
│   │   └── README.md
│   ├── types/                         # Shared TypeScript Types
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── auth.ts
│   │       ├── validation.ts
│   │       ├── blockchain.ts
│   │       ├── dao.ts
│   │       └── api.ts
│   └── config/                        # Shared Configs
│       ├── eslint-config/
│       │   ├── package.json
│       │   └── index.js
│       ├── tsconfig/
│       │   ├── package.json
│       │   ├── base.json
│       │   ├── nextjs.json
│       │   └── nestjs.json
│       └── tailwind-config/
│           ├── package.json
│           └── index.js
├── e2e/                               # End-to-End Tests
│   ├── playwright.config.ts
│   ├── package.json
│   └── tests/
│       ├── auth.spec.ts
│       ├── validation.spec.ts
│       ├── wallet.spec.ts
│       └── dao.spec.ts
├── docs/                              # Documentation
│   ├── architecture.md
│   ├── api.md
│   ├── deployment.md
│   └── contributing.md
├── .gitignore
├── .nvmrc
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

### Architectural Boundaries

**API Boundaries:**

**External API (Public):**
- `POST /api/v1/auth/login` - Wallet signature authentication
- `POST /api/v1/auth/verify` - JWT token verification
- `GET /api/v1/users/:id` - User profile retrieval
- `POST /api/v1/validations` - Submit validation request
- `POST /api/v1/validations/:id/scores` - Submit validation score
- `GET /api/v1/tokens/balance/:address` - Get token balance
- `GET /api/v1/nfts/:address` - Get user's NFT badges
- `GET /api/v1/dao/proposals` - List DAO proposals
- `POST /api/v1/dao/proposals/:id/vote` - Cast vote on proposal

**Internal Service Boundaries:**
- **Auth Service** ↔ **Users Service**: User verification and profile access
- **Validations Service** ↔ **Blockchain Service**: Token distribution triggers
- **Tokens Service** ↔ **Blockchain Service**: Balance queries and transaction monitoring
- **NFTs Service** ↔ **Blockchain Service**: Badge minting and metadata retrieval
- **DAO Service** ↔ **Blockchain Service**: Proposal creation and vote recording

**WebSocket Boundaries:**
- Client authenticates via JWT on connection
- Room-based subscriptions (user-specific, validation-specific)
- Server-to-client events only (no client-initiated events except connection)

**Component Boundaries:**

**Frontend Component Communication:**

1. **State Management (Zustand):**
   - Components read from stores via hooks
   - Components dispatch actions to update stores
   - No direct component-to-component state sharing

2. **Parent-Child Communication:**
   - Props down, events up pattern
   - Type-safe interfaces for all props
   - No prop drilling beyond 2 levels (use stores instead)

3. **Feature Isolation:**
   - Features communicate via stores, not direct imports
   - Shared UI components in `components/ui/`
   - Feature-specific components in `components/features/{feature}/`

**Service Boundaries:**

**Backend Service Communication:**

1. **Module Dependency Rules:**
   - Common module can be imported by all
   - Feature modules cannot import each other directly
   - Cross-feature communication via events or service injection

2. **Database Access:**
   - Each module owns its database entities
   - Cross-module queries via service methods, not direct DB access
   - Repository pattern for data access layer

3. **Event-Driven Integration:**
   - Blockchain events trigger service actions
   - WebSocket gateway broadcasts service events
   - Async event processing for non-critical operations

**Data Boundaries:**

**Database Schema Ownership:**
- `users` table → Users Module
- `validations`, `validation_scores` → Validations Module
- `token_transactions` → Tokens Module
- `nft_badges` → NFTs Module
- `dao_proposals`, `dao_votes` → DAO Module
- `sponsor_challenges` → Challenges Module

**Caching Strategy:**
- **Frontend:** React Query for API response caching (5-minute TTL)
- **Backend:** Redis for session data and frequently accessed blockchain data
- **Smart Contracts:** Event logs cached in database, refreshed on new blocks

**External Data Integration:**
- **Supabase:** User profiles, validation metadata, social connections
- **AWS S3:** Video files with CloudFront CDN
- **Alchemy/Infura:** Blockchain RPC calls with local caching
- **IPFS/Pinata:** NFT metadata storage

### Requirements to Structure Mapping

**FR1-FR5: User Onboarding & Authentication**
- Frontend: `apps/web/src/app/(auth)/`, `components/features/wallet/`
- Backend: `apps/api/src/auth/`, `apps/api/src/users/`
- Shared: `packages/types/src/auth.ts`
- Library: `apps/web/src/lib/web3auth.ts`

**FR6-FR10: Social Connection & Trust Network**
- Frontend: `apps/web/src/app/(dashboard)/profile/`, `components/features/friends/`
- Backend: `apps/api/src/users/` (friendships management)
- Database: `friendships` table in Supabase

**FR11-FR20: Trick Validation & Scoring**
- Frontend: `apps/web/src/app/(dashboard)/validations/`, `components/features/validation/`
- Backend: `apps/api/src/validations/`
- Smart Contracts: `packages/contracts/contracts/ValidationManager.sol`
- Storage: AWS S3 for video files
- Database: `validations`, `validation_scores` tables

**FR21-FR26: Token Economy & Rewards**
- Frontend: `components/features/wallet/WalletBalance.tsx`
- Backend: `apps/api/src/tokens/`, `apps/api/src/blockchain/`
- Smart Contracts: `packages/contracts/contracts/TRKTRKToken.sol`
- Database: `token_transactions` table

**FR27-FR32: NFT Badge System**
- Frontend: `components/features/nft/BadgeGallery.tsx`
- Backend: `apps/api/src/nfts/`
- Smart Contracts: `packages/contracts/contracts/NFTBadgeFactory.sol`
- Storage: IPFS for metadata
- Database: `nft_badges` table

**FR33-FR39: Sponsor Challenges**
- Frontend: `apps/web/src/app/(dashboard)/challenges/`, `components/features/challenges/`
- Backend: `apps/api/src/challenges/`
- Database: `sponsor_challenges` table

**FR40-FR49: Admin Operations & Fraud Detection**
- Frontend: `apps/web/src/app/(dashboard)/admin/` (admin-only routes)
- Backend: `apps/api/src/admin/` (to be created)
- Middleware: `apps/api/src/common/guards/roles.guard.ts`

**FR50-FR65: Treasury & Blockchain Integration**
- Frontend: `apps/web/src/app/(dashboard)/dao/`, `components/features/dao/`
- Backend: `apps/api/src/dao/`, `apps/api/src/blockchain/`
- Smart Contracts: `packages/contracts/contracts/DAOIntegration.sol`, `TreasuryManager.sol`
- Database: `dao_proposals`, `dao_votes` tables

**Cross-Cutting Concerns:**

**Authentication & Authorization:**
- `apps/web/src/lib/web3auth.ts` - Web3Auth initialization
- `apps/api/src/auth/` - JWT and wallet signature verification
- `apps/api/src/common/guards/` - Route protection
- `packages/types/src/auth.ts` - Shared auth types

**Real-Time Communication:**
- `apps/web/src/lib/socket.ts` - Socket.io client
- `apps/api/src/websocket/` - Socket.io gateway
- Event handlers in respective feature modules

**Error Handling:**
- `apps/web/src/components/ErrorBoundary.tsx` - React error boundary
- `apps/api/src/common/filters/all-exceptions.filter.ts` - Global exception filter
- Standardized error response formats

**Logging & Monitoring:**
- `apps/api/src/common/interceptors/logging.interceptor.ts` - Request/response logging
- `apps/api/src/common/middleware/logger.middleware.ts` - HTTP logging
- Integration with external monitoring (Sentry, Datadog)

### Integration Points

**Internal Communication:**

1. **Frontend → Backend API:**
   - HTTP REST calls via `apps/web/src/lib/api.ts`
   - JWT authentication in headers
   - Type-safe request/response via shared types

2. **Frontend → WebSocket:**
   - Socket.io client connection on app load
   - JWT authentication on connection
   - Event listeners in Zustand stores

3. **Backend → Smart Contracts:**
   - ethers.js v6 via Alchemy/Infura RPC
   - Contract ABIs generated from Hardhat compilation
   - Event listeners for blockchain state changes

4. **Backend → Database:**
   - Supabase client for PostgreSQL access
   - Row-Level Security for authorization
   - Type-safe queries via generated types

**External Integrations:**

1. **Web3Auth:**
   - Frontend: Social login wallet creation
   - Configuration: `apps/web/src/lib/web3auth.ts`
   - API Keys: Environment variables

2. **Alchemy/Infura:**
   - Backend: Blockchain RPC calls
   - Configuration: `apps/api/src/config/blockchain.config.ts`
   - Failover logic in blockchain service

3. **AWS S3:**
   - Backend: Video upload endpoint
   - Frontend: Direct upload with pre-signed URLs
   - CDN: CloudFront for video delivery

4. **Supabase:**
   - Backend: Database client
   - Frontend: Real-time subscriptions (optional)
   - Configuration: Environment variables

5. **IPFS/Pinata:**
   - Backend: NFT metadata upload
   - Smart Contracts: Metadata URI storage
   - Configuration: Pinata API keys

**Data Flow:**

**Validation Request Flow:**
1. User uploads video → Frontend
2. Pre-signed S3 URL request → Backend API
3. Video upload → AWS S3
4. Validation request creation → Backend API → Database
5. Notification to validators → WebSocket
6. Validators submit scores → Backend API → Database
7. Consensus check → Backend
8. Token distribution trigger → Smart Contract
9. Transaction confirmation → Blockchain listener → Backend
10. Balance update notification → WebSocket → Frontend

**Token Distribution Flow:**
1. Validation approved → Backend
2. Smart contract call → ValidationManager.sol
3. Token transfer → TRKTRKToken.sol
4. Event emission → Blockchain
5. Event listener → Backend blockchain service
6. Database update → token_transactions table
7. WebSocket notification → Frontend
8. Zustand store update → UI refresh

### File Organization Patterns

**Configuration Files:**
- **Root Level:** `turbo.json`, `pnpm-workspace.yaml`, `.gitignore`, `.nvmrc`
- **App Level:** Each app has own `package.json`, `tsconfig.json`, `.env.example`
- **Shared Configs:** `packages/config/` for reusable ESLint, TypeScript, Tailwind configs

**Source Organization:**
- **Feature-Based:** Group by domain (validation, wallet, dao) not by type
- **Co-location:** Tests next to implementation files
- **Barrel Exports:** `index.ts` files for clean imports
- **Absolute Imports:** Use `@/` prefix in Next.js, package names in monorepo

**Test Organization:**
- **Frontend:** `*.test.tsx` co-located with components
- **Backend:** `*.spec.ts` co-located with services/controllers
- **Contracts:** Dedicated `test/` directory with unit/integration split
- **E2E:** Root-level `e2e/` directory with Playwright

**Asset Organization:**
- **Static Assets:** `apps/web/public/` for images, icons, manifest
- **Video Files:** AWS S3 with CloudFront CDN (not in repo)
- **NFT Metadata:** IPFS/Pinata (not in repo)
- **Generated Assets:** Build outputs in `.next/`, `dist/`, `artifacts/`

### Development Workflow Integration

**Development Server Structure:**
```bash
# Root level - runs all apps in parallel
pnpm dev

# Individual apps
cd apps/web && pnpm dev      # Next.js on http://localhost:3000
cd apps/api && pnpm dev      # Nest.js on http://localhost:3001
cd packages/contracts && npx hardhat node  # Local blockchain
```

**Build Process Structure:**
```bash
# Turborepo builds all packages in dependency order
pnpm build

# Build outputs:
# - apps/web/.next/          (Next.js production build)
# - apps/api/dist/           (Nest.js compiled JS)
# - packages/contracts/artifacts/  (Compiled contracts + ABIs)
# - packages/*/dist/         (Compiled shared packages)
```

**Deployment Structure:**

**Frontend (Vercel):**
- Root directory: `apps/web/`
- Build command: `cd ../.. && pnpm turbo run build --filter=web`
- Output directory: `apps/web/.next/`
- Environment variables: Web3Auth, API URL, Alchemy key

**Backend (Railway):**
- Root directory: `apps/api/`
- Build command: `cd ../.. && pnpm turbo run build --filter=api`
- Start command: `node dist/main.js`
- Environment variables: Database URL, JWT secret, blockchain RPC

**Smart Contracts (Polygon):**
- Deployment via Hardhat Ignition
- Verification via Etherscan API
- Contract addresses stored in environment variables
- ABIs committed to repo for frontend/backend consumption

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All architectural decisions are fully compatible and work together seamlessly:
- **Technology Stack:** Next.js 15 + Nest.js + Hardhat 3 + Turborepo + pnpm are all production-ready and compatible
- **Version Compatibility:** Web3Auth v10.13.0, Zustand v5.0.10, Socket.io v4.8.3, ethers.js v6 all work together
- **Integration Points:** All chosen technologies have proven integration patterns (Next.js ↔ Nest.js via REST, Nest.js ↔ Hardhat via ethers.js, Frontend ↔ Backend via Socket.io)

**Pattern Consistency:**
Implementation patterns fully support architectural decisions:
- **Naming Conventions:** Consistent across database (snake_case), API (camelCase), and code (PascalCase/camelCase)
- **Structure Patterns:** Feature-based organization aligns with Next.js App Router and Nest.js modules
- **Communication Patterns:** Socket.io event naming (`domain:action`) matches REST API patterns (`/api/v1/domain`)
- **Error Handling:** Unified approach across frontend (ErrorBoundary) and backend (AllExceptionsFilter)

**Structure Alignment:**
Project structure fully supports all architectural decisions:
- **Monorepo Layout:** Turborepo structure enables shared types, configs, and code reuse
- **App Isolation:** Clear boundaries between web (Next.js), api (Nest.js), and contracts (Hardhat)
- **Shared Packages:** Types, UI components, and configs properly shared across apps
- **Integration Points:** All communication flows (REST, WebSocket, Blockchain) have designated locations

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**
All 65 functional requirements are architecturally supported:

- **FR1-FR5 (User Onboarding):** Web3Auth integration + JWT authentication + wallet abstraction layer
- **FR6-FR10 (Social Network):** Supabase friendships table + QR code generation + friend list UI
- **FR11-FR20 (Validation):** ValidationManager.sol + AWS S3 storage + validation scoring UI + consensus logic
- **FR21-FR26 (Token Economy):** TRKTRKToken.sol + blockchain service + real-time balance updates
- **FR27-FR32 (NFT Badges):** NFTBadgeFactory.sol + IPFS metadata + badge gallery UI
- **FR33-FR39 (Sponsor Challenges):** Challenges module + sponsor payment integration
- **FR40-FR49 (Admin & Fraud):** Admin module + fraud detection service + role-based guards
- **FR50-FR65 (DAO & Treasury):** DAOIntegration.sol + TreasuryManager.sol + Aragon integration

**Non-Functional Requirements Coverage:**
All 50 NFRs are addressed:

- **Performance (NFR1-NFR7):** Next.js 15 with Turbopack, Zustand for state, Socket.io for real-time, CDN for assets
- **Security (NFR8-NFR16):** Web3Auth MPC wallets, JWT auth, OpenZeppelin contracts, RLS in Supabase
- **Scalability (NFR17-NFR22):** Turborepo caching, Vercel CDN, Railway auto-scaling, Polygon L2
- **Reliability (NFR23-NFR28):** Alchemy + Infura failover, automated backups, error boundaries
- **Usability (NFR29-NFR35):** PWA support, offline-first, shadcn/ui components, mobile-responsive
- **Compliance (NFR46-NFR50):** GDPR data export/deletion, audit logging, token utility classification

**Cross-Cutting Concerns:**
All identified concerns are architecturally handled:
- **Authentication:** Web3Auth + JWT + wallet signature verification
- **Real-Time:** Socket.io gateway with room-based subscriptions
- **Error Handling:** Global error boundaries + exception filters + standardized responses
- **Logging:** Interceptors + middleware + external monitoring integration
- **Fraud Detection:** Statistical analysis + rate limiting + admin dashboard

### Implementation Readiness Validation ✅

**Decision Completeness:**
- ✅ All critical decisions documented with specific versions (Web3Auth v10.13.0, Zustand v5.0.10, etc.)
- ✅ Technology stack fully specified with rationale for each choice
- ✅ Integration patterns defined for all communication boundaries
- ✅ Deployment strategy documented for each component (Vercel, Railway, Polygon)

**Structure Completeness:**
- ✅ Complete directory tree with all files and folders specified
- ✅ All 65 FRs mapped to specific implementation locations
- ✅ Integration points clearly defined (REST endpoints, WebSocket events, smart contract calls)
- ✅ Component boundaries established with communication rules

**Pattern Completeness:**
- ✅ Naming conventions cover database, API, code, and file naming
- ✅ Structure patterns define organization for all code types
- ✅ Format patterns specify API responses, data exchange, and error handling
- ✅ Communication patterns define events, state management, and service integration
- ✅ Process patterns cover error handling, loading states, and async operations
- ✅ Examples provided for correct usage and anti-patterns to avoid

### Gap Analysis Results

**No Critical Gaps Identified** ✅

**Minor Enhancement Opportunities (Post-MVP):**
- Advanced fraud detection ML models (can use rule-based initially)
- Multi-region deployment strategy (single region sufficient for MVP)
- Advanced analytics and observability (basic monitoring sufficient initially)
- Redis caching layer (can add when performance requires)

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed (65 FRs, 50 NFRs, 10 cross-cutting concerns)
- [x] Scale and complexity assessed (High complexity, 15+ components)
- [x] Technical constraints identified (Polygon, Web3, PWA, GDPR)
- [x] Cross-cutting concerns mapped (Auth, real-time, fraud, compliance)

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions (5 major decisions)
- [x] Technology stack fully specified (Next.js, Nest.js, Hardhat, Turborepo)
- [x] Integration patterns defined (REST, WebSocket, Blockchain)
- [x] Performance considerations addressed (NFR1-NFR7 coverage)

**✅ Implementation Patterns**
- [x] Naming conventions established (database, API, code)
- [x] Structure patterns defined (monorepo, feature-based)
- [x] Communication patterns specified (events, state, services)
- [x] Process patterns documented (errors, loading, async)

**✅ Project Structure**
- [x] Complete directory structure defined (complete monorepo layout)
- [x] Component boundaries established (apps, packages, shared)
- [x] Integration points mapped (internal and external)
- [x] Requirements to structure mapping complete (all 65 FRs)

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION ✅

**Confidence Level:** HIGH

**Key Strengths:**
1. **Comprehensive Technology Stack:** Modern, production-ready technologies with proven track records
2. **Type Safety Throughout:** TypeScript across frontend, backend, and shared packages
3. **Clear Boundaries:** Well-defined separation between apps, packages, and services
4. **Monorepo Benefits:** Code sharing, unified tooling, efficient builds with Turborepo
5. **Web3 Best Practices:** OpenZeppelin contracts, MPC wallets, L2 scaling
6. **Developer Experience:** Hot reload, type generation, automated testing, CI/CD ready

**Areas for Future Enhancement:**
1. **Performance Optimization:** Add Redis caching when traffic increases
2. **Advanced Monitoring:** Implement detailed observability stack (Datadog, Sentry)
3. **Multi-Region:** Deploy to multiple regions for global users
4. **Advanced Fraud Detection:** Implement ML-based pattern recognition
5. **Mobile Native Apps:** Consider React Native apps for better mobile UX

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions
- Maintain type safety - no `any` types without documentation
- Test coverage minimum 80% for business logic
- Document any deviations from patterns in code comments

**First Implementation Priority:**
```bash
# Initialize Turborepo monorepo
mkdir tricktrack && cd tricktrack
pnpm init
pnpm add -D turbo

# Configure workspace (create pnpm-workspace.yaml and update package.json)
# Initialize Next.js app in apps/web/
# Initialize Nest.js app in apps/api/
# Initialize Hardhat in packages/contracts/
# Create shared packages (types, ui, config)
```

**Development Sequence:**
1. **Phase 1: Foundation (Week 1-2)** - Initialize monorepo, set up Hardhat, configure Supabase, implement Web3Auth
2. **Phase 2: Core Features (Week 3-6)** - Build validation flow, implement token distribution, set up Socket.io
3. **Phase 3: Advanced Features (Week 7-10)** - NFT badges, DAO governance, sponsor challenges, admin dashboard
4. **Phase 4: Production Readiness (Week 11-12)** - Security audit, performance optimization, GDPR compliance

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2026-01-15
**Document Location:** `c:\Users\thoma\OneDrive\Documents\Projects\tricktrack\_bmad-output\planning-artifacts\architecture.md`

### Final Architecture Deliverables

**📋 Complete Architecture Document**

- All architectural decisions documented with specific versions
- Implementation patterns ensuring AI agent consistency
- Complete project structure with all files and directories
- Requirements to architecture mapping
- Validation confirming coherence and completeness

**🏗️ Implementation Ready Foundation**

- 5 major architectural decisions made (Web3Auth, Zustand, Socket.io, Alchemy, Hardhat+Chai)
- 8 implementation pattern categories defined
- 15+ architectural components specified
- 65 functional requirements + 50 non-functional requirements fully supported

**📚 AI Agent Implementation Guide**

- Technology stack with verified versions
- Consistency rules that prevent implementation conflicts
- Project structure with clear boundaries
- Integration patterns and communication standards

### Quality Assurance Checklist

**✅ Architecture Coherence**
- [x] All decisions work together without conflicts
- [x] Technology choices are compatible
- [x] Patterns support the architectural decisions
- [x] Structure aligns with all choices

**✅ Requirements Coverage**
- [x] All functional requirements are supported
- [x] All non-functional requirements are addressed
- [x] Cross-cutting concerns are handled
- [x] Integration points are defined

**✅ Implementation Readiness**
- [x] Decisions are specific and actionable
- [x] Patterns prevent agent conflicts
- [x] Structure is complete and unambiguous
- [x] Examples are provided for clarity

### Project Success Factors

**🎯 Clear Decision Framework**
Every technology choice was made collaboratively with clear rationale, ensuring all stakeholders understand the architectural direction.

**🔧 Consistency Guarantee**
Implementation patterns and rules ensure that multiple AI agents will produce compatible, consistent code that works together seamlessly.

**📋 Complete Coverage**
All project requirements are architecturally supported, with clear mapping from business needs to technical implementation.

**🏗️ Solid Foundation**
The chosen Turborepo monorepo and architectural patterns provide a production-ready foundation following current best practices.

---

**Architecture Status:** READY FOR IMPLEMENTATION ✅

**Next Phase:** Begin implementation using the architectural decisions and patterns documented herein.

**Document Maintenance:** Update this architecture when major technical decisions are made during implementation.

