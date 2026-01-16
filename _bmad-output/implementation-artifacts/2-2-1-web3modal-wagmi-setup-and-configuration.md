# Story 2.2.1: Web3Modal & wagmi Setup and Configuration

Status: ready-for-dev

## Story

As a **developer**,
I want **to set up Web3Modal and wagmi for external wallet connections**,
So that **crypto-savvy users can connect their existing wallets**.

## Acceptance Criteria

1. **Given** Web3Modal and wagmi dependencies are installed
   **When** I configure wagmi with Polygon network
   **Then** wagmi is ready to support multiple wallet connectors
   **And** Web3Modal is configured with proper theme
   **And** the configuration is ready for UI integration

## Tasks / Subtasks

- [ ] Install Web3Modal and wagmi dependencies (AC: 1)
  - [ ] Install `@web3modal/wagmi` v3+
  - [ ] Install `wagmi` v2+
  - [ ] Install `viem` v2+
  - [ ] Install `@tanstack/react-query` for caching
- [ ] Configure wagmi (AC: 1)
  - [ ] Create `src/lib/wagmi.ts` configuration file
  - [ ] Set up WalletConnect project ID
  - [ ] Configure Polygon network
  - [ ] Add supported wallet connectors (MetaMask, WalletConnect, Coinbase)
- [ ] Configure Web3Modal (AC: 1)
  - [ ] Create `src/lib/web3modal.ts` configuration
  - [ ] Set up Web3Modal theme
  - [ ] Configure featured wallets
  - [ ] Set up project metadata
- [ ] Create wagmi provider wrapper (AC: 1)
  - [ ] Create `src/providers/WagmiProvider.tsx`
  - [ ] Wrap app with WagmiConfig
  - [ ] Add QueryClientProvider
  - [ ] Initialize Web3Modal
- [ ] Set up environment variables (AC: 1)
  - [ ] Add WalletConnect project ID to `.env.example`
  - [ ] Add Polygon RPC URLs
  - [ ] Document all required variables
- [ ] Verify wagmi configuration
  - [ ] Test wagmi initialization
  - [ ] Verify Polygon network configuration
  - [ ] Test wallet connector setup
  - [ ] Confirm Web3Modal theme loads

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
1. Install all wagmi and Web3Modal dependencies
2. Create wagmi configuration with Polygon network
3. Create Web3Modal configuration with theme
4. Set up WagmiProvider wrapper
5. Add provider to app layout
6. Test configuration initialization

**Success Criteria:**
- All dependencies installed correctly
- wagmi configuration created with connectors
- Web3Modal theme configured
- Provider wrapper integrated in layout
- Ready for wallet connection UI in Story 2.2.2

### Dependencies

**Story 1.2** - Next.js PWA must be set up

### References

- [Source: `@stories-epic-02-wallet.md` - Story 2.2]
- [Source: `@architecture.md` - Web3 Integration]
- [wagmi Documentation](https://wagmi.sh/)
- [Web3Modal Documentation](https://docs.walletconnect.com/web3modal/about)

## Dev Agent Record

### Agent Model Used

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

