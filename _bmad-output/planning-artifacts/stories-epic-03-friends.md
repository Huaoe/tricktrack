# Epic 3: Friend Connection Network via QR Codes

**Epic Goal:** Users can connect with friends by scanning QR codes, establishing mutual validation rights.

**FRs covered:** FR6, FR7, FR8, FR9, FR10

---

## Story 3.1: Generate ECDSA-Signed QR Code for Friend Connection

As a **user**,
I want **to generate a QR code for friend connection**,
So that **my friends can scan it to add me to their validation network**.

**Acceptance Criteria:**

**Given** I am logged in
**When** I navigate to Friends > Add Friend > Generate QR Code
**Then** a QR code is generated containing my wallet address, timestamp (5-min validity), and ECDSA signature
**And** the QR code is displayed full-screen
**And** the QR code expires after 5 minutes and regenerates automatically

**Technical Notes:** Use `ethers.js` or `viem` for ECDSA signing, payload: `{address, timestamp, signature}`, use `qrcode.react`

**Dependencies:** Story 2.1 or 2.2

---

## Story 3.2: Scan QR Code to Establish Mutual Validation Rights

As a **user**,
I want **to scan another user's QR code to establish mutual validation rights**,
So that **we can validate each other's trick attempts**.

**Acceptance Criteria:**

**Given** my friend has generated a QR code
**When** I navigate to Friends > Add Friend > Scan QR Code
**Then** my device camera opens with QR scanner
**And** I scan my friend's QR code
**And** the app verifies ECDSA signature and timestamp
**And** if valid, a friend connection request is sent
**And** once accepted, we both appear in each other's friend lists

**Technical Notes:** Use `react-qr-scanner` or `html5-qrcode`, verify signature on backend, store in `friend_connections` table

**Dependencies:** Story 3.1, Story 1.3

---

## Story 3.3: View List of Connected Friends

As a **user**,
I want **to view my list of connected friends**,
So that **I can see who can validate my tricks**.

**Acceptance Criteria:**

**Given** I have connected friends
**When** I navigate to Friends > My Friends
**Then** I see a list of all friends with: wallet address (truncated), username, connection status, connection date
**And** friends are sorted by connection date (most recent first)
**And** I can search friends by username or wallet address
**And** I can filter by status (active, pending, removed)

**Technical Notes:** Fetch from `friend_connections` table, implement pagination (20 per page), cache with React Query

**Dependencies:** Story 3.2

---

## Story 3.4: Remove Friends from Validation Network

As a **user**,
I want **to remove friends from my validation network**,
So that **I can manage who has validation rights**.

**Acceptance Criteria:**

**Given** I am viewing my friend list
**When** I select a friend and click "Remove Friend"
**Then** a confirmation dialog appears
**And** I confirm the removal
**And** the friend is removed from my network (mutual removal)
**And** friend's status changes to "removed"
**And** we can no longer request validations from each other

**Technical Notes:** Update `friend_connections` with `status: 'removed'`, implement soft delete, prevent validation requests

**Dependencies:** Story 3.3

---

## Story 3.5: Display Friend Connection Status (Pending, Active, Removed)

As a **user**,
I want **to see friend connection status (pending, active, removed)**,
So that **I know which friends can validate my tricks**.

**Acceptance Criteria:**

**Given** I am viewing my friend list
**When** I look at each friend's status
**Then** I see: Pending (awaiting acceptance), Active (can validate), or Removed (cannot validate)
**And** pending requests show "Accept" or "Decline" button
**And** active friends show "Remove" button
**And** status badges are color-coded (Pending: Yellow, Active: Green, Removed: Gray)

**Technical Notes:** Store status in `friend_connections` enum, implement real-time updates via WebSockets or polling

**Dependencies:** Story 3.3
