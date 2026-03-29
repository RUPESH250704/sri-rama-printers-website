# Deployment Instructions - Vercel + Railway

## Prerequisites
1. GitHub account
2. Vercel account (free)
3. Railway account (free)
4. MongoDB Atlas account (free)

## Step 1: Setup MongoDB Atlas
1. Go to https://cloud.mongodb.com/
2. Create free cluster
3. Create database user
4. Whitelist all IPs (0.0.0.0/0)
5. Get connection string

## Step 2: Deploy Backend to Railway
1. Push code to GitHub
2. Go to https://railway.app/
3. Click "Deploy from GitHub repo"
4. Select your repository
5. Choose "backend" folder as root directory
6. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `NODE_ENV`: production
   - `PORT`: 5000
7. Deploy

## Step 3: Deploy Frontend to Vercel
1. Go to https://vercel.com/
2. Click "New Project"
3. Import from GitHub
4. Select your repository
5. Set Framework Preset: "Create React App"
6. Set Root Directory: "frontend"
7. Add environment variable:
   - `REACT_APP_API_URL`: Your Railway backend URL + "/api"
8. Deploy

## Step 4: Update CORS Settings
1. Get your Vercel frontend URL
2. Update backend/server.js CORS origin with your Vercel URL
3. Redeploy backend on Railway

## Step 5: Test Your Live Website
- Frontend: https://your-project.vercel.app
- Backend: https://your-project.railway.app

## Automatic Deployments
- Both platforms will auto-deploy when you push to GitHub
- Frontend builds in ~2 minutes
- Backend deploys in ~3 minutes

## Free Tier Limits
- Vercel: 100GB bandwidth/month
- Railway: 500 hours/month, 1GB RAM
- MongoDB Atlas: 512MB storage

Your website is now live and accessible worldwide! 🚀