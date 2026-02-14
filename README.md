# AgriSlove - Smart Agriculture Platform

AgriSlove is a comprehensive agricultural platform that helps farmers make informed decisions using modern technology and traditional knowledge. The platform combines AI-powered features with community-driven insights to provide a complete farming solution.

## 🌟 Features

### 1. Disease Detection
- Upload plant images for instant disease identification
- Get detailed information about symptoms and treatments
- Receive preventive measures and best practices
- Track disease history and patterns

### 2. Crop Recommendations
- Get personalized crop suggestions based on:
  - Soil type
  - Season
  - Region
- Detailed information about:
  - Water requirements
  - Growth period
  - Yield potential
  - Market demand

### 3. Market Prices
- Real-time market price updates
- Price trends and analysis
- Supply and demand information
- Quality grading
- Multiple market coverage

### 4. Weather Information
- Location-based weather updates
- Seasonal forecasts
- Agricultural advisories
- Temperature and rainfall alerts
- Wind speed monitoring

### 5. Fertilizer Recommendations
- Crop-specific fertilizer suggestions
- Organic and chemical options
- Application timing guidance
- Dosage recommendations
- Special notes and precautions

### 6. AI-Powered Chatbot
- 24/7 agricultural assistance
- Answers to farming queries
- Traditional practice information
- Crop management advice
- Sustainable farming guidance

### 7. Community Forum
- Connect with fellow farmers
- Share experiences and knowledge
- Post questions and get answers
- Category-based discussions
- Like and comment on posts

### 8. Traditional Practices
- Region-specific farming methods
- Traditional wisdom integration
- Sustainable farming techniques
- Community-verified practices
- Modern adaptation guidelines

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account (optional - app works with demo data)

### Quick Start (5 minutes)

1. **Navigate to project folder:**
```bash
cd agrislove-01
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file** (optional - app works without it):
Create a `.env` file in the `agrislove-01/` directory:
```env
VITE_SUPABASE_URL=https://derildzszqbqbgeygznk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlcmlsZHpzenFicWJnZXlnem5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3Mzg4MzEsImV4cCI6MjA2MDMxNDgzMX0.olc4Ade8TjAM3kxo6JeoP7DhyMuSpm8Dm4y2rA6fTlE
VITE_GEMINI_API_KEY=AIzaSyDo1ndEm0_eLxpOenbjcJWLwvGGLndtAAM
```

4. **Populate the database** (optional - recommended for full functionality):
```bash
npm run populate-db
```
This will populate your Supabase database with demo data for all features. See `scripts/README.md` for more details.

5. **Start the development server:**
```bash
npm run dev
```

The application will be available at **`http://localhost:8080`**

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder, ready for deployment.

### Deploy to Production

See `DEPLOYMENT.md` for detailed deployment instructions for:
- Railway
- Render
- Firebase Hosting
- Vercel
- Netlify

## 🛠️ Tech Stack

- Frontend:
  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - Shadcn UI

- Backend:
  - Supabase
  - Edge Functions
  - PostgreSQL

## 📱 Features in Detail

### Disease Detection
- Upload plant images
- AI-powered disease identification
- Treatment recommendations
- Prevention strategies
- Historical data tracking

### Crop Recommendations
- Soil analysis integration
- Seasonal suitability
- Regional adaptation
- Yield optimization
- Market demand analysis

### Market Prices
- Real-time price updates
- Historical price trends
- Market demand analysis
- Quality-based pricing
- Multiple market coverage

### Weather Information
- Location-based updates
- Seasonal forecasts
- Agricultural advisories
- Extreme weather alerts
- Farming recommendations

### Fertilizer Recommendations
- Crop-specific suggestions
- Organic alternatives
- Application timing
- Dosage guidelines
- Soil health monitoring

### AI Chatbot
- 24/7 assistance
- Farming queries
- Best practices
- Problem-solving
- Knowledge sharing

### Community Forum
- User interactions
- Knowledge sharing
- Question-answer platform
- Category organization
- Engagement features

### Traditional Practices
- Regional wisdom
- Sustainable methods
- Modern adaptations
- Community verification
- Best practices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Farmers and agricultural experts
- Open-source community
- Traditional farming communities
- Agricultural research institutions
