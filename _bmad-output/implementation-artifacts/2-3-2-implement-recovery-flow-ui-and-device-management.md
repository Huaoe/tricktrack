# Story 2.3.2: Implement Recovery Flow UI and Device Management

Status: ready-for-dev

## Story

As a **user with an in-app wallet**,
I want **to recover my wallet via a simple UI and manage my devices**,
So that **I don't lose access if I lose my device**.

## Acceptance Criteria

1. **Given** I created an in-app wallet via Web3Auth
   **When** I log in on a new device with the same social account
   **Then** my wallet is automatically recovered with the same address
   **And** my token balance and history are intact
   **And** recovery completes in under 2 minutes
   **And** I can manage devices with access to my wallet

## Tasks / Subtasks

- [ ] Implement recovery flow UI (AC: 1)
  - [ ] Create `src/components/auth/RecoveryFlow.tsx`
  - [ ] Add "Recover Wallet" option on login page
  - [ ] Display recovery instructions
  - [ ] Show recovery progress indicator
- [ ] Handle automatic recovery (AC: 1)
  - [ ] Create `src/hooks/useWalletRecovery.ts`
  - [ ] Detect existing wallet on social login
  - [ ] Automatically restore wallet address
  - [ ] Verify wallet address matches previous session
  - [ ] Log recovery event
- [ ] Add recovery verification (AC: 1)
  - [ ] Verify recovered wallet address
  - [ ] Check token balance matches blockchain state
  - [ ] Validate transaction history integrity
  - [ ] Display recovery success message
- [ ] Implement email backup setup (AC: 1)
  - [ ] Create `src/components/settings/EmailBackup.tsx`
  - [ ] Prompt user to set up email backup after wallet creation
  - [ ] Send verification email
  - [ ] Confirm email backup is active
- [ ] Implement device management (AC: 1)
  - [ ] Create `src/components/settings/DeviceManagement.tsx`
  - [ ] List all devices with access to wallet
  - [ ] Allow revoking device access
  - [ ] Show last login time per device
- [ ] Add recovery testing (AC: 1)
  - [ ] Create recovery test flow
  - [ ] Measure recovery time
  - [ ] Verify data integrity after recovery
  - [ ] Test email backup recovery
- [ ] Verify recovery functionality
  - [ ] Test social recovery with Google account
  - [ ] Test social recovery with Twitter account
  - [ ] Test email backup recovery
  - [ ] Verify wallet address remains same
  - [ ] Confirm token balance is correct
  - [ ] Verify recovery completes in < 2 minutes

## Dev Notes

### Recovery Hook Implementation

**src/hooks/useWalletRecovery.ts:**
```typescript
'use client';

import { useState } from 'react';
import { web3auth, getWalletAddress } from '@/lib/web3auth';
import { verifyWalletBalance, restoreUserSession } from '@/lib/auth/recovery';
import { toast } from 'sonner';

export const useWalletRecovery = () => {
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryProgress, setRecoveryProgress] = useState(0);

  const recoverWallet = async () => {
    try {
      setIsRecovering(true);
      setRecoveryProgress(10);
      const startTime = Date.now();

      // Step 1: Authenticate with social login
      setRecoveryProgress(30);
      await web3auth.connect();

      // Step 2: Retrieve wallet address
      setRecoveryProgress(60);
      const address = await getWalletAddress();

      // Step 3: Verify wallet on blockchain
      setRecoveryProgress(80);
      const balance = await verifyWalletBalance(address);

      // Step 4: Restore session
      setRecoveryProgress(90);
      const token = await restoreUserSession(address);
      localStorage.setItem('auth_token', token);

      setRecoveryProgress(100);
      const elapsedTime = (Date.now() - startTime) / 1000;
      
      console.log(`Wallet recovered in ${elapsedTime}s`);
      toast.success(`Wallet recovered successfully! Balance: ${balance} TRKTRK`);

      return { address, balance, recoveryTime: elapsedTime };
    } catch (error) {
      console.error('Wallet recovery failed:', error);
      toast.error('Failed to recover wallet. Please try again.');
      throw error;
    } finally {
      setIsRecovering(false);
      setRecoveryProgress(0);
    }
  };

  return {
    isRecovering,
    recoveryProgress,
    recoverWallet,
  };
};
```

### UI Components

**src/components/auth/RecoveryFlow.tsx:**
```typescript
'use client';

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@tricktrack/ui';
import { useWalletRecovery } from '@/hooks/useWalletRecovery';
import { Shield, Mail, Smartphone } from 'lucide-react';

export const RecoveryFlow = () => {
  const { isRecovering, recoveryProgress, recoverWallet } = useWalletRecovery();

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Recover Your Wallet</CardTitle>
        <CardDescription>
          Log in with your social account to automatically recover your wallet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Shield className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="font-medium text-sm">Social Recovery</p>
              <p className="text-xs text-muted-foreground">
                Use Google, Twitter, or Discord
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Mail className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="font-medium text-sm">Email Backup</p>
              <p className="text-xs text-muted-foreground">
                Recover via email verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Smartphone className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="font-medium text-sm">Device Share</p>
              <p className="text-xs text-muted-foreground">
                Automatic recovery on trusted devices
              </p>
            </div>
          </div>
        </div>

        {isRecovering && (
          <div className="space-y-2">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${recoveryProgress}%` }}
              />
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Recovering wallet... {recoveryProgress}%
            </p>
          </div>
        )}

        <Button
          onClick={recoverWallet}
          disabled={isRecovering}
          className="w-full min-h-[44px]"
        >
          {isRecovering ? 'Recovering...' : 'Recover Wallet'}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Recovery typically completes in under 2 minutes
        </p>
      </CardContent>
    </Card>
  );
};
```

**src/components/settings/EmailBackup.tsx:**
```typescript
'use client';

import { useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@tricktrack/ui';
import { Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const EmailBackup = () => {
  const [email, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const setupEmailBackup = async () => {
    try {
      setIsSending(true);
      
      const response = await fetch('/api/v1/auth/email-backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Failed to set up email backup');

      toast.success('Verification email sent! Please check your inbox.');
      setIsVerified(true);
    } catch (error) {
      toast.error('Failed to set up email backup');
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Backup
        </CardTitle>
        <CardDescription>
          Add an email backup to recover your wallet if you lose access
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isVerified ? (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 text-green-500 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Email backup is active</span>
          </div>
        ) : (
          <>
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-[44px]"
            />
            <Button
              onClick={setupEmailBackup}
              disabled={!email || isSending}
              className="w-full min-h-[44px]"
            >
              {isSending ? 'Sending...' : 'Set Up Email Backup'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
```

**src/components/settings/DeviceManagement.tsx:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@tricktrack/ui';
import { Smartphone, Trash2 } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  lastLogin: Date;
  isCurrent: boolean;
}

export const DeviceManagement = () => {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    const response = await fetch('/api/v1/auth/devices');
    const data = await response.json();
    setDevices(data.devices);
  };

  const revokeDevice = async (deviceId: string) => {
    await fetch(`/api/v1/auth/devices/${deviceId}`, { method: 'DELETE' });
    loadDevices();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Device Management
        </CardTitle>
        <CardDescription>
          Manage devices with access to your wallet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {devices.map((device) => (
          <div
            key={device.id}
            className="flex items-center justify-between p-3 bg-muted rounded-lg"
          >
            <div className="flex-1">
              <p className="font-medium text-sm">{device.name}</p>
              <p className="text-xs text-muted-foreground">
                Last login: {new Date(device.lastLogin).toLocaleDateString()}
              </p>
              {device.isCurrent && (
                <span className="text-xs text-primary">Current device</span>
              )}
            </div>
            {!device.isCurrent && (
              <Button
                onClick={() => revokeDevice(device.id)}
                size="sm"
                variant="ghost"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
```

### Testing Requirements

**Verification Steps:**
1. Create wallet with Google login
2. Log out and clear browser data
3. Click "Recover Wallet"
4. Log in with same Google account
5. Wallet recovered with same address
6. Token balance matches blockchain state
7. Recovery completes in < 2 minutes
8. Test email backup setup
9. Test device management
10. Test device revocation

**Success Criteria:**
- Wallet address remains consistent across recoveries
- Token balance is accurate after recovery
- Recovery time < 2 minutes
- Email backup works correctly
- Device management functions properly

### Dependencies

**Story 2.3.1** - Web3Auth MFA configuration must be complete

### References

- [Source: `@stories-epic-02-wallet.md` - Story 2.3]
- [Web3Auth Recovery Documentation](https://web3auth.io/docs/features/account-recovery)

## Dev Agent Record

### Agent Model Used

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

