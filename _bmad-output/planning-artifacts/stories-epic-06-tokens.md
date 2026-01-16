# Epic 6: Token Rewards & Transaction History

**Epic Goal:** Users earn TRKTRK tokens automatically when validations succeed, can view their balance in real-time, and track all transactions.

**FRs covered:** FR21, FR22, FR23, FR24, FR25, FR26

---

## Story 6.1: View TRKTRK Token Balance in Real-Time

As a **user**,
I want **to view my TRKTRK token balance in real-time**,
So that **I can track my earnings and see my progress**.

**Acceptance Criteria:**

**Given** I am logged in with a connected wallet
**When** I navigate to the Dashboard or Wallet page
**Then** I see my current TRKTRK token balance displayed prominently
**And** the balance updates within 30 seconds of blockchain confirmation
**And** the balance is displayed with 2 decimal places (e.g., "125.50 TRKTRK")
**And** I can refresh the balance manually with a "Refresh" button
**And** the balance is fetched from the blockchain (not cached)
**And** a loading indicator shows while balance is being fetched

**Technical Notes:** Use `ethers.js` or `viem` to query TRKTRKToken.sol `balanceOf()` function, implement real-time updates via WebSockets or polling (every 30 seconds), cache balance in React state for instant display, display balance with token icon/logo

**Dependencies:** Story 4.1, Story 2.1 or 2.2

---

## Story 6.2: View Transaction History with Timestamps and Amounts

As a **user**,
I want **to view my transaction history with timestamps and amounts**,
So that **I can track all my token earnings and transfers**.

**Acceptance Criteria:**

**Given** I am logged in and have token transactions
**When** I navigate to Wallet > Transaction History
**Then** I see a list of all transactions with: transaction type (Earned, Sent, Received), amount (e.g., "+50 TRKTRK"), timestamp (e.g., "2 hours ago" or "Jan 15, 2026"), description (e.g., "Earned from Kickflip validation"), transaction hash (link to PolygonScan)
**And** transactions are sorted by timestamp (most recent first)
**And** I can filter transactions by type (Earned, Sent, Received)
**And** I can search transactions by date range

**Technical Notes:** Fetch transactions from `transactions` table, index blockchain events using The Graph for historical data, implement pagination (20 transactions per page), link to PolygonScan: `https://polygonscan.com/tx/{txHash}`

**Dependencies:** Story 6.1, Story 4.11

---

## Story 6.3: System Distributes Tokens by Difficulty Tier (10-100 Tokens)

As a **system**,
I want **to distribute tokens based on trick difficulty tier**,
So that **users earn appropriate rewards for their skill level**.

**Acceptance Criteria:**

**Given** a validation succeeded
**When** the system distributes rewards
**Then** tokens are awarded based on difficulty tier: Beginner (10 TRKTRK), Intermediate (25 TRKTRK), Advanced (50 TRKTRK), Expert (100 TRKTRK)
**And** reward amounts are stored in the database for each trick type
**And** admins can update reward amounts via DAO governance
**And** reward amounts are displayed to users before validation request

**Technical Notes:** Store reward tiers in `trick_types` table, pass difficulty tier to ValidationManager.sol for reward calculation, allow DAO to update reward amounts via DAOIntegration.sol, display expected reward in validation request UI

**Dependencies:** Story 5.2, Story 4.2

---

## Story 6.4: Validators Earn Bonus Tokens (5 TRKTRK per Filmed Validation)

As a **validator**,
I want **to earn bonus tokens (5 TRKTRK) for each filmed validation**,
So that **I am incentivized to validate my friends' tricks**.

**Acceptance Criteria:**

**Given** I completed a validation by scoring a trick
**When** the validation is processed
**Then** I receive 5 TRKTRK bonus tokens
**And** the bonus is awarded regardless of validation success/failure
**And** the bonus is distributed via ValidationManager.sol
**And** I receive a notification: "You earned 5 TRKTRK for validating [Friend]'s trick!"
**And** the bonus transaction appears in my transaction history
**And** validators can earn unlimited bonuses (no daily cap)

**Technical Notes:** Award validator bonus in ValidationManager.sol `distributeRewards()` function, distribute bonuses to all validators who submitted scores, track validator earnings for leaderboard (optional), prevent double-awarding bonuses for the same validation

**Dependencies:** Story 5.5, Story 4.2

---

## Story 6.5: View Pending Token Distributions Before Validation Completes

As a **user**,
I want **to view pending token distributions before validation completes**,
So that **I know how many tokens I will earn if my validation succeeds**.

**Acceptance Criteria:**

**Given** I have submitted a validation request
**When** I view the validation status
**Then** I see the expected reward amount displayed: "Potential reward: 50 TRKTRK" (for Advanced trick), "Validators will earn: 5 TRKTRK each"
**And** the reward is marked as "pending" until validation completes
**And** if validation fails, the pending reward is removed
**And** if validation succeeds, the reward is confirmed and distributed
**And** pending rewards are displayed in a separate section: "Pending Rewards"
**And** total pending rewards are summed and displayed on the Dashboard

**Technical Notes:** Calculate expected reward based on trick difficulty tier, display pending rewards in validation request UI, store pending rewards in `validation_requests` table, update UI when validation completes (success or failure)

**Dependencies:** Story 5.3, Story 6.3

---

## Story 6.6: System Processes Token Distributions via Smart Contract

As a **system**,
I want **to process token distributions via smart contract**,
So that **rewards are distributed securely and transparently on-chain**.

**Acceptance Criteria:**

**Given** a validation succeeded
**When** the backend processes the reward distribution
**Then** the ValidationManager.sol smart contract is called with: user wallet address, reward amount (based on difficulty tier), validator wallet addresses, validator bonus amounts (5 TRKTRK each)
**And** the smart contract mints tokens from the DAO treasury
**And** tokens are transferred to user and validator wallets
**And** the transaction is confirmed on Polygon blockchain
**And** transaction hash is stored in the database
**And** users receive notifications when tokens are distributed

**Technical Notes:** Call ValidationManager.sol `distributeRewards()` function, batch multiple distributions for gas optimization, wait for 2 block confirmations before updating UI, handle transaction failures with automatic retry

**Dependencies:** Story 4.2, Story 5.10
