# Deployment Guide - Sri Rama Prints

## Prerequisites
1. GitHub account
2. MongoDB Atlas account (free)
3. Vercel account (free)
4. Railway/Render account (free)

## Step 1: Setup MongoDB Atlas
1. Go to https://www.mongodb.com/atlas
2. Create free account and cluster
3. Get connection string
4. Whitelist all IPs (0.0.0.0/0) for production

## Step 2: Prepare Backend for Production

### Update backend/.env:
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=production
```

### Add to backend/package.json:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "npm install"
  },
  "engines": {
    "node": "18.x"
  }
}
```

## Step 3: Prepare Frontend for Production

### Update frontend/src/services/api.ts:
Replace localhost URLs with your deployed backend URL:
```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.railway.app/api' 
  : 'http://localhost:5000/api';
```

## Step 4: Deploy Backend (Railway)
1. Push code to GitHub
2. Go to https://railway.app
3. Connect GitHub repository
4. Select backend folder
5. Add environment variables
6. Deploy

## Step 5: Deploy Frontend (Vercel)
1. Go to https://vercel.com
2. Import GitHub repository
3. Set root directory to 'frontend'
4. Add environment variable: REACT_APP_API_URL=your_backend_url
5. Deploy

## Step 6: Update CORS
Update backend/server.js CORS settings:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-vercel-app.vercel.app'],
  credentials: true
}));
```

## Alternative: One-Click Deploy Options

### Render (Full-Stack)
1. Connect GitHub
2. Create Web Service for backend
3. Create Static Site for frontend
4. Configure environment variables

### Railway (Full-Stack)
1. Connect GitHub
2. Deploy backend service
3. Deploy frontend service
4. Configure domains

## Cost Breakdown:
- **Free Tier**: $0/month (with limitations)
- **Basic Paid**: $10-20/month (more resources)
- **Domain**: $10-15/year (optional)

## Production Checklist:
- [ ] Environment variables configured
- [ ] Database connection secured
- [ ] CORS properly configured
- [ ] File upload paths updated
- [ ] Error handling improved
- [ ] Security headers added
- [ ] SSL certificate (automatic with most platforms)

Your website will be accessible worldwide once deployed!