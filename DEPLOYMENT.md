# Deployment Guide

## Backend Deployment (Render)

### Step 1: Prepare Backend
- Backend is already configured with:
  - `Procfile` for Render
  - Server binds to `0.0.0.0` for production
  - MongoDB connection via `MONGODB_URI` environment variable

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `ShaheerKhalid01/amazon_clone`
4. Configure:
   - **Name**: amazon-clone-backend
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: Node 18

### Step 3: Set Environment Variables
In Render dashboard → Environment Variables:
```
MONGODB_URI=mongodb://your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
FRONTEND_URL=https://your-netlify-app.netlify.app
GROQ_API_KEY=your-groq-api-key
```

### Step 4: Get Backend URL
After deployment, Render will provide a URL like:
`https://amazon-clone-backend.onrender.com`

## Frontend Deployment (Netlify)

### Step 1: Update Netlify Environment Variables
1. Go to Netlify → Your site → Site settings → Environment variables
2. Add:
```
VITE_API_URL=https://amazon-clone-backend.onrender.com/api
```

### Step 2: Redeploy Frontend
1. Push the new `netlify.toml` to GitHub
2. Netlify will auto-redeploy
3. Or trigger manual deploy in Netlify dashboard

### Step 3: Update Backend CORS
After getting your Netlify URL, update the backend environment variable:
```
FRONTEND_URL=https://your-app.netlify.app
```

## Verification
1. Test backend: `https://your-backend.onrender.com/api/health`
2. Test frontend: Open your Netlify URL
3. Test login/registration flow
4. Check browser console for API errors

## Troubleshooting

### Backend 502/503 Errors
- Check Render logs for MongoDB connection issues
- Verify `MONGODB_URI` is correct
- Ensure MongoDB Atlas IP whitelist allows Render IPs

### Frontend API Errors
- Verify `VITE_API_URL` is set correctly in Netlify
- Check browser Network tab for failed requests
- Ensure backend CORS includes your Netlify domain

### Netlify 404 on Refresh
- Ensure `netlify.toml` is in the `frontend/` directory
- Check that redirects are configured correctly
- Verify build output directory is `dist`

## Alternative Deployment Options

### Vercel (Full-stack)
- Can deploy both frontend and backend
- Backend as serverless functions
- Requires refactoring `server.js` to Vercel format

### Railway
- Similar to Render
- Supports MongoDB directly
- Good for full-stack deployment

### AWS Amplify
- Full AWS integration
- More complex setup
- Good for production scaling
