# Epic 9: DAO Treasury & Token Management

**Epic Goal:** Platform treasury is managed via Aragon DAO with multi-sig controls, enabling secure token distribution and governance.

**FRs covered:** FR50, FR51, FR52, FR53, FR54

---

## Story 9.1: System Manages DAO Treasury Wallet with Multi-Sig Controls

As a **system**,
I want **to manage the DAO treasury wallet with multi-sig controls**,
So that **token distribution is secure and requires multiple approvals**.

**Acceptance Criteria:**

**Given** the Aragon DAO is deployed on Polygon
**When** the treasury is initialized
**Then** a Gnosis Safe multi-sig wallet is configured as the treasury holder
**And** multi-sig requires 2-of-3 signatures for transfers exceeding 10,000 TRKTRK
**And** signers are designated DAO members or core team members
**And** all treasury transactions are recorded on-chain
**And** treasury balance is visible on the DAO dashboard

**Technical Notes:** Use Gnosis Safe for multi-sig wallet, integrate with Aragon DAO, configure signing threshold (2-of-3), store signer addresses in smart contract, emit events for all treasury operations

**Dependencies:** Story 4.5, Story 4.4

---

## Story 9.2: Admins Approve Token Transfers from Treasury

As an **admin**,
I want **to approve token transfers from treasury**,
So that **sponsor wallets can be funded and rewards can be distributed**.

**Acceptance Criteria:**

**Given** I am an authorized admin/signer
**When** a token transfer request is created (e.g., funding sponsor wallet)
**Then** I receive a notification to approve the transfer
**And** I can view transfer details: recipient address, amount, purpose, requester
**And** I can approve or reject the transfer via the admin dashboard
**And** if transfer > 10,000 TRKTRK, it requires 2-of-3 approvals
**And** once approved, the transfer executes automatically
**And** the transfer is recorded in treasury transaction history

**Technical Notes:** Implement approval workflow in admin dashboard, integrate with Gnosis Safe API for multi-sig approvals, send notifications via email/push, store approval records in `treasury_approvals` table

**Dependencies:** Story 9.1, Story 10.1

---

## Story 9.3: System Tracks Token Allocation Across Pools

As a **system**,
I want **to track token allocation across pools (user rewards, sponsor challenges, treasury reserve)**,
So that **token distribution is transparent and budgets are managed**.

**Acceptance Criteria:**

**Given** the treasury is initialized with 10M TRKTRK
**When** tokens are distributed
**Then** the system tracks allocation across pools:
- **User Rewards Pool:** 60% (6M TRKTRK) - for validation rewards
- **Sponsor Challenges Pool:** 25% (2.5M TRKTRK) - for challenge bonuses
- **Treasury Reserve:** 15% (1.5M TRKTRK) - for operations, team, advisors
**And** pool balances are updated in real-time
**And** admins can view pool allocations on the DAO dashboard
**And** alerts are triggered when pools fall below 20% capacity
**And** DAO can vote to rebalance pools

**Technical Notes:** Store pool allocations in TreasuryManager.sol, track distributions in `token_allocations` table, implement monitoring dashboard, allow DAO governance to adjust allocations

**Dependencies:** Story 9.1, Story 4.5

---

## Story 9.4: System Enforces Vesting Schedules for Team/Advisor Tokens

As a **system**,
I want **to enforce vesting schedules for team/advisor tokens**,
So that **token distribution to team members is gradual and aligned with long-term commitment**.

**Acceptance Criteria:**

**Given** team/advisor tokens are allocated from treasury reserve
**When** vesting schedules are configured
**Then** tokens are released according to schedule:
- **Cliff Period:** 6 months (no tokens released)
- **Vesting Period:** 24 months (linear vesting after cliff)
- **Total Allocation:** Per team member/advisor agreement
**And** vested tokens are automatically transferred to beneficiary wallets
**And** vesting progress is visible on the admin dashboard
**And** unvested tokens remain locked in the treasury
**And** vesting schedules cannot be modified without DAO vote

**Technical Notes:** Use OpenZeppelin VestingWallet contracts, configure cliff and vesting duration, implement automated release mechanism, store vesting schedules in TreasuryManager.sol

**Dependencies:** Story 9.1, Story 4.5

---

## Story 9.5: Admins View Treasury Balance and Transaction History

As an **admin**,
I want **to view treasury balance and transaction history**,
So that **I can monitor token distribution and ensure transparency**.

**Acceptance Criteria:**

**Given** I am an authorized admin
**When** I navigate to Admin > Treasury Dashboard
**Then** I see: current treasury balance (total TRKTRK), pool allocations (User Rewards, Sponsor Challenges, Reserve), recent transactions (last 50), pending approval requests, vesting schedules
**And** I can filter transactions by: type (distribution, transfer, vesting), date range, amount
**And** I can export transaction history as CSV
**And** I can view detailed transaction info: timestamp, recipient, amount, purpose, approvers, blockchain transaction hash
**And** all data is fetched from on-chain sources (transparent)

**Technical Notes:** Fetch treasury balance from TRKTRKToken.sol, fetch transactions from The Graph (indexed blockchain events), display in admin dashboard, implement CSV export functionality

**Dependencies:** Story 9.1, Story 10.1
