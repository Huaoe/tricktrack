# Story 2.1: Integrate Web3Auth for In-App Wallet Creation

Status: ready-for-dev

## Story

As a **new user**,
I want **to create an in-app wallet in under 30 seconds without email or KYC**,
So that **I can start using TrickTrack immediately without blockchain knowledge**.

## Acceptance Criteria

1. **Given** I am on the TrickTrack landing page
   **When** I click "Create Wallet"
   **Then** Web3Auth modal opens with social login options (Google, Twitter, Discord)
   **And** I authenticate and an Ethereum wallet is created
   **And** my wallet address is displayed
   **And** the process completes in under 30 seconds
   **And** my private key is encrypted by Web3Auth

## Tasks / Subtasks

- [ ] Install Web3Auth dependencies (AC: 1)
  - [ ] Install `@web3auth/modal` v7+
  - [ ] Install `@web3auth/base` for types
  - [ ] Install `@web3auth/ethereum-provider`
  - [ ] Install `@web3auth/openlogin-adapter`
- [ ] Configure Web3Auth client (AC: 1)
  - [ ] Create `src/lib/web3auth.ts` configuration file
  - [ ] Set up Web3Auth client ID (from dashboard)
  - [ ] Configure for Polygon network (chainId: 137)
  - [ ] Add social login providers (Google, Twitter, Discord)
  - [ ] Set up testnet configuration for development
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

### Architecture Requirements

**Web3 Wallet Integration** (from `@architecture.md`)

**Key Requirements:**
- In-app wallet creation < 30 seconds (NFR4, FR1)
- Zero blockchain knowledge required (UX principle)
- AES-256 wallet encryption at rest (NFR8)
- Social recovery support (FR3)
- Session management with 30-day expiration (FR5)

**Technology Stack:**
- Web3Auth Plug and Play SDK v7+
- Polygon network (low gas fees)
- Supabase for user data storage
- JWT for session management

### Web3Auth Configuration

**src/lib/web3auth.ts:**
```typescript
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!;

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0x89', // Polygon Mainnet
  rpcTarget: process.env.NEXT_PUBLIC_POLYGON_RPC_URL!,
  displayName: 'Polygon Mainnet',
  blockExplorer: 'https://polygonscan.com',
  ticker: 'MATIC',
  tickerName: 'Polygon',
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

export const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  chainConfig,
  privateKeyProvider,
  uiConfig: {
    appName: 'TrickTrack',
    mode: 'dark',
    loginMethodsOrder: ['google', 'twitter', 'discord'],
    defaultLanguage: 'en',
  },
});

// Configure OpenLogin adapter for social logins
const openloginAdapter = new OpenloginAdapter({
  adapterSettings: {
    loginConfig: {
      google: {
        verifier: 'tricktrack-google',
        typeOfLogin: 'google',
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      },
      twitter: {
        verifier: 'tricktrack-twitter',
        typeOfLogin: 'twitter',
        clientId: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!,
      },
      discord: {
        verifier: 'tricktrack-discord',
        typeOfLogin: 'discord',
        clientId: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
      },
    },
  },
});

web3auth.configureAdapter(openloginAdapter);

export async function initWeb3Auth() {
  await web3auth.initModal();
}

export async function loginWithWeb3Auth() {
  const provider = await web3auth.connect();
  return provider;
}

export async function getWalletAddress(): Promise<string> {
  const provider = web3auth.provider;
  if (!provider) throw new Error('Not connected');
  
  const ethersProvider = new ethers.BrowserProvider(provider);
  const signer = await ethersProvider.getSigner();
  return await signer.getAddress();
}

export async function logout() {
  await web3auth.logout();
}
```

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

**apps/api/src/users/users.service.ts:**
```typescript
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(private jwtService: JwtService) {}

  async create(createUserDto: CreateUserDto) {
    // Check if user exists
    const existingUser = await this.findByWalletAddress(createUserDto.walletAddress);
    
    if (existingUser) {
      // Return existing user with new token
      const token = this.generateToken(existingUser);
      return { user: existingUser, token };
    }

    // Create new user in Supabase
    const user = {
      id: crypto.randomUUID(),
      walletAddress: createUserDto.walletAddress,
      walletType: createUserDto.walletType,
      createdAt: new Date(),
      suspended: false,
    };

    // Save to database (Supabase integration)
    // await this.supabase.from('users').insert(user);

    const token = this.generateToken(user);
    
    return { user, token };
  }

  private generateToken(user: any): string {
    return this.jwtService.sign({
      sub: user.id,
      walletAddress: user.walletAddress,
    }, {
      expiresIn: '30d',
    });
  }

  async findByWalletAddress(walletAddress: string) {
    // Query Supabase
    // return await this.supabase.from('users').select('*').eq('wallet_address', walletAddress).single();
    return null;
  }
}
```

### Environment Variables

**apps/web/.env.example:**
```env
# Web3Auth
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_web3auth_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_TWITTER_CLIENT_ID=your_twitter_client_id
NEXT_PUBLIC_DISCORD_CLIENT_ID=your_discord_client_id

# Polygon
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY
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
8. Verify wallet address is valid Ethereum format

**Performance Metrics:**
- Wallet creation time: < 30 seconds (NFR4)
- Modal load time: < 2 seconds
- Database save time: < 1 second

**Success Criteria:**
- All social login providers work (Google, Twitter, Discord)
- Wallet address is valid and displayed
- User saved to database with correct wallet type
- Session persists across page reloads
- Performance meets < 30 second requirement

### Dependencies

**Story 1.2** - Next.js PWA must be set up
**Story 1.3** - Nest.js backend must be set up

### References

- [Source: `@stories-epic-02-wallet.md` - Story 2.1]
- [Source: `@architecture.md` - Web3 Integration]
- [Source: `@prd.md` - FR1: In-app wallet creation]
- [Source: `@ux-design-specification.md` - Web3 Complexity Abstraction]
- [Web3Auth Documentation](https://web3auth.io/docs/)
- [Polygon Documentation](https://docs.polygon.technology/)

## Dev Agent Record

### Agent Model Used

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

