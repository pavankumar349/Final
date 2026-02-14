# Render.com Deployment Guide - Alternative Hosting

## 🚀 Deploy to Render (Free Alternative)

Render.com is a great alternative to Netlify with a free tier.

### Step-by-Step Deployment

1. **Sign Up**
   - Visit: https://render.com
   - Click **"Get Started for Free"**
   - Sign up with your **GitHub account**

2. **Create New Static Site**
   - Click **"New +"** button (top right)
   - Select **"Static Site"**

3. **Connect Repository**
   - Click **"Connect account"** if not connected
   - Select repository: `pavankumar349/Final`
   - Click **"Connect"**

4. **Configure Site**
   - **Name:** `agrislove` (or any name you prefer)
   - **Branch:** `main`
   - **Root Directory:** Leave empty (or `./`)
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`

5. **Add Environment Variables**
   Click **"Advanced"** and add:
   ```
   VITE_SUPABASE_URL = https://derildzszqbqbgeygznk.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlcmlsZHpzenFicWJnZXlnem5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3Mzg4MzEsImV4cCI6MjA2MDMxNDgzMX0.olc4Ade8TjAM3kxo6JeoP7DhyMuSpm8Dm4y2rA6fTlE
   VITE_GEMINI_API_KEY = AIzaSyDo1ndEm0_eLxpOenbjcJWLwvGGLndtAAM
   ```

6. **Deploy**
   - Click **"Create Static Site"**
   - Wait 3-5 minutes for first deployment
   - Your site will be live at: `https://agrislove.onrender.com`

---

## ✅ Render Features

- ✅ **Free tier** available
- ✅ **Automatic HTTPS**
- ✅ **Auto-deploy on git push**
- ✅ **Custom domains** supported
- ✅ **No credit card required** for static sites

---

## 🔄 Automatic Deployments

- Every push to `main` branch = Automatic deployment
- Build logs available in dashboard
- Email notifications for deployments

---

## 🛠️ Troubleshooting

### Build Fails
- Check **Build Logs** in Render dashboard
- Ensure Node.js version is 18+ (add to `package.json` if needed)
- Verify environment variables are set

### Environment Variables Not Working
- Go to **Environment** tab
- Ensure variables start with `VITE_`
- Redeploy after adding variables

### Site Not Loading
- Check build logs
- Verify `dist` folder is generated
- Ensure build command is correct

---

## 📊 Render Dashboard

- **Services** - View all your deployments
- **Logs** - See build and runtime logs
- **Settings** - Configure environment variables
- **Custom Domains** - Add your domain

---

**Start deploying:** https://render.com

