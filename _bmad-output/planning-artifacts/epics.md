---
stepsCompleted: [1, 2]
inputDocuments: ['c:\\Users\\thoma\\OneDrive\\Documents\\Projects\\tricktrack\\_bmad-output\\planning-artifacts\\prd.md', 'c:\\Users\\thoma\\OneDrive\\Documents\\Projects\\tricktrack\\_bmad-output\\planning-artifacts\\architecture.md', 'c:\\Users\\thoma\\OneDrive\\Documents\\Projects\\tricktrack\\_bmad-output\\planning-artifacts\\ux-design-specification.md']
---

# tricktrack - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for tricktrack, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**User Onboarding & Authentication (FR1-FR5):**
- FR1: Users can create an in-app wallet in under 30 seconds without requiring email or KYC
- FR2: Users can connect external wallets (MetaMask, WalletConnect, hardware wallets)
- FR3: Users can recover wallet access via social recovery or email backup
- FR4: Users can view their wallet address and copy it to clipboard
- FR5: Users can export their private key or seed phrase securely

**Social Connection & Trust Network (FR6-FR10):**
- FR6: Users can generate a QR code for friend connection
- FR7: Users can scan another user's QR code to establish mutual validation rights
- FR8: Users can view their list of connected friends
- FR9: Users can remove friends from their validation network
- FR10: Users can see friend connection status (pending, active, removed)

**Trick Validation & Scoring (FR11-FR20):**
- FR11: Users can upload video recordings of skateboarding tricks to the platform
- FR12: Users can select the trick type from a predefined list before requesting validation
- FR13: Users can request validation from 3 or more connected friends
- FR14: Validators can view validation requests from their friends
- FR15: Validators can score trick attempts across three criteria: Clean Landing (50%), Style (30%), Difficulty (20%)
- FR16: Validators can provide text feedback on trick attempts
- FR17: Users can view real-time validation progress and individual validator scores
- FR18: Users can retry failed validations with no penalty
- FR19: System can aggregate validator scores and determine consensus (90% threshold)
- FR20: System can distribute base trick rewards when validation succeeds

**Token Economy & Rewards (FR21-FR26):**
- FR21: Users can view their TRKTRK token balance in real-time
- FR22: Users can view their transaction history with timestamps and amounts
- FR23: System can distribute tokens based on trick difficulty tier (Beginner: 10, Intermediate: 25, Advanced: 50, Expert: 100)
- FR24: Validators can earn bonus tokens (5 TRKTRK) for each filmed validation
- FR25: Users can view pending token distributions before validation completes
- FR26: System can process token distributions via smart contract on validation success

**NFT Badge System (FR27-FR32):**
- FR27: Users can earn NFT badges automatically on achievement milestones
- FR28: Users can view their badge collection in a gallery
- FR29: Users can see badge metadata (name, description, unlock criteria, mint date)
- FR30: System can mint tiered badges (Bronze: first trick, Silver: 10 tricks, Gold: 50 tricks)
- FR31: Users can share badge achievements to social media
- FR32: Users can verify badge authenticity on-chain via blockchain explorer

**Sponsor Challenges (FR33-FR39):**
- FR33: Users can discover active sponsor challenges in the app feed
- FR34: Users can view challenge details (reward amount, duration, requirements, sponsor info)
- FR35: Users can join sponsor challenges and submit trick attempts
- FR36: System can distribute challenge rewards in addition to base trick rewards
- FR37: Users can earn custom sponsor NFT badges on challenge completion
- FR38: Users can view challenge participation status and remaining time
- FR39: System can automatically end challenges when max participants reached or time expires

**Admin Operations & Fraud Detection (FR40-FR49):**
- FR40: Admins can view fraud detection dashboard with validator score patterns
- FR41: Admins can flag suspicious accounts for manual review
- FR42: Admins can freeze or suspend user accounts
- FR43: Admins can unfreeze accounts after investigation
- FR44: Admins can view anomaly alerts for statistical outliers
- FR45: Admins can manually create sponsor challenges via backoffice panel
- FR46: Admins can transfer tokens from treasury to sponsor wallets
- FR47: Admins can view gas cost monitoring and batch processing metrics
- FR48: Admins can trigger emergency pause on smart contracts
- FR49: Admins can view platform-wide analytics (users, validations, tokens distributed)

**Treasury & Token Management (FR50-FR54):**
- FR50: System can manage DAO treasury wallet with multi-sig controls
- FR51: Admins can approve token transfers from treasury
- FR52: System can track token allocation across pools (user rewards, sponsor challenges, treasury reserve)
- FR53: System can enforce vesting schedules for team/advisor tokens
- FR54: Admins can view treasury balance and transaction history

**Blockchain Integration (FR55-FR60):**
- FR55: System can deploy and interact with smart contracts on Polygon network
- FR56: System can batch process multiple validations to optimize gas costs
- FR57: System can monitor gas prices and adjust transaction timing
- FR58: System can handle RPC provider failover on infrastructure issues
- FR59: System can queue transactions during network congestion
- FR60: System can verify on-chain transaction status and confirmations

**Compliance & Security (FR61-FR65):**
- FR61: System can track user consent for data processing (GDPR)
- FR62: System can provide data export functionality for user data requests
- FR63: System can delete user data on account deletion requests
- FR64: Admins can access audit logs for all administrative actions
- FR65: System can enforce rate limiting on validation requests and wallet creation

### NonFunctional Requirements

**Performance (NFR1-NFR7):**
- NFR1: Video upload completes within 30 seconds for files up to 100MB on 4G mobile networks
- NFR2: Validation request submission completes within 2 seconds
- NFR3: Real-time validation score updates appear within 5 seconds of validator submission
- NFR4: Token balance updates reflect within 30 seconds of blockchain transaction confirmation
- NFR5: App initial load time under 3 seconds on 4G networks
- NFR6: Blockchain transaction confirmation (Polygon) completes within 2 minutes under normal network conditions
- NFR7: Admin dashboard analytics queries complete within 5 seconds for datasets up to 100k records

**Security (NFR8-NFR16):**
- NFR8: All user wallet private keys encrypted at rest using AES-256 encryption
- NFR9: All API communications use TLS 1.3 or higher
- NFR10: Smart contracts pass security audit with zero critical or high-severity vulnerabilities
- NFR11: Multi-sig treasury requires 2-of-3 signatures for token transfers exceeding 10,000 TRKTRK
- NFR12: User sessions expire after 30 days of inactivity
- NFR13: Admin accounts require multi-factor authentication
- NFR14: Video uploads scanned for malware before storage
- NFR15: Rate limiting enforces max 10 validation requests per user per day
- NFR16: Failed authentication attempts trigger account lockout after 5 consecutive failures

**Scalability (NFR17-NFR22):**
- NFR17: System supports 10x user growth (500 → 5,000 wallets) with less than 10% performance degradation
- NFR18: Database queries maintain sub-second response times with up to 1 million validation records
- NFR19: Video storage infrastructure scales to 10TB without manual intervention
- NFR20: Smart contract gas costs remain under $0.01 per validation at 10x transaction volume
- NFR21: RPC provider infrastructure handles 1,000 concurrent blockchain transactions
- NFR22: CDN delivers video content with 99.9% availability globally

**Reliability (NFR23-NFR28):**
- NFR23: Platform maintains 99.5% uptime (excluding planned maintenance)
- NFR24: Blockchain transaction success rate exceeds 99% (excluding user-caused failures)
- NFR25: Token distribution accuracy is 100% (no double-spending or missed rewards)
- NFR26: Automated backup of off-chain data (user profiles, videos) every 24 hours
- NFR27: RPC provider failover activates within 10 seconds of primary provider failure
- NFR28: Smart contract emergency pause activates within 5 minutes of critical vulnerability detection

**Usability (NFR29-NFR35):**
- NFR29: New users complete wallet creation in under 30 seconds without external documentation
- NFR30: Validation scoring interface requires no more than 3 taps/clicks per validation
- NFR31: App supports offline video recording with automatic upload when connection restored
- NFR32: Error messages provide clear, non-technical explanations and recovery steps
- NFR33: App supports mobile devices with screen sizes from 4.7" to 6.7"
- NFR34: Wallet recovery process completes in under 2 minutes with social recovery or email backup
- NFR35: App supports English language at launch (Spanish, Portuguese in Phase 2)

**Accessibility (NFR36-NFR39):**
- NFR36: App meets WCAG 2.1 Level AA standards for visual contrast and text sizing
- NFR37: All interactive elements support screen reader navigation
- NFR38: Video playback includes closed caption support for validator feedback
- NFR39: App supports device accessibility features (VoiceOver, TalkBack, font scaling)

**Integration & Interoperability (NFR40-NFR45):**
- NFR40: Polygon RPC provider failover supports Alchemy, Infura, and self-hosted nodes
- NFR41: Smart contracts compatible with standard ERC-20 and ERC-721 wallets
- NFR42: Video storage supports AWS S3 with fallback to alternative cloud providers
- NFR43: Database (Supabase) supports data export in JSON and CSV formats
- NFR44: API endpoints support RESTful standards with OpenAPI documentation
- NFR45: Blockchain events indexed by The Graph with 99% uptime SLA

**Compliance & Data Privacy (NFR46-NFR50):**
- NFR46: Platform complies with GDPR for EU users (data export, deletion, consent tracking)
- NFR47: User data deletion requests processed within 30 days
- NFR48: Off-chain data storage complies with data residency requirements (EU data in EU servers)
- NFR49: Audit logs retain all administrative actions for 12 months
- NFR50: Token utility classification complies with Howey Test (not a security)

### Additional Requirements

**From Architecture Document:**

**Starter Template & Monorepo Setup:**
- Turborepo + pnpm workspaces monorepo structure
- Next.js 15 PWA (frontend) in `apps/web/`
- Nest.js backend in `apps/api/`
- Hardhat smart contracts in `packages/contracts/`
- Shared TypeScript types in `packages/types/`
- shadcn/ui components in `packages/ui/`
- Shared configs (ESLint, TypeScript, Tailwind) in `packages/config/`

**Smart Contract Architecture:**
- 5 core smart contracts: TRKTRKToken.sol, ValidationManager.sol, NFTBadgeFactory.sol, DAOIntegration.sol, TreasuryManager.sol
- Transparent proxy pattern for upgradeability (ValidationManager, NFTBadgeFactory)
- OpenZeppelin security patterns (ReentrancyGuard, AccessControl, Pausable)
- Event emission for historical data (avoid expensive storage)
- Batch processing support (10-50 validations per transaction)

**Blockchain Infrastructure:**
- Polygon mainnet deployment (Mumbai testnet for staging)
- Alchemy + Infura RPC providers with automatic failover
- The Graph for blockchain event indexing
- Gas optimization: target < $0.01 per validation
- Transaction queue manager with intelligent batching

**Web3 Integration:**
- Web3Auth or Magic for in-app wallet creation
- Web3Modal for external wallet connection (MetaMask, WalletConnect)
- ethers.js v6 or viem for blockchain interactions
- ECDSA-signed QR codes for friend connections
- Optimistic UI updates (hide blockchain latency)

**DAO & Governance:**
- Aragon DAO on Polygon as treasury holder
- Token-weighted voting (1 TRKTRK = 1 vote)
- Multi-sig controls (2-of-3 for > 10,000 TRKTRK transfers)
- Transparent treasury dashboard

**Storage & CDN:**
- AWS S3 for video storage with CloudFront CDN
- IPFS/Arweave for NFT metadata (Pinata for pinning)
- Supabase for off-chain data (user mappings, friend connections, validation metadata)

**Payment Processing:**
- Stripe integration for sponsor fiat payments
- Fiat-to-crypto on-ramp (Stripe → DAO treasury → sponsor wallet)

**Monitoring & Observability:**
- Datadog or similar for metrics and logging
- Sentry for error tracking
- Custom admin dashboard for fraud detection
- Gas cost tracking and alerting
- Transaction success rate monitoring

**Deployment Infrastructure:**
- Frontend: Vercel (Next.js PWA)
- Backend: Railway (Nest.js API)
- Smart Contracts: Polygon mainnet via Hardhat Ignition
- Environment variables management for Web3Auth, Alchemy, database URLs

**From UX Design Document:**

**Responsive Design:**
- Mobile-first PWA (primary device: smartphones on 4G)
- Tailwind CSS responsive utilities (`sm:`, `md:`, `lg:`)
- Touch targets minimum 44px × 44px for mobile accessibility
- Support for screen sizes 4.7" to 6.7"

**Animation & Feedback:**
- Token reward celebration animation (coin flip with confetti)
- NFT badge mint animation (fade-in + scale-up with glow)
- Validation success celebration with haptic feedback
- Loading states with skeleton screens and shimmer effects
- Optimistic UI for instant gratification

**Accessibility:**
- WCAG 2.1 Level AA compliance
- ARIA-compliant components with keyboard navigation
- Screen reader support for all core flows
- Color contrast ratios meet accessibility guidelines
- Closed caption support for video playback

**Offline Support:**
- Service worker with IndexedDB for offline storage
- Draft validation requests offline, auto-submit when online
- Cached validation history for offline viewing
- Intelligent sync prioritization

**Real-Time Features:**
- WebSocket connections for live validation updates
- Push notifications via Firebase Cloud Messaging
- Real-time score aggregation display
- Background transaction confirmation tracking

**UI Component Library:**
- shadcn/ui components (copy-paste, not npm dependencies)
- Custom components: QR scanner, token reward animation, NFT badge display, validation scoring interface
- Tailwind CSS utility-first styling
- TypeScript support with full type safety

### FR Coverage Map

**User Onboarding & Authentication:**
- FR1 → Epic 2: In-app wallet creation (< 30 seconds, no email/KYC)
- FR2 → Epic 2: External wallet connection (MetaMask, WalletConnect, hardware wallets)
- FR3 → Epic 2: Wallet recovery via social recovery or email backup
- FR4 → Epic 2: View and copy wallet address
- FR5 → Epic 2: Export private key or seed phrase securely

**Social Connection & Trust Network:**
- FR6 → Epic 3: Generate QR code for friend connection
- FR7 → Epic 3: Scan QR code to establish mutual validation rights
- FR8 → Epic 3: View list of connected friends
- FR9 → Epic 3: Remove friends from validation network
- FR10 → Epic 3: See friend connection status (pending, active, removed)

**Trick Validation & Scoring:**
- FR11 → Epic 5: Upload video recordings of skateboarding tricks
- FR12 → Epic 5: Select trick type from predefined list
- FR13 → Epic 5: Request validation from 3+ connected friends
- FR14 → Epic 5: Validators view validation requests from friends
- FR15 → Epic 5: Validators score across three criteria (Clean Landing 50%, Style 30%, Difficulty 20%)
- FR16 → Epic 5: Validators provide text feedback on attempts
- FR17 → Epic 5: View real-time validation progress and individual scores
- FR18 → Epic 5: Retry failed validations with no penalty
- FR19 → Epic 5: System aggregates scores and determines 90% consensus
- FR20 → Epic 5: System distributes base trick rewards on validation success

**Token Economy & Rewards:**
- FR21 → Epic 6: View TRKTRK token balance in real-time
- FR22 → Epic 6: View transaction history with timestamps and amounts
- FR23 → Epic 6: System distributes tokens by difficulty tier (10-100 tokens)
- FR24 → Epic 6: Validators earn bonus tokens (5 TRKTRK per filmed validation)
- FR25 → Epic 6: View pending token distributions before validation completes
- FR26 → Epic 6: System processes token distributions via smart contract

**NFT Badge System:**
- FR27 → Epic 7: Earn NFT badges automatically on achievement milestones
- FR28 → Epic 7: View badge collection in gallery
- FR29 → Epic 7: See badge metadata (name, description, unlock criteria, mint date)
- FR30 → Epic 7: System mints tiered badges (Bronze/Silver/Gold)
- FR31 → Epic 7: Share badge achievements to social media
- FR32 → Epic 7: Verify badge authenticity on-chain via blockchain explorer

**Sponsor Challenges:**
- FR33 → Epic 8: Discover active sponsor challenges in app feed
- FR34 → Epic 8: View challenge details (reward, duration, requirements, sponsor info)
- FR35 → Epic 8: Join sponsor challenges and submit trick attempts
- FR36 → Epic 8: System distributes challenge rewards in addition to base rewards
- FR37 → Epic 8: Earn custom sponsor NFT badges on challenge completion
- FR38 → Epic 8: View challenge participation status and remaining time
- FR39 → Epic 8: System automatically ends challenges when max participants reached or time expires

**Admin Operations & Fraud Detection:**
- FR40 → Epic 10: Admins view fraud detection dashboard with validator score patterns
- FR41 → Epic 10: Admins flag suspicious accounts for manual review
- FR42 → Epic 10: Admins freeze or suspend user accounts
- FR43 → Epic 10: Admins unfreeze accounts after investigation
- FR44 → Epic 10: Admins view anomaly alerts for statistical outliers
- FR45 → Epic 10: Admins manually create sponsor challenges via backoffice panel
- FR46 → Epic 10: Admins transfer tokens from treasury to sponsor wallets
- FR47 → Epic 10: Admins view gas cost monitoring and batch processing metrics
- FR48 → Epic 10: Admins trigger emergency pause on smart contracts
- FR49 → Epic 10: Admins view platform-wide analytics (users, validations, tokens distributed)

**Treasury & Token Management:**
- FR50 → Epic 9: System manages DAO treasury wallet with multi-sig controls
- FR51 → Epic 9: Admins approve token transfers from treasury
- FR52 → Epic 9: System tracks token allocation across pools (user rewards, sponsor challenges, treasury reserve)
- FR53 → Epic 9: System enforces vesting schedules for team/advisor tokens
- FR54 → Epic 9: Admins view treasury balance and transaction history

**Blockchain Integration:**
- FR55 → Epic 4: System deploys and interacts with smart contracts on Polygon network
- FR56 → Epic 4: System batch processes multiple validations to optimize gas costs
- FR57 → Epic 4: System monitors gas prices and adjusts transaction timing
- FR58 → Epic 4: System handles RPC provider failover on infrastructure issues
- FR59 → Epic 4: System queues transactions during network congestion
- FR60 → Epic 4: System verifies on-chain transaction status and confirmations

**Compliance & Security:**
- FR61 → Epic 11: System tracks user consent for data processing (GDPR)
- FR62 → Epic 11: System provides data export functionality for user data requests
- FR63 → Epic 11: System deletes user data on account deletion requests
- FR64 → Epic 11: Admins access audit logs for all administrative actions
- FR65 → Epic 11: System enforces rate limiting on validation requests and wallet creation

## Epic List

### Epic 1: Project Foundation & Monorepo Setup
Development environment is ready with Turborepo monorepo structure, shared TypeScript types, and deployment pipelines configured. This establishes the greenfield starter template with Next.js 15 PWA, Nest.js backend, and Hardhat smart contracts.

**FRs covered:** Architecture requirements (Turborepo + pnpm, Next.js 15, Nest.js, Hardhat setup, shared packages)

### Epic 2: Wallet Connection & User Authentication
Users can create in-app wallets or connect external wallets, enabling them to interact with the blockchain and establish their identity on TrickTrack.

**FRs covered:** FR1, FR2, FR3, FR4, FR5

### Epic 3: Friend Connection Network via QR Codes
Users can connect with friends by scanning QR codes, establishing mutual validation rights and building their trust network.

**FRs covered:** FR6, FR7, FR8, FR9, FR10

### Epic 4: Smart Contract Deployment (Token & Validation)
Core blockchain infrastructure is deployed on Polygon, enabling token distribution, validation rewards, and gas-optimized batch processing.

**FRs covered:** FR55, FR56, FR57, FR58, FR59, FR60

### Epic 5: Trick Validation & Scoring System
Users can upload trick videos, request validation from friends, and validators can score attempts using the three-criteria system (Clean Landing 50%, Style 30%, Difficulty 20%).

**FRs covered:** FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR20

### Epic 6: Token Rewards & Transaction History
Users earn TRKTRK tokens automatically when validations succeed, can view their balance in real-time, and track all transactions.

**FRs covered:** FR21, FR22, FR23, FR24, FR25, FR26

### Epic 7: NFT Badge System
Users automatically earn NFT badges on achievement milestones, can view their badge collection, and share achievements on social media.

**FRs covered:** FR27, FR28, FR29, FR30, FR31, FR32

### Epic 8: Sponsor Challenges
Users can discover and join sponsor-created challenges, earn bonus rewards, and receive custom sponsor NFT badges.

**FRs covered:** FR33, FR34, FR35, FR36, FR37, FR38, FR39

### Epic 9: DAO Treasury & Token Management
Platform treasury is managed via Aragon DAO with multi-sig controls, enabling secure token distribution and governance.

**FRs covered:** FR50, FR51, FR52, FR53, FR54

### Epic 10: Admin Operations & Fraud Detection
Admins can monitor platform health, detect fraud patterns, manage sponsor challenges, and respond to security incidents.

**FRs covered:** FR40, FR41, FR42, FR43, FR44, FR45, FR46, FR47, FR48, FR49

### Epic 11: Compliance & Data Privacy
Platform complies with GDPR and regulatory requirements, users can export/delete their data, and all admin actions are audited.

**FRs covered:** FR61, FR62, FR63, FR64, FR65
