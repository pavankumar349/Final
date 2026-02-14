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
    const { region, cropType } = await req.json()
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get traditional practices from database
    const { data: practices } = await supabaseClient
      .from('traditional_practices')
      .select('*')
      .eq('region', region)
      .eq('crop_type', cropType)
      .limit(5)

    if (practices && practices.length > 0) {
      return new Response(
        JSON.stringify(practices),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    // If no practices found, generate them
    const newPractices = generateTraditionalPractices(region, cropType)
    
    // Save to database
    await supabaseClient
      .from('traditional_practices')
      .insert(newPractices)

    return new Response(
      JSON.stringify(newPractices),
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

function generateTraditionalPractices(region: string, cropType: string) {
  const practices = {
    'North India': {
      'Rice': [
        {
          name: 'SRI Method',
          description: 'System of Rice Intensification using less water and seeds',
          benefits: ['Higher yield', 'Water conservation', 'Better root development'],
          implementation: 'Plant single seedlings at wider spacing, maintain soil moisture'
        },
        {
          name: 'Green Manuring',
          description: 'Growing and incorporating green manure crops before rice',
          benefits: ['Soil fertility', 'Nitrogen fixation', 'Organic matter'],
          implementation: 'Grow dhaincha or sunnhemp, incorporate before flowering'
        }
      ],
      'Wheat': [
        {
          name: 'Zero Tillage',
          description: 'Direct seeding without soil disturbance',
          benefits: ['Moisture conservation', 'Reduced cost', 'Timely sowing'],
          implementation: 'Use zero-till drill for seeding after rice harvest'
        },
        {
          name: 'Crop Residue Management',
          description: 'Managing crop residues for soil health',
          benefits: ['Soil moisture', 'Organic matter', 'Erosion control'],
          implementation: 'Spread and incorporate crop residues after harvest'
        }
      ]
    },
    'South India': {
      'Rice': [
        {
          name: 'Samba Method',
          description: 'Traditional rice cultivation in Tamil Nadu',
          benefits: ['Drought resistance', 'Traditional wisdom', 'Local adaptation'],
          implementation: 'Use local varieties, follow traditional calendar'
        },
        {
          name: 'Fish Culture',
          description: 'Integrated fish farming in rice fields',
          benefits: ['Additional income', 'Pest control', 'Nutrient cycling'],
          implementation: 'Introduce fish after rice establishment'
        }
      ],
      'Coconut': [
        {
          name: 'Intercropping',
          description: 'Growing multiple crops in coconut gardens',
          benefits: ['Diversified income', 'Soil health', 'Space utilization'],
          implementation: 'Grow banana, pepper, or vegetables between palms'
        },
        {
          name: 'Organic Mulching',
          description: 'Using organic materials as mulch',
          benefits: ['Moisture retention', 'Weed control', 'Soil fertility'],
          implementation: 'Apply coconut husk or leaves around base'
        }
      ]
    }
  }

  const regionPractices = practices[region]?.[cropType] || [
    {
      name: 'Traditional Crop Rotation',
      description: 'Rotating crops to maintain soil health',
      benefits: ['Soil fertility', 'Pest control', 'Sustainable farming'],
      implementation: 'Follow traditional crop rotation patterns'
    },
    {
      name: 'Organic Manuring',
      description: 'Using traditional organic manures',
      benefits: ['Soil health', 'Sustainable nutrition', 'Cost-effective'],
      implementation: 'Apply farmyard manure or compost regularly'
    }
  ]

  return regionPractices.map(practice => ({
    ...practice,
    region: region,
    crop_type: cropType,
    source: 'Traditional Knowledge',
    validation_status: 'Community Verified',
    adaptation_notes: 'Can be adapted to modern farming systems'
  }))
} 