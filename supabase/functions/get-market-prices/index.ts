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
    const { cropName, marketName } = await req.json()
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get market prices from database
    const { data: prices } = await supabaseClient
      .from('market_prices')
      .select('*')
      .eq('crop_name', cropName)
      .eq('market_name', marketName)
      .order('date', { ascending: false })
      .limit(1)

    if (prices && prices.length > 0) {
      return new Response(
        JSON.stringify(prices[0]),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    // If no price found, generate one
    const price = generateMarketPrice(cropName, marketName)
    
    // Save to database
    await supabaseClient
      .from('market_prices')
      .insert(price)

    return new Response(
      JSON.stringify(price),
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

function generateMarketPrice(cropName: string, marketName: string) {
  const basePrices = {
    'Rice': { min: 1800, max: 2200 },
    'Wheat': { min: 1600, max: 2000 },
    'Maize': { min: 1400, max: 1800 },
    'Cotton': { min: 5000, max: 6000 },
    'Soybean': { min: 3000, max: 4000 }
  }

  const basePrice = basePrices[cropName] || { min: 1500, max: 2500 }
  const price = Math.floor(Math.random() * (basePrice.max - basePrice.min + 1)) + basePrice.min

  return {
    crop_name: cropName,
    market_name: marketName,
    price_per_quintal: price,
    date: new Date().toISOString(),
    price_trend: 'Stable',
    supply_quantity: 'Moderate',
    demand_level: 'High',
    quality_grade: 'A',
    special_notes: 'Prices may vary based on quality and market conditions'
  }
} 