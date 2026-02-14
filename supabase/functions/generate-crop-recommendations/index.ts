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
    const { soilType, season, region } = await req.json()
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get crop recommendations from database
    const { data: recommendations } = await supabaseClient
      .from('crop_recommendations')
      .select('*')
      .eq('soil_type', soilType)
      .eq('season', season)
      .eq('region', region)
      .limit(5)

    if (recommendations && recommendations.length > 0) {
      return new Response(
        JSON.stringify(recommendations),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    // If no recommendations found, generate them
    const newRecommendations = generateCropRecommendations(soilType, season, region)
    
    // Save to database
    await supabaseClient
      .from('crop_recommendations')
      .insert(newRecommendations)

    return new Response(
      JSON.stringify(newRecommendations),
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

function generateCropRecommendations(soilType: string, season: string, region: string) {
  const crops = {
    'Black Soil': {
      'Kharif': ['Cotton', 'Soybean', 'Pigeon Pea'],
      'Rabi': ['Wheat', 'Chickpea', 'Mustard'],
      'Summer': ['Groundnut', 'Sunflower', 'Moong']
    },
    'Red Soil': {
      'Kharif': ['Maize', 'Groundnut', 'Pigeon Pea'],
      'Rabi': ['Wheat', 'Chickpea', 'Mustard'],
      'Summer': ['Moong', 'Urad', 'Sunflower']
    },
    'Alluvial Soil': {
      'Kharif': ['Rice', 'Maize', 'Soybean'],
      'Rabi': ['Wheat', 'Mustard', 'Potato'],
      'Summer': ['Moong', 'Urad', 'Vegetables']
    }
  }

  const recommendedCrops = crops[soilType]?.[season] || ['Rice', 'Wheat', 'Maize']
  
  return recommendedCrops.map(crop => ({
    crop_name: crop,
    soil_type: soilType,
    season: season,
    region: region,
    water_requirement: 'Medium',
    growth_period: '90-120 days',
    yield_potential: '3-4 tonnes per hectare',
    market_demand: 'High',
    special_notes: 'Suitable for the given soil and season conditions'
  }))
} 