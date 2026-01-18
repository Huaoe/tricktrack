# Environment Variables Configuration

This document lists all environment variables required for the TrickTrack platform across all services.

## Frontend (apps/web)

Create `.env.local` file in `apps/web/`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Blockchain Configuration (Alchemy only)
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key_here
NEXT_PUBLIC_CHAIN_ID=137

# Contract Addresses (deployed after Story 4.6/4.7)
NEXT_PUBLIC_TOKEN_ADDRESS=
NEXT_PUBLIC_VALIDATION_MANAGER_ADDRESS=
NEXT_PUBLIC_NFT_BADGE_FACTORY_ADDRESS=

# Web3Auth Configuration
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_web3auth_client_id_here

# Environment
NEXT_PUBLIC_ENV=development
```

### Vercel Secrets Configuration

Set these secrets in your Vercel dashboard:

1. **Environment Variables** (Settings → Environment Variables):
   - `NEXT_PUBLIC_API_URL` = `https://your-api.railway.app`
   - `NEXT_PUBLIC_ALCHEMY_API_KEY` = `<from Alchemy dashboard>`
   - `NEXT_PUBLIC_CHAIN_ID` = `137` (Polygon Mainnet only)
   - `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID` = `<from Web3Auth dashboard>`
   - `NEXT_PUBLIC_TOKEN_ADDRESS` = `<deployed contract address>`
   - `NEXT_PUBLIC_VALIDATION_MANAGER_ADDRESS` = `<deployed contract address>`
   - `NEXT_PUBLIC_NFT_BADGE_FACTORY_ADDRESS` = `<deployed contract address>`
   - `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` = `<from Google Analytics>`

2. **Build Environment Variables**:
   - `TURBO_TOKEN` = `<from Vercel Remote Cache>`
   - `TURBO_TEAM` = `<your team slug>`

## Backend (apps/api)

Create `.env` file in `apps/api/`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Database Configuration (Supabase)
DATABASE_URL=postgresql://user:password@host:port/database

# JWT Configuration
JWT_SECRET=your_jwt_secret_here_change_in_production
JWT_EXPIRATION=7d

# Blockchain Configuration (Alchemy only, Mainnet only)
ALCHEMY_POLYGON_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# Contract Addresses (deployed after Story 4.6/4.7)
TOKEN_ADDRESS=
VALIDATION_MANAGER_ADDRESS=
NFT_BADGE_FACTORY_ADDRESS=

# Cloudflare R2 Configuration (for video storage)
CLOUDFLARE_R2_ACCOUNT_ID=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET=tricktrack-videos
CLOUDFLARE_R2_PUBLIC_URL=

# Arweave Configuration (for NFT metadata storage)
ARWEAVE_WALLET_KEY=

# The Graph Configuration (for blockchain indexing)
GRAPH_API_KEY=

# Web3Auth Configuration
WEB3AUTH_VERIFIER_NAME=
WEB3AUTH_CLIENT_ID=

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

### Railway Secrets Configuration

Set these secrets in your Railway dashboard:

1. **Variables** tab:
   - `PORT` = `3001`
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = `https://your-app.vercel.app`
   - `DATABASE_URL` = `<from Supabase dashboard>`
   - `JWT_SECRET` = `<generate with: openssl rand -base64 32>`
   - `JWT_EXPIRATION` = `7d`
   - `ALCHEMY_POLYGON_URL` = `<from Alchemy dashboard>`
   - `TOKEN_ADDRESS` = `<deployed contract address>`
   - `VALIDATION_MANAGER_ADDRESS` = `<deployed contract address>`
   - `NFT_BADGE_FACTORY_ADDRESS` = `<deployed contract address>`
   - `CLOUDFLARE_R2_ACCOUNT_ID` = `<from Cloudflare dashboard>`
   - `CLOUDFLARE_R2_ACCESS_KEY_ID` = `<from Cloudflare R2 API tokens>`
   - `CLOUDFLARE_R2_SECRET_ACCESS_KEY` = `<from Cloudflare R2 API tokens>`
   - `CLOUDFLARE_R2_BUCKET` = `tricktrack-videos`
   - `CLOUDFLARE_R2_PUBLIC_URL` = `<your R2 public URL>`
   - `ARWEAVE_WALLET_KEY` = `<from Arweave wallet>`
   - `GRAPH_API_KEY` = `<from The Graph dashboard>`
   - `WEB3AUTH_VERIFIER_NAME` = `<from Web3Auth dashboard>`
   - `WEB3AUTH_CLIENT_ID` = `<from Web3Auth dashboard>`
   - `RATE_LIMIT_TTL` = `60`
   - `RATE_LIMIT_MAX` = `100`

## Smart Contracts (packages/contracts)

Create `.env` file in `packages/contracts/`:

```env
# Blockchain RPC URLs (Mainnet only)
ALCHEMY_POLYGON_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# Deployer Private Key
PRIVATE_KEY=your_wallet_private_key

# Polygonscan API Key (for contract verification)
POLYGONSCAN_API_KEY=your_polygonscan_api_key

# Gas Reporter
REPORT_GAS=false
COINMARKETCAP_API_KEY=

# Deployed Contract Addresses (updated after deployment)
TOKEN_ADDRESS=
VALIDATION_MANAGER_ADDRESS=
NFT_BADGE_FACTORY_ADDRESS=
```

## GitHub Actions Secrets

Configure these secrets in GitHub repository settings (Settings → Secrets and variables → Actions):

1. **Vercel Deployment**:
   - `VERCEL_TOKEN` = `<from Vercel account settings>`
   - `VERCEL_ORG_ID` = `<from Vercel project settings>`
   - `VERCEL_PROJECT_ID` = `<from Vercel project settings>`

2. **Railway Deployment**:
   - `RAILWAY_TOKEN` = `<from Railway account settings>`

3. **Turborepo Remote Cache**:
   - `TURBO_TOKEN` = `<from Vercel Remote Cache>`
   - `TURBO_TEAM` = `<your team slug>`

## How to Obtain API Keys

### Alchemy (Blockchain RPC)
1. Visit [https://www.alchemy.com/](https://www.alchemy.com/)
2. Sign up for free account
3. Create app for "Polygon Mainnet"
4. Copy API key from dashboard

### Web3Auth (Wallet Authentication)
1. Visit [https://dashboard.web3auth.io/](https://dashboard.web3auth.io/)
2. Create new project
3. Configure allowed origins
4. Copy Client ID

### Polygonscan (Contract Verification)
1. Visit [https://polygonscan.com/](https://polygonscan.com/)
2. Create account and log in
3. Go to API-KEYs section
4. Create new API key

### Cloudflare R2 (Video Storage)
1. Visit [https://dash.cloudflare.com/](https://dash.cloudflare.com/)
2. Navigate to R2 Object Storage
3. Create a new R2 bucket (e.g., `tricktrack-videos`)
4. Generate R2 API tokens (Manage R2 API Tokens)
5. Configure public access domain if needed

**Why Cloudflare R2?**
- S3-compatible API (easy migration)
- Zero egress fees (AWS charges $0.09/GB)
- ~90% cheaper than AWS S3
- Built-in CDN capabilities

### Supabase (Database)
1. Visit [https://supabase.com/](https://supabase.com/)
2. Create new project
3. Get connection string from project settings

### Arweave (NFT Metadata Storage)
1. Visit [https://www.arweave.org/](https://www.arweave.org/)
2. Create an Arweave wallet
3. Fund wallet with AR tokens for permanent storage
4. Export wallet key for backend integration

**Why Arweave?**
- Permanent storage with one-time payment
- Ideal for NFT metadata that should never disappear
- ~$5-10 per GB one-time cost

### The Graph (Blockchain Indexing)
1. Visit [https://thegraph.com/](https://thegraph.com/)
2. Create account and deploy subgraph
3. Get API key for querying indexed data

**Why The Graph?**
- Efficiently query blockchain events (trick validations, NFT transfers)
- Without it, you'd need to scan all blocks manually (very slow)
- Essential for marketplace and leaderboard features

### Google Analytics (Analytics)
1. Visit [https://analytics.google.com/](https://analytics.google.com/)
2. Create new property for your app
3. Get Measurement ID (G-XXXXXXXXXX)
4. Add to frontend configuration

## Security Best Practices

1. **Never commit `.env` files**: Always use `.env.example` as template
2. **Use strong secrets**: Generate with `openssl rand -base64 32`
3. **Rotate secrets regularly**: Change production secrets every 90 days
4. **Separate environments**: Use different keys for dev/staging/prod
5. **Restrict access**: Limit who can view production secrets
6. **Use secret management**: Consider AWS Secrets Manager or Vault for production
7. **Audit access logs**: Monitor who accesses secrets

## Environment Setup Commands

### Generate JWT Secret
```bash
openssl rand -base64 32
```

### Generate Random String
```bash
openssl rand -hex 16
```

### Test Environment Variables (Frontend)
```bash
cd apps/web
cat .env.local
pnpm dev
```

### Test Environment Variables (Backend)
```bash
cd apps/api
cat .env
pnpm dev
```

### Verify All Variables Are Set
```bash
# Check frontend
cd apps/web && node -e "require('dotenv').config({path:'.env.local'}); console.log(process.env)" | grep NEXT_PUBLIC

# Check backend
cd apps/api && node -e "require('dotenv').config(); console.log(process.env)" | grep -v "PATH\|PWD"
```

## Troubleshooting

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` matches backend URL
- Verify CORS is configured correctly in backend
- Check backend is running and accessible

### Contract interactions fail
- Verify all `NEXT_PUBLIC_*_ADDRESS` variables are set
- Check `NEXT_PUBLIC_CHAIN_ID` matches deployed network
- Ensure `NEXT_PUBLIC_ALCHEMY_API_KEY` is valid

### Database connection errors
- Verify `DATABASE_URL` format is correct
- Check database is accessible from Railway
- Ensure database user has correct permissions

### Deployment fails
- Check all required secrets are set in Vercel/Railway
- Verify build commands are correct
- Check logs for missing environment variables
