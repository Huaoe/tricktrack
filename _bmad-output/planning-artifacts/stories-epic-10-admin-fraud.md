# Epic 10: Admin Operations & Fraud Detection

**Epic Goal:** Admins can monitor platform health, detect fraud patterns, manage sponsor challenges, and respond to security incidents.

**FRs covered:** FR40, FR41, FR42, FR43, FR44, FR45, FR46, FR47, FR48, FR49

---

## Story 10.1: Admins View Fraud Detection Dashboard with Validator Score Patterns

As an **admin**,
I want **to view a fraud detection dashboard with validator score patterns**,
So that **I can identify suspicious behavior and maintain platform integrity**.

**Acceptance Criteria:**

**Given** I am an authorized admin
**When** I navigate to Admin > Fraud Detection
**Then** I see analytics for: validator score patterns (outliers, always high/low scores), validation response times (unusually fast responses), friend network anomalies (circular validation rings), token earning rates (abnormal accumulation)
**And** suspicious accounts are flagged with severity levels (low, medium, high)
**And** I can view detailed activity logs for flagged accounts
**And** I can see statistical analysis: average scores per validator, score variance, validation frequency
**And** alerts are generated for statistical outliers (e.g., validator always scores 10/10)

**Technical Notes:** Implement fraud detection algorithms in backend, analyze validation data from `validation_scores` table, use statistical methods (z-score, standard deviation), display visualizations with charts, store fraud alerts in `fraud_alerts` table

**Dependencies:** Story 1.3, Story 5.5

---

## Story 10.2: Admins Flag Suspicious Accounts for Manual Review

As an **admin**,
I want **to flag suspicious accounts for manual review**,
So that **I can investigate potential fraud before taking action**.

**Acceptance Criteria:**

**Given** I am viewing the fraud detection dashboard
**When** I identify a suspicious account
**Then** I can click "Flag for Review" to mark the account
**And** I can add notes about the suspicious behavior
**And** I can assign severity level (low, medium, high)
**And** flagged accounts appear in a review queue
**And** other admins can see flagged accounts and add their observations
**And** flagged users are notified that their account is under review (optional)

**Technical Notes:** Store flags in `account_flags` table with admin ID, timestamp, notes, severity, implement review queue interface, allow multiple admins to collaborate on investigations

**Dependencies:** Story 10.1

---

## Story 10.3: Admins Freeze or Suspend User Accounts

As an **admin**,
I want **to freeze or suspend user accounts**,
So that **I can prevent fraudulent activity while investigating**.

**Acceptance Criteria:**

**Given** I have flagged an account for review
**When** I determine the account is engaging in fraud
**Then** I can freeze the account (temporary, pending investigation) or suspend the account (permanent ban)
**And** frozen accounts cannot: submit validation requests, validate others' tricks, transfer tokens, earn new rewards
**And** suspended accounts cannot log in or access the platform
**And** frozen/suspended users receive notification with reason and appeal process
**And** all admin actions are logged in audit logs
**And** frozen accounts can be unfrozen after investigation

**Technical Notes:** Update `users` table with `status: 'frozen'` or `'suspended'`, implement middleware to block actions for frozen/suspended accounts, send notification emails, log actions to `audit_logs` table

**Dependencies:** Story 10.2

---

## Story 10.4: Admins Unfreeze Accounts After Investigation

As an **admin**,
I want **to unfreeze accounts after investigation**,
So that **falsely flagged users can resume normal activity**.

**Acceptance Criteria:**

**Given** I have completed an investigation on a frozen account
**When** I determine the account is legitimate
**Then** I can unfreeze the account
**And** the user regains full access to all platform features
**And** the user receives notification: "Your account has been unfrozen"
**And** the unfreeze action is logged in audit logs with reason
**And** any pending rewards are distributed to the unfrozen account

**Technical Notes:** Update `users` table with `status: 'active'`, send notification email, log action to `audit_logs` table, process any pending transactions

**Dependencies:** Story 10.3

---

## Story 10.5: Admins View Anomaly Alerts for Statistical Outliers

As an **admin**,
I want **to view anomaly alerts for statistical outliers**,
So that **I can proactively detect fraud without manual monitoring**.

**Acceptance Criteria:**

**Given** the fraud detection system is running
**When** statistical anomalies are detected
**Then** alerts are generated automatically for: validators with score variance > 2 standard deviations, validation response times < 10 seconds consistently, users earning tokens > 3x average rate, circular validation patterns (A validates B, B validates A repeatedly)
**And** alerts appear in the admin dashboard with severity indicators
**And** I can click an alert to view detailed analysis
**And** I can dismiss false positive alerts
**And** alert thresholds can be configured by admins

**Technical Notes:** Implement automated anomaly detection with scheduled jobs (run hourly), use statistical analysis (z-score, IQR), store alerts in `fraud_alerts` table, send email/Slack notifications for high-severity alerts

**Dependencies:** Story 10.1

---

## Story 10.6: Admins Manually Create Sponsor Challenges via Backoffice Panel

As an **admin**,
I want **to manually create sponsor challenges via backoffice panel**,
So that **I can set up challenges for sponsors who have paid**.

**Acceptance Criteria:**

**Given** I am an authorized admin
**When** I navigate to Admin > Challenges > Create Challenge
**Then** I can enter challenge details: sponsor name/logo, challenge title/description, reward amount (TRKTRK), custom NFT badge design (upload image), duration (start/end dates), requirements (trick type, minimum score), max participants (optional)
**And** I can preview the challenge before publishing
**And** I can save as draft or publish immediately
**And** published challenges appear in the user feed
**And** I can edit or end challenges early if needed

**Technical Notes:** Create admin form with validation, upload sponsor logo and badge design to IPFS, store challenge in `sponsor_challenges` table, implement preview functionality, allow draft/published status

**Dependencies:** Story 1.3, Story 8.1

---

## Story 10.7: Admins Transfer Tokens from Treasury to Sponsor Wallets

As an **admin**,
I want **to transfer tokens from treasury to sponsor wallets**,
So that **sponsors can fund their challenges**.

**Acceptance Criteria:**

**Given** I am an authorized admin
**When** I navigate to Admin > Treasury > Transfer Tokens
**Then** I can enter: recipient wallet address (sponsor), amount (TRKTRK), purpose (e.g., "Fund Challenge: [Challenge Name]")
**And** if amount > 10,000 TRKTRK, the transfer requires multi-sig approval
**And** I can review transfer details before submitting
**And** the transfer is executed via TreasuryManager.sol
**And** the transfer is recorded in treasury transaction history
**And** sponsor receives notification when tokens are transferred

**Technical Notes:** Implement transfer form with validation, integrate with Gnosis Safe for multi-sig approvals, call TreasuryManager.sol `transferTokens()` function, log transaction in `treasury_transactions` table

**Dependencies:** Story 9.2, Story 4.5

---

## Story 10.8: Admins View Gas Cost Monitoring and Batch Processing Metrics

As an **admin**,
I want **to view gas cost monitoring and batch processing metrics**,
So that **I can optimize blockchain operations and control costs**.

**Acceptance Criteria:**

**Given** I am an authorized admin
**When** I navigate to Admin > Blockchain Metrics
**Then** I see: average gas cost per validation, total gas spent (daily, weekly, monthly), batch processing efficiency (validations per batch, gas savings), current gas price (Polygon network), transaction success rate, failed transaction logs
**And** I can view historical gas cost trends (chart)
**And** I can set gas price alerts (e.g., notify if gas > $0.05 per validation)
**And** I can view batch processing queue status (pending validations)

**Technical Notes:** Fetch gas costs from blockchain transaction receipts, calculate metrics from `transactions` table, use Polygon Gas Station API for current gas prices, display charts with Chart.js or similar, implement alerting via email/Slack

**Dependencies:** Story 4.9, Story 4.10

---

## Story 10.9: Admins Trigger Emergency Pause on Smart Contracts

As an **admin**,
I want **to trigger emergency pause on smart contracts**,
So that **I can stop operations if a critical vulnerability is detected**.

**Acceptance Criteria:**

**Given** I am an authorized admin with emergency pause permissions
**When** I detect a critical security issue
**Then** I can navigate to Admin > Emergency Controls > Pause Contracts
**And** I can select which contracts to pause: ValidationManager, NFTBadgeFactory, TreasuryManager
**And** I must confirm the pause action with a warning message
**And** paused contracts stop all operations (no validations, no badge minting, no transfers)
**And** users receive notification: "Platform temporarily paused for maintenance"
**And** the pause action is logged in audit logs
**And** I can unpause contracts when the issue is resolved

**Technical Notes:** Implement pause functionality using OpenZeppelin Pausable pattern, call contract `pause()` function via admin wallet, require multi-sig approval for pause/unpause, log actions to `audit_logs` table, display maintenance message to users

**Dependencies:** Story 4.2, Story 4.3, Story 4.5

---

## Story 10.10: Admins View Platform-Wide Analytics

As an **admin**,
I want **to view platform-wide analytics (users, validations, tokens distributed)**,
So that **I can monitor platform growth and health**.

**Acceptance Criteria:**

**Given** I am an authorized admin
**When** I navigate to Admin > Analytics
**Then** I see key metrics: total users (wallets connected), active users (daily, weekly, monthly), total validations (successful, failed), tokens distributed (total, by pool), NFT badges minted (by tier), sponsor challenges (active, completed), average validation score, validator participation rate
**And** I can view metrics by time period (daily, weekly, monthly, all-time)
**And** I can view charts and visualizations for trends
**And** I can export analytics data as CSV
**And** I can set up custom reports and dashboards

**Technical Notes:** Aggregate data from multiple tables (`users`, `validation_requests`, `transactions`, `badges`, `sponsor_challenges`), implement caching for performance, use Chart.js or similar for visualizations, implement CSV export functionality

**Dependencies:** Story 1.3
