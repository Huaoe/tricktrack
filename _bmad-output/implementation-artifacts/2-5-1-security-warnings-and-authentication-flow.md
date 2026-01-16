# Story 2.5.1: Security Warnings and Authentication Flow

Status: ready-for-dev

## Story

As a **developer**,
I want **to implement security warnings and re-authentication for private key export**,
So that **users understand the risks before exporting sensitive data**.

## Acceptance Criteria

1. **Given** I am logged in with an in-app wallet
   **When** I navigate to Settings > Security > Export Wallet
   **Then** I see comprehensive security warnings
   **And** I must acknowledge the risks
   **And** I must re-authenticate to proceed
   **And** all actions are logged for security audit

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
  - [ ] Add "I Understand, Proceed" button
- [ ] Add re-authentication flow (AC: 1)
  - [ ] Create `src/components/security/ReauthDialog.tsx`
  - [ ] Require Web3Auth re-login
  - [ ] Verify session is recent (< 5 minutes)
  - [ ] Handle authentication failure
  - [ ] Show authentication progress
- [ ] Implement audit logging (AC: 1)
  - [ ] Create backend endpoint `POST /api/v1/audit-logs`
  - [ ] Create audit log DTO
  - [ ] Log export attempts
  - [ ] Store timestamp, IP address, device info
  - [ ] Send security notification email
- [ ] Verify security flow
  - [ ] Test warning dialog displays all risks
  - [ ] Verify acknowledgment checkbox required
  - [ ] Test re-authentication works
  - [ ] Confirm audit logs are created
  - [ ] Test security notifications sent

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

**src/app/settings/security/page.tsx:**
```typescript
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
    </div>
  );
}
```

### Backend API Implementation

**apps/api/src/audit-logs/dto/create-audit-log.dto.ts:**
```typescript
import { IsString, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuditLogDto {
  @ApiProperty({ example: 'private_key_export' })
  @IsString()
  action: string;

  @ApiProperty()
  @IsDate()
  timestamp: Date;

  @ApiProperty()
  @IsString()
  userAgent: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ipAddress?: string;
}
```

**apps/api/src/audit-logs/audit-logs.controller.ts:**
```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@ApiTags('audit-logs')
@Controller('audit-logs')
export class AuditLogsController {
  @Post()
  @ApiOperation({ summary: 'Create audit log entry' })
  async createLog(@Body() dto: CreateAuditLogDto) {
    const log = {
      id: crypto.randomUUID(),
      action: dto.action,
      timestamp: dto.timestamp,
      userAgent: dto.userAgent,
      ipAddress: dto.ipAddress,
    };

    // Save to database
    // await this.auditLogsService.create(log);

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
3. Warning dialog appears with all risks
4. Try to proceed without checkbox - button disabled
5. Check acknowledgment checkbox - button enabled
6. Click "I Understand, Proceed"
7. Re-authentication dialog appears
8. Complete re-authentication
9. Verify audit log entry created

**Security Testing:**
- Cannot bypass warning dialog
- Cannot proceed without acknowledgment
- Re-authentication required
- Audit log captures all attempts
- Security notifications sent

**Success Criteria:**
- Warning dialog displays all risks clearly
- Acknowledgment required to proceed
- Re-authentication works correctly
- Audit logging captures all actions
- Ready for export implementation in Story 2.5.2

### Dependencies

**Story 2.1.1** - Web3Auth configuration must be complete

### References

- [Source: `@stories-epic-02-wallet.md` - Story 2.5]
- [Source: `@prd.md` - FR4: Private key export]
- [Source: `@architecture.md` - Security Requirements]

## Dev Agent Record

### Agent Model Used

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

