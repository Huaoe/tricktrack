# 🛹 TrickTrack

> **Decentralized skateboarding validation platform powered by peer-to-peer trust and blockchain rewards**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with BMAD](https://img.shields.io/badge/Built%20with-BMAD-blue)](https://bmad.ai)
[![Polygon](https://img.shields.io/badge/Blockchain-Polygon-8247E5)](https://polygon.technology/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js)](https://nextjs.org/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Development Workflow](#-development-workflow)
- [Getting Started](#-getting-started)
- [BMAD + Ralph Wiggum](#-bmad--ralph-wiggum)
- [Time Tracking](#-time-tracking)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**TrickTrack** is a Web3 Progressive Web Application that revolutionizes skateboarding skill validation through peer-to-peer trust networks. Skaters film tricks, request validation from friends, and earn TRKTRK tokens and NFT badges based on consensus scoring.

### Key Features

- 🔐 **Wallet Integration**: In-app wallet creation (<30s) or external wallet connection (MetaMask, WalletConnect)
- 👥 **Trust Network**: QR code-based friend connections for mutual validation rights
- 🎥 **Video Validation**: Upload tricks, get scored by 3+ friends across 3 criteria (Clean Landing 50%, Style 30%, Difficulty 20%)
- 🪙 **Token Rewards**: Earn TRKTRK tokens (10-100 per trick) via smart contract distribution
- 🏆 **NFT Badges**: Auto-minted achievement badges (Bronze/Silver/Gold) on milestones
- 🎯 **Sponsor Challenges**: Participate in brand-sponsored challenges for bonus rewards
- 🏛️ **DAO Governance**: Aragon DAO treasury with token-weighted voting

### Project Status

| Epic | Status | Stories Complete | Progress |
|------|--------|------------------|----------|
| **Epic 1**: Foundation & Monorepo | 🟡 In Progress | 6/8 | ████████░░ 75% |
| **Epic 2**: Wallet & Auth | ⚪ Backlog | 0/6 | ░░░░░░░░░░ 0% |
| **Epic 3**: Friend Network | ⚪ Backlog | 0/5 | ░░░░░░░░░░ 0% |
| **Epic 4**: Smart Contracts | ⚪ Backlog | 0/11 | ░░░░░░░░░░ 0% |
| **Epic 5**: Validation System | ⚪ Backlog | 0/10 | ░░░░░░░░░░ 0% |
| **Epic 6**: Token Rewards | ⚪ Backlog | 0/6 | ░░░░░░░░░░ 0% |
| **Epic 7**: NFT Badges | ⚪ Backlog | 0/6 | ░░░░░░░░░░ 0% |
| **Epic 8**: Sponsor Challenges | ⚪ Backlog | 0/7 | ░░░░░░░░░░ 0% |
| **Epic 9**: DAO Treasury | ⚪ Backlog | 0/5 | ░░░░░░░░░░ 0% |
| **Epic 10**: Admin & Fraud | ⚪ Backlog | 0/10 | ░░░░░░░░░░ 0% |
| **Epic 11**: Compliance | ⚪ Backlog | 0/5 | ░░░░░░░░░░ 0% |

**Overall Progress**: 6/79 stories complete (7.6%)

---

## 🏗️ Architecture

TrickTrack follows a **monorepo architecture** using Turborepo with pnpm workspaces, enabling efficient code sharing and parallel development.

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (PWA)                         │
│  Next.js 15 + React + TypeScript + shadcn/ui + Tailwind   │
│              Deployed on Vercel                             │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API                              │
│         Nest.js + TypeScript + Supabase                    │
│              Deployed on Railway                            │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                 Blockchain Layer                            │
│  Smart Contracts (Solidity) on Polygon Mainnet            │
│  • TRKTRKToken.sol (ERC-20)                               │
│  • ValidationManager.sol (Validation + Rewards)            │
│  • NFTBadgeFactory.sol (ERC-721)                          │
│  • DAOIntegration.sol (Aragon Interface)                   │
│  • TreasuryManager.sol (Multi-sig Treasury)                │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Infrastructure & Services                      │
│  • Alchemy/Infura (RPC Providers)                          │
│  • The Graph (Blockchain Indexing)                         │
│  • AWS S3 + CloudFront (Video Storage/CDN)                 │
│  • IPFS/Arweave (NFT Metadata)                             │
│  • Supabase (Off-chain Database)                           │
│  • Datadog (Monitoring)                                     │
└─────────────────────────────────────────────────────────────┘
```

### Design Principles

- **Mobile-First PWA**: Optimized for 4G networks, 4.7"-6.7" screens
- **Optimistic UI**: Hide blockchain latency with instant feedback
- **Gas Optimization**: Batch processing (10-50 validations/tx) to keep costs <$0.01
- **Security-First**: AES-256 encryption, TLS 1.3, smart contract audits
- **Scalability**: Support 10x growth (500→5,000 wallets) with <10% degradation

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router) + React 19
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS + shadcn/ui components
- **Web3**: Web3Auth (in-app wallets), Web3Modal (external wallets)
- **State**: React Query + Zustand
- **Blockchain**: ethers.js v6 / viem

### Backend
- **Framework**: Nest.js
- **Database**: Supabase (PostgreSQL)
- **Storage**: AWS S3 + CloudFront CDN
- **Auth**: JWT + Web3 signature verification

### Blockchain
- **Network**: Polygon (Mumbai testnet → Mainnet)
- **Language**: Solidity 0.8.x
- **Framework**: Hardhat + Hardhat Ignition
- **Libraries**: OpenZeppelin (upgradeable contracts)
- **Indexing**: The Graph
- **RPC**: Alchemy + Infura (failover)

### DevOps
- **Monorepo**: Turborepo + pnpm workspaces
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (frontend), Railway (backend)
- **Monitoring**: Datadog, Sentry
- **Testing**: Vitest, Playwright, Hardhat

---

## 📁 Project Structure

```
tricktrack/
├── apps/
│   ├── web/                    # Next.js 15 PWA (frontend)
│   │   ├── app/               # App Router pages
│   │   ├── components/        # React components
│   │   ├── lib/              # Utilities & hooks
│   │   └── public/           # Static assets
│   └── api/                   # Nest.js backend
│       ├── src/
│       │   ├── modules/      # Feature modules
│       │   ├── common/       # Shared utilities
│       │   └── main.ts       # Entry point
│       └── test/             # E2E tests
├── packages/
│   ├── contracts/            # Hardhat smart contracts
│   │   ├── contracts/       # Solidity files
│   │   ├── test/            # Contract tests
│   │   ├── scripts/         # Deployment scripts
│   │   └── hardhat.config.ts
│   ├── types/               # Shared TypeScript types
│   ├── ui/                  # shadcn/ui components
│   └── config/              # Shared configs (ESLint, TS, Tailwind)
├── _bmad/                   # BMAD workflow system
│   ├── bmm/                # Business Management Module
│   │   ├── agents/         # AI agent personas
│   │   └── workflows/      # Development workflows
│   └── core/               # Core BMAD engine
├── _bmad-output/           # Generated artifacts
│   ├── planning-artifacts/  # PRD, architecture, epics
│   └── implementation-artifacts/  # Stories, sprint status
├── docs/                   # Documentation
├── ralph.sh               # Ralph Wiggum autonomous dev script
├── progress.txt           # Development progress log
├── turbo.json            # Turborepo config
├── pnpm-workspace.yaml   # pnpm workspace config
└── package.json          # Root package.json
```

---

## 🔄 Development Workflow

TrickTrack uses **BMAD (Business-Managed Agile Development)** methodology for systematic, story-driven development.

### BMAD Workflow Overview

```
┌──────────────┐
│  Epic File   │  ← High-level feature grouping
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Create Story │  ← SM breaks epic into implementable stories
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Dev Story   │  ← Dev implements using red-green-refactor
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Code Review  │  ← AI code review (fresh context, different LLM)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│     Done     │  ← Story merged, epic progresses
└──────────────┘
```

### Story Lifecycle

1. **Backlog**: Story exists in epic file only
2. **Ready-for-dev**: Story file created with tasks/subtasks
3. **In-progress**: Developer actively implementing
4. **Review**: Code complete, awaiting review
5. **Done**: Reviewed, tested, merged

### Red-Green-Refactor Cycle

For each task/subtask:
1. **🔴 RED**: Write failing tests first
2. **🟢 GREEN**: Implement minimal code to pass tests
3. **🔵 REFACTOR**: Improve code while keeping tests green
4. **✅ VALIDATE**: Run full test suite (no regressions)
5. **📝 MARK COMPLETE**: Update story file `[ ] → [x]`

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.x or higher
- **pnpm**: v10.22.0 or higher
- **Docker**: For Ralph Wiggum autonomous development
- **Git**: For version control

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tricktrack.git
cd tricktrack

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development servers (all apps)
pnpm dev

# Run specific app
pnpm dev --filter=web    # Frontend only
pnpm dev --filter=api    # Backend only
```

### Environment Variables

Create `.env.local` in the root:

```bash
# Anthropic API (for Ralph Wiggum)
ANTHROPIC_API_KEY=sk-ant-api03-...

# Blockchain
ALCHEMY_API_KEY=your_alchemy_key
INFURA_API_KEY=your_infura_key
POLYGON_PRIVATE_KEY=your_deployer_private_key

# Backend
DATABASE_URL=your_supabase_url
JWT_SECRET=your_jwt_secret

# Storage
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=tricktrack-videos
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm test --filter=contracts  # Smart contract tests
pnpm test --filter=web        # Frontend tests
pnpm test --filter=api        # Backend tests

# Run E2E tests
pnpm test:e2e
```

---

## 🤖 BMAD + Ralph Wiggum

**Ralph Wiggum** is an autonomous development script that uses Claude Code + BMAD methodology to implement stories automatically.

### How Ralph Works

Ralph runs Claude Code in an isolated Docker container with access only to this repository. It:

1. **Reads sprint-status.yaml** to find ready-for-dev stories
2. **Loads story files** with tasks/subtasks
3. **Implements each task** using red-green-refactor cycle
4. **Runs tests** after each task (no regressions allowed)
5. **Updates story files** marking tasks complete `[x]`
6. **Makes git commits** per task
7. **Moves to next story** when current story complete

### Using Ralph

```bash
# Process all epics (max 10 iterations each)
./ralph.sh 10

# Process only Epic 1 (Foundation)
./ralph.sh 20 1

# Process Epics 1, 2, and 3
./ralph.sh 15 1 2 3

# Process Epic range 4-6
./ralph.sh 25 4-6
```

### Ralph Configuration

Ralph uses:
- **Container**: Persistent Docker container (`ralph-claude-dev`)
- **API**: Anthropic Claude API (set `ANTHROPIC_API_KEY`)
- **Context**: Full repository access at `/workspace`
- **Isolation**: No access to files outside repository
- **Resources**: 2 CPUs, 4GB RAM, 200 process limit

### Epic-by-Epic Development Strategy

**Recommended approach**:

```bash
# Phase 1: Foundation (Epic 1)
./ralph.sh 20 1

# Phase 2: Core Features (Epics 2-5)
./ralph.sh 30 2-5

# Phase 3: Advanced Features (Epics 6-8)
./ralph.sh 25 6-8

# Phase 4: Governance & Admin (Epics 9-11)
./ralph.sh 20 9-11
```

### Manual BMAD Workflows

If you prefer manual control:

```bash
# Create next story from epic
/create-story

# Develop a story
/dev-story

# Code review (use different LLM)
/code-review

# Sprint status
/sprint-status
```

---

## ⏱️ Time Tracking

### Development Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Total Stories** | 79 | 6 complete | 🟡 7.6% |
| **Epics Complete** | 11 | 0 | 🔴 0% |
| **Test Coverage** | >80% | TBD | ⚪ Not started |
| **Sprint Velocity** | 8-10 stories/week | TBD | ⚪ Measuring |

### Time Estimates

Based on BMAD story complexity analysis:

| Epic | Stories | Est. Hours | Est. Days (8h/day) |
|------|---------|------------|-------------------|
| Epic 1: Foundation | 8 | 40-60h | 5-8 days |
| Epic 2: Wallet & Auth | 6 | 48-72h | 6-9 days |
| Epic 3: Friend Network | 5 | 30-45h | 4-6 days |
| Epic 4: Smart Contracts | 11 | 88-132h | 11-17 days |
| Epic 5: Validation System | 10 | 80-120h | 10-15 days |
| Epic 6: Token Rewards | 6 | 36-54h | 5-7 days |
| Epic 7: NFT Badges | 6 | 36-54h | 5-7 days |
| Epic 8: Sponsor Challenges | 7 | 42-63h | 5-8 days |
| Epic 9: DAO Treasury | 5 | 40-60h | 5-8 days |
| Epic 10: Admin & Fraud | 10 | 60-90h | 8-11 days |
| Epic 11: Compliance | 5 | 30-45h | 4-6 days |
| **TOTAL** | **79** | **530-795h** | **68-102 days** |

**Estimated completion**: 3-4 months (solo dev) or 1-2 months (with Ralph automation)

### Progress Tracking

Track progress in:
- **`_bmad-output/implementation-artifacts/sprint-status.yaml`**: Story states
- **`progress.txt`**: Session-by-session progress log
- **Git commits**: Atomic commits per task

### Velocity Tracking

```bash
# View current sprint status
cat _bmad-output/implementation-artifacts/sprint-status.yaml

# View progress log
tail -n 50 progress.txt

# Git activity
git log --oneline --since="1 week ago"
```

---

## 🤝 Contributing

### Development Guidelines

1. **Follow BMAD methodology**: All changes must be story-driven
2. **Red-Green-Refactor**: Write tests first, then implementation
3. **No direct main commits**: All changes via story branches
4. **Code review required**: Use `/code-review` workflow
5. **Update story files**: Mark tasks complete `[x]` as you go

### Code Style

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint + Prettier (auto-format on save)
- **Naming**: Descriptive names, camelCase for variables, PascalCase for components
- **Comments**: Only for complex logic (code should be self-documenting)

### Git Workflow

```bash
# Create story branch
git checkout -b story/1-7-configure-eslint

# Make changes, commit per task
git commit -m "[1-7] Complete task 1: Set up ESLint base config"

# Push and create PR
git push origin story/1-7-configure-eslint
```

### Testing Requirements

- **Unit tests**: All business logic and utilities
- **Integration tests**: Component interactions
- **E2E tests**: Critical user flows
- **Smart contract tests**: 100% coverage for contracts
- **No regressions**: All existing tests must pass

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

### Documentation
- **Deployment Guide**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **Environment Variables**: [docs/ENVIRONMENT_VARIABLES.md](docs/ENVIRONMENT_VARIABLES.md)
- **Domain Configuration**: [docs/DOMAIN_CONFIGURATION.md](docs/DOMAIN_CONFIGURATION.md)
- **Monitoring**: [docs/MONITORING.md](docs/MONITORING.md)
- **Troubleshooting**: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

### Project Artifacts
- **Architecture**: [_bmad-output/planning-artifacts/architecture.md](_bmad-output/planning-artifacts/architecture.md)
- **PRD**: [_bmad-output/planning-artifacts/prd.md](_bmad-output/planning-artifacts/prd.md)
- **Sprint Status**: [_bmad-output/implementation-artifacts/sprint-status.yaml](_bmad-output/implementation-artifacts/sprint-status.yaml)

### Smart Contracts
- **Contract Deployment**: [packages/contracts/scripts/DEPLOYMENT.md](packages/contracts/scripts/DEPLOYMENT.md)

---

## 📞 Support

For questions or issues:
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/tricktrack/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/tricktrack/discussions)

---

**Built with ❤️ using BMAD methodology and autonomous AI development**

*Last updated: 2026-01-16*
