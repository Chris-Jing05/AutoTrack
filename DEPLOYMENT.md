# AutoTrack Deployment Guide

This guide will help you deploy AutoTrack to production using Vercel (frontend) and Render (backend).

## Prerequisites

- GitHub account
- Vercel account (free): https://vercel.com
- Render account (free): https://render.com
- Supabase project (for database)

## Step 1: Push Code to GitHub

1. Create a new GitHub repository
2. Push your code:

```bash
cd /Users/chrisjing/Desktop/AutoTrack
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/autotrack.git
git push -u origin main
```

## Step 2: Deploy Backend to Render

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `autotrack-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free (or upgrade for better performance with ML models)

5. Add Environment Variables:
   Click **"Advanced"** → **"Add Environment Variable"**:

   ```
   PYTHON_VERSION=3.11.5
   HOST=0.0.0.0
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
   ```

6. Click **"Create Web Service"**
7. Wait for deployment (~10-15 minutes for first deploy due to ML models)
8. **Copy your backend URL** (e.g., `https://autotrack-backend.onrender.com`)

## Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://autotrack-backend.onrender.com
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Click **"Deploy"**
6. Wait for deployment (~2-3 minutes)

## Step 4: Update Backend CORS

After frontend deployment:

1. Go back to Render dashboard
2. Click on your backend service
3. Go to **"Environment"**
4. Update `ALLOWED_ORIGINS` with your Vercel URL:
   ```
   ALLOWED_ORIGINS=https://your-app.vercel.app
   ```
5. Click **"Save Changes"** (this will redeploy)

## Step 5: Test Your Deployment

1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Try uploading a receipt
3. Check that everything works!

---

## Alternative: Deploy Both on Render

If you prefer to deploy everything on Render:

### Backend (Same as above)

### Frontend on Render:

1. **New Static Site**
2. **Build Command**: `npm run build`
3. **Publish Directory**: `.next`
4. Environment Variables: Same as Vercel

---

## Alternative: One-Click Deploy with Railway

Railway is even easier:

### Backend:
1. Go to https://railway.app
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Add environment variables
5. Done!

### Frontend:
Same process as backend

---

## Troubleshooting

### Backend Issues:

**Problem**: "Out of memory" on free tier
- **Solution**: Upgrade to paid tier ($7/month) or use Railway which has more generous free tier

**Problem**: Slow cold starts
- **Solution**: This is normal on free tier. Backend "sleeps" after 15 min of inactivity. First request takes ~30 seconds to wake up.

**Problem**: ML models not loading
- **Solution**: Ensure you have enough RAM. Free tier has 512MB, ML models need ~1GB. Consider upgrading.

### Frontend Issues:

**Problem**: "API not found" errors
- **Solution**: Check `NEXT_PUBLIC_API_URL` environment variable is set correctly

**Problem**: Tesseract files not loading
- **Solution**: Ensure `vercel.json` is in the frontend directory with proper headers

---

## Cost Breakdown

### Free Tier (Good for testing):
- **Vercel**: Free (100GB bandwidth)
- **Render**: Free (512MB RAM, sleeps after 15min)
- **Supabase**: Free (500MB database)
- **Total**: $0/month

### Recommended Production (Better performance):
- **Vercel**: Free
- **Render**: $7/month (512MB RAM, always on)
- **Supabase**: Free or $25/month for Pro
- **Total**: $7-32/month

---

## Need Help?

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
