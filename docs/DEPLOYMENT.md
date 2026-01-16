# Deployment Guide

This guide provides step-by-step instructions for deploying the TrickTrack platform to production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Deploy Frontend (Vercel)](#deploy-frontend-vercel)
4. [Deploy Backend (Railway)](#deploy-backend-railway)
5. [Deploy Smart Contracts (Polygon)](#deploy-smart-contracts-polygon)
6. [Post-Deployment](#post-deployment)
7. [Continuous Deployment](#continuous-deployment)
8. [Rollback Procedures](#rollback-procedures)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Accounts
- [ ] GitHub account with repository access
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] Railway account (sign up at https://railway.app)
- [ ] Alchemy account (sign up at https://www.alchemy.com)
- [ ] Supabase account (for database)
- [ ] AWS account (for S3 storage)
- [ ] Web3Auth account (for wallet authentication)

### Required Tools
- [ ] Node.js 20+ installed
- [ ] pnpm 9+ installed
- [ ] Git installed
- [ ] Metamask or similar wallet (with MATIC for deployments)

### Environment Preparation
- [ ] All tests passing locally: `pnpm test`
- [ ] Build successful locally: `pnpm build`
- [ ] Lint passing: `pnpm lint`
- [ ] Type check passing: `pnpm type-check`

## Initial Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/tricktrack.git
cd tricktrack
pnpm install
```

### 2. Configure Environment Variables
See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) for complete list.

### 3. Test Locally
```bash
# Terminal 1: Start backend
cd apps/api
pnpm dev

# Terminal 2: Start frontend
cd apps/web
pnpm dev

# Terminal 3: Run tests
pnpm test
```

Verify:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api/docs
- Health Check: http://localhost:3001/api/v1/health

## Deploy Frontend (Vercel)

### Step 1: Connect Repository

1. Log in to [Vercel](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select the `tricktrack` repository

### Step 2: Configure Build Settings

**Framework Preset**: Next.js

**Root Directory**: `apps/web`

**Build Command**:
```bash
cd ../.. && pnpm turbo run build --filter=web
```

**Output Directory**: `.next`

**Install Command**:
```bash
pnpm install --frozen-lockfile
```

### Step 3: Configure Environment Variables

Add environment variables in Vercel project settings:

```env
# Production
NEXT_PUBLIC_API_URL=https://api.tricktrack.app
NEXT_PUBLIC_ALCHEMY_API_KEY=<your_alchemy_key>
NEXT_PUBLIC_CHAIN_ID=137
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=<your_web3auth_client_id>

# Build
TURBO_TOKEN=<from_vercel_remote_cache>
TURBO_TEAM=<your_team_slug>
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Visit your Vercel URL: `https://your-project.vercel.app`

### Step 5: Configure Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your custom domain (e.g., `tricktrack.app`)
3. Configure DNS as instructed
4. Wait for SSL certificate provisioning

**Verification**:
```bash
curl https://tricktrack.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "...",
  "environment": "production",
  "version": "1.0.0",
  "backend": {"status": "connected", "url": "..."}
}
```

## Deploy Backend (Railway)

### Step 1: Create New Project

1. Log in to [Railway](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Select the `tricktrack` repository

### Step 2: Configure Service

**Service Name**: `tricktrack-api`

**Root Directory**: `apps/api`

**Build Command**: Automatic (Railway detects Nixpacks)

**Start Command**: Defined in `nixpacks.toml`:
```bash
cd apps/api && node dist/main
```

### Step 3: Configure Environment Variables

Add variables in Railway service settings:

```env
# Server
PORT=3001
NODE_ENV=production

# Frontend
FRONTEND_URL=https://tricktrack.app
PRODUCTION_DOMAIN=https://tricktrack.app

# Database (from Supabase)
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=<generate_with_openssl_rand_-base64_32>
JWT_EXPIRATION=7d

# Blockchain
ALCHEMY_POLYGON_URL=https://polygon-mainnet.g.alchemy.com/v2/<YOUR_KEY>
ALCHEMY_POLYGON_MUMBAI_URL=https://polygon-mumbai.g.alchemy.com/v2/<YOUR_KEY>
INFURA_POLYGON_URL=https://polygon-mainnet.infura.io/v3/<YOUR_KEY>

# AWS S3
AWS_ACCESS_KEY_ID=<your_aws_access_key>
AWS_SECRET_ACCESS_KEY=<your_aws_secret_key>
AWS_S3_BUCKET=<your_bucket_name>
AWS_REGION=us-east-1

# Web3Auth
WEB3AUTH_VERIFIER_NAME=<your_verifier>
WEB3AUTH_CLIENT_ID=<your_client_id>

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build and deployment
3. Visit Railway URL: `https://your-service.railway.app/api/v1/health`

### Step 5: Configure Custom Domain (Optional)

1. Go to Settings → Networking
2. Add custom domain: `api.tricktrack.app`
3. Configure DNS CNAME as instructed
4. Wait for SSL certificate

**Verification**:
```bash
curl https://api.tricktrack.app/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": 123,
  "environment": "production",
  "version": "1.0.0"
}
```

### Step 6: Update Frontend Environment

Update Vercel environment variable:
```env
NEXT_PUBLIC_API_URL=https://api.tricktrack.app
```

Redeploy frontend to apply changes.

## Deploy Smart Contracts (Polygon)

> **Note**: Smart contract deployment will be implemented in Epic 4. This section provides the deployment structure.

### Step 1: Prepare for Deployment

```bash
cd packages/contracts

# Compile contracts
pnpm compile

# Run tests
pnpm test

# Check gas usage
pnpm test:gas
```

### Step 2: Configure Wallet

1. Create `.env` file:
```env
ALCHEMY_POLYGON_MUMBAI_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_KEY
ALCHEMY_POLYGON_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_wallet_private_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

2. Fund deployer wallet:
   - Mumbai: Get free MATIC from [Mumbai Faucet](https://faucet.polygon.technology/)
   - Polygon: Purchase MATIC (minimum 0.1 MATIC recommended)

### Step 3: Deploy to Mumbai (Testnet)

```bash
# Deploy all contracts
pnpm deploy:mumbai

# Save contract addresses from output
# Update .env files:
TOKEN_ADDRESS=0x...
VALIDATION_MANAGER_ADDRESS=0x...
NFT_BADGE_FACTORY_ADDRESS=0x...
```

### Step 4: Test on Mumbai

1. Test contract interactions from frontend
2. Test validation flow
3. Test token transfers
4. Monitor transactions on [Mumbai Polygonscan](https://mumbai.polygonscan.com/)

### Step 5: Deploy to Polygon (Mainnet)

> ⚠️ **WARNING**: Production deployment - double-check everything!

```bash
# Final checks
pnpm test
pnpm test:coverage

# Deploy to mainnet
pnpm deploy:polygon

# Save contract addresses
# CRITICAL: Back up these addresses immediately!
```

### Step 6: Verify Contracts

```bash
# Set contract addresses in .env
export TOKEN_ADDRESS=0x...
export VALIDATION_MANAGER_ADDRESS=0x...
export NFT_BADGE_FACTORY_ADDRESS=0x...

# Verify on Polygonscan
pnpm verify:contracts
```

### Step 7: Update Environment Variables

Update contract addresses in:
- Vercel (frontend)
- Railway (backend)

Environment variables to update:
```env
# Frontend (Vercel)
NEXT_PUBLIC_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_VALIDATION_MANAGER_ADDRESS=0x...
NEXT_PUBLIC_NFT_BADGE_FACTORY_ADDRESS=0x...

# Backend (Railway)
TOKEN_ADDRESS=0x...
VALIDATION_MANAGER_ADDRESS=0x...
NFT_BADGE_FACTORY_ADDRESS=0x...
```

Redeploy both services to apply changes.

## Post-Deployment

### 1. Verify All Services

```bash
# Frontend
curl https://tricktrack.app/api/health

# Backend
curl https://api.tricktrack.app/api/v1/health

# API Documentation
open https://api.tricktrack.app/api/docs

# Contracts
open https://polygonscan.com/address/<TOKEN_ADDRESS>
```

### 2. Test Critical Flows

- [ ] User can visit the app
- [ ] PWA installation works
- [ ] API endpoints respond correctly
- [ ] CORS is configured correctly
- [ ] Health checks pass
- [ ] SSL certificates are valid

### 3. Configure Monitoring

- [ ] Set up uptime monitoring (UptimeRobot, BetterUptime)
- [ ] Configure error tracking (Sentry)
- [ ] Set up analytics (Vercel Analytics)
- [ ] Configure alerts for downtime

See [MONITORING.md](./MONITORING.md) for details.

### 4. Update Documentation

- [ ] Document contract addresses
- [ ] Update README with production URLs
- [ ] Create runbook for common issues
- [ ] Document rollback procedures

### 5. Communicate Launch

- [ ] Notify team of successful deployment
- [ ] Update status page
- [ ] Prepare support team
- [ ] Monitor for first 24 hours

## Continuous Deployment

### Automatic Deployments

**GitHub → Vercel (Frontend)**:
- Push to `main` branch
- GitHub Actions runs tests
- Vercel automatically deploys if tests pass

**GitHub → Railway (Backend)**:
- Push to `main` branch
- GitHub Actions runs tests
- Railway automatically deploys if tests pass

### Manual Deployments

**Vercel**:
```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy from local
cd apps/web
vercel --prod
```

**Railway**:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Preview Deployments

**Vercel**:
- Automatic preview for every pull request
- Preview URL: `https://tricktrack-git-branch-name.vercel.app`

**Railway**:
- Create preview environment for feature branches
- Configure in Railway dashboard

## Rollback Procedures

### Rollback Frontend (Vercel)

**Via Dashboard**:
1. Go to Vercel dashboard → Project → Deployments
2. Find the last working deployment
3. Click "..." → "Promote to Production"

**Via CLI**:
```bash
vercel rollback <deployment-url>
```

### Rollback Backend (Railway)

**Via Dashboard**:
1. Go to Railway dashboard → Service → Deployments
2. Click on previous deployment
3. Click "Redeploy"

**Via CLI**:
```bash
railway rollback
```

### Rollback Smart Contracts

> ⚠️ **WARNING**: Smart contracts cannot be rolled back once deployed!

**Options**:
1. Deploy new contract version
2. Update contract addresses in environment variables
3. Migrate data to new contracts
4. Notify users of contract migration

**Prevention**:
- Always test on Mumbai first
- Use upgradeable contracts pattern
- Implement emergency pause functionality
- Have migration plan ready

## Troubleshooting

### Deployment Fails

**Frontend (Vercel)**:
```bash
# Check build locally
cd apps/web
pnpm build

# Check logs in Vercel dashboard
# Common issues:
# - Missing environment variables
# - Build timeout
# - Out of memory
```

**Backend (Railway)**:
```bash
# Check build locally
cd apps/api
pnpm build

# Check logs in Railway dashboard
# Common issues:
# - Port binding error
# - Database connection failed
# - Missing environment variables
```

### Health Checks Fail

```bash
# Test locally
curl http://localhost:3000/api/health
curl http://localhost:3001/api/v1/health

# Check environment variables
# Check CORS configuration
# Check firewall rules
```

### CORS Errors

1. Verify `FRONTEND_URL` in Railway
2. Verify `NEXT_PUBLIC_API_URL` in Vercel
3. Check `apps/api/src/main.ts` CORS configuration
4. Ensure domains match exactly (with/without www)

### SSL Certificate Issues

1. Wait 5-10 minutes for provisioning
2. Verify DNS is correctly configured
3. Check Vercel/Railway dashboard for errors
4. Contact support if issue persists

### Smart Contract Deployment Fails

```bash
# Check wallet balance
# Verify RPC endpoint
# Increase gas limit
# Check network congestion
```

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Environment variables documented
- [ ] Database migrations ready (if any)
- [ ] Backup plan prepared
- [ ] Team notified of deployment

### Deployment
- [ ] Deploy backend first
- [ ] Verify backend health check
- [ ] Deploy frontend
- [ ] Verify frontend health check
- [ ] Deploy smart contracts (Epic 4)
- [ ] Update contract addresses
- [ ] Verify end-to-end functionality

### Post-Deployment
- [ ] All health checks passing
- [ ] Critical user flows tested
- [ ] Monitoring configured
- [ ] Team notified of completion
- [ ] Documentation updated
- [ ] Monitor for 24 hours

## Support

### Getting Help

- **Vercel**: https://vercel.com/support
- **Railway**: https://railway.app/help
- **Alchemy**: https://docs.alchemy.com/
- **GitHub Actions**: https://docs.github.com/en/actions

### Emergency Contacts

- DevOps Lead: [contact]
- Technical Lead: [contact]
- On-Call Engineer: [contact]

## References

- [Environment Variables](./ENVIRONMENT_VARIABLES.md)
- [Domain Configuration](./DOMAIN_CONFIGURATION.md)
- [Monitoring Setup](./MONITORING.md)
- [Smart Contract Deployment](../packages/contracts/scripts/DEPLOYMENT.md)
