# Epic 2: Wallet Connection & User Authentication

**Epic Goal:** Users can create in-app wallets or connect external wallets, enabling blockchain interaction.

**FRs covered:** FR1, FR2, FR3, FR4, FR5

---

## Story 2.1: Integrate Web3Auth for In-App Wallet Creation

As a **new user**,
I want **to create an in-app wallet in under 30 seconds without email or KYC**,
So that **I can start using TrickTrack immediately without blockchain knowledge**.

**Acceptance Criteria:**

**Given** I am on the TrickTrack landing page
**When** I click "Create Wallet"
**Then** Web3Auth modal opens with social login options (Google, Twitter, Discord)
**And** I authenticate and an Ethereum wallet is created
**And** my wallet address is displayed
**And** the process completes in under 30 seconds
**And** my private key is encrypted by Web3Auth

**Technical Notes:** Use Web3Auth Plug and Play SDK v7+, configure for Polygon, store wallet address in Supabase `users` table

**Dependencies:** Story 1.2, Story 1.3

---

## Story 2.2: Integrate Web3Modal for External Wallet Connection

As a **crypto-savvy user**,
I want **to connect my existing wallet (MetaMask, WalletConnect, hardware wallet)**,
So that **I can use TrickTrack with my preferred wallet**.

**Acceptance Criteria:**

**Given** I am on the landing page
**When** I click "Connect Wallet"
**Then** Web3Modal opens with wallet options (MetaMask, WalletConnect, Coinbase Wallet, hardware wallets)
**And** I select my wallet and approve connection
**And** my wallet address is displayed
**And** connection persists across sessions

**Technical Notes:** Use Web3Modal v3+ with wagmi/viem, support multiple wallet providers, store preference in localStorage

**Dependencies:** Story 1.2

---

## Story 2.3: Implement Social Recovery for In-App Wallets

As a **user with an in-app wallet**,
I want **to recover my wallet via social recovery or email backup**,
So that **I don't lose access if I lose my device**.

**Acceptance Criteria:**

**Given** I created an in-app wallet via Web3Auth
**When** I log in on a new device with the same social account
**Then** my wallet is automatically recovered with the same address
**And** my token balance and history are intact
**And** recovery completes in under 2 minutes

**Technical Notes:** Web3Auth handles social recovery automatically, implement email backup via MFA feature

**Dependencies:** Story 2.1

---

## Story 2.4: Display Wallet Address and Copy to Clipboard

As a **user**,
I want **to view my wallet address and copy it to clipboard**,
So that **I can share my address or verify my identity**.

**Acceptance Criteria:**

**Given** I am logged in
**When** I navigate to my profile
**Then** my wallet address is displayed (truncated: `0x1234...5678`)
**And** I can click "Copy" to copy full address
**And** a toast confirms "Address copied!"
**And** I can click address to view on PolygonScan
**And** a QR code of my address is available

**Technical Notes:** Use `navigator.clipboard.writeText()`, truncate to first 6 + last 4 chars, generate QR with `qrcode.react`

**Dependencies:** Story 2.1 or 2.2

---

## Story 2.5: Export Private Key or Seed Phrase Securely

As a **user with an in-app wallet**,
I want **to export my private key or seed phrase securely**,
So that **I can import my wallet into other applications**.

**Acceptance Criteria:**

**Given** I am logged in with an in-app wallet
**When** I navigate to Settings > Security > Export Wallet
**Then** I see a warning about risks
**And** I must re-authenticate to proceed
**And** I can export private key or seed phrase
**And** I must acknowledge risks before copying
**And** export action is logged

**Technical Notes:** Use Web3Auth's `getPrivateKey()`, require re-authentication, display security warnings, log to `audit_logs`

**Dependencies:** Story 2.1

---

## Story 2.6: Implement Session Management and Auto-Logout

As a **user**,
I want **my session to expire after 30 days of inactivity**,
So that **my account remains secure**.

**Acceptance Criteria:**

**Given** I am logged in
**When** I am inactive for 30 days
**Then** my session expires automatically
**And** I am redirected to login page
**And** I must reconnect wallet to access app
**And** I can manually log out anytime

**Technical Notes:** Store session timestamp in localStorage, check validity on app load, use JWT with 30-day expiration

**Dependencies:** Story 2.1 or 2.2
