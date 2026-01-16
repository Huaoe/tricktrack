# Story 1.8: Set Up Deployment Pipelines (Vercel, Railway, Polygon)

Status: ready-for-dev

## Story

As a **developer**,
I want **deployment pipelines configured for Vercel, Railway, and Polygon**,
So that **I can deploy the frontend, backend, and smart contracts to production**.

## Acceptance Criteria

1. **Given** the monorepo is fully configured
   **When** I push code to the main branch
   **Then** the frontend deploys to Vercel, backend deploys to Railway, and smart contracts can be deployed to Polygon
   **And** the setup includes CI/CD workflows, environment configurations, and deployment scripts

## Tasks / Subtasks

- [ ] Configure Vercel for Next.js frontend (AC: 1)
  - [ ] Create `vercel.json` configuration
  - [ ] Configure build settings for `apps/web`
  - [ ] Set up environment variables
  - [ ] Configure domain and preview deployments
- [ ] Configure Railway for Nest.js backend (AC: 1)
  - [ ] Create `railway.json` configuration
  - [ ] Configure build settings for `apps/api`
  - [ ] Set up environment variables
  - [ ] Configure database connection (Supabase)
- [ ] Set up GitHub Actions CI/CD (AC: 1)
  - [ ] Create `.github/workflows/ci.yml` for testing
  - [ ] Create `.github/workflows/deploy.yml` for deployments
  - [ ] Configure Turborepo remote caching
  - [ ] Add deployment triggers for main branch
- [ ] Configure smart contract deployment scripts (AC: 1)
  - [ ] Create deployment script for Mumbai testnet
  - [ ] Create deployment script for Polygon mainnet
  - [ ] Add contract verification scripts
  - [ ] Document deployment process
- [ ] Set up environment variable management (AC: 1)
  - [ ] Create `.env.example` files for each app
  - [ ] Document required environment variables
  - [ ] Configure secrets in Vercel
  - [ ] Configure secrets in Railway
- [ ] Configure production domains (AC: 1)
  - [ ] Set up custom domain for frontend (if available)
  - [ ] Set up custom domain for backend API (if available)
  - [ ] Configure CORS for production domains
  - [ ] Set up SSL certificates
- [ ] Add deployment health checks (AC: 1)
  - [ ] Create health check endpoint in backend
  - [ ] Configure Vercel health checks
  - [ ] Configure Railway health checks
  - [ ] Add monitoring alerts
- [ ] Create deployment documentation (AC: 1)
  - [ ] Document deployment process for each service
  - [ ] Create troubleshooting guide
  - [ ] Document rollback procedures
  - [ ] Add deployment checklist
- [ ] Verify deployment pipelines
  - [ ] Test Vercel deployment with preview
  - [ ] Test Railway deployment
  - [ ] Test smart contract deployment to Mumbai
  - [ ] Verify all services communicate correctly

## Dev Notes

### Architecture Requirements

**Deployment Strategy** (from `@architecture.md`)

**Infrastructure:**
- **Vercel (Frontend):** Zero-config Next.js deployment, global CDN, automatic HTTPS
- **Railway (Backend):** Docker-based deployment, auto-scaling, PostgreSQL support
- **Polygon Mainnet:** Smart contract deployment with low gas costs

**Performance Requirements:**
- App load time: < 3 seconds on 4G (NFR4)
- 99.5% platform uptime (NFR23)
- Transaction success rate: 99%+ (NFR24)

### Vercel Configuration

**vercel.json:**
```json
{
  "buildCommand": "cd ../.. && pnpm turbo run build --filter=web",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs",
  "installCommand": "pnpm install",
  "devCommand": "cd apps/web && pnpm dev",
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url",
    "NEXT_PUBLIC_ALCHEMY_API_KEY": "@alchemy-api-key"
  },
  "build": {
    "env": {
      "TURBO_TOKEN": "@turbo-token",
      "TURBO_TEAM": "@turbo-team"
    }
  }
}
```

**apps/web/.env.example:**
```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Blockchain
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_CHAIN_ID=137

# Contract Addresses (deployed after Story 4.6/4.7)
NEXT_PUBLIC_TOKEN_ADDRESS=
NEXT_PUBLIC_VALIDATION_MANAGER_ADDRESS=
NEXT_PUBLIC_NFT_BADGE_FACTORY_ADDRESS=

# Web3Auth
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_web3auth_client_id
```

### Railway Configuration

**railway.json:**
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd ../.. && pnpm install && pnpm turbo run build --filter=api"
  },
  "deploy": {
    "startCommand": "cd apps/api && pnpm start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**apps/api/.env.example:**
```env
# Server
PORT=3001
NODE_ENV=production

# Frontend
FRONTEND_URL=https://your-app.vercel.app

# Database (Supabase)
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=7d

# Blockchain
ALCHEMY_POLYGON_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY
INFURA_POLYGON_URL=https://polygon-mainnet.infura.io/v3/YOUR_PROJECT_ID

# Contract Addresses
TOKEN_ADDRESS=
VALIDATION_MANAGER_ADDRESS=
NFT_BADGE_FACTORY_ADDRESS=

# AWS S3 (for video storage)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
AWS_REGION=us-east-1
```

### GitHub Actions CI/CD

**.github/workflows/ci.yml:**
```yaml
name: CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9
      
      - name: Get pnpm store directory
        id: pnpm-cache
        run: echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT
      
      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Lint
        run: pnpm lint
      
      - name: Type check
        run: pnpm type-check
      
      - name: Run tests
        run: pnpm test
      
      - name: Build
        run: pnpm build
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
```

**.github/workflows/deploy.yml:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run tests
        run: pnpm test
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: apps/web
      
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up --service api
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### Smart Contract Deployment

**packages/contracts/scripts/deploy-mumbai.ts:**
```typescript
import { ethers } from 'hardhat';

async function main() {
  console.log('Deploying contracts to Mumbai testnet...');

  // Deploy TRKTRKToken
  const TRKTRKToken = await ethers.getContractFactory('TRKTRKToken');
  const token = await TRKTRKToken.deploy();
  await token.waitForDeployment();
  console.log('TRKTRKToken deployed to:', await token.getAddress());

  // Deploy ValidationManager
  const ValidationManager = await ethers.getContractFactory('ValidationManager');
  const validationManager = await ValidationManager.deploy(await token.getAddress());
  await validationManager.waitForDeployment();
  console.log('ValidationManager deployed to:', await validationManager.getAddress());

  // Deploy NFTBadgeFactory
  const NFTBadgeFactory = await ethers.getContractFactory('NFTBadgeFactory');
  const nftFactory = await NFTBadgeFactory.deploy();
  await nftFactory.waitForDeployment();
  console.log('NFTBadgeFactory deployed to:', await nftFactory.getAddress());

  console.log('\nDeployment complete!');
  console.log('Update .env files with these addresses:');
  console.log(`TOKEN_ADDRESS=${await token.getAddress()}`);
  console.log(`VALIDATION_MANAGER_ADDRESS=${await validationManager.getAddress()}`);
  console.log(`NFT_BADGE_FACTORY_ADDRESS=${await nftFactory.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

**Deployment Commands:**
```bash
# Deploy to Mumbai testnet
cd packages/contracts
pnpm deploy:mumbai

# Deploy to Polygon mainnet (production)
pnpm deploy:polygon

# Verify contracts on Polygonscan
pnpm verify --network polygon <CONTRACT_ADDRESS>
```

### Environment Variable Setup

**Required Secrets:**

**Vercel:**
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_ALCHEMY_API_KEY`
- `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID`
- `TURBO_TOKEN`
- `TURBO_TEAM`

**Railway:**
- `DATABASE_URL`
- `JWT_SECRET`
- `ALCHEMY_POLYGON_URL`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET`

**GitHub Actions:**
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `RAILWAY_TOKEN`
- `TURBO_TOKEN`
- `TURBO_TEAM`

### Health Check Endpoints

**apps/api/src/health/health.controller.ts:**
```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
```

### Deployment Checklist

**Pre-Deployment:**
- [ ] All tests pass locally
- [ ] Environment variables documented
- [ ] Database migrations ready
- [ ] Smart contracts tested on Mumbai
- [ ] API endpoints documented

**Deployment:**
- [ ] Deploy smart contracts to Polygon
- [ ] Update contract addresses in environment variables
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Verify health checks pass
- [ ] Test end-to-end functionality

**Post-Deployment:**
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify blockchain transactions
- [ ] Test user flows
- [ ] Update documentation

### Testing Requirements

**Verification Steps:**
1. Push code to feature branch - CI runs successfully
2. Create pull request - preview deployment created
3. Merge to main - production deployment triggered
4. Visit Vercel URL - frontend loads correctly
5. Visit Railway URL - API health check responds
6. Test API from frontend - CORS configured correctly
7. Deploy contracts to Mumbai - deployment succeeds

**Success Criteria:**
- CI/CD pipeline runs without errors
- Frontend deploys to Vercel successfully
- Backend deploys to Railway successfully
- Smart contracts can be deployed to Polygon
- All services communicate correctly
- Health checks pass
- Monitoring and alerts configured

### Dependencies

**All previous stories (1.1-1.7)** - Full monorepo must be configured

### References

- [Source: `@architecture.md` - Infrastructure & Deployment]
- [Source: `@stories-epic-01-foundation.md` - Story 1.8]
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Polygon Documentation](https://docs.polygon.technology/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## Dev Agent Record

### Agent Model Used

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

