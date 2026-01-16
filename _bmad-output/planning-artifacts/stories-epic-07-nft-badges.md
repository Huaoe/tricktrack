# Epic 7: NFT Badge System

**Epic Goal:** Users automatically earn NFT badges on achievement milestones, can view their badge collection, and share achievements on social media.

**FRs covered:** FR27, FR28, FR29, FR30, FR31, FR32

---

## Story 7.1: Earn NFT Badges Automatically on Achievement Milestones

As a **user**,
I want **to earn NFT badges automatically on achievement milestones**,
So that **I can showcase my skateboarding progress and accomplishments**.

**Acceptance Criteria:**

**Given** I have successfully validated tricks
**When** I reach an achievement milestone
**Then** an NFT badge is automatically minted to my wallet: Bronze Badge (first trick), Silver Badge (10 tricks), Gold Badge (50 tricks)
**And** I receive a push notification: "You earned the [Badge Name]!"
**And** a celebration animation plays (fade-in + scale-up with glow)
**And** the badge appears in my badge collection
**And** badge minting is free (gas paid by platform)
**And** badges are soulbound (non-transferable)

**Technical Notes:** Call NFTBadgeFactory.sol `mintBadge()` function on milestone, store badge metadata on IPFS via Pinata, track user progress in `user_stats` table, implement celebration animation with Framer Motion

**Dependencies:** Story 4.3, Story 5.10

---

## Story 7.2: View Badge Collection in Gallery

As a **user**,
I want **to view my badge collection in a gallery**,
So that **I can see all my earned badges and track my achievements**.

**Acceptance Criteria:**

**Given** I am logged in and have earned badges
**When** I navigate to Profile > Badges
**Then** I see a gallery of all my badges displayed as cards
**And** each badge card shows: badge image (from IPFS), badge name (e.g., "Bronze Skater"), badge description, unlock criteria (e.g., "Validate your first trick"), mint date (e.g., "Earned on Jan 15, 2026")
**And** badges are organized by tier (Bronze, Silver, Gold)
**And** unearned badges are shown as locked/grayed out
**And** I can click a badge to view full details

**Technical Notes:** Fetch badge data from NFTBadgeFactory.sol and IPFS, display badges in a responsive grid (2-3 columns on mobile), use shadcn/ui Card component for badge display, cache badge images from IPFS for performance

**Dependencies:** Story 7.1, Story 4.3

---

## Story 7.3: View Badge Metadata (Name, Description, Unlock Criteria, Mint Date)

As a **user**,
I want **to view badge metadata (name, description, unlock criteria, mint date)**,
So that **I understand what each badge represents and how to earn it**.

**Acceptance Criteria:**

**Given** I am viewing my badge collection
**When** I click on a badge
**Then** I see a detailed view with: badge name, badge description, unlock criteria (e.g., "Complete 10 successful validations"), mint date (if earned), blockchain transaction link (PolygonScan), IPFS metadata link
**And** if the badge is unearned, I see progress toward unlocking it (e.g., "7/10 tricks completed")
**And** I can share the badge details on social media
**And** I can view the badge on OpenSea or other NFT marketplaces

**Technical Notes:** Fetch metadata from IPFS using token URI, display progress bars for unearned badges, link to PolygonScan: `https://polygonscan.com/token/{contractAddress}?a={tokenId}`, link to OpenSea: `https://opensea.io/assets/matic/{contractAddress}/{tokenId}`

**Dependencies:** Story 7.2

---

## Story 7.4: System Mints Tiered Badges (Bronze/Silver/Gold)

As a **system**,
I want **to mint tiered badges (Bronze/Silver/Gold) on achievement milestones**,
So that **users are rewarded for their progression**.

**Acceptance Criteria:**

**Given** a user completes a validation
**When** the system checks their total successful validations
**Then** the system mints badges based on milestones:
- **Bronze Badge:** 1 successful validation (first trick)
- **Silver Badge:** 10 successful validations
- **Gold Badge:** 50 successful validations
**And** each badge has unique metadata stored on IPFS
**And** badges are minted via NFTBadgeFactory.sol
**And** badge minting is triggered automatically (no user action required)
**And** users receive notifications when badges are minted

**Technical Notes:** Track user validation count in `user_stats` table, call NFTBadgeFactory.sol `mintBadge()` on milestone, store metadata on IPFS with badge tier, name, description, image, prevent duplicate minting for same milestone

**Dependencies:** Story 4.3, Story 5.10

---

## Story 7.5: Share Badge Achievements to Social Media

As a **user**,
I want **to share badge achievements to social media**,
So that **I can celebrate my accomplishments with friends**.

**Acceptance Criteria:**

**Given** I have earned a badge
**When** I click "Share" on the badge details page
**Then** I see sharing options for: Twitter, Facebook, Instagram (via image download), Discord
**And** the share includes: badge image, badge name, achievement description, link to my TrickTrack profile
**And** for Twitter, a pre-filled tweet is generated: "I just earned the [Badge Name] on @TrickTrack! 🛹🔥 [Link]"
**And** for Instagram, the badge image is downloaded with achievement text overlay
**And** sharing increments a "shares" counter on the badge (optional)

**Technical Notes:** Use Web Share API for native sharing on mobile, generate Open Graph meta tags for link previews, create badge image with achievement text using Canvas API or server-side rendering, track shares in `badge_shares` table (optional)

**Dependencies:** Story 7.2

---

## Story 7.6: Verify Badge Authenticity On-Chain via Blockchain Explorer

As a **user**,
I want **to verify badge authenticity on-chain via blockchain explorer**,
So that **I can prove my badges are legitimate NFTs**.

**Acceptance Criteria:**

**Given** I have earned a badge
**When** I click "View on Blockchain" on the badge details page
**Then** I am redirected to PolygonScan showing the NFT token details
**And** I can see: contract address, token ID, owner address (my wallet), mint transaction, metadata URI (IPFS link)
**And** I can verify the badge is minted from the official TrickTrack NFTBadgeFactory contract
**And** I can view the badge on OpenSea or other NFT marketplaces
**And** the badge is marked as "Soulbound" (non-transferable)

**Technical Notes:** Link to PolygonScan: `https://polygonscan.com/token/{contractAddress}?a={tokenId}`, link to OpenSea: `https://opensea.io/assets/matic/{contractAddress}/{tokenId}`, display contract address and token ID prominently

**Dependencies:** Story 7.2, Story 4.3
