# AgriSlove - Deployment Guide

## 🚀 Complete Deployment Guide

This guide will help you deploy AgriSlove to production platforms like Railway, Render, Firebase, Vercel, or Netlify.

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Supabase Account** (for backend)
4. **Git** (for version control)

## 🔧 Environment Setup

### 1. Create `.env` file

Create a `.env` file in the root directory (`agrislove-01/`) with the following:

```env
VITE_SUPABASE_URL=https://derildzszqbqbgeygznk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlcmlsZHpzenFicWJnZXlnem5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3Mzg4MzEsImV4cCI6MjA2MDMxNDgzMX0.olc4Ade8TjAM3kxo6JeoP7DhyMuSpm8Dm4y2rA6fTlE
VITE_GEMINI_API_KEY=AIzaSyDo1ndEm0_eLxpOenbjcJWLwvGGLndtAAM
```

### 2. Install Dependencies

```bash
cd agrislove-01
npm install
```

### 3. Build the Project

```bash
npm run build
```

The build output will be in the `dist/` folder.

## 🌐 Deployment Options

### Option 1: Railway (Recommended)

1. **Sign up** at [railway.app](https://railway.app)
2. **Create a new project**
3. **Connect your GitHub repository** or **upload the project**
4. **Add environment variables:**
   - Go to Variables tab
   - Add all variables from `.env` file
5. **Set build command:** `npm run build`
6. **Set start command:** `npm run preview` or `npx serve dist`
7. **Deploy**

### Option 2: Render

1. **Sign up** at [render.com](https://render.com)
2. **Create a new Static Site**
3. **Connect your repository**
4. **Configure:**
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
   - **Environment Variables:** Add all from `.env`
5. **Deploy**

### Option 3: Firebase Hosting

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase:**
   ```bash
   firebase init hosting
   ```
   - Select existing project or create new
   - **Public directory:** `dist`
   - **Single-page app:** Yes
   - **Overwrite index.html:** No

4. **Build and deploy:**
   ```bash
   npm run build
   firebase deploy
   ```

### Option 4: Vercel

1. **Sign up** at [vercel.com](https://vercel.com)
2. **Import your project**
3. **Configure:**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:** Add all from `.env`
4. **Deploy**

### Option 5: Netlify

1. **Sign up** at [netlify.com](https://netlify.com)
2. **Create a new site**
3. **Connect repository**
4. **Build settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Environment variables:** Add all from `.env`
5. **Deploy**

## 🔄 How the Application Works

### Backend Integration

The application is configured to fetch real-time data from Supabase backend:

1. **Crop Recommendations** - Fetches from `crop_recommendations` table
2. **Market Prices** - Fetches from `market_prices` table with real-time updates
3. **Weather Data** - Fetches from `weather_data` table
4. **Community Forum** - Fetches from `community_posts` table with real-time subscriptions
5. **Fertilizer Recommendations** - Fetches from `fertilizer_recommendations` table
6. **Traditional Practices** - Fetches from `traditional_practices` table
7. **Recipes** - Fetches from `recipes` table or generates via Gemini API
8. **Chatbot** - Uses Supabase Edge Function `agriculture-chatbot`

### Data Flow

```
User Input → Frontend → Supabase Client → Supabase Backend
                                      ↓
                              Database Tables / Edge Functions
                                      ↓
                              Real-time Data Response
                                      ↓
                              Frontend Display
```

### Fallback System

If Supabase backend is unavailable:
- All features have **comprehensive demo/mock data**
- Application continues to work seamlessly
- Users get appropriate responses

## 🛠️ Local Development

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Access the application:**
   - URL: `http://localhost:8080`
   - The app will automatically reload on changes

## 📊 Features & Backend Tables

| Feature | Supabase Table | Edge Function | Demo Data |
|---------|---------------|---------------|-----------|
| Crop Recommendation | `crop_recommendations` | - | ✅ Yes |
| Disease Detection | - | - | ✅ Yes (50+ diseases) |
| Weather | `weather_data` | `generate-weather` | ✅ Yes |
| Market Prices | `market_prices` | `get-market-prices` | ✅ Yes (36+ crops) |
| Fertilizer | `fertilizer_recommendations` | `generate-fertilizer-recommendations` | ✅ Yes (50 crops) |
| Traditional Practices | `traditional_practices` | `generate-traditional-practices-large` | ✅ Yes (50 practices) |
| Recipes | `recipes` | `generate-recipes-large` | ✅ Yes (50+ recipes) |
| Chatbot | - | `agriculture-chatbot` | ✅ Yes (Intelligent responses) |
| Community Forum | `community_posts` | - | ✅ Yes (Mock posts) |

## ✅ Production Checklist

Before deploying:

- [x] All environment variables configured
- [x] Supabase project set up
- [x] Database tables created (optional - app works with demo data)
- [x] Edge functions deployed (optional - app has fallbacks)
- [x] Build completes successfully
- [x] All features tested
- [x] Error handling in place
- [x] Demo data available for all features

## 🎯 Quick Start (5 minutes)

1. **Clone and install:**
   ```bash
   cd agrislove-01
   npm install
   ```

2. **Create `.env` file** (copy from `.env.example`)

3. **Run locally:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Deploy to your preferred platform**

## 🔗 Important URLs

- **Supabase Dashboard:** https://supabase.com/dashboard
- **Supabase Project:** https://derildzszqbqbgeygznk.supabase.co
- **Local Development:** http://localhost:8080

## 📝 Notes

- The application works **100% with demo data** even without Supabase setup
- All features fetch from backend **first**, then fall back to demo data
- Real-time subscriptions update data automatically
- All API calls have proper error handling

## 🆘 Troubleshooting

### Build fails
- Check Node.js version (v18+)
- Delete `node_modules` and `package-lock.json`, then `npm install`

### Environment variables not working
- Ensure `.env` file is in root directory
- Restart dev server after adding variables
- Check variable names start with `VITE_`

### Supabase connection issues
- Verify Supabase URL and key in `.env`
- Check Supabase project is active
- App will work with demo data if backend unavailable

---

**Your AgriSlove application is now ready for production deployment! 🚀**

