
import React from 'react';
import Layout from '@/components/layout/Layout';
import AgricultureChatbot from '@/components/chat/AgricultureChatbot';

const ChatbotPage = () => {
  const QUESTIONS: string[] = [
    "What crops are best for black soil in Maharashtra?",
    "Suggest kharif crops for semi-arid climate",
    "How to control aphids organically on okra?",
    "Best natural fertilizer for tomato plants?",
    "How often should I irrigate paddy fields?",
    "What is SRI method in rice and its benefits?",
    "How to improve soil fertility in red soil?",
    "Neem oil spray ratio for pest control?",
    "Which millets grow well in low rainfall areas?",
    "How to store seeds traditionally for next season?",
    "Organic methods to control fruit fly in mango?",
    "How to detect nitrogen deficiency symptoms in crops?",
    "What vegetables can I grow in winter in Punjab?",
    "How to prepare a compost heap effectively?",
    "Drip vs flood irrigation: which is better for cotton?",
    "Fertilizer recommendation for wheat in loamy soil",
    "How to reduce waterlogging in fields during monsoon?",
    "Safe way to control whiteflies on chilli?",
    "Which legumes are best for crop rotation?",
    "How to prevent blossom end rot in tomatoes?",
    "What is the ideal pH for most crops?",
    "How to do mulching and what materials to use?",
    "How to identify and treat powdery mildew on grapes?",
    "Are there natural ways to control termites?",
    "How to set up rainwater harvesting for farms?",
    "Which crops suit sandy soil conditions?",
    "Tips to increase yield in pigeonpea?",
    "Organic pest control for cabbage caterpillars?",
    "How to use green manure effectively?",
    "What are the benefits of intercropping?",
    "Which crops for Rabi season in Uttar Pradesh?",
    "How to protect crops during heat waves?",
    "Traditional seed treatment methods before sowing?",
    "Fertilizer schedule for sugarcane?",
    "How to improve drainage in clay soil?",
    "How can I manage weeds without chemicals?",
    "Which crops are suitable for hill regions?",
    "How to reduce post-harvest losses in vegetables?",
    "What spacing is best for maize planting?",
    "Tips to grow groundnut with less water",
    "How to identify and control rice blast disease?",
    "Which fruit trees are good for tropical climate?",
    "How to prevent leaf curl in chilli plants?",
    "Are biofertilizers useful for pulses?",
    "When to prune mango trees for better yield?",
    "How to set up a kitchen garden organically?",
    "How to increase soil organic carbon?",
    "What is companion planting and examples?",
    "How to plan irrigation schedule for cotton?",
    "How to enhance pollination in cucurbits?"
  ];

  const ANSWERS: Record<string, string> = {
    "What crops are best for black soil in Maharashtra?": "Black (regur) soil suits cotton, soybean, pigeonpea, sorghum and groundnut. Use crop rotation (cotton → pulses) and add gypsum and organic matter to improve structure.",
    "Suggest kharif crops for semi-arid climate": "Prefer drought-tolerant kharif crops: pearl millet (bajra), sorghum (jowar), pigeonpea, mung, sesame and groundnut with mulching and timely weeding.",
    "How to control aphids organically on okra?": "Spray 5 ml neem oil + 1 ml soap per liter weekly, release ladybird beetles if available, and remove heavily infested tips early morning.",
    "Best natural fertilizer for tomato plants?": "Apply 2–3 kg well-decomposed compost/plant at transplanting, top-dress with vermicompost at flowering, and use fermented jeevamruth/panchagavya foliar sprays.",
    "How often should I irrigate paddy fields?": "Maintain 2–5 cm standing water, or with AWD keep water 1–2 days after it disappears then re-flood. Avoid flooding during early seedling and at ripening.",
    "What is SRI method in rice and its benefits?": "SRI uses single, young seedlings, wider spacing, intermittent irrigation and weeding. Benefits: 20–40% water saving and yield gains of 10–30%.",
    "How to improve soil fertility in red soil?": "Incorporate green manure (sunnhemp), compost and farmyard manure, add lime if acidic, and rotate with legumes to raise organic carbon.",
    "Neem oil spray ratio for pest control?": "Use 3–5 ml cold-pressed neem oil + 1 ml mild soap per liter water. Shake well and spray in evening; repeat every 7–10 days.",
    "Which millets grow well in low rainfall areas?": "Pearl millet (bajra), foxtail millet, little millet and finger millet (ragi) perform well with 400–600 mm rainfall and sandy to loamy soils.",
    "How to store seeds traditionally for next season?": "Sun-dry to safe moisture, mix with ash/neem leaves, store in earthen pots or gunny bags lined with neem leaves in a cool, dry place.",
    "Organic methods to control fruit fly in mango?": "Collect and destroy fallen fruits, set methyl eugenol lure traps, use protein bait sprays, and bag fruit where feasible.",
    "How to detect nitrogen deficiency symptoms in crops?": "Uniform pale yellowing of older leaves, stunted growth, thin stems. Correct with split nitrogen doses and organic manures.",
    "What vegetables can I grow in winter in Punjab?": "Pea, cabbage, cauliflower, carrot, radish, spinach, methi, broccoli and onion are ideal winter crops in Punjab.",
    "How to prepare a compost heap effectively?": "Layer greens and browns 1:2, keep moist like a wrung sponge, turn every 2–3 weeks, and maintain aeration for 8–12 weeks.",
    "Drip vs flood irrigation: which is better for cotton?": "Drip saves 30–50% water and increases yield by better fertigation and reduced weed pressure compared to flood irrigation.",
    "Fertilizer recommendation for wheat in loamy soil": "General: 120:60:40 NPK kg/ha (split N doses). Add 5–10 t/ha FYM and zinc if deficient; adjust to soil test.",
    "How to reduce waterlogging in fields during monsoon?": "Open field drains, beds-and-furrows, residue mulching, raise bund outlets, and keep waterways clear to evacuate excess water.",
    "Safe way to control whiteflies on chilli?": "Use yellow sticky traps, neem oil 5 ml/L, avoid broad-spectrum sprays, and manage weeds; release Encarsia if available.",
    "Which legumes are best for crop rotation?": "Chickpea, pigeonpea, mungbean and cowpea fix nitrogen, breaking pest cycles and improving soil for cereals.",
    "How to prevent blossom end rot in tomatoes?": "Ensure consistent watering, maintain Ca by gypsum or foliar Ca, avoid excess N and protect roots with mulch.",
    "What is the ideal pH for most crops?": "Most field crops prefer pH 6.0–7.5. Lime acidic soils; add elemental sulfur for alkaline soils if needed.",
    "How to do mulching and what materials to use?": "Apply 5–10 cm mulch around plants using straw, dry leaves or black plastic; keeps moisture, suppresses weeds and moderates temperature.",
    "How to identify and treat powdery mildew on grapes?": "White powdery growth on leaves/berries; improve airflow, sulfur sprays, and rotate systemic fungicides as per label.",
    "Are there natural ways to control termites?": "Use neem cake, destroy termitaria near fields, water management, and sand barriers around young plants.",
    "How to set up rainwater harvesting for farms?": "Construct farm ponds with inlet silt traps, bunds/contour trenches, and rooftop collection linked to storage tanks.",
    "Which crops suit sandy soil conditions?": "Groundnut, watermelon, muskmelon, sesame and sweet potato suit sandy soils with frequent light irrigations and organic matter.",
    "Tips to increase yield in pigeonpea?": "Use recommended varieties, timely sowing (June–July), wider rows, balanced NPK+S, and intercrop with cereals.",
    "Organic pest control for cabbage caterpillars?": "Handpick larvae, apply Bt (Bacillus thuringiensis), and use neem 5 ml/L at 7–10 day intervals.",
    "How to use green manure effectively?": "Sow sunnhemp/dhaincha 45–50 days before main crop and incorporate at flowering for nitrogen and organic matter.",
    "What are the benefits of intercropping?": "Better resource use, reduced pests, improved soil cover and risk buffering; e.g., maize + cowpea, pigeonpea + sorghum.",
    "Which crops for Rabi season in Uttar Pradesh?": "Wheat, mustard, gram, peas and lentil are common Rabi crops in UP.",
    "How to protect crops during heat waves?": "Mulch, irrigate in evenings/mornings, shade-nets for nurseries, anti-transpirants where recommended.",
    "Traditional seed treatment methods before sowing?": "Use turmeric/ash/neem leaf powder; brine float tests and sun-drying to reduce seed-borne issues.",
    "Fertilizer schedule for sugarcane?": "Apply 250–300 kg N, 100 kg P2O5, 100 kg K2O/ha split 3–4 times; add organics and pressmud if available; adjust to soil test.",
    "How to improve drainage in clay soil?": "Add organic matter, form raised beds, apply gypsum to improve structure, and deep till along drains pre-season.",
    "How can I manage weeds without chemicals?": "Mulching, stale seed bed, hand weeding, cover crops, and competitive varieties reduce herbicide needs.",
    "Which crops are suitable for hill regions?": "Millets, potato, temperate vegetables (cabbage, cauliflower), beans and apple/peach in suitable elevations.",
    "How to reduce post-harvest losses in vegetables?": "Harvest cool hours, shade, avoid bruising, pre-cool, grade, and ventilated crates; quick market linkage.",
    "What spacing is best for maize planting?": "Generally 60–75 cm rows × 20–25 cm plant spacing (≈ 53–83k plants/ha), adjust to variety and rainfall.",
    "Tips to grow groundnut with less water": "Use short-duration varieties, sow on ridges, gypsum at pegging, mulching, and irrigate at flowering and pegging.",
    "How to identify and control rice blast disease?": "Diamond lesions with grey centers; use resistant varieties, balanced N, and tricyclazole where permitted.",
    "Which fruit trees are good for tropical climate?": "Mango, banana, coconut, papaya, guava, sapota and pomegranate perform well in tropical zones.",
    "How to prevent leaf curl in chilli plants?": "Manage whiteflies/thrips (yellow traps, neem), rogue infected plants, and use tolerant varieties.",
    "Are biofertilizers useful for pulses?": "Yes—Rhizobium/PSB inoculation improves N fixation and P uptake, enhancing yields and soil health.",
    "When to prune mango trees for better yield?": "Light prune post-harvest to maintain canopy and remove dead/diseased wood; avoid heavy pruning.",
    "How to set up a kitchen garden organically?": "Raised beds, compost, crop rotation, mixed planting with marigold/basil, drip or mulching for water saving.",
    "How to increase soil organic carbon?": "Add compost/FYM, green manures, residue retention, reduce tillage and include legumes in rotations.",
    "What is companion planting and examples?": "Planting supportive species together; e.g., marigold with tomato (nematodes), basil with tomato (pests), maize-bean-squash.",
    "How to plan irrigation schedule for cotton?": "Irrigate at square/flower/boll stages; use soil moisture checks or ET-based scheduling; prefer drip fertigation.",
    "How to enhance pollination in cucurbits?": "Maintain flowering bees with flowers/border crops, avoid insecticides during bloom, and hand-pollinate early morning."
  };

  const ask = (q: string) => {
    window.dispatchEvent(new CustomEvent('askChatbot', { detail: { question: q, presetAnswer: ANSWERS[q] } }));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-agri-green-dark mb-4">Agriculture Assistant</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get answers to your farming questions, learn about traditional practices, 
              and receive advice on crops, soil management, pest control, and more.
            </p>
          </div>
          
          <AgricultureChatbot />
          
          <div className="mt-10 bg-agri-cream-light p-6 rounded-lg">
            <h2 className="text-xl font-bold text-agri-green-dark mb-4">
              Suggested Questions (Tap to Ask)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => ask(q)}
                  className="text-left bg-white hover:bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-100"
                >
                  <span className="text-agri-green-dark text-sm">{q}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatbotPage;
