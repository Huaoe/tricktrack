# Story 2.1.2: Web3Auth UI and User Integration

Status: ready-for-dev

## Story

As a **new user**,
I want **to create an in-app wallet through a simple UI in under 30 seconds**,
So that **I can start using TrickTrack immediately**.

## Acceptance Criteria

1. **Given** I am on the TrickTrack landing page
   **When** I click "Create Wallet"
   **Then** Web3Auth modal opens with social login options
   **And** I authenticate and my wallet is created
   **And** my wallet address is displayed
   **And** the process completes in under 30 seconds
   **And** my user data is saved to the database

## Tasks / Subtasks

- [ ] Create wallet creation UI (AC: 1)
  - [ ] Create `src/components/auth/CreateWalletButton.tsx`
  - [ ] Add "Create Wallet" button to landing page
  - [ ] Implement Web3Auth modal trigger
  - [ ] Add loading states during authentication
- [ ] Implement wallet creation flow (AC: 1)
  - [ ] Create `src/hooks/useWeb3Auth.ts` custom hook
  - [ ] Handle Web3Auth initialization
  - [ ] Implement social login authentication
  - [ ] Extract wallet address after authentication
  - [ ] Store wallet type as "in-app" in state
- [ ] Store user data in database (AC: 1)
  - [ ] Create API endpoint `POST /api/v1/users`
  - [ ] Create User DTO with wallet address validation
  - [ ] Save user to Supabase `users` table
  - [ ] Store wallet type (in-app vs external)
  - [ ] Return user profile with JWT token
- [ ] Implement wallet address display (AC: 1)
  - [ ] Create `src/components/wallet/WalletDisplay.tsx`
  - [ ] Show truncated address (0x1234...5678)
  - [ ] Display wallet type badge (in-app)
  - [ ] Add success toast notification
- [ ] Add session persistence (AC: 1)
  - [ ] Store Web3Auth session in localStorage
  - [ ] Implement auto-reconnect on page load
  - [ ] Handle session expiration gracefully
  - [ ] Clear session on logout
- [ ] Optimize performance (AC: 1)
  - [ ] Measure wallet creation time
  - [ ] Ensure < 30 second completion
  - [ ] Add performance monitoring
  - [ ] Optimize Web3Auth initialization
- [ ] Verify wallet creation
  - [ ] Test Google social login
  - [ ] Test Twitter social login
  - [ ] Test Discord social login
  - [ ] Verify wallet address is valid Ethereum address
  - [ ] Confirm user saved to database
  - [ ] Test session persistence across page reloads

## Dev Notes

### Custom Hook Implementation

**src/hooks/useWeb3Auth.ts:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { web3auth, initWeb3Auth, loginWithWeb3Auth, getWalletAddress, logout } from '@/lib/web3auth';
import { useRouter } from 'next/navigation';

export const useWeb3Auth = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        await initWeb3Auth();
        if (web3auth.connected) {
          const address = await getWalletAddress();
          setWalletAddress(address);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Web3Auth initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const createWallet = async () => {
    try {
      setIsLoading(true);
      const startTime = Date.now();
      
      await loginWithWeb3Auth();
      const address = await getWalletAddress();
      
      // Save user to database
      const response = await fetch('/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          walletType: 'in-app',
        }),
      });

      if (!response.ok) throw new Error('Failed to create user');

      const { user, token } = await response.json();
      
      // Store JWT token
      localStorage.setItem('auth_token', token);
      
      setWalletAddress(address);
      setIsConnected(true);
      
      const elapsedTime = Date.now() - startTime;
      console.log(`Wallet created in ${elapsedTime}ms`);
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Wallet creation failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await logout();
      setWalletAddress(null);
      setIsConnected(false);
      localStorage.removeItem('auth_token');
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    isConnected,
    walletAddress,
    isLoading,
    createWallet,
    disconnectWallet,
  };
};
```

### UI Components

**src/components/auth/CreateWalletButton.tsx:**
```typescript
'use client';

import { useState } from 'react';
import { Button } from '@tricktrack/ui';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';
import { toast } from 'sonner';

export const CreateWalletButton = () => {
  const { createWallet, isLoading } = useWeb3Auth();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateWallet = async () => {
    try {
      setIsCreating(true);
      await createWallet();
      toast.success('Wallet created successfully!');
    } catch (error) {
      toast.error('Failed to create wallet. Please try again.');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button
      onClick={handleCreateWallet}
      disabled={isLoading || isCreating}
      size="lg"
      className="min-h-[44px]"
    >
      {isCreating ? 'Creating Wallet...' : 'Create Wallet'}
    </Button>
  );
};
```

**src/components/wallet/WalletDisplay.tsx:**
```typescript
'use client';

import { Badge } from '@tricktrack/ui';

interface WalletDisplayProps {
  address: string;
  walletType: 'in-app' | 'external';
}

export const WalletDisplay = ({ address, walletType }: WalletDisplayProps) => {
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm">{truncateAddress(address)}</span>
      <Badge variant={walletType === 'in-app' ? 'default' : 'secondary'}>
        {walletType === 'in-app' ? 'In-App' : 'External'}
      </Badge>
    </div>
  );
};
```

### Backend API Implementation

**apps/api/src/users/dto/create-user.dto.ts:**
```typescript
import { IsEthereumAddress, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum WalletType {
  IN_APP = 'in-app',
  EXTERNAL = 'external',
}

export class CreateUserDto {
  @ApiProperty({ example: '0x1234567890123456789012345678901234567890' })
  @IsEthereumAddress()
  walletAddress: string;

  @ApiProperty({ enum: WalletType, example: WalletType.IN_APP })
  @IsEnum(WalletType)
  walletType: WalletType;
}
```

### Testing Requirements

**Verification Steps:**
1. Click "Create Wallet" button - Web3Auth modal opens
2. Select Google login - authentication succeeds
3. Wallet created - address displayed within 30 seconds
4. User saved to database - verify in Supabase
5. JWT token stored - verify in localStorage
6. Reload page - session persists
7. Test Twitter and Discord logins - all work

**Performance Metrics:**
- Wallet creation time: < 30 seconds (NFR4)
- Modal load time: < 2 seconds
- Database save time: < 1 second

**Success Criteria:**
- All social login providers work
- Wallet address is valid and displayed
- User saved to database with correct wallet type
- Session persists across page reloads
- Performance meets < 30 second requirement

### Dependencies

**Story 2.1.1** - Web3Auth configuration must be complete
**Story 1.3** - Nest.js backend must be set up

### References

- [Source: `@stories-epic-02-wallet.md` - Story 2.1]
- [Source: `@prd.md` - FR1: In-app wallet creation]
- [Source: `@ux-design-specification.md` - Web3 Complexity Abstraction]

## Dev Agent Record

### Agent Model Used

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

