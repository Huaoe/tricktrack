# Epic 4: Smart Contract Deployment (Token & Validation)

**Epic Goal:** Core blockchain infrastructure deployed on Polygon, enabling token distribution and validation rewards.

**FRs covered:** FR55, FR56, FR57, FR58, FR59, FR60

---

## Story 4.1: Develop TRKTRKToken.sol (ERC-20 Token Contract)

As a **blockchain developer**,
I want **to develop the TRKTRK ERC-20 token contract**,
So that **users can earn and transfer TRKTRK tokens on Polygon**.

**Acceptance Criteria:**

**Given** Hardhat is configured
**When** I run `pnpm hardhat compile`
**Then** `TRKTRKToken.sol` compiles successfully
**And** contract includes: ERC-20 standard, name "TrickTrack Token", symbol "TRKTRK", decimals 18, initial supply 10M (to DAO treasury), minting function (ValidationManager only), burning function
**And** contract passes all unit tests

**Technical Notes:** Use OpenZeppelin `ERC20` and `AccessControl`, implement `MINTER_ROLE`, gas target < 50,000 per transfer

**Dependencies:** Story 1.4

---

## Story 4.2: Develop ValidationManager.sol (Validation & Reward Contract)

As a **blockchain developer**,
I want **to develop the ValidationManager contract**,
So that **the system can distribute token rewards when validations succeed**.

**Acceptance Criteria:**

**Given** TRKTRKToken.sol is deployed
**When** I run `pnpm hardhat compile`
**Then** `ValidationManager.sol` compiles successfully
**And** includes: record validation results, distribute rewards by difficulty tier (10/25/50/100), validator bonus (5 TRKTRK), batch processing (10-50 validations), emergency pause, upgradeability via proxy
**And** passes all unit tests

**Technical Notes:** Use OpenZeppelin `AccessControl`, `Pausable`, `ReentrancyGuard`, transparent proxy, emit events for The Graph, gas target < $0.01 per validation

**Dependencies:** Story 4.1

---

## Story 4.3: Develop NFTBadgeFactory.sol (ERC-721 Badge Contract)

As a **blockchain developer**,
I want **to develop the NFTBadgeFactory contract**,
So that **users can earn NFT badges on achievement milestones**.

**Acceptance Criteria:**

**Given** Hardhat is configured
**When** I run `pnpm hardhat compile`
**Then** `NFTBadgeFactory.sol` compiles successfully
**And** includes: ERC-721 standard, mint badges on milestones, badge tiers (Bronze/Silver/Gold), custom sponsor badges, token URI to IPFS, soulbound logic (non-transferable), upgradeability
**And** passes all unit tests

**Technical Notes:** Use OpenZeppelin `ERC721`, `ERC721URIStorage`, `AccessControl`, override `_transfer` to revert, store metadata on IPFS via Pinata

**Dependencies:** Story 1.4

---

## Story 4.4: Develop DAOIntegration.sol (Aragon DAO Interface)

As a **blockchain developer**,
I want **to develop the DAOIntegration contract**,
So that **the DAO can govern reward amounts and treasury operations**.

**Acceptance Criteria:**

**Given** Aragon DAO is deployed
**When** I run `pnpm hardhat compile`
**Then** `DAOIntegration.sol` compiles successfully
**And** includes: Aragon DAO interface, update reward tiers via DAO vote, approve treasury transfers via vote, token-weighted voting (1 TRKTRK = 1 vote), multi-sig controls (2-of-3 for > 10K TRKTRK)
**And** passes all unit tests

**Technical Notes:** Use Aragon DAO SDK, implement voting with quorum requirements, set up Gnosis Safe for treasury

**Dependencies:** Story 1.4

---

## Story 4.5: Develop TreasuryManager.sol (DAO Treasury Contract)

As a **blockchain developer**,
I want **to develop the TreasuryManager contract**,
So that **the DAO can manage token allocation and vesting schedules**.

**Acceptance Criteria:**

**Given** Hardhat is configured
**When** I run `pnpm hardhat compile`
**Then** `TreasuryManager.sol` compiles successfully
**And** includes: track token allocation across pools, enforce vesting schedules, transfer tokens to sponsor wallets, multi-sig controls (> 10K TRKTRK), emergency pause
**And** passes all unit tests

**Technical Notes:** Use OpenZeppelin `VestingWallet`, implement allocation tracking with mappings, integrate with Gnosis Safe

**Dependencies:** Story 4.1

---

## Story 4.6: Deploy Smart Contracts to Polygon Mumbai Testnet

As a **blockchain developer**,
I want **to deploy all smart contracts to Polygon Mumbai testnet**,
So that **I can test the full blockchain integration before mainnet**.

**Acceptance Criteria:**

**Given** all contracts are developed and tested
**When** I run `pnpm hardhat ignition deploy --network mumbai`
**Then** all contracts are deployed to Mumbai: TRKTRKToken, ValidationManager (proxy), NFTBadgeFactory (proxy), DAOIntegration, TreasuryManager
**And** contract addresses saved to `deployments/mumbai.json`
**And** contracts verified on PolygonScan Mumbai

**Technical Notes:** Use Hardhat Ignition, configure Alchemy/Infura RPC for Mumbai, verify with `hardhat-etherscan`

**Dependencies:** Stories 4.1-4.5

---

## Story 4.7: Deploy Smart Contracts to Polygon Mainnet

As a **blockchain developer**,
I want **to deploy all smart contracts to Polygon mainnet**,
So that **users can earn real TRKTRK tokens and NFT badges**.

**Acceptance Criteria:**

**Given** all contracts are tested on Mumbai
**When** I run `pnpm hardhat ignition deploy --network polygon`
**Then** all contracts are deployed to Polygon mainnet
**And** contract addresses saved to `deployments/polygon.json`
**And** contracts verified on PolygonScan
**And** initial 10M TRKTRK minted to DAO treasury
**And** contract addresses added to frontend env variables

**Technical Notes:** Use Hardhat Ignition, conduct security audit before mainnet (4-6 weeks)

**Dependencies:** Story 4.6

---

## Story 4.8: Implement RPC Provider Failover (Alchemy + Infura)

As a **backend developer**,
I want **RPC provider failover between Alchemy and Infura**,
So that **blockchain interactions remain reliable even if one provider fails**.

**Acceptance Criteria:**

**Given** backend is configured with Alchemy and Infura RPC URLs
**When** Alchemy RPC fails or times out
**Then** backend automatically switches to Infura RPC
**And** failover activates within 10 seconds
**And** all pending transactions are retried on backup provider
**And** failover events are logged

**Technical Notes:** Use `ethers.js` FallbackProvider, configure 10-second timeout, log to Datadog/Sentry

**Dependencies:** Story 1.3, Story 4.7

---

## Story 4.9: Implement Gas Price Monitoring and Transaction Timing

As a **backend developer**,
I want **to monitor gas prices and adjust transaction timing**,
So that **blockchain transactions remain cost-effective (< $0.01 per validation)**.

**Acceptance Criteria:**

**Given** backend is processing validation rewards
**When** gas prices exceed threshold (e.g., 100 gwei)
**Then** transactions are queued until gas prices drop
**And** gas prices checked every 5 minutes via Polygon Gas Station API
**And** transactions batched when gas prices are low (< 50 gwei)
**And** admins receive alerts if gas costs exceed $0.05 per validation

**Technical Notes:** Use Polygon Gas Station API, implement transaction queue with priority levels, set thresholds in env variables

**Dependencies:** Story 1.3, Story 4.7

---

## Story 4.10: Implement Transaction Queue and Batch Processing

As a **backend developer**,
I want **to queue transactions and batch process multiple validations**,
So that **gas costs are optimized (10-50 validations per transaction)**.

**Acceptance Criteria:**

**Given** multiple validation rewards are pending
**When** queue reaches 10 validations or 5 minutes have passed
**Then** all pending validations are batched into a single transaction
**And** batch transaction is sent to ValidationManager.sol
**And** all rewards distributed in one transaction
**And** if batch fails, individual validations are retried separately

**Technical Notes:** Implement queue using Redis or in-memory, use ValidationManager's batch function, set batch size limits (10-50)

**Dependencies:** Story 4.2, Story 4.9

---

## Story 4.11: Verify On-Chain Transaction Status and Confirmations

As a **backend developer**,
I want **to verify on-chain transaction status and confirmations**,
So that **I can ensure token rewards are successfully distributed**.

**Acceptance Criteria:**

**Given** a validation reward transaction is sent
**When** transaction is included in a block
**Then** backend waits for 2 block confirmations (~4 seconds on Polygon)
**And** transaction status updated in database: Pending, Confirmed, or Failed
**And** users see real-time transaction status in app
**And** failed transactions trigger automatic retry (up to 3 attempts)

**Technical Notes:** Use `ethers.js` `waitForTransaction()`, implement retry with exponential backoff, store transaction hashes in `transactions` table

**Dependencies:** Story 4.7, Story 1.3
