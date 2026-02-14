# Database Population Scripts

## Overview

This directory contains scripts to populate the Supabase database with demo data for the AgriSlove application.

## Prerequisites

1. Node.js installed (v18 or higher)
2. Supabase project set up with the following tables:
   - `crop_recommendations`
   - `market_prices`
   - `weather_data`
   - `fertilizer_recommendations`
   - `traditional_practices`
   - `recipes`

## Setup

1. Make sure you have a `.env` file in the `agrislove-01/` directory with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

## Running the Population Script

To populate the database with demo data, run:

```bash
npm run populate-db
```

Or directly with tsx:

```bash
npx tsx scripts/populate-database.ts
```

## What Data is Populated?

The script populates the following tables:

1. **crop_recommendations** - ~200+ crop recommendations across different states, soil types, and seasons
2. **market_prices** - ~100+ market price entries for various crops across different states and markets
3. **weather_data** - Weather data for 10 states with 4 districts each (40 entries)
4. **fertilizer_recommendations** - 14 fertilizer recommendations for major crops
5. **traditional_practices** - 20 traditional farming practices
6. **recipes** - 14 traditional Indian recipes

## Notes

- The script will skip existing records if they have duplicate keys
- Data is inserted in batches for better performance
- The script uses the Supabase client from environment variables
- If environment variables are not set, it will use hardcoded fallback values

## Troubleshooting

If you encounter errors:

1. **Connection errors**: Check your Supabase URL and API key in `.env`
2. **Table not found**: Ensure all tables exist in your Supabase project
3. **Permission errors**: Check that your Supabase anon key has insert permissions
4. **Duplicate key errors**: The script may skip these - this is normal if data already exists

