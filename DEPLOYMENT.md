# Flight Booking Frontend - Deployment Guide

## Overview

This is a Vue.js flight booking frontend that integrates with:
- **Auth Service**: https://accommodation.fakhrihabb.dev (SSO)
- **Backend API**: http://2306223206-be.hafizmuh.site
- **Cookie Domain**: .fakhrihabb.dev

## Prerequisites

- Node.js 18+ installed
- Vercel CLI (optional, for CLI deployment)
- Git repository

## Environment Variables

The application uses different configurations for development and production:

### Development (.env.development)
```
VITE_USE_COOKIE_AUTH=false
VITE_COOKIE_DOMAIN=.fakhrihabb.dev
VITE_AUTH_DOMAIN=http://localhost:3000
VITE_API_URL=http://localhost:8080
```

### Production (.env.production)
```
VITE_USE_COOKIE_AUTH=true
VITE_COOKIE_DOMAIN=.fakhrihabb.dev
VITE_AUTH_DOMAIN=https://accommodation.fakhrihabb.dev
VITE_API_URL=http://2306223206-be.hafirmuh.site
```

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```
   The app will run on http://localhost:5175

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub:**
   ```bash
   git remote add origin <your-github-repo-url>
   git push -u origin master
   ```

2. **Import to Vercel:**
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: **Vite**
     - Root Directory: `./`
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **Set Environment Variables:**
   Add these in Vercel Dashboard → Project Settings → Environment Variables:
   ```
   VITE_USE_COOKIE_AUTH=true
   VITE_COOKIE_DOMAIN=.fakhrihabb.dev
   VITE_AUTH_DOMAIN=https://accommodation.fakhrihabb.dev
   VITE_API_URL=http://2306223206-be.hafizmuh.site
   ```

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? **Select your account**
   - Link to existing project? **N**
   - What's your project's name? **flight-2306223206-fe**
   - In which directory is your code located? **./**
   - Override settings? **N**

4. **Deploy to production:**
   ```bash
   vercel --prod
   ```

### Option 3: Deploy via GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - master

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Post-Deployment Configuration

### 1. Configure Custom Domain (Optional)

If deploying to a custom domain on .fakhrihabb.dev:

1. Go to Vercel Dashboard → Project Settings → Domains
2. Add your domain (e.g., `flight.fakhrihabb.dev`)
3. Configure DNS:
   - Type: **CNAME**
   - Name: **flight**
   - Value: **cname.vercel-dns.com**

### 2. Verify SSO Integration

1. Visit your deployed app
2. Click "Login" → Should redirect to https://accommodation.fakhrihabb.dev/login
3. Login with test credentials
4. Should redirect back to your flight app with authentication

### 3. Test Flight Booking Flow

1. **As CUSTOMER:**
   - View flights on home page
   - Click "Book Flight"
   - Complete booking

2. **As FLIGHT_AIRLINE:**
   - Click "Create Flight"
   - Fill out flight details
   - Submit to create new flight
   - Edit your own flights

3. **As SUPERADMIN:**
   - Delete any flight

## Troubleshooting

### Authentication Not Working

**Issue:** Login redirects but token not saved

**Solution:**
- Check that `VITE_USE_COOKIE_AUTH=true` in production
- Verify cookie domain is `.fakhrihabb.dev`
- Ensure your deployed domain is on `*.fakhrihabb.dev`

### API Calls Failing

**Issue:** 404 or CORS errors when calling backend

**Solution:**
- Verify `VITE_API_URL` is correct
- Check backend CORS configuration allows your frontend domain
- Ensure backend is running and accessible

### Build Failures

**Issue:** Deployment fails during build

**Solution:**
- Run `npm run build` locally to test
- Check for TypeScript errors: `npm run build`
- Verify all dependencies are in package.json

### Environment Variables Not Applied

**Issue:** Still using development config in production

**Solution:**
- Redeploy after setting environment variables
- Check Vercel dashboard → Deployments → Latest → Environment Variables
- Ensure variables are set for "Production" environment

## Monitoring

- **Deployment Logs:** Vercel Dashboard → Deployments → View Logs
- **Runtime Logs:** Vercel Dashboard → Project → Logs
- **Analytics:** Vercel Dashboard → Analytics (if enabled)

## Rollback

If deployment has issues:

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback <deployment-url>
```

Or use Vercel Dashboard → Deployments → Click "..." → Promote to Production

## Support

For issues:
1. Check browser console for errors
2. Check Vercel deployment logs
3. Verify environment variables
4. Test authentication flow
5. Verify backend connectivity
