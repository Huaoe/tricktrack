# Domain Configuration Guide

This guide explains how to configure custom domains for the TrickTrack platform.

## Overview

TrickTrack consists of three main services that can have custom domains:

1. **Frontend (Next.js PWA)** - Deployed on Vercel
2. **Backend API (NestJS)** - Deployed on Railway
3. **Smart Contracts** - Deployed on Polygon blockchain (no domain needed)

## Frontend Domain Configuration (Vercel)

### Default Domain
- Vercel provides a default domain: `your-project.vercel.app`
- Preview deployments: `your-project-git-branch.vercel.app`

### Custom Domain Setup

1. **Purchase Domain**: Buy a domain from a registrar (Namecheap, GoDaddy, Cloudflare, etc.)

2. **Add Domain in Vercel**:
   - Go to Vercel dashboard → Project → Settings → Domains
   - Click "Add Domain"
   - Enter your domain (e.g., `tricktrack.app` or `www.tricktrack.app`)
   - Click "Add"

3. **Configure DNS**:

   **Option A: Using Vercel Nameservers (Recommended)**
   - In your domain registrar, update nameservers to:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```
   - Wait 24-48 hours for propagation

   **Option B: Using CNAME Record**
   - Add CNAME record in your DNS provider:
     ```
     Type: CNAME
     Name: www (or @)
     Value: cname.vercel-dns.com
     TTL: 3600
     ```

   **Option C: Using A Record**
   - Add A record in your DNS provider:
     ```
     Type: A
     Name: @ (or your subdomain)
     Value: 76.76.21.21
     TTL: 3600
     ```

4. **SSL Certificate**: Vercel automatically provisions SSL certificates via Let's Encrypt

5. **Update Environment Variables**:
   ```env
   # apps/api/.env (or Railway dashboard)
   FRONTEND_URL=https://tricktrack.app
   PRODUCTION_DOMAIN=https://tricktrack.app
   ```

### Recommended Domain Structure
- **Production**: `https://tricktrack.app` or `https://www.tricktrack.app`
- **Staging**: `https://staging.tricktrack.app`
- **Preview**: Vercel automatic preview URLs

## Backend Domain Configuration (Railway)

### Default Domain
- Railway provides a default domain: `your-service.railway.app`

### Custom Domain Setup

1. **Add Domain in Railway**:
   - Go to Railway dashboard → Service → Settings → Networking
   - Click "Add Custom Domain"
   - Enter your API subdomain (e.g., `api.tricktrack.app`)

2. **Configure DNS**:
   - Railway will provide a CNAME target
   - Add CNAME record in your DNS provider:
     ```
     Type: CNAME
     Name: api
     Value: <provided-by-railway>.railway.app
     TTL: 3600
     ```

3. **SSL Certificate**: Railway automatically provisions SSL certificates

4. **Update Environment Variables**:
   ```env
   # apps/web/.env.local (or Vercel dashboard)
   NEXT_PUBLIC_API_URL=https://api.tricktrack.app
   ```

### Recommended API Domain Structure
- **Production**: `https://api.tricktrack.app`
- **Staging**: `https://api-staging.tricktrack.app`

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (development)
- `https://*.vercel.app` (Vercel preview deployments)
- The value of `FRONTEND_URL` environment variable
- The value of `PRODUCTION_DOMAIN` environment variable (if set)

### Update CORS for Custom Domain

1. **Set Railway Environment Variables**:
   ```env
   FRONTEND_URL=https://tricktrack.app
   PRODUCTION_DOMAIN=https://tricktrack.app
   ```

2. **Redeploy Backend**: Railway will automatically redeploy with new CORS settings

## SSL/TLS Configuration

### Vercel
- **Automatic SSL**: Vercel automatically provisions and renews SSL certificates
- **HTTP/2**: Enabled by default
- **TLS Version**: TLS 1.2 and 1.3 supported
- **HSTS**: Enabled automatically

### Railway
- **Automatic SSL**: Railway automatically provisions SSL via Let's Encrypt
- **Force HTTPS**: Enabled by default
- **TLS Version**: TLS 1.2 and 1.3 supported

### Additional Security Headers

Add these headers in `apps/web/vercel.json` (already configured):

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
```

## Domain Verification Checklist

### Frontend (Vercel)
- [ ] Domain added in Vercel dashboard
- [ ] DNS configured (CNAME or A record)
- [ ] SSL certificate issued (check for green lock icon)
- [ ] HTTPS redirect working
- [ ] www redirect configured (if applicable)
- [ ] Custom domain loads correctly

### Backend (Railway)
- [ ] Custom domain added in Railway
- [ ] DNS CNAME record configured
- [ ] SSL certificate issued
- [ ] API accessible via custom domain
- [ ] Health check endpoint responds: `https://api.tricktrack.app/api/v1/health`

### CORS Verification
- [ ] Frontend can call backend API
- [ ] Preflight OPTIONS requests succeed
- [ ] Credentials (cookies) are sent correctly
- [ ] No CORS errors in browser console

## Testing Domain Configuration

### Test Frontend
```bash
# Check DNS resolution
dig tricktrack.app

# Check SSL certificate
curl -vI https://tricktrack.app

# Check page loads
curl https://tricktrack.app
```

### Test Backend
```bash
# Check DNS resolution
dig api.tricktrack.app

# Check SSL certificate
curl -vI https://api.tricktrack.app

# Check health endpoint
curl https://api.tricktrack.app/api/v1/health

# Expected response:
# {"status":"ok","timestamp":"...","uptime":...}
```

### Test CORS
```bash
# Test preflight request
curl -X OPTIONS https://api.tricktrack.app/api/v1/health \
  -H "Origin: https://tricktrack.app" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Should return 200 with CORS headers
```

## Troubleshooting

### DNS Not Resolving
- Wait 24-48 hours for DNS propagation
- Clear DNS cache: `sudo dscacheutil -flushcache` (macOS) or `ipconfig /flushdns` (Windows)
- Check DNS with online tools: https://dnschecker.org/

### SSL Certificate Not Issuing
- Ensure DNS is correctly configured
- Wait a few minutes for certificate provisioning
- Check domain ownership verification

### CORS Errors
- Verify `FRONTEND_URL` is set correctly in Railway
- Check backend logs for CORS errors
- Ensure domain matches exactly (with/without www)
- Clear browser cache and try again

### 404 Errors
- Ensure domain is correctly added in Vercel/Railway
- Check that deployments are successful
- Verify DNS is pointing to correct target

### Mixed Content Warnings
- Ensure all resources (images, scripts) use HTTPS
- Update hardcoded HTTP URLs to HTTPS
- Check browser console for specific mixed content errors

## Cost Considerations

### Domain Registration
- **Cost**: $10-15/year (depends on TLD)
- **Renewal**: Set up auto-renewal to avoid expiration
- **Privacy**: Consider domain privacy protection

### SSL Certificates
- **Vercel**: Free (Let's Encrypt)
- **Railway**: Free (Let's Encrypt)
- **No additional cost for SSL**

### DNS Hosting
- **Using Vercel Nameservers**: Free
- **Using Cloudflare**: Free
- **Using other providers**: Varies

## Best Practices

1. **Use apex domain**: `tricktrack.app` instead of `www.tricktrack.app`
2. **Set up www redirect**: Redirect www to apex or vice versa
3. **Enable HSTS**: Force HTTPS for all requests
4. **Use CDN**: Vercel's CDN is already configured
5. **Monitor uptime**: Set up monitoring for both frontend and backend
6. **Set up DNS monitoring**: Get alerts if DNS changes
7. **Document configuration**: Keep records of DNS settings
8. **Backup configuration**: Save DNS settings in version control

## Production Deployment Checklist

Before launching with custom domains:

- [ ] Purchase and configure domains
- [ ] Test all endpoints with custom domains
- [ ] Verify SSL certificates are valid
- [ ] Test CORS from production frontend to production API
- [ ] Update all environment variables
- [ ] Test Web3Auth with production domains
- [ ] Test PWA installation from custom domain
- [ ] Configure monitoring and alerts
- [ ] Set up domain renewal reminders
- [ ] Document domain configuration for team

## References

- [Vercel Custom Domains](https://vercel.com/docs/concepts/projects/custom-domains)
- [Railway Custom Domains](https://docs.railway.app/deploy/exposing-your-app#custom-domains)
- [DNS Configuration Guide](https://www.cloudflare.com/learning/dns/dns-records/)
- [SSL/TLS Best Practices](https://www.ssllabs.com/projects/best-practices/)
