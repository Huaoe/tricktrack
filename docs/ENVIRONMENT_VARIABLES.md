# Environment Variables Configuration

This document lists all environment variables required for the TrickTrack platform across all services.

## Frontend (apps/web)

Create `.env.local` file in `apps/web/`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Blockchain Configuration
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
   - `NEXT_PUBLIC_CHAIN_ID` = `137`
   - `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID` = `<from Web3Auth dashboard>`
   - `NEXT_PUBLIC_TOKEN_ADDRESS` = `<deployed contract address>`
   - `NEXT_PUBLIC_VALIDATION_MANAGER_ADDRESS` = `<deployed contract address>`
   - `NEXT_PUBLIC_NFT_BADGE_FACTORY_ADDRESS` = `<deployed contract address>`

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

# Blockchain Configuration
ALCHEMY_POLYGON_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY
ALCHEMY_POLYGON_MUMBAI_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
INFURA_POLYGON_URL=https://polygon-mainnet.infura.io/v3/YOUR_PROJECT_ID

# Contract Addresses (deployed after Story 4.6/4.7)
TOKEN_ADDRESS=
VALIDATION_MANAGER_ADDRESS=
NFT_BADGE_FACTORY_ADDRESS=

# AWS S3 Configuration (for video storage)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
AWS_REGION=us-east-1

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
   - `ALCHEMY_POLYGON_MUMBAI_URL` = `<from Alchemy dashboard>`
   - `INFURA_POLYGON_URL` = `<from Infura dashboard>`
   - `TOKEN_ADDRESS` = `<deployed contract address>`
   - `VALIDATION_MANAGER_ADDRESS` = `<deployed contract address>`
   - `NFT_BADGE_FACTORY_ADDRESS` = `<deployed contract address>`
   - `AWS_ACCESS_KEY_ID` = `<from AWS IAM>`
   - `AWS_SECRET_ACCESS_KEY` = `<from AWS IAM>`
   - `AWS_S3_BUCKET` = `<your bucket name>`
   - `AWS_REGION` = `us-east-1`
   - `WEB3AUTH_VERIFIER_NAME` = `<from Web3Auth dashboard>`
   - `WEB3AUTH_CLIENT_ID` = `<from Web3Auth dashboard>`
   - `RATE_LIMIT_TTL` = `60`
   - `RATE_LIMIT_MAX` = `100`

## Smart Contracts (packages/contracts)

Create `.env` file in `packages/contracts/`:

```env
# Blockchain RPC URLs
ALCHEMY_POLYGON_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY
ALCHEMY_POLYGON_MUMBAI_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY

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
3. Create app for "Polygon" and "Polygon Mumbai"
4. Copy API keys from dashboard

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

### AWS S3 (Video Storage)
1. Log in to AWS Console
2. Create S3 bucket
3. Create IAM user with S3 permissions
4. Generate access keys

### Supabase (Database)
1. Visit [https://supabase.com/](https://supabase.com/)
2. Create new project
3. Get connection string from project settings

### CoinMarketCap (Gas Price API)
1. Visit [https://coinmarketcap.com/api/](https://coinmarketcap.com/api/)
2. Sign up for free API key
3. Use for gas price estimation

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
