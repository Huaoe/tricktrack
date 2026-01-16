# Epic 8: Sponsor Challenges

**Epic Goal:** Users can discover and join sponsor-created challenges, earn bonus rewards, and receive custom sponsor NFT badges.

**FRs covered:** FR33, FR34, FR35, FR36, FR37, FR38, FR39

---

## Story 8.1: Discover Active Sponsor Challenges in App Feed

As a **user**,
I want **to discover active sponsor challenges in the app feed**,
So that **I can participate in challenges and earn bonus rewards**.

**Acceptance Criteria:**

**Given** I am logged in
**When** I navigate to the Home feed or Challenges tab
**Then** I see a list of active sponsor challenges displayed as cards
**And** each challenge card shows: sponsor logo, challenge title, reward amount (e.g., "500 TRKTRK + Custom Badge"), duration (e.g., "5 days remaining"), number of participants, challenge requirements
**And** challenges are sorted by: Featured (sponsor tier), Ending Soon, Highest Reward
**And** I can filter challenges by: trick difficulty, reward amount, time remaining
**And** new challenges appear in the feed automatically

**Technical Notes:** Fetch challenges from `sponsor_challenges` table, display in responsive grid, implement real-time updates for new challenges, cache challenge data with React Query

**Dependencies:** Story 1.2, Story 1.3

---

## Story 8.2: View Challenge Details (Reward, Duration, Requirements, Sponsor Info)

As a **user**,
I want **to view challenge details (reward amount, duration, requirements, sponsor info)**,
So that **I understand what I need to do to complete the challenge**.

**Acceptance Criteria:**

**Given** I am viewing the challenges feed
**When** I click on a challenge card
**Then** I see a detailed view with: sponsor name and logo, challenge title and description, reward amount (TRKTRK tokens + custom NFT badge), challenge duration (start/end dates), requirements (e.g., "Land a Kickflip with 95%+ score"), max participants (if limited), current participants count, sponsor website link
**And** I can see example videos of successful attempts (if available)
**And** I can view the custom sponsor NFT badge design
**And** I can see terms and conditions for the challenge

**Technical Notes:** Fetch challenge details from `sponsor_challenges` table, display sponsor info from `sponsors` table, show NFT badge preview from IPFS, implement countdown timer for challenge end date

**Dependencies:** Story 8.1

---

## Story 8.3: Join Sponsor Challenges and Submit Trick Attempts

As a **user**,
I want **to join sponsor challenges and submit trick attempts**,
So that **I can compete for bonus rewards**.

**Acceptance Criteria:**

**Given** I am viewing a challenge details page
**When** I click "Join Challenge"
**Then** I am enrolled in the challenge
**And** I can upload a trick video specifically for this challenge
**And** I select the required trick type (as specified by challenge)
**And** I request validation from 3+ friends (same as normal validation)
**And** the validation must meet challenge requirements (e.g., 95%+ score)
**And** I can submit multiple attempts until I succeed or challenge ends
**And** my participation status is tracked (joined, in progress, completed, failed)

**Technical Notes:** Create entry in `challenge_participations` table, link validation request to challenge ID, enforce challenge requirements in validation logic, allow multiple attempts per challenge

**Dependencies:** Story 8.2, Story 5.3

---

## Story 8.4: System Distributes Challenge Rewards in Addition to Base Rewards

As a **system**,
I want **to distribute challenge rewards in addition to base trick rewards**,
So that **users earn bonus tokens for completing sponsor challenges**.

**Acceptance Criteria:**

**Given** a user successfully completes a challenge validation
**When** the validation succeeds (meets challenge requirements)
**Then** the user receives: base trick reward (10-100 TRKTRK based on difficulty), challenge bonus reward (e.g., 500 TRKTRK), custom sponsor NFT badge
**And** validators still receive 5 TRKTRK bonus tokens
**And** challenge rewards are distributed via ValidationManager.sol
**And** user receives notification: "You earned [X] TRKTRK + [Badge Name] for completing [Challenge]!"
**And** challenge completion is recorded in user's profile

**Technical Notes:** Call ValidationManager.sol with additional challenge reward amount, mint custom sponsor badge via NFTBadgeFactory.sol, store completion in `challenge_participations` table with `status: 'completed'`, track challenge budget and remaining rewards

**Dependencies:** Story 8.3, Story 4.2, Story 4.3

---

## Story 8.5: Earn Custom Sponsor NFT Badges on Challenge Completion

As a **user**,
I want **to earn custom sponsor NFT badges on challenge completion**,
So that **I can showcase my achievements and sponsor partnerships**.

**Acceptance Criteria:**

**Given** I successfully completed a sponsor challenge
**When** the system processes the challenge completion
**Then** a custom sponsor NFT badge is minted to my wallet
**And** the badge includes: sponsor logo, challenge name, completion date, unique design (different from standard badges)
**And** the badge appears in my badge collection
**And** the badge is soulbound (non-transferable)
**And** I receive a celebration animation and notification
**And** I can share the badge on social media

**Technical Notes:** Call NFTBadgeFactory.sol `mintSponsorBadge()` function, store custom badge metadata on IPFS with sponsor branding, track sponsor badge count in user profile, display sponsor badges separately from achievement badges

**Dependencies:** Story 8.4, Story 4.3

---

## Story 8.6: View Challenge Participation Status and Remaining Time

As a **user**,
I want **to view my challenge participation status and remaining time**,
So that **I know my progress and how much time I have left**.

**Acceptance Criteria:**

**Given** I have joined one or more challenges
**When** I navigate to My Challenges
**Then** I see a list of my active challenges with: challenge name, participation status (joined, in progress, completed, failed), remaining time (countdown timer), number of attempts made, reward amount
**And** completed challenges show: completion date, rewards earned, badge earned
**And** expired challenges show: "Challenge Ended" status
**And** I receive notifications when challenges are about to expire (24 hours, 1 hour)

**Technical Notes:** Fetch from `challenge_participations` table, implement countdown timers with real-time updates, send push notifications via Firebase Cloud Messaging for expiration warnings

**Dependencies:** Story 8.3

---

## Story 8.7: System Automatically Ends Challenges When Max Participants Reached or Time Expires

As a **system**,
I want **to automatically end challenges when max participants reached or time expires**,
So that **challenge budgets are managed and deadlines are enforced**.

**Acceptance Criteria:**

**Given** a sponsor challenge is active
**When** the challenge reaches max participants OR the end date/time is reached
**Then** the challenge status changes to "ended"
**And** no new participants can join
**And** users already participating can still complete their attempts (grace period: 24 hours)
**And** the challenge is removed from the active challenges feed
**And** the challenge moves to "Past Challenges" section
**And** sponsor receives summary report: total participants, completions, rewards distributed

**Technical Notes:** Implement scheduled job (cron) to check challenge end dates, update `sponsor_challenges` table with `status: 'ended'`, send notifications to participants when challenge ends, generate sponsor report with analytics

**Dependencies:** Story 8.1, Story 8.3
