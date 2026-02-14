import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
const googleApiKey = Deno.env.get("GOOGLE_API_KEY");

let cachedData: Record<string, unknown>[] | null = null;
let lastCacheTime = 0;
const CACHE_DURATION_MS = 1000 * 60 * 30; // 30 minutes

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
 
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse dish name from query string
    const url = new URL(req.url);
    const dish = url.searchParams.get('dish');

    // Return cache if available and fresh (only if no dish filter)
    if (!dish && cachedData && Date.now() - lastCacheTime < CACHE_DURATION_MS) {
      return new Response(JSON.stringify(cachedData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `Give me a JSON array of 200 unique Indian traditional recipes. Each object must have: id (1-200), title, ingredients (array of 4-8 items), description (one sentence), and cookingTime (e.g., "35 min"). No explanations, just raw JSON.`;

    let recipes: any[] = [];
    let aiSuccess = false;

    // 1. Try OpenAI
    if (openAIApiKey) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openAIApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You generate India's traditional recipes (for a database)." },
            { role: "user", content: prompt }
          ],
          max_tokens: 4096,
        }),
      });
      const result = await response.json();
      try {
        recipes = JSON.parse(result.choices[0].message.content);
        aiSuccess = Array.isArray(recipes) && recipes.length > 0;
      } catch (err) { console.error(err); }
    }

    // 2. Try Gemini if OpenAI failed
    if (!aiSuccess && geminiApiKey) {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + geminiApiKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });
      const result = await response.json();
      try {
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
        recipes = JSON.parse(text);
        aiSuccess = Array.isArray(recipes) && recipes.length > 0;
      } catch (err) { console.error(err); }
    }

    // 3. Try Google (you can add logic here)
    if (!aiSuccess && googleApiKey) {
      recipes = [];
      aiSuccess = false;
    }

    // Fallback static recipe if all AI calls fail
    if (!aiSuccess) {
      recipes = [
        {
          id: 1,
          title: "Biryani",
          ingredients: ["Rice", "Chicken", "Spices", "Yogurt", "Onion", "Garlic", "Ginger", "Ghee"],
          description: "A classic Indian rice dish with aromatic spices and meat or vegetables.",
          cookingTime: "60 min"
        }
      ];
    }

    // If dish filter is provided, filter recipes by dish name (case-insensitive, partial match)
    let filteredRecipes = recipes;
    if (dish) {
      const dishLower = dish.toLowerCase();
      filteredRecipes = Array.isArray(recipes) ? recipes.filter((r) => {
        const title = r.title || r.name || '';
        return title.toLowerCase().includes(dishLower);
      }) : [];
      // If still no results, and fallback not yet used, add fallback static recipe for the search
      if (filteredRecipes.length === 0) {
        filteredRecipes = [
          {
            id: 1,
            title: dish.charAt(0).toUpperCase() + dish.slice(1),
            ingredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
            description: `A traditional recipe for ${dish}.`,
            cookingTime: "45 min"
          }
        ];
      }
    }

    // Cache only if no dish filter
    if (!dish) {
      cachedData = recipes;
      lastCacheTime = Date.now();
    }

    return new Response(JSON.stringify(filteredRecipes), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
