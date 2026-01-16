---
stepsCompleted: [1]
inputDocuments: []
session_topic: 'Skateboard trick certification app with crypto rewards and peer validation'
session_goals: 'Define core functionality, token economics, NFT badges, peer validation system'
selected_approach: 'AI-Recommended Techniques'
techniques_used: ['Token Economy Mapping', 'Peer Validation Workflows', 'NFT Utility Brainstorming']
ideas_generated: ['Trick Tiers', 'Combo Multipliers', 'Peer Bounties', 'Sponsor Pools', 'Token Gating', 'NFT Badges']
context_file: ''
---

# Brainstorming Session Results

**Facilitator:** Thomas
**Date:** 2026-01-15

## Session Overview

**Topic:** TrickTrack - Skateboard trick certification app with peer validation and crypto rewards

**Goals:** 
- Define core functionality for trick validation
- Explore token/NFT incentive mechanics
- Design peer review system
- Identify technical requirements

### Project Vision

**TrickTrack** is a PWA skateboard app where users:
1. Request peer validation for trick attempts
2. Validators score attempts via simple form (90% threshold)
3. Successful tricks earn crypto tokens and NFT badges
4. Wallet-based authentication with anonymous profiles
5. QR code-based friend connections

### Tech Stack
- **Frontend:** Next.js (App Router) + React + TypeScript
- **Backend:** Nest.js (POC requirement)
- **Database/Auth:** Supabase
- **UI:** shadcn/ui + Tailwind CSS
- **Blockchain:** Polygon (Aragon DAO for governance)
- **Storage:** AWS S3 (off-chain video storage)
- **Wallet:** In-app wallet creation or external wallet connection

### Governance Model
**DAO Structure (Aragon on Polygon):**
- Aragon DAO framework for decentralized governance
- Token holders participate in decision-making via on-chain voting
- Charitable mission: Support skateboarding organizations worldwide via donations
- Users blessed to participate through donation mechanisms
- Community-driven funding allocation
- Transparent treasury management on Polygon

---

## Token Economics

### Revenue Model
1. **Primary:** Sponsor partnerships (brands fund token pools)
2. **Secondary:** Local event partnerships
3. **Tertiary:** Peer bounty transaction fees (5%)

### Token Supply & Allocation
- **Initial Supply:** 10M tokens
- **Allocation:**
  - 40% Community Rewards
  - 30% Sponsor Pool
  - 20% Team (3yr vesting)
  - 10% Liquidity

### Fixed Rewards Per Trick
```typescript
const TRICK_REWARDS = {
  ollie: 10,
  shuvit: 10,
  kickflip: 25,
  heelflip: 25,
  hardflip: 50,
  tre_flip: 50
}
```

### Token Utility Ideas
1. **Trick Tiers** - Base rewards by difficulty
2. **Combo Multipliers** - Landing tricks in sequence increases payout
3. **Daily Streaks** - Bonus for consistent participation
4. **Peer Bounties** - Challenge others to attempt your trick
5. **Token Burn** - Spend tokens to reset failed attempts
6. **HODL Rewards** - Earn interest on unused tokens
7. **Sponsor Pools** - Brands fund token rewards for promoted tricks
8. **Skill Matching** - Higher rewards when peers rate attempt as "clean"
9. **Token Gating** - Pay tokens to access elite trick lists
10. **Community Chest** - Pool tokens for spot prizes

### Sponsor Tiers

#### Local Skate Shop Tier ($500-2k/month)
- Logo placement on challenge cards
- Custom trick list (e.g., "Mike's Skatepark Challenge")
- Geo-targeted bounties near their store

#### Brand Tier ($5-15k/month)
- Featured banner in app
- Sponsored NFT badges (e.g., "Monster Energy Pro")
- Video ad slots in trick submission flow

#### Premium Tier ($20k+/month)
- Co-branded token (e.g., "Vans Bucks")
- IRL event integration
- Exclusive trick tutorials

### Sponsor Token Utility
1. **Custom Pools** - Sponsors fund tokens with branded names
2. **Burn-to-Boost** - Brands burn tokens to increase challenge visibility
3. **Staking Rewards** - Sponsors stake tokens to earn ad space discounts

### Potential Launch Partners
| Company          | Fit               | Hook                          |
|------------------|-------------------|-------------------------------|
| **Vans**         | Skate heritage    | Co-branded "Off the Wall" NFTs|
| **Red Bull**     | Extreme sports    | "Send It" challenge series    |
| **CCS**          | Skate e-commerce  | Token discounts on gear       |
| **Local Parks**  | Geo-targeting     | "Shred the Spot" leaderboards |

---

## NFT Badge System

### Badge Tiers
1. **Bronze**
   - Common tricks (Ollie, Shuvit)
   - Animated .gif format
   - 500+ minted per trick

2. **Silver**
   - Intermediate (Kickflip, Heelflip)
   - 3D rotating model
   - Limited to 250 per trick

3. **Gold**
   - Pro-level (Hardflip, 360 Flip)
   - AR-enabled models
   - 100 max per trick

4. **Sponsor Exclusive**
   - Branded challenges
   - Wearable in metaverses
   - Dynamic traits (e.g., weather effects)

### Technical Implementation
- **Chain:** Polygon (low gas fees)
- **Standard:** ERC-721 NFT
- **Storage:** IPFS/Arweave for permanent metadata

### Revenue Streams
1. **Primary Sales** - Mint fee for premium badges
2. **Royalties** - 5% on secondary sales
3. **Sponsor Fees** - Custom badge creation

---

## DAO Governance & Charitable Mission

### Organizational Structure
**Aragon DAO on Polygon**
- Aragon framework for DAO infrastructure
- ERC-20 governance tokens on Polygon
- Token-based voting for platform decisions
- Community voting on feature priorities
- Transparent treasury management via Aragon Agent
- Low-cost governance participation (Polygon gas fees)

### Charitable Mission
**Global Skateboarding Support:**
- Platform allocates portion of revenue to skateboarding organizations worldwide
- Users participate through voluntary donations
- DAO votes on recipient organizations
- Transparent donation tracking on-chain

### Donation Mechanisms
1. **Optional User Donations:**
   - Donate tokens to charity pool
   - Tax-deductible receipts (where applicable)
   - Donor recognition badges

2. **Platform Allocation:**
   - % of sponsor fees → charity pool
   - % of NFT royalties → charity pool
   - Community votes on allocation percentages

3. **Supported Organizations:**
   - Local skate park construction
   - Youth skateboarding programs
   - Equipment donations to underserved communities
   - Skateboarding advocacy groups

### DAO Voting Rights
- Token holders vote on:
  - Charity recipient selection
  - Platform feature roadmap
  - Revenue allocation percentages
  - Sponsor partnership approvals

---

## Peer Validation System

### Validation Workflow
1. **Request Initiation:**
   - Skater selects validators from QR-connected friends list
   - No random assignments → only trusted peers

2. **Asynchronous Validation:**
   - Validators receive notification
   - Can film attempt (bonus tokens for filming)
   - Submit score via simple form
   - No time window - validates when convenient

3. **Grading Criteria:**
   - **Clean Landing** (50% weight)
   - **Style Points** (30%)
   - **Difficulty Bonus** (20%)
   - **90% threshold required to pass**

4. **Dynamic Validator Lists:**
   - Editable per challenge
   - Can add more validators after initial request
   - Individual score breakdowns visible

### Validation Form Components
- Trick selector dropdown
- Score slider (0-100)
- Video upload field (optional)
- Comments textarea
- Submit button

### Technical Specs
- **Video Storage:** AWS S3 (off-chain for cost reduction)
- **Consensus:** 100% of selected validators must approve (≥90% score)
- **Data Flow:** Supabase for validation records

### Anti-Cheat Measures
- Video AI flags edited footage
- Reputation system for validators
- Challenge appeals (paid re-reviews)

---

## Friend Connection System

### QR Connection Workflow
**Purpose:** Link skaters' apps to build trusted validator networks

**Steps:**
1. Generate unique QR per user (contains wallet address)
2. Scan-to-connect with mutual confirmation
3. Optional: Map custom name to wallet address
4. Sync validator network between connected apps

### Wallet-Based Auth
- **Wallet Options:**
  - Create wallet in-app (simplified onboarding)
  - Connect external wallet (MetaMask, WalletConnect)
- Anonymous by default
- Optional friend naming (map to wallet addresses)
- Address book with custom names

**Example:**
```json
{
  "0x123...": "SkateBuddy42",
  "0x456...": "LocalParkPro"
}
```

### Technical Implementation
- ECDSA cryptographic signatures for QR codes (Ethereum-compatible)
- Web3Modal/WalletConnect for wallet connection
- In-app wallet creation using ethers.js
- Supabase for friend mappings

---

## Implementation Roadmap

### Phase 1: MVP
1. Wallet auth + friend system (QR connections)
2. Basic validation form
3. Fixed token rewards
4. Simple NFT badge minting

### Phase 2: Token Economy
1. Sponsor integration
2. ERC-20 token deployment on Polygon
3. Aragon DAO setup and governance launch
4. Advanced reward mechanics
5. Bounty system

### Phase 3: Scale
1. Advanced NFT features (dynamic traits, AR)
2. DAO treasury diversification
3. Event partnerships
4. Mobile app optimization
5. Cross-chain bridge exploration

---

## Next Steps

### Immediate Actions
1. Create Figma wireframes for core screens
2. Setup Next.js + Nest.js monorepo
3. Configure Supabase auth and database
4. Design validation form UI

### Technical Setup
```bash
# Monorepo structure
tricktrack/
├── apps/
│   ├── frontend/ (Next.js)
│   └── backend/ (Nest.js)
└── packages/
    ├── ui/ (shadcn components)
    └── contracts/ (token logic)
```

### Supabase Tables
```sql
CREATE TABLE validations (
  id UUID PRIMARY KEY,
  trick TEXT,
  score NUMERIC,
  video_url TEXT,
  validator_wallet TEXT,
  skater_wallet TEXT,
  created_at TIMESTAMP
);

CREATE TABLE friends (
  id UUID PRIMARY KEY,
  wallet_address TEXT,
  friend_wallet TEXT,
  custom_name TEXT,
  created_at TIMESTAMP
);
```

---

## Session Summary

**Ideas Generated:** 50+
**Key Decisions:**
- Wallet-based anonymous auth (in-app creation or external wallet)
- QR friend connections
- 90% validation threshold
- Fixed token rewards per trick
- Sponsor-driven revenue model
- Polygon blockchain for tokens/NFTs
- Aragon DAO for governance
- AWS S3 for video storage
- Next.js + Nest.js + Supabase stack

**Status:** Vision complete, ready for implementation planning
