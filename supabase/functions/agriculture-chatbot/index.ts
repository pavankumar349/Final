// Ensure Deno environment is correctly set up
if (typeof Deno === 'undefined') {
  throw new Error('Deno environment is not available. Please ensure you are running this in a Deno environment.');
}

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const additionalPrompts = [
  "What are the best practices for crop rotation?",
  "How can I improve soil health naturally?",
  "What are effective organic pest control methods?",
  "How do I conserve water in agriculture?",
  "What are the benefits of using cover crops?",
  "How can I manage soil erosion on my farm?",
  "What are the best practices for composting?",
  "How do I implement sustainable farming practices?",
  "What are the traditional methods of seed storage?",
  "How can I increase biodiversity on my farm?",
  "What are the best practices for integrated pest management?",
  "How do I manage crop diseases organically?",
  "What are the benefits of agroforestry?",
  "How can I improve pollination in my crops?",
  "What are the best practices for organic farming?",
  "How do I manage weeds without chemicals?",
  "What are the benefits of using green manure?",
  "How can I improve soil fertility naturally?",
  "What are the best practices for water harvesting?",
  "How do I implement permaculture principles?",
  "What are the benefits of using biochar?",
  "How can I improve crop yield sustainably?",
  "What are the best practices for crop diversification?",
  "How do I manage pests using natural predators?",
  "What are the benefits of using organic fertilizers?",
  "How can I improve soil structure?",
  "What are the best practices for rotational grazing?",
  "How do I manage livestock sustainably?",
  "What are the benefits of using heirloom seeds?",
  "How can I improve water quality on my farm?",
  "What are the best practices for agroecology?",
  "How do I manage farm waste sustainably?",
  "What are the benefits of using renewable energy in agriculture?",
  "How can I improve soil moisture retention?",
  "What are the best practices for urban farming?",
  "How do I manage farm biodiversity?",
  "What are the benefits of using organic mulches?",
  "How can I improve crop resilience to climate change?",
  "What are the best practices for aquaponics?",
  "How do I manage farm labor sustainably?",
  "What are the benefits of using natural pest repellents?",
  "How can I improve soil pH naturally?",
  "What are the best practices for vertical farming?",
  "How do I manage farm equipment sustainably?",
  "What are the benefits of using organic pesticides?",
  "How can I improve crop quality naturally?",
  "What are the best practices for community-supported agriculture?",
  "How do I manage farm finances sustainably?",
  "What are the benefits of using organic herbicides?",
  "How can I improve farm productivity sustainably?"
];

// Predefined agricultural knowledge prompts to enhance the chatbot's agricultural knowledge
const agriculturalKnowledgePrompt = `You are an agricultural assistant with expertise in both modern and traditional farming practices. 
You have knowledge about:
- Various crop types and their growing conditions
- Soil types and soil health management
- Organic and traditional pest control methods
- Sustainable farming practices
- Traditional and indigenous agricultural knowledge
- Weather impacts on agriculture
- Fertilizers and soil amendments
- Crop rotation and companion planting
- Water conservation techniques
- Harvest and post-harvest handling

When answering, prioritize sustainable and eco-friendly approaches. Include traditional wisdom where applicable.
For technical questions, provide practical, actionable advice that farmers can implement.
If you're uncertain, acknowledge limitations rather than providing potentially harmful advice.

Here are some common topics you can discuss:
${additionalPrompts.join('\n')}`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get relevant information from database
    const { data: practices } = await supabaseClient
      .from('traditional_practices')
      .select('*')
      .limit(5);

    const { data: crops } = await supabaseClient
      .from('crop_recommendations')
      .select('*')
      .limit(5);

    // Generate response based on message and database data
    const response = generateResponse(message, practices, crops);

    return new Response(
      JSON.stringify({ response }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in agriculture-chatbot function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});

function generateResponse(message: string, practices: any[], crops: any[]): string {
  // Simple response generation based on keywords
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('traditional') || lowerMessage.includes('practice')) {
    const practice = practices[Math.floor(Math.random() * practices.length)];
    return `Here's a traditional farming practice: ${practice.title}. ${practice.description}`;
  }
  
  if (lowerMessage.includes('crop') || lowerMessage.includes('plant')) {
    const crop = crops[Math.floor(Math.random() * crops.length)];
    return `For your query about crops, here's a recommendation: ${crop.crop_name}. It grows well in ${crop.climate_zone} climate and ${crop.soil_type} soil.`;
  }
  
  return "I'm your agriculture assistant. I can help you with information about traditional farming practices, crop recommendations, and more. What would you like to know?";
}
