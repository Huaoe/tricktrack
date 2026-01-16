# Story 2.5: Export Private Key or Seed Phrase Securely

Status: ready-for-dev

## Story

As a **user with an in-app wallet**,
I want **to export my private key or seed phrase securely**,
So that **I can import my wallet into other applications**.

## Acceptance Criteria

1. **Given** I am logged in with an in-app wallet
   **When** I navigate to Settings > Security > Export Wallet
   **Then** I see a warning about risks
   **And** I must re-authenticate to proceed
   **And** I can export private key or seed phrase
   **And** I must acknowledge risks before copying
   **And** export action is logged

## Tasks / Subtasks

- [ ] Create security settings page (AC: 1)
  - [ ] Create `src/app/settings/security/page.tsx`
  - [ ] Add navigation to security settings
  - [ ] Display export wallet option
  - [ ] Show security warning banner
- [ ] Implement warning dialog (AC: 1)
  - [ ] Create `src/components/security/ExportWarningDialog.tsx`
  - [ ] Display security risks clearly
  - [ ] List potential threats (phishing, malware, etc.)
  - [ ] Require user acknowledgment checkbox
- [ ] Add re-authentication flow (AC: 1)
  - [ ] Create `src/components/security/ReauthDialog.tsx`
  - [ ] Require Web3Auth re-login
  - [ ] Verify session is recent (< 5 minutes)
  - [ ] Handle authentication failure
- [ ] Implement private key export (AC: 1)
  - [ ] Use Web3Auth `getPrivateKey()` method
  - [ ] Display private key in secure format
  - [ ] Add copy to clipboard functionality
  - [ ] Clear from memory after viewing
- [ ] Implement seed phrase export (AC: 1)
  - [ ] Use Web3Auth `getSeedPhrase()` method
  - [ ] Display 12/24 word seed phrase
  - [ ] Add copy to clipboard functionality
  - [ ] Show word numbering for verification
- [ ] Add export logging (AC: 1)
  - [ ] Create audit log entry on export
  - [ ] Log timestamp, IP address, device
  - [ ] Store in `audit_logs` table
  - [ ] Send security notification email
- [ ] Implement secure display (AC: 1)
  - [ ] Blur private key by default
  - [ ] Require click to reveal
  - [ ] Auto-hide after 30 seconds
  - [ ] Prevent screenshots (where possible)
- [ ] Add confirmation flow (AC: 1)
  - [ ] Require typing "EXPORT" to confirm
  - [ ] Show final warning before export
  - [ ] Confirm user understands risks
  - [ ] Log confirmation timestamp
- [ ] Verify export functionality
  - [ ] Test re-authentication works
  - [ ] Verify private key exports correctly
  - [ ] Test seed phrase export
  - [ ] Confirm audit log entry created
  - [ ] Verify security notifications sent
  - [ ] Test on mobile devices

## Dev Notes

### Architecture Requirements

**Private Key Export** (from `@architecture.md`)

**Security Requirements:**
- AES-256 wallet encryption at rest (NFR8)
- Re-authentication required (security best practice)
- Audit logging for compliance (NFR16)
- Clear security warnings (UX principle)

**Risk Mitigation:**
- Multiple confirmation steps
- Security education
- Audit trail
- Time-limited access

### Web3Auth Private Key Access

**src/lib/web3auth.ts additions:**
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

export async function getSeedPhrase(): Promise<string> {
  if (!web3auth.provider) {
    throw new Error('Not connected');
  }

  // Note: Seed phrase availability depends on Web3Auth configuration
  const seedPhrase = await web3auth.provider.request({
    method: 'solana_seed_phrase', // or appropriate method
  });

  return seedPhrase as string;
}
```

### Components Implementation

**src/components/security/ExportWarningDialog.tsx:**
```typescript
'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  Button,
  Checkbox 
} from '@tricktrack/ui';
import { AlertTriangle } from 'lucide-react';

interface ExportWarningDialogProps {
  open: boolean;
  onClose: () => void;
  onProceed: () => void;
}

export const ExportWarningDialog = ({ open, onClose, onProceed }: ExportWarningDialogProps) => {
  const [acknowledged, setAcknowledged] = useState(false);

  const handleProceed = () => {
    if (acknowledged) {
      onProceed();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Security Warning
          </DialogTitle>
          <DialogDescription>
            Exporting your private key or seed phrase is dangerous
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-3">
            <p className="font-semibold text-sm">⚠️ Critical Risks:</p>
            <ul className="text-sm space-y-2 list-disc list-inside">
              <li>Anyone with your private key can steal all your funds</li>
              <li>Never share your private key with anyone</li>
              <li>TrickTrack will never ask for your private key</li>
              <li>Beware of phishing websites and fake support</li>
              <li>Store your key offline in a secure location</li>
            </ul>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="acknowledge"
              checked={acknowledged}
              onCheckedChange={(checked) => setAcknowledged(checked as boolean)}
            />
            <label htmlFor="acknowledge" className="text-sm cursor-pointer">
              I understand the risks and will keep my private key secure
            </label>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button onClick={onClose} variant="outline" className="min-h-[44px]">
            Cancel
          </Button>
          <Button 
            onClick={handleProceed} 
            disabled={!acknowledged}
            variant="destructive"
            className="min-h-[44px]"
          >
            I Understand, Proceed
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

**src/components/security/ReauthDialog.tsx:**
```typescript
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from '@tricktrack/ui';
import { web3auth } from '@/lib/web3auth';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';

interface ReauthDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReauthDialog = ({ open, onClose, onSuccess }: ReauthDialogProps) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleReauth = async () => {
    try {
      setIsAuthenticating(true);
      
      // Trigger Web3Auth re-authentication
      await web3auth.connect();
      
      toast.success('Authentication successful');
      onSuccess();
    } catch (error) {
      toast.error('Authentication failed. Please try again.');
      console.error(error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Re-authenticate Required
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            For your security, please re-authenticate to export your private key.
          </p>

          <Button
            onClick={handleReauth}
            disabled={isAuthenticating}
            className="w-full min-h-[44px]"
          >
            {isAuthenticating ? 'Authenticating...' : 'Re-authenticate'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

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

  useEffect(() => {
    // Auto-hide private key after 30 seconds
    if (isRevealed && privateKey) {
      const timer = setTimeout(() => {
        setIsRevealed(false);
        toast.info('Private key hidden for security');
      }, 30000);
      setAutoHideTimer(timer);
      
      return () => {
        if (timer) clearTimeout(timer);
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
      await logExportAction('private_key');
      
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
                    ⏱️ Private key will auto-hide in 30 seconds
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

**src/app/settings/security/page.tsx:**
```typescript
import { PrivateKeyExport } from '@/components/security/PrivateKeyExport';
import { AlertTriangle } from 'lucide-react';

export default function SecuritySettingsPage() {
  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="text-muted-foreground">
          Manage your wallet security and export options
        </p>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold">Security Notice</p>
          <p className="text-muted-foreground">
            Never share your private key or seed phrase with anyone. TrickTrack will never ask for this information.
          </p>
        </div>
      </div>

      <PrivateKeyExport />
    </div>
  );
}
```

### Backend API Implementation

**apps/api/src/audit-logs/audit-logs.controller.ts:**
```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('audit-logs')
@Controller('audit-logs')
export class AuditLogsController {
  @Post()
  @ApiOperation({ summary: 'Create audit log entry' })
  async createLog(@Body() dto: CreateAuditLogDto) {
    // Save to database
    const log = {
      id: crypto.randomUUID(),
      action: dto.action,
      timestamp: dto.timestamp,
      userAgent: dto.userAgent,
      ipAddress: dto.ipAddress,
    };

    // Send security notification email
    // await this.emailService.sendSecurityAlert(user.email, dto.action);

    return { success: true, logId: log.id };
  }
}
```

### Testing Requirements

**Verification Steps:**
1. Navigate to Settings > Security
2. Click "Export Private Key"
3. Warning dialog appears with risks
4. Check acknowledgment checkbox
5. Click "I Understand, Proceed"
6. Re-authentication dialog appears
7. Complete re-authentication
8. Private key retrieved
9. Type "EXPORT" in confirmation field
10. Click "Reveal Private Key"
11. Private key displayed
12. Click "Copy" - copied to clipboard
13. Verify audit log entry created
14. Wait 30 seconds - key auto-hides
15. Test on mobile devices

**Security Testing:**
- Re-authentication required
- Cannot bypass warning dialog
- Audit log created on export
- Auto-hide timer works
- Copy functionality works
- Security notifications sent

**Success Criteria:**
- Warning dialog displays all risks clearly
- Re-authentication works correctly
- Private key exports successfully
- Audit logging captures all actions
- Auto-hide timer functions properly
- All touch targets meet 44px minimum

### Dependencies

**Story 2.1** - Web3Auth integration must be complete

### References

- [Source: `@stories-epic-02-wallet.md` - Story 2.5]
- [Source: `@prd.md` - FR4: Private key export]
- [Source: `@architecture.md` - Security Requirements]
- [Web3Auth Private Key Documentation](https://web3auth.io/docs/features/private-key)

## Dev Agent Record

### Agent Model Used

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

