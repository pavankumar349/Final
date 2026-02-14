# Netlify Deployment Guide for AgriSlove

## ✅ Your code is now on GitHub!
**Repository:** https://github.com/pavankumar349/Final

## 🚀 Deploy to Netlify (Step-by-Step)

### Method 1: Deploy via Netlify Dashboard (Recommended)

1. **Go to Netlify**
   - Visit: https://app.netlify.com
   - Sign up or log in with your GitHub account

2. **Add New Site**
   - Click **"Add new site"** → **"Import an existing project"**
   - Choose **"Deploy with GitHub"**
   - Authorize Netlify to access your GitHub account

3. **Select Repository**
   - Find and select: **`pavankumar349/Final`**
   - Click **"Connect"**

4. **Configure Build Settings**
   Netlify should auto-detect these from `netlify.toml`, but verify:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Branch to deploy:** `main`

5. **Add Environment Variables**
   Click **"Show advanced"** → **"New variable"** and add:
   ```
   VITE_SUPABASE_URL = https://derildzszqbqbgeygznk.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlcmlsZHpzenFicWJnZXlnem5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3Mzg4MzEsImV4cCI6MjA2MDMxNDgzMX0.olc4Ade8TjAM3kxo6JeoP7DhyMuSpm8Dm4y2rA6fTlE
   VITE_GEMINI_API_KEY = AIzaSyDo1ndEm0_eLxpOenbjcJWLwvGGLndtAAM
   ```

6. **Deploy**
   - Click **"Deploy site"**
   - Wait 2-3 minutes for build to complete
   - Your site will be live at: `https://random-name-123456.netlify.app`

7. **Custom Domain (Optional)**
   - Go to **Site settings** → **Domain management**
   - Click **"Add custom domain"**
   - Follow instructions to configure your domain

---

### Method 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Site**
   ```bash
   netlify init
   ```
   - Choose: **"Create & configure a new site"**
   - Select your team
   - Site name: (leave blank for auto-generated or enter custom name)

4. **Set Environment Variables**
   ```bash
   netlify env:set VITE_SUPABASE_URL "https://derildzszqbqbgeygznk.supabase.co"
   netlify env:set VITE_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlcmlsZHpzenFicWJnZXlnem5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3Mzg4MzEsImV4cCI6MjA2MDMxNDgzMX0.olc4Ade8TjAM3kxo6JeoP7DhyMuSpm8Dm4y2rA6fTlE"
   netlify env:set VITE_GEMINI_API_KEY "AIzaSyDo1ndEm0_eLxpOenbjcJWLwvGGLndtAAM"
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

---

## 📋 What's Already Configured

✅ **`netlify.toml`** - Build configuration file
✅ **`_redirects`** - SPA routing support
✅ **Build settings** - Auto-detected from Vite
✅ **Node version** - Set to 18

## 🔄 Automatic Deployments

Once connected to GitHub:
- **Every push to `main` branch** = Automatic production deployment
- **Pull requests** = Preview deployments
- **Build logs** available in Netlify dashboard

## 🛠️ Troubleshooting

### Build Fails
- Check **Build logs** in Netlify dashboard
- Ensure Node.js version is 18+
- Verify environment variables are set correctly

### Environment Variables Not Working
- Go to **Site settings** → **Environment variables**
- Ensure all variables start with `VITE_`
- Redeploy after adding variables

### Routing Issues (404 errors)
- The `_redirects` file handles SPA routing
- If issues persist, check `netlify.toml` redirect rules

### Site Not Loading
- Check build logs for errors
- Verify `dist` folder is being generated
- Ensure all dependencies are in `package.json`

## 📊 Monitoring

- **Deploy status:** Dashboard shows all deployments
- **Build logs:** Click any deployment to see logs
- **Analytics:** Available in Netlify dashboard (may require upgrade)

## 🎯 Next Steps After Deployment

1. **Test your live site** - Visit the Netlify URL
2. **Set up custom domain** (optional)
3. **Enable HTTPS** (automatic with Netlify)
4. **Configure form handling** (if needed)
5. **Set up continuous deployment** (already enabled)

---

## ✅ Deployment Checklist

- [x] Code pushed to GitHub
- [x] Netlify configuration files added
- [ ] Netlify account created
- [ ] Repository connected to Netlify
- [ ] Environment variables added
- [ ] Site deployed successfully
- [ ] Custom domain configured (optional)
- [ ] Site tested and working

---

**Your AgriSlove app is ready to deploy! 🚀**

Visit: https://app.netlify.com to get started.

