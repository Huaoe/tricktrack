# Epic 5: Trick Validation & Scoring System

**Epic Goal:** Users can upload trick videos, request validation from friends, and validators can score attempts using the three-criteria system.

**FRs covered:** FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR20

---

## Story 5.1: Upload Video Recordings of Skateboarding Tricks

As a **user**,
I want **to upload video recordings of my skateboarding tricks**,
So that **my friends can validate my attempts and I can earn tokens**.

**Acceptance Criteria:**

**Given** I am logged in and have recorded a trick video
**When** I navigate to Tricks > Upload Trick
**Then** I can select a video file from my device (max 100MB, MP4/MOV format)
**And** the video uploads to AWS S3 with progress indicator
**And** upload completes within 30 seconds on 4G networks
**And** video is scanned for malware before storage
**And** video thumbnail is generated automatically
**And** I receive confirmation: "Video uploaded successfully!"

**Technical Notes:** Use AWS S3 with CloudFront CDN, implement multipart upload, generate thumbnails with AWS Lambda/ffmpeg, scan with ClamAV/AWS GuardDuty, store metadata in `trick_videos` table

**Dependencies:** Story 1.2, Story 1.3

---

## Story 5.2: Select Trick Type from Predefined List

As a **user**,
I want **to select the trick type from a predefined list before requesting validation**,
So that **validators know what trick I attempted and can score accurately**.

**Acceptance Criteria:**

**Given** I have uploaded a trick video
**When** I proceed to request validation
**Then** I see a list of trick types organized by difficulty:
- **Beginner:** Ollie, Kickflip, Heelflip, Pop Shove-it (10 TRKTRK)
- **Intermediate:** Varial Kickflip, 360 Flip, Hardflip, Backside 180 (25 TRKTRK)
- **Advanced:** Nollie Flip, Switch Kickflip, Frontside 360, Backside 360 (50 TRKTRK)
- **Expert:** Laser Flip, Impossible, Gazelle Flip, Big Spin Flip (100 TRKTRK)
**And** I select the trick type I attempted
**And** the difficulty tier is automatically assigned based on trick type
**And** I can add optional notes about the attempt

**Technical Notes:** Store trick types in `trick_types` table with difficulty tiers, display in searchable dropdown/grid, auto-assign reward amount

**Dependencies:** Story 5.1

---

## Story 5.3: Request Validation from 3+ Connected Friends

As a **user**,
I want **to request validation from 3 or more connected friends**,
So that **I can get consensus on my trick attempt and earn tokens**.

**Acceptance Criteria:**

**Given** I have uploaded a video and selected a trick type
**When** I proceed to request validation
**Then** I see a list of my active friends (from friend network)
**And** I select at least 3 friends as validators (up to 10 max)
**And** selected friends receive push notifications: "New validation request from [User]"
**And** the validation request is created with status "pending"
**And** I see confirmation: "Validation request sent to [3] friends"
**And** I can view request status in My Tricks > Pending Validations

**Technical Notes:** Fetch active friends from `friend_connections` table, create request in `validation_requests` table, send push notifications via Firebase Cloud Messaging, rate limiting: max 10 requests per user per day

**Dependencies:** Story 5.2, Story 3.2

---

## Story 5.4: Validators View Validation Requests from Friends

As a **validator**,
I want **to view validation requests from my friends**,
So that **I can score their trick attempts and help them earn tokens**.

**Acceptance Criteria:**

**Given** I am logged in and have received validation requests
**When** I navigate to Validations > Pending Requests
**Then** I see a list of pending validation requests with: friend's username/wallet address, trick type/difficulty tier, video thumbnail, request timestamp, expected reward amount
**And** requests are sorted by timestamp (most recent first)
**And** I can filter requests by trick difficulty or friend
**And** I receive push notifications for new requests

**Technical Notes:** Fetch from `validation_requests` table, display video thumbnails from CloudFront CDN, implement real-time updates via WebSockets/polling, show badge for unread requests

**Dependencies:** Story 5.3

---

## Story 5.5: Validators Score Trick Attempts Across Three Criteria

As a **validator**,
I want **to score trick attempts across three criteria (Clean Landing 50%, Style 30%, Difficulty 20%)**,
So that **I can provide fair and consistent validation scores**.

**Acceptance Criteria:**

**Given** I am viewing a validation request
**When** I click "Validate" and watch the trick video
**Then** I see a scoring interface with three sliders:
- **Clean Landing (50%):** 0-10 scale
- **Style (30%):** 0-10 scale
- **Difficulty (20%):** 0-10 scale
**And** each slider shows real-time score contribution (e.g., "Clean Landing: 8/10 = 40%")
**And** total score is calculated automatically (weighted average)
**And** I can adjust scores before submitting
**And** I must score all three criteria to submit
**And** I can optionally provide text feedback (max 500 characters)
**And** I receive 5 TRKTRK bonus tokens for completing the validation

**Technical Notes:** Use shadcn/ui Slider component, calculate weighted score: (cleanLanding * 0.5) + (style * 0.3) + (difficulty * 0.2), store scores in `validation_scores` table, award validator bonus via ValidationManager.sol

**Dependencies:** Story 5.4, Story 1.6

---

## Story 5.6: Validators Provide Text Feedback on Trick Attempts

As a **validator**,
I want **to provide text feedback on trick attempts**,
So that **I can give constructive advice and encouragement to my friends**.

**Acceptance Criteria:**

**Given** I am scoring a validation request
**When** I enter text feedback in the feedback field
**Then** I can write up to 500 characters of feedback
**And** feedback is optional but encouraged
**And** feedback is displayed to the trick submitter after validation completes
**And** feedback is stored with the validation score
**And** I can use emojis in feedback (🔥, 💯, 🛹)
**And** inappropriate feedback can be reported by the submitter

**Technical Notes:** Store feedback in `validation_scores` table, implement character counter (500 max), sanitize feedback to prevent XSS attacks

**Dependencies:** Story 5.5

---

## Story 5.7: View Real-Time Validation Progress and Individual Scores

As a **user**,
I want **to view real-time validation progress and individual validator scores**,
So that **I can track my validation status and see how validators scored my trick**.

**Acceptance Criteria:**

**Given** I have submitted a validation request
**When** I navigate to My Tricks > Pending Validations
**Then** I see real-time progress for each validation:
- Number of validators who have responded (e.g., "2/3 validators")
- Individual validator scores (displayed after all validators respond)
- Average score across all validators
- Validation status (pending, in progress, completed, failed)
**And** scores update within 5 seconds of validator submission
**And** I receive push notifications when validators respond
**And** I can see which validators have not yet responded

**Technical Notes:** Use WebSockets or polling for real-time updates, fetch validation progress from `validation_scores` table, display progress bar showing completion percentage

**Dependencies:** Story 5.5

---

## Story 5.8: Retry Failed Validations with No Penalty

As a **user**,
I want **to retry failed validations with no penalty**,
So that **I can improve my trick and try again without losing tokens or reputation**.

**Acceptance Criteria:**

**Given** my validation failed (consensus < 90%)
**When** I view the failed validation result
**Then** I see a "Retry Validation" button
**And** I can upload a new video for the same trick type
**And** I can request validation from the same or different friends
**And** there is no penalty for failed attempts (no token deduction)
**And** failed attempts are marked in my history but don't affect reputation
**And** I can retry unlimited times until I succeed

**Technical Notes:** Store failed validations in Supabase with `status: 'failed'`, allow new validation request with same trick type, display retry button prominently in validation results

**Dependencies:** Story 5.9

---

## Story 5.9: System Aggregates Validator Scores and Determines Consensus (90% Threshold)

As a **system**,
I want **to aggregate validator scores and determine consensus (90% threshold)**,
So that **trick attempts are validated fairly and rewards are distributed accurately**.

**Acceptance Criteria:**

**Given** all validators have submitted scores for a validation request
**When** the system calculates the average score
**Then** the validation succeeds if average score ≥ 90%
**And** if successful, the user earns tokens based on trick difficulty tier: Beginner (10), Intermediate (25), Advanced (50), Expert (100)
**And** validators earn 5 TRKTRK bonus tokens each
**And** if failed (average < 90%), no tokens are distributed
**And** validation result is stored with final score and status

**Technical Notes:** Calculate average score: sum(validator_scores) / count(validators), determine success: average_score >= 9.0 (90%), trigger token distribution via ValidationManager.sol, store result in `validation_requests` table with `status: 'success'` or `'failed'`

**Dependencies:** Story 5.5, Story 4.2

---

## Story 5.10: System Distributes Base Trick Rewards on Validation Success

As a **system**,
I want **to distribute base trick rewards when validation succeeds**,
So that **users earn tokens for successfully validated tricks**.

**Acceptance Criteria:**

**Given** a validation succeeded (average score ≥ 90%)
**When** the system processes the reward distribution
**Then** the user receives tokens based on trick difficulty: Beginner (10), Intermediate (25), Advanced (50), Expert (100)
**And** validators receive 5 TRKTRK bonus tokens each
**And** tokens are distributed via ValidationManager.sol smart contract
**And** token balance updates within 30 seconds of blockchain confirmation
**And** user receives push notification: "You earned [X] TRKTRK for [Trick]!"
**And** transaction is recorded in token transaction history

**Technical Notes:** Call ValidationManager.sol `distributeRewards()` function, batch multiple reward distributions for gas optimization, wait for 2 block confirmations before updating UI, store transaction hash in `transactions` table

**Dependencies:** Story 5.9, Story 4.2
