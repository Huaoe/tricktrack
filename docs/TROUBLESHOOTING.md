# Deployment Troubleshooting Guide

This guide provides solutions to common deployment issues encountered when deploying the TrickTrack platform.

## Table of Contents
1. [Build Failures](#build-failures)
2. [Deployment Failures](#deployment-failures)
3. [Runtime Errors](#runtime-errors)
4. [Network Issues](#network-issues)
5. [Database Issues](#database-issues)
6. [Smart Contract Issues](#smart-contract-issues)

## Build Failures

### Frontend Build Fails (Vercel)

#### Error: "Module not found"
**Symptom**: Build fails with module import errors

**Solution**:
```bash
# Verify all dependencies are installed
cd apps/web
pnpm install

# Check if module exists
ls node_modules/<module-name>

# Verify package.json includes the dependency
cat package.json | grep <module-name>

# If missing, add it:
pnpm add <module-name>
```

#### Error: "Type errors"
**Symptom**: TypeScript compilation errors during build

**Solution**:
```bash
# Run type check locally
cd apps/web
pnpm type-check

# Fix errors
# Common issues:
# - Missing type definitions: pnpm add -D @types/<package>
# - Incorrect type imports
# - Strict mode violations
```

#### Error: "Out of memory"
**Symptom**: Build process runs out of memory

**Solution**:
1. Optimize build in `next.config.ts`:
```typescript
export default {
  experimental: {
    optimizePackageImports: ['@tricktrack/ui'],
  },
};
```

2. Contact Vercel support to increase memory limit

#### Error: "Build timeout"
**Symptom**: Build exceeds time limit

**Solution**:
- Optimize build performance
- Remove unused dependencies
- Use `pnpm` instead of `npm`
- Check for infinite loops in build scripts

### Backend Build Fails (Railway)

#### Error: "pnpm not found"
**Symptom**: Railway cannot find pnpm

**Solution**:
Ensure `nixpacks.toml` is configured:
```toml
[phases.setup]
nixPkgs = ["nodejs_20", "pnpm"]
```

#### Error: "Cannot find module"
**Symptom**: NestJS cannot resolve imports

**Solution**:
```bash
# Verify tsconfig paths
cat apps/api/tsconfig.json

# Ensure all imports use correct paths
# Run build locally
cd apps/api
pnpm build
```

#### Error: "Compilation failed"
**Symptom**: TypeScript compilation errors

**Solution**:
```bash
# Run type check
cd apps/api
pnpm type-check

# Fix errors
# Check for:
# - Missing types
# - Incorrect decorators
# - Import errors
```

## Deployment Failures

### Vercel Deployment Fails

#### Error: "Deployment failed to start"
**Symptom**: Deployment completes but app doesn't start

**Solution**:
1. Check build output directory in `vercel.json`:
```json
{
  "outputDirectory": ".next"
}
```

2. Verify output directory exists after build

3. Check Vercel function logs for errors

#### Error: "Environment variable missing"
**Symptom**: App fails at runtime due to missing env vars

**Solution**:
1. Go to Vercel → Project → Settings → Environment Variables
2. Add all required `NEXT_PUBLIC_*` variables
3. Redeploy

#### Error: "Too many redirects"
**Symptom**: App stuck in redirect loop

**Solution**:
Check for redirect loops in:
- `next.config.ts`
- Middleware
- Vercel rewrites configuration

### Railway Deployment Fails

#### Error: "Port binding failed"
**Symptom**: Service fails to start, port error in logs

**Solution**:
Ensure `PORT` environment variable is set:
```env
PORT=3001
```

And app uses it:
```typescript
await app.listen(process.env.PORT ?? 3001);
```

#### Error: "Health check failed"
**Symptom**: Railway keeps restarting service

**Solution**:
1. Verify health check endpoint exists:
```bash
curl https://your-service.railway.app/api/v1/health
```

2. Check `railway.json`:
```json
{
  "deploy": {
    "healthcheckPath": "/api/v1/health",
    "healthcheckTimeout": 100
  }
}
```

3. Increase timeout if app is slow to start

#### Error: "Database connection failed"
**Symptom**: Cannot connect to database

**Solution**:
```bash
# Verify DATABASE_URL is set
railway variables

# Test connection
psql $DATABASE_URL

# Common issues:
# - Incorrect connection string format
# - Database not accessible from Railway
# - SSL/TLS configuration
```

## Runtime Errors

### Frontend Runtime Errors

#### Error: "Failed to fetch API"
**Symptom**: Frontend cannot connect to backend

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` is correct:
```bash
# In Vercel dashboard
NEXT_PUBLIC_API_URL=https://api.tricktrack.app
```

2. Check CORS configuration in backend

3. Verify backend is accessible:
```bash
curl https://api.tricktrack.app/api/v1/health
```

#### Error: "Hydration mismatch"
**Symptom**: React hydration errors in console

**Solution**:
- Remove server/client rendering differences
- Check for `useEffect` issues
- Verify data fetching logic

#### Error: "Service worker registration failed"
**Symptom**: PWA service worker errors

**Solution**:
1. Verify `sw.js` is generated during build
2. Check service worker is served correctly
3. Ensure HTTPS is enabled (required for service workers)

### Backend Runtime Errors

#### Error: "CORS blocked"
**Symptom**: Browser blocks API requests due to CORS

**Solution**:
Update `apps/api/src/main.ts`:
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
```

Ensure `FRONTEND_URL` is set in Railway.

#### Error: "JWT validation failed"
**Symptom**: Authentication requests fail

**Solution**:
1. Verify `JWT_SECRET` is set and matches across deploys
2. Check token expiration
3. Verify token format

#### Error: "Validation failed"
**Symptom**: Request validation errors

**Solution**:
- Check request payload matches DTO
- Verify all required fields are sent
- Check data types match expected types

## Network Issues

### SSL Certificate Issues

#### Error: "Certificate not trusted"
**Symptom**: SSL warnings in browser

**Solution**:
1. Wait 5-10 minutes for certificate provisioning
2. Verify DNS is correctly configured
3. Check Vercel/Railway dashboard for SSL status
4. Hard refresh browser (Ctrl+Shift+R)

#### Error: "DNS not resolving"
**Symptom**: Domain doesn't resolve to deployment

**Solution**:
```bash
# Check DNS resolution
dig tricktrack.app
nslookup tricktrack.app

# Verify DNS records are correct
# Wait 24-48 hours for propagation
# Clear DNS cache locally
```

### API Connection Issues

#### Error: "Connection timeout"
**Symptom**: Requests to API timeout

**Solution**:
1. Check backend is running:
```bash
curl https://api.tricktrack.app/api/v1/health
```

2. Verify Railway service is not sleeping (free tier)
3. Check for rate limiting
4. Verify network connectivity

#### Error: "502 Bad Gateway"
**Symptom**: Backend returns 502 error

**Solution**:
- Check Railway logs for application errors
- Verify app is starting correctly
- Check memory and CPU usage
- Restart Railway service

## Database Issues

### Connection Errors

#### Error: "Connection pool exhausted"
**Symptom**: Cannot connect to database, pool full

**Solution**:
1. Increase connection pool size
2. Close connections properly
3. Check for connection leaks
4. Upgrade database plan if needed

#### Error: "SSL required"
**Symptom**: Database connection fails due to SSL

**Solution**:
Update connection string:
```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
```

### Migration Errors

#### Error: "Migration failed"
**Symptom**: Database migrations fail during deployment

**Solution**:
1. Run migrations manually:
```bash
railway run npm run migration:run
```

2. Verify migration files are correct
3. Check database permissions
4. Rollback and retry if needed

## Smart Contract Issues

### Deployment Errors

#### Error: "Insufficient funds"
**Symptom**: Contract deployment fails due to low balance

**Solution**:
```bash
# Check wallet balance
npx hardhat run scripts/check-balance.ts --network polygon

# Add more MATIC to deployer wallet
```

#### Error: "Gas estimation failed"
**Symptom**: Cannot estimate gas for deployment

**Solution**:
1. Increase gas limit in `hardhat.config.cjs`
2. Check for contract errors
3. Verify RPC endpoint is working
4. Try different RPC provider

#### Error: "Nonce too low"
**Symptom**: Transaction fails due to nonce issue

**Solution**:
- Wait for pending transactions to complete
- Reset Metamask account nonce
- Use different wallet temporarily

### Verification Errors

#### Error: "Contract verification failed"
**Symptom**: Polygonscan verification fails

**Solution**:
```bash
# Verify manually with constructor args
npx hardhat verify --network polygon \
  <CONTRACT_ADDRESS> \
  <CONSTRUCTOR_ARG_1> \
  <CONSTRUCTOR_ARG_2>

# Check compiler version matches
# Ensure optimization settings match
```

### Interaction Errors

#### Error: "Transaction reverted"
**Symptom**: Contract calls fail and revert

**Solution**:
1. Check transaction revert reason
2. Verify function parameters
3. Check contract state
4. Ensure sufficient gas limit

## Performance Issues

### Slow Response Times

#### Frontend slow to load
**Symptom**: Frontend takes > 3 seconds to load

**Solution**:
- Enable Vercel Edge Network
- Optimize images
- Use code splitting
- Implement lazy loading
- Check Vercel Analytics

#### API slow to respond
**Symptom**: API requests take > 1 second

**Solution**:
- Add database indexes
- Optimize queries
- Implement caching
- Scale Railway service
- Check Railway metrics

### High Memory Usage

#### Backend using too much memory
**Symptom**: Railway service crashes due to OOM

**Solution**:
- Check for memory leaks
- Optimize data structures
- Implement pagination
- Upgrade Railway plan
- Profile memory usage

## Monitoring and Debugging

### Enable Debug Logging

**Frontend**:
```typescript
// next.config.ts
export default {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};
```

**Backend**:
```typescript
// main.ts
if (process.env.NODE_ENV === 'development') {
  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);
}
```

### Check Logs

**Vercel**:
```bash
# Install Vercel CLI
pnpm add -g vercel

# View logs
vercel logs
```

**Railway**:
```bash
# Install Railway CLI
npm install -g @railway/cli

# View logs
railway logs
```

### Test Endpoints

```bash
# Test health checks
curl -v https://tricktrack.app/api/health
curl -v https://api.tricktrack.app/api/v1/health

# Test specific endpoints
curl -X GET https://api.tricktrack.app/api/v1/users \
  -H "Authorization: Bearer <token>"

# Test with verbose output
curl -v -X POST https://api.tricktrack.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## Getting Help

### Check Status Pages
- Vercel: https://www.vercel-status.com/
- Railway: https://status.railway.app/
- Alchemy: https://status.alchemy.com/
- Polygon: https://status.polygon.technology/

### Support Channels
- Vercel: https://vercel.com/support
- Railway: https://discord.gg/railway
- GitHub: Issues tab in repository
- Team Slack: #engineering channel

### Useful Commands

```bash
# Check all services
curl https://tricktrack.app/api/health
curl https://api.tricktrack.app/api/v1/health

# Test database connection
railway run node -e "require('./apps/api/dist/main')"

# Rebuild everything locally
pnpm clean
pnpm install
pnpm build
pnpm test

# Check environment variables
railway variables
vercel env ls

# Rollback deployments
vercel rollback <deployment-url>
railway rollback
```

## Prevention

### Before Deployment
- [ ] All tests passing
- [ ] Type check passing
- [ ] Lint passing
- [ ] Build successful locally
- [ ] Environment variables documented
- [ ] Backup plan ready

### After Deployment
- [ ] Monitor logs for 1 hour
- [ ] Test critical user flows
- [ ] Check error rates
- [ ] Verify performance metrics
- [ ] Update documentation

## References

- [Deployment Guide](./DEPLOYMENT.md)
- [Environment Variables](./ENVIRONMENT_VARIABLES.md)
- [Monitoring Guide](./MONITORING.md)
- [Vercel Troubleshooting](https://vercel.com/docs/platform/frequently-asked-questions)
- [Railway Troubleshooting](https://docs.railway.app/troubleshoot/fixing-common-errors)
