# 🚀 Manual Vercel Deployment Guide

## Deploy via Vercel Website (No CLI Required)

### Step 1: Connect GitHub to Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"** (use GitHub account)
3. Click **"Import Project"** → **"Continue with GitHub"**
4. Select your **yapalacasa** repository

### Step 2: Configure the Project
1. **Project Name**: Keep it or rename to "salvar-portal"
2. **Framework Preset**: Select **"Other"** or leave blank
3. **Root Directory**: 
   - Click **"Edit"**
   - Enter: `web-portal-deployment`
   - Click **"Save"**
4. **Environment Variables**: Leave blank (static site, no env needed)
5. Click **"Deploy"**

### Step 3: Wait for Deployment
- Vercel will automatically build and deploy
- Should take 30-60 seconds
- You'll see a live URL when done (like `salvar-portal.vercel.app`)

### Step 4: Add Custom Domain (Optional)
1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your domain (e.g., `salvar.app` or `portal.salvar.app`)
4. Follow DNS instructions

---

## Troubleshooting

### Issue: "No framework detected"
**Solution**: This is OK. Our site is static HTML (no framework needed).

### Issue: "Build failed"
**Solution**: 
- Make sure `Root Directory` is set to `web-portal-deployment`
- Ensure `index.html` exists in that folder
- Check that `.vercelignore` is present

### Issue: "404 on routes"
**Solution**: 
- This is already fixed in `vercel.json` (has rewrites rule)
- Clear cache and trigger a redeploy

### Issue: "Deployment timeout"
**Solution**: 
1. Go to project **Settings** → **Build & Deployment**
2. Increase build timeout to 900 seconds
3. Trigger a redeploy

---

## Auto-Deploy on GitHub Push

The deployment is already configured to auto-update when you push to GitHub:

1. Every time you commit to `main` branch
2. Vercel automatically detects the change
3. Redeploys the site automatically
4. No manual action needed

---

## Verify Deployment

Once deployed, you should see:
- ✅ Hero section with Salvar logo
- ✅ FAQ section that opens/closes
- ✅ Contact information
- ✅ Download buttons for app
- ✅ Professional footer

---

## Support

If deployment still fails:
1. Check Vercel deployment logs (in project dashboard)
2. Verify `vercel.json` is in `web-portal-deployment/` folder
3. Ensure `index.html` exists
4. Check that folder has `README.md` and `package.json`

---

**Current Status**: Ready to deploy! 🎉
