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
    const { imageUrl, cropType } = await req.json()
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get disease detection from database
    const { data: detections } = await supabaseClient
      .from('disease_detections')
      .select('*')
      .eq('crop_type', cropType)
      .limit(5)

    if (detections && detections.length > 0) {
      return new Response(
        JSON.stringify(detections[0]),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    // If no detection found, generate one
    const detection = generateDiseaseDetection(cropType)
    
    // Save to database
    await supabaseClient
      .from('disease_detections')
      .insert({
        ...detection,
        image_url: imageUrl
      })

    return new Response(
      JSON.stringify(detection),
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

function generateDiseaseDetection(cropType: string) {
  const diseases = {
    'Rice': {
      name: 'Bacterial Leaf Blight',
      symptoms: ['Yellowing of leaf margins', 'Water-soaked lesions', 'Wilting of leaves'],
      treatment: ['Use disease-resistant varieties', 'Apply copper-based fungicides', 'Practice crop rotation'],
      prevention: ['Maintain proper field drainage', 'Avoid excessive nitrogen', 'Use certified seeds']
    },
    'Wheat': {
      name: 'Rust Disease',
      symptoms: ['Orange-brown pustules on leaves', 'Premature leaf death', 'Reduced grain size'],
      treatment: ['Apply fungicides early', 'Remove infected plant debris', 'Use resistant varieties'],
      prevention: ['Monitor weather conditions', 'Practice crop rotation', 'Maintain proper spacing']
    },
    'Cotton': {
      name: 'Boll Rot',
      symptoms: ['Discolored bolls', 'Premature opening', 'Reduced fiber quality'],
      treatment: ['Apply recommended fungicides', 'Remove infected bolls', 'Improve air circulation'],
      prevention: ['Control insect pests', 'Maintain proper spacing', 'Avoid excessive moisture']
    }
  }

  const disease = diseases[cropType] || {
    name: 'General Plant Disease',
    symptoms: ['Leaf spots', 'Wilting', 'Stunted growth'],
    treatment: ['Apply appropriate fungicides', 'Remove infected parts', 'Improve growing conditions'],
    prevention: ['Use disease-free seeds', 'Practice crop rotation', 'Maintain plant health']
  }

  return {
    crop_type: cropType,
    disease_name: disease.name,
    symptoms: disease.symptoms,
    treatment: disease.treatment,
    prevention: disease.prevention,
    confidence_score: 0.85,
    detection_date: new Date().toISOString()
  }
} 