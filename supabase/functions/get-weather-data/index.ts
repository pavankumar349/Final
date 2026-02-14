import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { location } = await req.json()
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get weather data from database
    const { data: weatherData } = await supabaseClient
      .from('weather_data')
      .select('*')
      .eq('location', location)
      .order('timestamp', { ascending: false })
      .limit(1)

    if (weatherData && weatherData.length > 0) {
      return new Response(
        JSON.stringify(weatherData[0]),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    // If no weather data found, generate one
    const weather = generateWeatherData(location)
    
    // Save to database
    await supabaseClient
      .from('weather_data')
      .insert(weather)

    return new Response(
      JSON.stringify(weather),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

function generateWeatherData(location: string) {
  const seasons = {
    'Summer': { temp: { min: 30, max: 45 }, humidity: { min: 40, max: 60 } },
    'Monsoon': { temp: { min: 25, max: 35 }, humidity: { min: 70, max: 90 } },
    'Winter': { temp: { min: 15, max: 30 }, humidity: { min: 50, max: 70 } }
  }

  const currentSeason = getCurrentSeason()
  const seasonData = seasons[currentSeason]
  
  const temperature = Math.floor(Math.random() * (seasonData.temp.max - seasonData.temp.min + 1)) + seasonData.temp.min
  const humidity = Math.floor(Math.random() * (seasonData.humidity.max - seasonData.humidity.min + 1)) + seasonData.humidity.min
  const rainfall = currentSeason === 'Monsoon' ? Math.floor(Math.random() * 50) : Math.floor(Math.random() * 10)
  const windSpeed = Math.floor(Math.random() * 20) + 5

  return {
    location: location,
    temperature: temperature,
    humidity: humidity,
    rainfall: rainfall,
    wind_speed: windSpeed,
    season: currentSeason,
    timestamp: new Date().toISOString(),
    forecast: generateForecast(currentSeason),
    agricultural_advisory: generateAdvisory(currentSeason, temperature, rainfall)
  }
}

function getCurrentSeason() {
  const month = new Date().getMonth()
  if (month >= 2 && month <= 5) return 'Summer'
  if (month >= 6 && month <= 9) return 'Monsoon'
  return 'Winter'
}

function generateForecast(season: string) {
  const forecasts = {
    'Summer': 'Hot and dry conditions expected. Irrigation may be needed.',
    'Monsoon': 'Heavy rainfall expected. Take necessary precautions.',
    'Winter': 'Cool and dry conditions expected. Protect crops from frost.'
  }
  return forecasts[season]
}

function generateAdvisory(season: string, temperature: number, rainfall: number) {
  if (season === 'Summer') {
    if (temperature > 40) {
      return 'High temperature alert! Increase irrigation frequency and provide shade if possible.'
    }
    return 'Regular irrigation recommended. Monitor soil moisture levels.'
  }
  if (season === 'Monsoon') {
    if (rainfall > 30) {
      return 'Heavy rainfall alert! Ensure proper drainage and protect crops from waterlogging.'
    }
    return 'Monitor for pest and disease outbreaks. Apply preventive measures.'
  }
  if (temperature < 20) {
    return 'Low temperature alert! Protect crops from frost damage.'
  }
  return 'Normal winter conditions. Continue regular maintenance.'
} 