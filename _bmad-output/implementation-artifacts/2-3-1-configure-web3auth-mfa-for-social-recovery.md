# Story 2.3.1: Configure Web3Auth MFA for Social Recovery

Status: ready-for-dev

## Story

As a **developer**,
I want **to configure Web3Auth Multi-Factor Authentication for social recovery**,
So that **users can recover their wallets on new devices**.

## Acceptance Criteria

1. **Given** Web3Auth is configured
   **When** I enable MFA settings
   **Then** social recovery is enabled
   **And** email backup is configured
   **And** device share is set up
   **And** recovery mechanisms are ready for use

## Tasks / Subtasks

- [ ] Configure Web3Auth MFA (AC: 1)
  - [ ] Enable Multi-Factor Authentication in Web3Auth dashboard
  - [ ] Configure email backup as recovery method
  - [ ] Set up device share for additional security
  - [ ] Configure recovery share threshold
- [ ] Update Web3Auth configuration (AC: 1)
  - [ ] Update `src/lib/web3auth.ts` with MFA settings
  - [ ] Configure device share factor
  - [ ] Configure backup share factor
  - [ ] Configure social backup factor
  - [ ] Configure password factor
- [ ] Create recovery utility functions (AC: 1)
  - [ ] Create `src/lib/auth/recovery.ts`
  - [ ] Implement wallet verification function
  - [ ] Implement balance check function
  - [ ] Implement session restore function
- [ ] Set up backend recovery endpoint (AC: 1)
  - [ ] Create `POST /api/v1/users/restore` endpoint
  - [ ] Verify wallet address exists
  - [ ] Generate new JWT token
  - [ ] Return user session data
- [ ] Verify MFA configuration
  - [ ] Test MFA settings in Web3Auth dashboard
  - [ ] Verify recovery factors are enabled
  - [ ] Test configuration loads correctly
  - [ ] Confirm backend endpoint works

## Dev Notes

### Architecture Requirements

**Social Recovery** (from `@architecture.md`)

**Key Requirements:**
- Automatic wallet recovery via social login (FR3)
- Recovery time < 2 minutes (derived from NFR4)
- No loss of funds or transaction history
- Multi-device support

**Technology Stack:**
- Web3Auth MFA (Multi-Factor Authentication)
- Email backup via Web3Auth
- Device share management

### Web3Auth MFA Configuration

**Update src/lib/web3auth.ts:**
```typescript
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from '@web3auth/base';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';

export const web3auth = new Web3Auth({
  clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x89',
    rpcTarget: process.env.NEXT_PUBLIC_POLYGON_RPC_URL!,
  },
  uiConfig: {
    appName: 'TrickTrack',
    mode: 'dark',
    loginMethodsOrder: ['google', 'twitter', 'discord'],
    defaultLanguage: 'en',
  },
  // Enable MFA for recovery
  enableLogging: true,
});

const openloginAdapter = new OpenloginAdapter({
  adapterSettings: {
    mfaSettings: {
      deviceShareFactor: {
        enable: true,
        priority: 1,
        mandatory: false,
      },
      backUpShareFactor: {
        enable: true,
        priority: 2,
        mandatory: false,
      },
      socialBackupFactor: {
        enable: true,
        priority: 3,
        mandatory: false,
      },
      passwordFactor: {
        enable: true,
        priority: 4,
        mandatory: false,
      },
    },
  },
});

web3auth.configureAdapter(openloginAdapter);
```

### Recovery Utilities

**src/lib/auth/recovery.ts:**
```typescript
export async function verifyWalletBalance(address: string): Promise<number> {
  const response = await fetch(`/api/v1/tokens/balance/${address}`);
  const { balance } = await response.json();
  return balance;
}

export async function restoreUserSession(address: string): Promise<string> {
  const response = await fetch('/api/v1/users/restore', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress: address }),
  });

  const { token } = await response.json();
  return token;
}
```

### Backend API Implementation

**apps/api/src/users/users.controller.ts:**
```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  @Post('restore')
  @ApiOperation({ summary: 'Restore user session after wallet recovery' })
  async restoreSession(@Body() dto: { walletAddress: string }) {
    // Find user by wallet address
    const user = await this.usersService.findByWalletAddress(dto.walletAddress);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate new JWT token
    const token = this.jwtService.generateToken({
      sub: user.id,
      walletAddress: user.walletAddress,
      walletType: user.walletType,
    });

    return { user, token };
  }
}
```

### Testing Requirements

**Verification Steps:**
1. Enable MFA in Web3Auth dashboard
2. Update Web3Auth configuration with MFA settings
3. Create recovery utility functions
4. Create backend restore endpoint
5. Test configuration loads without errors
6. Verify all recovery factors are enabled

**Success Criteria:**
- MFA settings configured in Web3Auth
- Configuration file updated with recovery factors
- Recovery utilities created
- Backend endpoint ready for session restoration
- Ready for recovery UI implementation in Story 2.3.2

### Dependencies

**Story 2.1.1** - Web3Auth configuration must be complete

### References

- [Source: `@stories-epic-02-wallet.md` - Story 2.3]
- [Source: `@prd.md` - FR3: Social recovery]
- [Web3Auth MFA Documentation](https://web3auth.io/docs/features/mfa)

## Dev Agent Record

### Agent Model Used

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

