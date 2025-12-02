# Deployment & Production Guide

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Build Process](#build-process)
3. [Deployment Platforms](#deployment-platforms)
4. [Environment Configuration](#environment-configuration)
5. [Performance Optimization](#performance-optimization)
6. [Security Considerations](#security-considerations)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Backup & Recovery](#backup--recovery)
9. [Scaling](#scaling)

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] No TypeScript errors: `yarn build`
- [ ] No ESLint warnings: `yarn lint`
- [ ] No console errors/warnings
- [ ] No hardcoded API URLs or credentials
- [ ] All environment variables configured

### Functionality Testing
- [ ] Create patient flow works
- [ ] Update patient flow works
- [ ] Delete patient flow works (with confirmation)
- [ ] Create appointment (no conflicts)
- [ ] Create appointment (conflict prevention works)
- [ ] Search/filter working
- [ ] CSV export working
- [ ] Mobile responsive tested on real device
- [ ] All links working
- [ ] Forms validated

### Documentation
- [ ] README.md up to date
- [ ] API changes documented
- [ ] New features documented
- [ ] Deployment instructions ready

### Performance
- [ ] Build time < 15 seconds
- [ ] Bundle size analyzed
- [ ] Page load time acceptable (< 3s)
- [ ] localStorage usage reasonable (< 1MB)

## Build Process

### Production Build

```bash
# 1. Clean install
rm -rf node_modules
yarn install

# 2. Build application
yarn build

# Output should show:
# ✓ 2000+ modules transformed
# ✓ built in 8-10s

# 3. Check build output
ls -lah dist/
# dist/index.html
# dist/assets/
#   ├── index-XXXXX.js (main bundle)
#   ├── style-XXXXX.css (styles)
#   └── other-chunks...

# 4. Analyze bundle size
yarn build --debug

# 5. Preview production build locally
yarn preview
# Visit http://localhost:5173 to test
```

### Build Optimization Tips

```bash
# Check bundle size
du -sh dist/

# Analyze what's in bundle (if using build analyzer)
# See Vite docs for rollup visualizer plugin

# Typical final size:
# - HTML: ~2KB
# - CSS: ~50KB (minified, including Tailwind)
# - JS: ~200-300KB (minified, including all dependencies)
# Total: ~300KB gzipped
```

### Build Output Structure

```
dist/
├── index.html                 # Entry point (will be served)
├── assets/
│   ├── index-XXXXX.js        # Main JavaScript bundle
│   ├── index-XXXXX.css       # Main CSS bundle (Tailwind)
│   ├── PatientsList-XXXXX.js  # Code-split chunks
│   └── ... (more chunks)
└── vite.svg                   # Static assets
```

## Deployment Platforms

### Option 1: Vercel (Recommended for React)

**Why Vercel:**
- Zero-config React deployment
- Automatic preview deployments
- Edge caching
- Environment variables UI
- Analytics included
- Free tier available

**Steps:**

1. **Create Vercel Account**
   - Visit https://vercel.com
   - Sign up with GitHub/GitLab/Bitbucket

2. **Connect Repository**
   ```bash
   # Push code to GitHub
   git push origin main
   ```
   - Go to Vercel dashboard
   - Click "New Project"
   - Import your Git repository
   - Select "clinic-management-application"

3. **Configure**
   - Framework: Vite
   - Root Directory: (auto-detected)
   - Build Command: `yarn build`
   - Output Directory: `dist`

4. **Environment Variables**
   - (Not needed currently, add if backend API added)
   - Click "Environment Variables"
   - Add any needed variables

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Get URL: `https://clinic-app.vercel.app`

6. **Automatic Deployments**
   - Every push to main → automatic redeploy
   - Pull requests → automatic preview deployments

**Cost:** Free tier includes unlimited deployments, 100GB bandwidth/month

### Option 2: Netlify

**Steps:**

1. **Create Account**
   - Visit https://netlify.com
   - Sign up

2. **Deploy**
   - Drag & drop `dist` folder, OR
   - Connect Git repository

3. **Configure Build**
   - Build Command: `yarn build`
   - Publish Directory: `dist`

4. **Deploy**
   - Netlify auto-builds and deploys

**Cost:** Free tier generous, paid tiers available

### Option 3: GitHub Pages (Static Hosting)

**Limited: requires subdirectory path**

```bash
# 1. Update vite.config.js
export default {
  base: '/clinic-management-application/'
}

# 2. Build
yarn build

# 3. Deploy
# Option A: Manually
# - Commit dist/ folder to gh-pages branch
# - GitHub Pages serves it

# Option B: GitHub Actions (automatic)
# - Create .github/workflows/deploy.yml
```

### Option 4: Docker + Cloud (AWS, GCP, Azure)

**For more control:**

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build image
docker build -t clinic-app .

# Run container
docker run -p 80:80 clinic-app

# Push to registry
docker tag clinic-app:latest your-registry/clinic-app:latest
docker push your-registry/clinic-app:latest
```

## Environment Configuration

### Environment Variables

**Create .env files:**

```bash
# .env (default, used everywhere)
VITE_APP_NAME="Clinic Management"

# .env.development (dev server only)
VITE_DEBUG=true

# .env.production (production build)
VITE_API_URL=https://api.clinic.com

# .env.local (local overrides, not committed)
VITE_LOCAL_OVERRIDE=true
```

**Access in code:**
```typescript
const apiUrl = import.meta.env.VITE_API_URL
const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD
```

**Via deployment platform:**
- Vercel: Settings → Environment Variables
- Netlify: Deploys → Environment
- GitHub: Secrets & variables

### Production Configuration

**Recommended settings:**

```bash
# .env.production
VITE_APP_NAME="Clinic Management System"
VITE_API_URL=https://api.yourdomain.com
VITE_ENABLE_ANALYTICS=true
```

## Performance Optimization

### Metrics to Monitor

**First Contentful Paint (FCP):** < 1.5s  
**Largest Contentful Paint (LCP):** < 2.5s  
**Time to Interactive (TTI):** < 3.5s  
**Cumulative Layout Shift (CLS):** < 0.1

### Optimization Strategies Already Implemented

1. **Code Splitting**
   - Vite automatically splits routes
   - Each page loaded on-demand

2. **CSS Optimization**
   - Tailwind PurgeCSS removes unused styles
   - CSS minified in production

3. **Lazy Loading**
   - Images: Use `loading="lazy"` (future)
   - Routes: Built into React Router

4. **Tree Shaking**
   - Vite automatically removes unused code
   - TypeScript unused imports warnings

### Additional Optimizations (Future)

```typescript
// 1. Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'))

// 2. Add Suspense boundary
<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>

// 3. Memoize expensive components
const PatientsList = React.memo(PatientListComponent)

// 4. Optimize images (when added)
<img src="..." loading="lazy" />

// 5. Use Web Workers (for heavy calculations)
// Move appointment conflict detection to worker thread
```

### Performance Testing

```bash
# Lighthouse testing (Chrome DevTools)
1. Open http://localhost:5173
2. F12 → Lighthouse
3. Click "Analyze page load"
4. Review scores and suggestions

# Bundle analysis
yarn build --mode analyze
# (requires vite-plugin-visualizer)

# Monitor performance in production
# - Google Analytics
# - Vercel Analytics
# - Sentry (for errors)
```

## Security Considerations

### Authentication (When Backend Added)

```typescript
// Store auth token securely
// localStorage is NOT secure for auth tokens
// Use httpOnly cookies instead

// Or use secure storage
const token = sessionStorage.getItem('auth_token')
// Token cleared when browser closes
```

### Data Validation

```typescript
// Validate on client AND server
const schema = z.object({
  email: z.string().email(),
  phone: z.string().regex(/^\d{10}$/),
})

const validated = schema.parse(formData)
```

### XSS Prevention

```typescript
// React automatically escapes JSX
<div>{userInput}</div>  // ✓ Safe (escaped)

// Avoid dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />  // ✗ Unsafe

// Sanitize if needed
import DOMPurify from 'dompurify'
const clean = DOMPurify.sanitize(userInput)
<div>{clean}</div>
```

### CORS (When Backend Added)

```typescript
// Server should set CORS headers
// Access-Control-Allow-Origin: https://yourdomain.com
// Access-Control-Allow-Credentials: true

// Client-side fetch
fetch(url, {
  credentials: 'include',  // Send cookies
  headers: {
    'Content-Type': 'application/json'
  }
})
```

### Environment Variables Protection

```bash
# ✓ OK to expose in frontend
VITE_APP_NAME=MyApp
VITE_API_URL=https://api.example.com

# ✗ NEVER expose these
VITE_SECRET_KEY=xxxxx
VITE_DATABASE_PASSWORD=xxxxx
VITE_PRIVATE_API_KEY=xxxxx

# For sensitive data:
# - Keep in .env.local (don't commit)
# - For CI/CD, use platform secrets
# - Use backend API instead of exposing keys
```

### CSP Headers (Set on Server)

```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
```

## Monitoring & Maintenance

### Error Tracking

**Setup Sentry (Error Monitoring):**

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
})
```

**Errors automatically reported to Sentry dashboard**

### Analytics

**Setup Google Analytics:**

```typescript
// src/main.tsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const trackPageView = (pathname: string) => {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: pathname,
    })
  }
}

// In App component
const location = useLocation()
useEffect(() => {
  trackPageView(location.pathname)
}, [location])
```

### Uptime Monitoring

**Use services like:**
- Uptime Robot (free tier)
- Better Stack
- PagerDuty

**Configure alerts:** Email/SMS when site down

### Health Checks

```bash
# Simple health check endpoint
# GET https://yourdomain.com/health
# Response: { "status": "ok" }

# Or just check status code 200
```

## Backup & Recovery

### Database Backup (When Backend Added)

```bash
# Daily automated backups
# MongoDB: mongodump
# PostgreSQL: pg_dump
# MySQL: mysqldump

# Backup locations:
# - Cloud storage (S3, GCS, Azure Blob)
# - Multiple regions
# - Automated scheduling
```

### Code Backup

```bash
# Git is your backup
git push origin main

# Additional:
# - GitHub backups (free)
# - GitLab backups
# - Gitee (China-based)

# Disaster recovery:
# git clone https://github.com/user/repo
# Everything restored
```

### localStorage Backup

```typescript
// User can export/download data
const data = localStorage.getItem('clinic-storage')
const blob = new Blob([data], { type: 'application/json' })
const url = URL.createObjectURL(blob)
const link = document.createElement('a')
link.href = url
link.download = 'clinic-backup.json'
link.click()
```

## Scaling

### Horizontal Scaling (Multiple Servers)

**Current Limitation:**
- localStorage is client-side only
- Each browser has separate data

**Solution:**
1. Migrate to backend database
2. Server-side persistence
3. Multiple app instances served by load balancer

### Vertical Scaling (More Powerful Servers)

**For larger deployments:**
- Better server hardware
- Increased Node.js memory
- Faster database
- Caching layer (Redis)

### Caching Strategy

```typescript
// Browser caching
// Set Cache-Control headers
// - Static assets: 1 year
// - HTML: No cache
// - API responses: 5 minutes

// Service Worker (for offline support)
// - Cache assets
// - Serve offline

// CDN caching
// - Global edge locations
// - Compress responses
// - GZIP enabled
```

### Database Scaling (When Backend Added)

```
Single DB → Primary/Replica
         → Sharding (by clinic/region)
         → Read replicas + Cache
         → Multi-region replication
```

### API Rate Limiting (When Backend Added)

```
Rate Limit: 100 requests / minute
Example: 5 requests/second for 20 seconds

Protect against:
- Brute force attacks
- DDoS attacks
- Resource exhaustion
```

## Going Live Checklist

- [ ] Domain registered
- [ ] SSL certificate installed
- [ ] Deployment platform configured
- [ ] Environment variables set
- [ ] Database migrations run (if backend)
- [ ] Backups configured
- [ ] Monitoring/alerts set up
- [ ] Error tracking (Sentry) enabled
- [ ] Analytics (Google Analytics) enabled
- [ ] Performance tested
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Team trained
- [ ] User feedback mechanism ready
- [ ] Support plan in place
- [ ] Launch announcement ready

## Post-Launch Maintenance

### Weekly Tasks
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Monitor uptime

### Monthly Tasks
- [ ] Review analytics
- [ ] Check security updates
- [ ] Update dependencies (minor versions)
- [ ] Database optimization
- [ ] User feedback review

### Quarterly Tasks
- [ ] Major dependency updates
- [ ] Security audit
- [ ] Performance optimization
- [ ] Feature planning

### Yearly Tasks
- [ ] Architecture review
- [ ] Disaster recovery drill
- [ ] Security penetration test
- [ ] Capacity planning

---

## Useful Links

- **Vercel Docs:** https://vercel.com/docs
- **Netlify Docs:** https://docs.netlify.com/
- **Vite Production Guide:** https://vitejs.dev/guide/static-deploy.html
- **Web Vitals:** https://web.dev/vitals/
- **OWASP Security:** https://owasp.org/

---

**Deployment Guide Version:** 1.0.0  
**Last Updated:** December 2, 2025
