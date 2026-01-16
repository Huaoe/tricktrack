# Story 2.2: Integrate Web3Modal for External Wallet Connection

Status: ready-for-dev

## Story

As a **crypto-savvy user**,
I want **to connect my existing wallet (MetaMask, WalletConnect, hardware wallet)**,
So that **I can use TrickTrack with my preferred wallet**.

## Acceptance Criteria

1. **Given** I am on the landing page
   **When** I click "Connect Wallet"
   **Then** Web3Modal opens with wallet options (MetaMask, WalletConnect, Coinbase Wallet, hardware wallets)
   **And** I select my wallet and approve connection
   **And** my wallet address is displayed
   **And** connection persists across sessions

## Tasks / Subtasks

- [ ] Install Web3Modal and wagmi dependencies (AC: 1)
  - [ ] Install `@web3modal/wagmi` v3+
  - [ ] Install `wagmi` v2+
  - [ ] Install `viem` v2+
  - [ ] Install `@tanstack/react-query` for caching
- [ ] Configure wagmi and Web3Modal (AC: 1)
  - [ ] Create `src/lib/wagmi.ts` configuration file
  - [ ] Set up WalletConnect project ID
  - [ ] Configure Polygon network
  - [ ] Add supported wallet connectors (MetaMask, WalletConnect, Coinbase)
  - [ ] Set up Web3Modal theme
- [ ] Create wagmi provider wrapper (AC: 1)
  - [ ] Create `src/providers/WagmiProvider.tsx`
  - [ ] Wrap app with WagmiConfig
  - [ ] Add QueryClientProvider
  - [ ] Initialize Web3Modal
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
  - [ ] Handle network switching to Polygon
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
  - [ ] Prompt network switch if on wrong network
  - [ ] Handle network switch approval/rejection
  - [ ] Display network status indicator
- [ ] Verify wallet connection
  - [ ] Test MetaMask connection
  - [ ] Test WalletConnect connection
  - [ ] Test Coinbase Wallet connection
  - [ ] Verify wallet address is valid
  - [ ] Confirm user saved to database
  - [ ] Test session persistence across page reloads
  - [ ] Test network switching to Polygon

## Dev Notes

### Architecture Requirements

**External Wallet Support** (from `@architecture.md`)

**Key Requirements:**
- Support multiple wallet providers (FR2)
- Connection persists across sessions
- Network validation (Polygon only)
- Seamless UX for crypto-savvy users

**Technology Stack:**
- Web3Modal v3+ (wallet connection UI)
- wagmi v2+ (React hooks for Ethereum)
- viem v2+ (TypeScript Ethereum library)
- WalletConnect v2 protocol

### wagmi Configuration

**src/lib/wagmi.ts:**
```typescript
import { createConfig, http } from 'wagmi';
import { polygon, polygonMumbai } from 'wagmi/chains';
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

export const config = createConfig({
  chains: [polygon, polygonMumbai],
  connectors: [
    injected({ target: 'metaMask' }),
    walletConnect({ 
      projectId,
      metadata: {
        name: 'TrickTrack',
        description: 'Skateboarding trick validation platform',
        url: 'https://tricktrack.app',
        icons: ['https://tricktrack.app/icon.png'],
      },
    }),
    coinbaseWallet({
      appName: 'TrickTrack',
      appLogoUrl: 'https://tricktrack.app/icon.png',
    }),
  ],
  transports: {
    [polygon.id]: http(process.env.NEXT_PUBLIC_POLYGON_RPC_URL),
    [polygonMumbai.id]: http(process.env.NEXT_PUBLIC_MUMBAI_RPC_URL),
  },
});
```

**src/lib/web3modal.ts:**
```typescript
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { config } from './wagmi';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

export const web3modal = createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#000000',
    '--w3m-border-radius-master': '8px',
  },
  featuredWalletIds: [
    // MetaMask
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
    // Coinbase Wallet
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
    // Trust Wallet
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
  ],
});
```

### Provider Setup

**src/providers/WagmiProvider.tsx:**
```typescript
'use client';

import { WagmiProvider as WagmiConfigProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/lib/wagmi';
import { ReactNode, useState } from 'react';

export const WagmiProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiConfigProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfigProvider>
  );
};
```

**Update apps/web/src/app/layout.tsx:**
```typescript
import { WagmiProvider } from '@/providers/WagmiProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider>
          {children}
        </WagmiProvider>
      </body>
    </html>
  );
}
```

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

### Environment Variables

**apps/web/.env.example:**
```env
# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Polygon RPC
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY
NEXT_PUBLIC_MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
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

**Story 1.2** - Next.js PWA must be set up
**Story 1.3** - Nest.js backend must be set up (for user API)

### References

- [Source: `@stories-epic-02-wallet.md` - Story 2.2]
- [Source: `@architecture.md` - Web3 Integration]
- [Source: `@prd.md` - FR2: External wallet connection]
- [wagmi Documentation](https://wagmi.sh/)
- [Web3Modal Documentation](https://docs.walletconnect.com/web3modal/about)
- [viem Documentation](https://viem.sh/)

## Dev Agent Record

### Agent Model Used

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

