# Monitoring and Health Checks

This document describes the monitoring and health check setup for the TrickTrack platform.

## Health Check Endpoints

### Frontend Health Check
**Endpoint**: `https://your-app.vercel.app/api/health`

**Method**: `GET`

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-01-16T12:00:00.000Z",
  "environment": "production",
  "version": "1.0.0",
  "backend": {
    "status": "connected",
    "url": "https://api.tricktrack.app"
  }
}
```

**Status Codes**:
- `200` - Service is healthy
- `500` - Service encountered an error

### Backend Health Check
**Endpoint**: `https://api.tricktrack.app/api/v1/health`

**Method**: `GET`

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-01-16T12:00:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0"
}
```

**Status Codes**:
- `200` - Service is healthy
- `500` - Service encountered an error

## Vercel Monitoring

### Built-in Monitoring
Vercel provides built-in monitoring through the dashboard:

1. **Analytics**:
   - Page views and visitors
   - Top pages
   - Referrers
   - Devices and browsers

2. **Web Vitals**:
   - Largest Contentful Paint (LCP)
   - First Input Delay (FID)
   - Cumulative Layout Shift (CLS)
   - Time to First Byte (TTFB)

3. **Build Metrics**:
   - Build duration
   - Build success rate
   - Deploy frequency

### Configuration

Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/api/health",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ]
}
```

### Vercel Health Checks
- Automatic health checks on deployment
- Failed deployments automatically roll back
- Preview URLs for testing before production

## Railway Monitoring

### Built-in Monitoring
Railway provides monitoring through the dashboard:

1. **Resource Usage**:
   - CPU usage
   - Memory usage
   - Network traffic

2. **Logs**:
   - Application logs
   - Build logs
   - Deploy logs

3. **Metrics**:
   - Request count
   - Response time
   - Error rate

### Railway Health Checks

Configure in `railway.json`:
```json
{
  "deploy": {
    "healthcheckPath": "/api/v1/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Health Check Behavior**:
- Railway pings `/api/v1/health` every 60 seconds
- If health check fails, service is restarted automatically
- After 10 failed restarts, service is stopped

## GitHub Actions Monitoring

### CI Pipeline Checks
The CI pipeline (`.github/workflows/ci.yml`) monitors:
- Linting errors
- Type checking errors
- Test failures
- Build failures

### Deployment Pipeline Checks
The deploy pipeline (`.github/workflows/deploy.yml`) monitors:
- Test results before deployment
- Build artifacts
- Deployment success/failure

### Notifications
Configure GitHub Actions notifications:

1. **Email Notifications**: Automatic on failure
2. **Slack Integration**: Add to workflow:
   ```yaml
   - name: Notify Slack
     if: failure()
     uses: 8398a7/action-slack@v3
     with:
       status: ${{ job.status }}
       webhook_url: ${{ secrets.SLACK_WEBHOOK }}
   ```

## Uptime Monitoring

### External Monitoring Services

Recommended services for production:

1. **UptimeRobot** (Free):
   - Monitor every 5 minutes
   - Email/SMS alerts
   - Status page
   - Setup: https://uptimerobot.com/

2. **BetterUptime** (Free tier):
   - Monitor every 30 seconds
   - Incident management
   - Status page
   - Setup: https://betterstack.com/

3. **Pingdom** (Paid):
   - Advanced monitoring
   - Real user monitoring
   - Transaction monitoring

### Configuration

Monitor these endpoints:
- `https://tricktrack.app/api/health` (Frontend)
- `https://api.tricktrack.app/api/v1/health` (Backend)

**Alert Thresholds**:
- Response time > 5 seconds
- Availability < 99.5%
- Status code != 200

## Error Tracking

### Recommended Tools

1. **Sentry** (Recommended):
   ```bash
   # Install Sentry
   pnpm add @sentry/nextjs @sentry/node
   ```

   **Frontend Setup** (`apps/web/sentry.config.ts`):
   ```typescript
   import * as Sentry from '@sentry/nextjs';

   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0,
   });
   ```

   **Backend Setup** (`apps/api/src/main.ts`):
   ```typescript
   import * as Sentry from '@sentry/node';

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0,
   });
   ```

2. **LogRocket** (Session Replay):
   - Record user sessions
   - Debug production issues
   - Performance monitoring

## Performance Monitoring

### Web Vitals
Monitor Core Web Vitals in production:

**Frontend** (`apps/web/src/app/layout.tsx`):
```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
```

Install packages:
```bash
pnpm add @vercel/speed-insights @vercel/analytics
```

### API Performance
Monitor API response times:

**Backend** (`apps/api/src/main.ts`):
```typescript
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${duration}ms`);
  });
  next();
});
```

## Blockchain Monitoring

### Contract Monitoring
Monitor deployed smart contracts:

1. **Polygonscan**:
   - Contract transactions
   - Gas usage
   - Event logs

2. **Alchemy Monitor**:
   - Webhook notifications
   - Failed transactions
   - Gas price alerts

3. **Tenderly**:
   - Transaction simulation
   - Smart contract monitoring
   - Alert rules

### RPC Provider Monitoring
Monitor RPC provider status:
- Alchemy status: https://status.alchemy.com/
- Infura status: https://status.infura.io/

## Alert Configuration

### Critical Alerts (Immediate Response)
- Frontend down (> 1 minute)
- Backend down (> 1 minute)
- Database connection lost
- Smart contract deployment failed
- High error rate (> 5%)

### Warning Alerts (Monitor)
- Slow response time (> 3 seconds)
- High memory usage (> 80%)
- High CPU usage (> 80%)
- Failed health checks
- Low disk space

### Info Alerts (Review)
- Successful deployments
- Configuration changes
- New user registrations
- High traffic periods

## Monitoring Dashboard

### Recommended Setup

1. **Grafana** (Free, self-hosted):
   - Centralized dashboard
   - Custom metrics
   - Alert management

2. **Datadog** (Paid):
   - All-in-one monitoring
   - APM and logs
   - Infrastructure monitoring

3. **New Relic** (Free tier):
   - Application monitoring
   - Browser monitoring
   - Synthetic monitoring

## Logs

### Frontend Logs (Vercel)
Access logs in Vercel dashboard:
- Deployment logs
- Function logs
- Edge logs

### Backend Logs (Railway)
Access logs in Railway dashboard:
- Build logs
- Deploy logs
- Application logs

**Log Retention**:
- Free tier: 7 days
- Paid tier: 30+ days

### Centralized Logging

**Option 1: Papertrail**
```bash
# Configure Railway to forward logs
PAPERTRAIL_URL=logs.papertrailapp.com:12345
```

**Option 2: Logtail**
```bash
# Add to apps/api
pnpm add @logtail/node
```

## Incident Response

### Response Plan

1. **Detection**: Alert triggered
2. **Acknowledgment**: Team member acknowledges alert
3. **Investigation**: Check logs and metrics
4. **Mitigation**: Fix or rollback deployment
5. **Resolution**: Verify fix and close incident
6. **Post-mortem**: Document learnings

### Rollback Procedure

**Vercel Rollback**:
1. Go to Deployments tab
2. Click "..." on previous deployment
3. Click "Promote to Production"

**Railway Rollback**:
1. Go to Deployments tab
2. Click on previous deployment
3. Click "Redeploy"

**Smart Contract Rollback**:
- Deploy new contract version
- Update contract addresses in environment variables
- Notify users of contract migration

## Testing Health Checks

### Local Testing
```bash
# Test frontend health
curl http://localhost:3000/api/health

# Test backend health
curl http://localhost:3001/api/v1/health
```

### Production Testing
```bash
# Test frontend health
curl https://tricktrack.app/api/health

# Test backend health
curl https://api.tricktrack.app/api/v1/health
```

### Automated Testing
Add to CI pipeline:
```yaml
- name: Test health endpoints
  run: |
    curl -f https://tricktrack.app/api/health || exit 1
    curl -f https://api.tricktrack.app/api/v1/health || exit 1
```

## Monitoring Checklist

### Pre-Launch
- [ ] Health check endpoints implemented
- [ ] Uptime monitoring configured
- [ ] Error tracking configured
- [ ] Log aggregation configured
- [ ] Alert rules defined
- [ ] Incident response plan documented
- [ ] Monitoring dashboard created

### Post-Launch
- [ ] Monitor health checks daily
- [ ] Review error logs weekly
- [ ] Check performance metrics weekly
- [ ] Test rollback procedure monthly
- [ ] Update alert thresholds as needed
- [ ] Review incident response quarterly

## References

- [Vercel Monitoring Docs](https://vercel.com/docs/analytics)
- [Railway Monitoring Docs](https://docs.railway.app/deploy/monitoring)
- [Sentry Documentation](https://docs.sentry.io/)
- [UptimeRobot Setup Guide](https://blog.uptimerobot.com/)
