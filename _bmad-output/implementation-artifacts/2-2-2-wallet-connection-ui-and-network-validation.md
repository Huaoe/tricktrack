# Story 2.2.2: Wallet Connection UI and Network Validation

Status: ready-for-dev

## Story

As a **crypto-savvy user**,
I want **to connect my existing wallet and have it validated for the correct network**,
So that **I can use TrickTrack with my preferred wallet on Polygon**.

## Acceptance Criteria

1. **Given** I am on the landing page
   **When** I click "Connect Wallet"
   **Then** Web3Modal opens with wallet options
   **And** I select my wallet and approve connection
   **And** my wallet address is displayed
   **And** connection persists across sessions
   **And** I am prompted to switch to Polygon if on wrong network

## Tasks / Subtasks

- [ ] Create wallet connection UI (AC: 1)
  - [ ] Create `src/components/auth/ConnectWalletButton.tsx`
  - [ ] Add "Connect Wallet" button to landing page
  - [ ] Implement Web3Modal trigger
  - [ ] Add loading states during connection
- [ ] Implement wallet connection flow (AC: 1)
  - [ ] Create `src/hooks/useWallet.ts` custom hook
  - [ ] Handle wallet connection with wagmi
  - [ ] Extract wallet address after connection
  - [ ] Store wallet type as "external" in state
- [ ] Store user data in database (AC: 1)
  - [ ] Reuse `POST /api/v1/users` endpoint
  - [ ] Save external wallet user to database
  - [ ] Store wallet type as "external"
  - [ ] Return user profile with JWT token
- [ ] Implement session persistence (AC: 1)
  - [ ] Store wallet connection in localStorage
  - [ ] Implement auto-reconnect on page load
  - [ ] Handle disconnection gracefully
  - [ ] Clear session on manual disconnect
- [ ] Add network validation (AC: 1)
  - [ ] Check if user is on Polygon network
  - [ ] Create `src/components/wallet/NetworkSwitcher.tsx`
  - [ ] Prompt network switch if on wrong network
  - [ ] Handle network switch approval/rejection
  - [ ] Display network status indicator
- [ ] Create wallet info display (AC: 1)
  - [ ] Create `src/components/wallet/WalletInfo.tsx`
  - [ ] Display connected wallet address
  - [ ] Show disconnect button
  - [ ] Display wallet type badge
- [ ] Verify wallet connection
  - [ ] Test MetaMask connection
  - [ ] Test WalletConnect connection
  - [ ] Test Coinbase Wallet connection
  - [ ] Verify wallet address is valid
  - [ ] Confirm user saved to database
  - [ ] Test session persistence across page reloads
  - [ ] Test network switching to Polygon

## Dev Notes

### Custom Hook Implementation

**src/hooks/useWallet.ts:**
```typescript
'use client';

import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useWallet = () => {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const router = useRouter();

  // Check if on correct network
  const isCorrectNetwork = chain?.id === polygon.id;

  useEffect(() => {
    if (isConnected && address) {
      // Save user to database
      saveUserToDatabase(address);
    }
  }, [isConnected, address]);

  const connectWallet = async (connectorId?: string) => {
    try {
      const connector = connectorId 
        ? connectors.find(c => c.id === connectorId)
        : connectors[0];

      if (!connector) throw new Error('Connector not found');

      connect({ connector });
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    disconnect();
    localStorage.removeItem('auth_token');
    router.push('/');
  };

  const switchToPolygon = () => {
    if (!isCorrectNetwork) {
      switchChain({ chainId: polygon.id });
    }
  };

  const saveUserToDatabase = async (walletAddress: string) => {
    try {
      const response = await fetch('/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          walletType: 'external',
        }),
      });

      if (!response.ok) throw new Error('Failed to save user');

      const { token } = await response.json();
      localStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  return {
    address,
    isConnected,
    isCorrectNetwork,
    isPending,
    connectors,
    connectWallet,
    disconnectWallet,
    switchToPolygon,
  };
};
```

### UI Components

**src/components/auth/ConnectWalletButton.tsx:**
```typescript
'use client';

import { Button } from '@tricktrack/ui';
import { useWallet } from '@/hooks/useWallet';
import { toast } from 'sonner';
import { useWeb3Modal } from '@web3modal/wagmi/react';

export const ConnectWalletButton = () => {
  const { isConnected, isPending } = useWallet();
  const { open } = useWeb3Modal();

  const handleConnect = async () => {
    try {
      await open();
      toast.success('Wallet connected successfully!');
    } catch (error) {
      toast.error('Failed to connect wallet. Please try again.');
      console.error(error);
    }
  };

  if (isConnected) {
    return null;
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isPending}
      size="lg"
      variant="outline"
      className="min-h-[44px]"
    >
      {isPending ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
};
```

**src/components/wallet/NetworkSwitcher.tsx:**
```typescript
'use client';

import { Button } from '@tricktrack/ui';
import { useWallet } from '@/hooks/useWallet';
import { AlertCircle } from 'lucide-react';

export const NetworkSwitcher = () => {
  const { isConnected, isCorrectNetwork, switchToPolygon } = useWallet();

  if (!isConnected || isCorrectNetwork) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md">
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <div className="flex-1">
        <p className="font-semibold">Wrong Network</p>
        <p className="text-sm">Please switch to Polygon network</p>
      </div>
      <Button onClick={switchToPolygon} size="sm" variant="secondary">
        Switch Network
      </Button>
    </div>
  );
};
```

**src/components/wallet/WalletInfo.tsx:**
```typescript
'use client';

import { useWallet } from '@/hooks/useWallet';
import { WalletDisplay } from './WalletDisplay';
import { Button } from '@tricktrack/ui';

export const WalletInfo = () => {
  const { address, isConnected, disconnectWallet } = useWallet();

  if (!isConnected || !address) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <WalletDisplay address={address} walletType="external" />
      <Button onClick={disconnectWallet} size="sm" variant="ghost">
        Disconnect
      </Button>
    </div>
  );
};
```

### Testing Requirements

**Verification Steps:**
1. Click "Connect Wallet" - Web3Modal opens
2. Select MetaMask - connection succeeds
3. Approve connection - wallet address displayed
4. User saved to database - verify in Supabase
5. JWT token stored - verify in localStorage
6. Reload page - wallet reconnects automatically
7. Test WalletConnect - mobile wallet connection works
8. Test Coinbase Wallet - connection succeeds
9. Switch to wrong network - prompt appears
10. Click "Switch Network" - switches to Polygon

**Wallet Compatibility:**
- MetaMask (browser extension)
- WalletConnect (mobile wallets)
- Coinbase Wallet
- Trust Wallet
- Hardware wallets (Ledger, Trezor via WalletConnect)

**Success Criteria:**
- All wallet providers connect successfully
- Wallet address is valid and displayed
- User saved to database with "external" wallet type
- Session persists across page reloads
- Network validation works correctly
- Disconnection clears session properly

### Dependencies

**Story 2.2.1** - wagmi and Web3Modal configuration must be complete
**Story 1.3** - Nest.js backend must be set up (for user API)

### References

- [Source: `@stories-epic-02-wallet.md` - Story 2.2]
- [Source: `@prd.md` - FR2: External wallet connection]
- [wagmi Documentation](https://wagmi.sh/)
- [viem Documentation](https://viem.sh/)

## Dev Agent Record

### Agent Model Used

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

