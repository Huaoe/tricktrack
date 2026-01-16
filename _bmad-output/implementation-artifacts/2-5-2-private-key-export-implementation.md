# Story 2.5.2: Private Key Export Implementation

Status: ready-for-dev

## Story

As a **user with an in-app wallet**,
I want **to export my private key after passing security checks**,
So that **I can import my wallet into other applications**.

## Acceptance Criteria

1. **Given** I have passed security warnings and re-authentication
   **When** I confirm the export action
   **Then** my private key is retrieved and displayed
   **And** I must type "EXPORT" to reveal the key
   **And** the key auto-hides after 30 seconds
   **And** I can copy the key to clipboard
   **And** the export action is logged

## Tasks / Subtasks

- [ ] Add Web3Auth private key access (AC: 1)
  - [ ] Update `src/lib/web3auth.ts` with `getPrivateKey()` function
  - [ ] Handle Web3Auth provider requests
  - [ ] Add error handling for key retrieval
- [ ] Implement private key export component (AC: 1)
  - [ ] Create `src/components/security/PrivateKeyExport.tsx`
  - [ ] Add export button
  - [ ] Integrate warning and reauth dialogs
  - [ ] Handle export flow state management
- [ ] Implement secure display (AC: 1)
  - [ ] Require typing "EXPORT" to reveal
  - [ ] Display private key in monospace font
  - [ ] Add copy to clipboard functionality
  - [ ] Implement auto-hide after 30 seconds
- [ ] Add confirmation flow (AC: 1)
  - [ ] Create confirmation input field
  - [ ] Validate "EXPORT" text input
  - [ ] Show reveal button when valid
  - [ ] Clear input after reveal
- [ ] Implement auto-hide timer (AC: 1)
  - [ ] Start 30-second timer on reveal
  - [ ] Show countdown indicator
  - [ ] Auto-hide key when timer expires
  - [ ] Show notification on auto-hide
- [ ] Add export logging (AC: 1)
  - [ ] Log private key export action
  - [ ] Log copy to clipboard action
  - [ ] Include timestamp and device info
  - [ ] Send security notification
- [ ] Verify export functionality
  - [ ] Test private key retrieval
  - [ ] Verify "EXPORT" confirmation works
  - [ ] Test auto-hide timer (30 seconds)
  - [ ] Confirm copy to clipboard works
  - [ ] Verify audit logs created
  - [ ] Test on mobile devices

## Dev Notes

### Web3Auth Private Key Access

**Update src/lib/web3auth.ts:**
```typescript
export async function getPrivateKey(): Promise<string> {
  if (!web3auth.provider) {
    throw new Error('Not connected');
  }

  const privateKey = await web3auth.provider.request({
    method: 'eth_private_key',
  });

  return privateKey as string;
}
```

### Private Key Export Component

**src/components/security/PrivateKeyExport.tsx:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input } from '@tricktrack/ui';
import { Eye, EyeOff, Copy, Key } from 'lucide-react';
import { getPrivateKey } from '@/lib/web3auth';
import { toast } from 'sonner';
import { ExportWarningDialog } from './ExportWarningDialog';
import { ReauthDialog } from './ReauthDialog';

export const PrivateKeyExport = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [showReauth, setShowReauth] = useState(false);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [autoHideTimer, setAutoHideTimer] = useState<NodeJS.Timeout | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(30);

  useEffect(() => {
    // Auto-hide private key after 30 seconds
    if (isRevealed && privateKey) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRevealed(false);
            toast.info('Private key hidden for security');
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      
      setAutoHideTimer(timer);
      
      return () => {
        if (timer) clearInterval(timer);
      };
    }
  }, [isRevealed, privateKey]);

  const handleExportClick = () => {
    setShowWarning(true);
  };

  const handleWarningProceed = () => {
    setShowWarning(false);
    setShowReauth(true);
  };

  const handleReauthSuccess = async () => {
    setShowReauth(false);
    
    try {
      const key = await getPrivateKey();
      setPrivateKey(key);
      
      // Log export action
      await logExportAction('private_key_export');
      
      toast.success('Private key retrieved. Handle with extreme care!');
    } catch (error) {
      toast.error('Failed to retrieve private key');
      console.error(error);
    }
  };

  const handleCopy = async () => {
    if (!privateKey) return;
    
    try {
      await navigator.clipboard.writeText(privateKey);
      toast.success('Private key copied to clipboard');
      
      // Log copy action
      await logExportAction('private_key_copy');
    } catch (error) {
      toast.error('Failed to copy private key');
    }
  };

  const handleReveal = () => {
    if (confirmText.toUpperCase() !== 'EXPORT') {
      toast.error('Please type EXPORT to confirm');
      return;
    }
    
    setIsRevealed(true);
    setConfirmText('');
    setTimeRemaining(30);
  };

  const logExportAction = async (action: string) => {
    await fetch('/api/v1/audit-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      }),
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Export Private Key
          </CardTitle>
          <CardDescription>
            Export your private key to import your wallet into other applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!privateKey ? (
            <Button
              onClick={handleExportClick}
              variant="destructive"
              className="min-h-[44px]"
            >
              Export Private Key
            </Button>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Type "EXPORT" to reveal private key:
                </label>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type EXPORT"
                  className="min-h-[44px]"
                />
              </div>

              {!isRevealed ? (
                <Button
                  onClick={handleReveal}
                  disabled={confirmText.toUpperCase() !== 'EXPORT'}
                  className="min-h-[44px]"
                >
                  Reveal Private Key
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-muted rounded-lg font-mono text-xs break-all">
                    {privateKey}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCopy}
                      size="sm"
                      variant="outline"
                      className="min-h-[44px] gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                    
                    <Button
                      onClick={() => setIsRevealed(false)}
                      size="sm"
                      variant="outline"
                      className="min-h-[44px] gap-2"
                    >
                      <EyeOff className="h-4 w-4" />
                      Hide
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    ⏱️ Auto-hiding in {timeRemaining} seconds
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <ExportWarningDialog
        open={showWarning}
        onClose={() => setShowWarning(false)}
        onProceed={handleWarningProceed}
      />

      <ReauthDialog
        open={showReauth}
        onClose={() => setShowReauth(false)}
        onSuccess={handleReauthSuccess}
      />
    </>
  );
};
```

### Testing Requirements

**Verification Steps:**
1. Complete security warnings and re-authentication
2. Private key retrieved successfully
3. Type "EXPORT" in confirmation field
4. Click "Reveal Private Key"
5. Private key displayed in monospace
6. Click "Copy" - key copied to clipboard
7. Wait 30 seconds - key auto-hides
8. Verify audit log entries created
9. Test on mobile devices

**Security Testing:**
- Cannot reveal without typing "EXPORT"
- Auto-hide timer works correctly
- Copy functionality works
- Audit logs capture all actions
- Security notifications sent

**Success Criteria:**
- Private key exports successfully
- "EXPORT" confirmation required
- Auto-hide timer functions properly (30 seconds)
- Copy to clipboard works
- Audit logging captures all actions
- All touch targets meet 44px minimum

### Dependencies

**Story 2.5.1** - Security warnings and authentication must be complete

### References

- [Source: `@stories-epic-02-wallet.md` - Story 2.5]
- [Web3Auth Private Key Documentation](https://web3auth.io/docs/features/private-key)

## Dev Agent Record

### Agent Model Used

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

