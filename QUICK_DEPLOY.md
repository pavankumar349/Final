# 🚀 Quick Deployment Guide - Get Your Live Link in 5 Minutes!

## Step 1: Deploy to Vercel (Recommended - 2 minutes)

1. **Click this link:** https://vercel.com/new
2. **Sign in with GitHub** (use your GitHub account)
3. **Click "Import Git Repository"**
4. **Select:** `pavankumar349/Final`
5. **Click "Import"**

### Configure (Auto-filled, just verify):
- ✅ Framework Preset: **Vite** (auto-detected)
- ✅ Root Directory: `./` 
- ✅ Build Command: `npm run build` (auto-filled)
- ✅ Output Directory: `dist` (auto-filled)
- ✅ Install Command: `npm install` (auto-filled)

### Add Environment Variables:
Click **"Environment Variables"** and add these 3:

```
Name: VITE_SUPABASE_URL
Value: https://derildzszqbqbgeygznk.supabase.co

Name: VITE_SUPABASE_ANON_KEY  
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlcmlsZHpzenFicWJnZXlnem5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3Mzg4MzEsImV4cCI6MjA2MDMxNDgzMX0.olc4Ade8TjAM3kxo6JeoP7DhyMuSpm8Dm4y2rA6fTlE

Name: VITE_GEMINI_API_KEY
Value: AIzaSyDo1ndEm0_eLxpOenbjcJWLwvGGLndtAAM
```

6. **Click "Deploy"**
7. **Wait 2-3 minutes**
8. **Your live link will appear!** (e.g., `https://final-xyz123.vercel.app`)

---

## Step 2: Alternative - Deploy to Render (If Vercel doesn't work)

1. **Go to:** https://dashboard.render.com
2. **Sign up with GitHub**
3. **Click "New +" → "Static Site"**
4. **Connect Repository:** `pavankumar349/Final`
5. **Configure:**
   - Name: `agrislove` (or any name)
   - Branch: `main`
   - Build Command: `npm run build`
   - Publish Directory: `dist`
6. **Add Environment Variables** (same 3 as above)
7. **Click "Create Static Site"**
8. **Wait 3-5 minutes**
9. **Your link:** `https://agrislove.onrender.com`

---

## 📋 What You'll Get

After deployment, you'll receive:
- ✅ **Live website URL** (e.g., `https://your-project.vercel.app`)
- ✅ **Automatic HTTPS** (secure connection)
- ✅ **Custom domain option** (add your own domain later)
- ✅ **Auto-deploy** (every git push = new deployment)

---

## 🎯 Your Project Link

**Once deployed, your link will be:**
- **Vercel:** `https://final-[random].vercel.app` or custom domain
- **Render:** `https://agrislove.onrender.com` or custom domain

The exact link will be shown in your deployment dashboard after deployment completes.

---

## ⚡ Quick Start Command (If using Vercel CLI)

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

**Start deploying now:** https://vercel.com/new

