import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

// Initialize Supabase client
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://derildzszqbqbgeygznk.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlcmlsZHpzenFicWJnZXlnem5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3Mzg4MzEsImV4cCI6MjA2MDMxNDgzMX0.olc4Ade8TjAM3kxo6JeoP7DhyMuSpm8Dm4y2rA6fTlE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper function to generate UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Populate Crop Recommendations
async function populateCropRecommendations() {
  console.log('📊 Populating crop_recommendations...');
  
  const states = [
    'Maharashtra', 'Punjab', 'Karnataka', 'Uttar Pradesh', 'Tamil Nadu',
    'Gujarat', 'Haryana', 'Rajasthan', 'Bihar', 'West Bengal',
    'Andhra Pradesh', 'Telangana', 'Madhya Pradesh', 'Kerala', 'Assam'
  ];
  
  const soilTypes = [
    'Alluvial Soil', 'Black Soil', 'Red Soil', 'Laterite Soil',
    'Desert Soil', 'Mountain Soil', 'Loamy', 'Clay', 'Sandy'
  ];
  
  const climateZones = [
    'Tropical Wet', 'Tropical Dry', 'Subtropical Humid', 'Semi-Arid',
    'Arid', 'Humid Continental', 'Highland'
  ];
  
  const seasons = ['Kharif', 'Rabi', 'Zaid'];
  
  const crops = [
    { name: 'Rice', season: 'Kharif', soil: ['Alluvial', 'Clay'], water: 'High', duration: 120, temp: [20, 35], rain: [100, 200] },
    { name: 'Wheat', season: 'Rabi', soil: ['Alluvial', 'Loamy'], water: 'Medium', duration: 120, temp: [10, 25], rain: [50, 100] },
    { name: 'Cotton', season: 'Kharif', soil: ['Black', 'Alluvial'], water: 'Medium', duration: 150, temp: [21, 35], rain: [50, 100] },
    { name: 'Sugarcane', season: 'Year-round', soil: ['Alluvial', 'Black'], water: 'High', duration: 300, temp: [26, 32], rain: [100, 150] },
    { name: 'Maize', season: 'Kharif', soil: ['Alluvial', 'Red'], water: 'Medium', duration: 90, temp: [18, 27], rain: [50, 100] },
    { name: 'Groundnut', season: 'Kharif', soil: ['Red', 'Sandy'], water: 'Low', duration: 100, temp: [20, 30], rain: [50, 75] },
    { name: 'Soybean', season: 'Kharif', soil: ['Black', 'Alluvial'], water: 'Medium', duration: 90, temp: [20, 30], rain: [50, 100] },
    { name: 'Mustard', season: 'Rabi', soil: ['Alluvial', 'Loamy'], water: 'Low', duration: 90, temp: [10, 25], rain: [30, 60] },
    { name: 'Chickpea', season: 'Rabi', soil: ['Alluvial', 'Red'], water: 'Low', duration: 90, temp: [15, 25], rain: [30, 60] },
    { name: 'Pigeonpea', season: 'Kharif', soil: ['Red', 'Black'], water: 'Low', duration: 150, temp: [20, 30], rain: [40, 80] },
    { name: 'Potato', season: 'Rabi', soil: ['Alluvial', 'Loamy'], water: 'Medium', duration: 90, temp: [15, 20], rain: [50, 75] },
    { name: 'Tomato', season: 'Year-round', soil: ['Alluvial', 'Loamy'], water: 'Medium', duration: 90, temp: [18, 25], rain: [50, 100] },
    { name: 'Onion', season: 'Rabi', soil: ['Alluvial', 'Loamy'], water: 'Medium', duration: 120, temp: [15, 25], rain: [50, 75] },
    { name: 'Chilli', season: 'Year-round', soil: ['Alluvial', 'Red'], water: 'Medium', duration: 120, temp: [20, 30], rain: [50, 100] },
    { name: 'Brinjal', season: 'Year-round', soil: ['Alluvial', 'Loamy'], water: 'Medium', duration: 120, temp: [20, 30], rain: [50, 100] },
  ];
  
  const cropRecommendations = [];
  
  for (const crop of crops) {
    for (const state of states.slice(0, 5)) { // Limit to 5 states per crop
      for (const soilType of soilTypes.slice(0, 3)) { // Limit to 3 soil types
        for (const climateZone of climateZones.slice(0, 2)) { // Limit to 2 climate zones
          const season = crop.season === 'Year-round' ? seasons[Math.floor(Math.random() * seasons.length)] : crop.season;
          
          cropRecommendations.push({
            id: generateUUID(),
            crop_name: crop.name,
            state: state,
            soil_type: soilType,
            climate_zone: climateZone,
            season: season,
            water_requirement: crop.water,
            growing_duration: crop.duration,
            min_temperature: crop.temp[0],
            max_temperature: crop.temp[1],
            min_rainfall: crop.rain[0],
            max_rainfall: crop.rain[1],
            yield_potential: `${Math.floor(Math.random() * 3) + 2}-${Math.floor(Math.random() * 3) + 5} tonnes/hectare`,
            special_instructions: `Suitable for ${soilType} in ${state} during ${season} season. Requires ${crop.water.toLowerCase()} water.`
          });
        }
      }
    }
  }
  
  // Insert in batches of 100 with retry logic
  for (let i = 0; i < cropRecommendations.length; i += 100) {
    const batch = cropRecommendations.slice(i, i + 100);
    let retries = 3;
    let success = false;
    
    while (retries > 0 && !success) {
      try {
        const { error } = await supabase.from('crop_recommendations').insert(batch);
        if (error) {
          if (error.message.includes('fetch failed') || error.message.includes('network')) {
            retries--;
            if (retries > 0) {
              console.log(`⚠️  Network error, retrying batch ${i / 100 + 1}... (${retries} retries left)`);
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
          }
          console.error(`Error inserting batch ${i / 100 + 1}:`, error.message);
          break;
        } else {
          console.log(`✅ Inserted batch ${i / 100 + 1} of crop recommendations`);
          success = true;
        }
      } catch (err: any) {
        retries--;
        if (retries > 0) {
          console.log(`⚠️  Error inserting batch ${i / 100 + 1}, retrying... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          console.error(`Error inserting batch ${i / 100 + 1}:`, err?.message || err);
        }
      }
    }
  }
  
  console.log(`✅ Completed: ${cropRecommendations.length} crop recommendations inserted`);
}

// Populate Market Prices
async function populateMarketPrices() {
  console.log('💰 Populating market_prices...');
  
  // Comprehensive list of Indian crops (cereals, pulses, oilseeds, fiber, commercial, spices, horticulture)
  const crops = [
    // Cereals & Millets
    "Rice", "Wheat", "Maize", "Barley", "Sorghum", "Jowar", "Bajra", "Ragi",
    // Pulses
    "Chickpea", "Pigeonpea", "Moong", "Urad", "Masur", "Pea",
    // Oilseeds
    "Groundnut", "Soybean", "Mustard", "Rapeseed", "Sesame", "Sunflower", "Safflower", "Linseed", "Castor",
    // Commercial/Fiber/Sugar
    "Cotton", "Jute", "Mesta", "Sugarcane", "Tobacco",
    // Spices & Condiments
    "Turmeric", "Ginger", "Chilli", "Coriander", "Cumin", "Fennel", "Fenugreek", "Black Pepper", "Cardamom", "Clove", "Cinnamon",
    // Horticulture - Vegetables
    "Potato", "Onion", "Tomato", "Brinjal", "Okra", "Cabbage", "Cauliflower", "Carrot", "Radish", "Beetroot", "Spinach", "Pea (Vegetable)",
    // Horticulture - Fruits
    "Mango", "Banana", "Apple", "Orange", "Grapes", "Pomegranate", "Guava", "Papaya", "Pineapple", "Watermelon", "Muskmelon",
    // Plantations & Others
    "Coconut", "Arecanut", "Coffee", "Tea", "Rubber",
  ];
  
  const states = [
    "Maharashtra", "Punjab", "Karnataka", "Uttar Pradesh", "Tamil Nadu",
    "Gujarat", "Haryana", "Rajasthan", "Bihar", "West Bengal",
    "Andhra Pradesh", "Telangana", "Madhya Pradesh", "Kerala", "Assam"
  ];
  
  const markets = [
    "Azadpur Mandi (Delhi)", "Vashi Market (Mumbai)", "Bowenpally Market (Hyderabad)", 
    "Gultekdi Market (Pune)", "Devi Ahilya Bai Holkar Market (Indore)",
    "Koyambedu Market (Chennai)", "Raja Market (Kolkata)", "Sabzi Mandi (Jaipur)",
    "Krishi Bhavan Market (Bangalore)", "APMC Market (Ahmedabad)",
    "Fruit Market (Nagpur)", "Vegetable Market (Surat)", "Grain Market (Ludhiana)",
    "Spice Market (Kochi)", "Flower Market (Mysore)"
  ];
  
  // Baseline modal prices (Rs per quintal) approximated; fruits/veg are indicative wholesale per quintal
  const basePrices: Record<string, number> = {
    // Cereals & Millets
    "Rice": 2200, "Wheat": 2275, "Maize": 2000, "Barley": 2000, "Sorghum": 2100, "Jowar": 2200, "Bajra": 2250, "Ragi": 3000,
    // Pulses
    "Chickpea": 5400, "Pigeonpea": 6500, "Moong": 8000, "Urad": 7600, "Masur": 6000, "Pea": 4000,
    // Oilseeds
    "Groundnut": 5500, "Soybean": 4500, "Mustard": 5500, "Rapeseed": 5500, "Sesame": 8000, "Sunflower": 6400, "Safflower": 5500, "Linseed": 6000, "Castor": 6200,
    // Commercial/Fiber/Sugar
    "Cotton": 6500, "Jute": 4500, "Mesta": 4200, "Sugarcane": 3200, "Tobacco": 12000,
    // Spices & Condiments
    "Turmeric": 9000, "Ginger": 12000, "Chilli": 15000, "Coriander": 8000, "Cumin": 18000, "Fennel": 14000, "Fenugreek": 7000, "Black Pepper": 55000, "Cardamom": 100000, "Clove": 70000, "Cinnamon": 60000,
    // Vegetables (indicative wholesale)
    "Potato": 1800, "Onion": 2500, "Tomato": 3500, "Brinjal": 2000, "Okra": 3000, "Cabbage": 1500, "Cauliflower": 2000, "Carrot": 2500, "Radish": 1600, "Beetroot": 2200, "Spinach": 1800, "Pea (Vegetable)": 5000,
    // Fruits (indicative wholesale)
    "Mango": 6000, "Banana": 3000, "Apple": 9000, "Orange": 4500, "Grapes": 6500, "Pomegranate": 8000, "Guava": 3000, "Papaya": 2500, "Pineapple": 3500, "Watermelon": 1800, "Muskmelon": 2200,
    // Plantation & Others
    "Coconut": 5000, "Arecanut": 35000, "Coffee": 20000, "Tea": 22000, "Rubber": 16000,
  };
  
  const marketPrices = [];
  
  for (const crop of crops) {
    const basePrice = basePrices[crop] || 3000;
    const statesForCrop = states.slice(0, Math.min(6 + Math.floor(Math.random() * 5), states.length));
    
    for (const state of statesForCrop) {
      const variation = Math.floor(Math.random() * 500) - 250;
      const price = basePrice + variation;
      const district = state === "Maharashtra" ? "Mumbai" : 
                      state === "Punjab" ? "Ludhiana" : 
                      state === "Karnataka" ? "Bangalore" : 
                      state === "Uttar Pradesh" ? "Lucknow" : 
                      state === "Tamil Nadu" ? "Chennai" : "Sample District";
      
      marketPrices.push({
        id: generateUUID(),
        crop_name: crop,
        market_name: markets[Math.floor(Math.random() * markets.length)],
        state: state,
        district: district,
        min_price: Math.max(500, price - Math.floor(Math.random() * 200)),
        max_price: price + Math.floor(Math.random() * 300),
        modal_price: price,
        price_unit: "quintal",
        updated_at: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
      });
    }
  }
  
  // Insert in batches of 100 with retry logic
  for (let i = 0; i < marketPrices.length; i += 100) {
    const batch = marketPrices.slice(i, i + 100);
    let retries = 3;
    let success = false;
    
    while (retries > 0 && !success) {
      try {
        const { error } = await supabase.from('market_prices').insert(batch);
        if (error) {
          if (error.message.includes('fetch failed') || error.message.includes('network')) {
            retries--;
            if (retries > 0) {
              console.log(`⚠️  Network error, retrying batch ${i / 100 + 1}... (${retries} retries left)`);
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
          }
          console.error(`Error inserting batch ${i / 100 + 1}:`, error.message);
          break;
        } else {
          console.log(`✅ Inserted batch ${i / 100 + 1} of market prices`);
          success = true;
        }
      } catch (err: any) {
        retries--;
        if (retries > 0) {
          console.log(`⚠️  Error inserting batch ${i / 100 + 1}, retrying... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          console.error(`Error inserting batch ${i / 100 + 1}:`, err?.message || err);
        }
      }
    }
  }
  
  console.log(`✅ Completed: ${marketPrices.length} market prices inserted`);
}

// Populate Weather Data
async function populateWeatherData() {
  console.log('🌤️ Populating weather_data...');
  
  const stateDistricts: Record<string, string[]> = {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
    'Punjab': ['Amritsar', 'Ludhiana', 'Chandigarh', 'Jalandhar'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
    'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Karnal'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol']
  };
  
  const forecasts = ['Partly Cloudy', 'Sunny', 'Clear', 'Cloudy', 'Light Rain', 'Moderate Rain'];
  
  const weatherData = [];
  
  for (const [state, districts] of Object.entries(stateDistricts)) {
    for (const district of districts) {
      const randomForecast = forecasts[Math.floor(Math.random() * forecasts.length)];
      const baseTemp = 25 + Math.floor(Math.random() * 10);
      
      weatherData.push({
        id: generateUUID(),
        state: state,
        district: district,
        temperature: baseTemp,
        humidity: 60 + Math.floor(Math.random() * 20),
        rainfall: randomForecast.includes('Rain') ? Math.floor(Math.random() * 50) : 0,
        forecast: randomForecast,
        forecast_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  }
  
  let retries = 3;
  let success = false;
  
  while (retries > 0 && !success) {
    try {
      const { error } = await supabase.from('weather_data').insert(weatherData);
      if (error) {
        if (error.message.includes('fetch failed') || error.message.includes('network')) {
          retries--;
          if (retries > 0) {
            console.log(`⚠️  Network error, retrying weather data... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
        }
        console.error('Error inserting weather data:', error.message);
        break;
      } else {
        console.log(`✅ Completed: ${weatherData.length} weather records inserted`);
        success = true;
      }
    } catch (err: any) {
      retries--;
      if (retries > 0) {
        console.log(`⚠️  Error inserting weather data, retrying... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.error('Error inserting weather data:', err?.message || err);
      }
    }
  }
}

// Populate Fertilizer Recommendations
async function populateFertilizerRecommendations() {
  console.log('🌱 Populating fertilizer_recommendations...');
  
  const fertilizers = [
    {
      crop_name: "Rice",
      organic_fertilizers: ["Farmyard Manure", "Green Manure", "Compost"],
      chemical_fertilizers: ["NPK 10:26:26", "Urea", "DAP"],
      application_timing: "Basal application during land preparation, top dressing at tillering and panicle initiation",
      dosage_per_acre: "Organic: 5-8 tonnes/acre, Chemical: 100-150 kg/acre",
      special_notes: "Split nitrogen application recommended. Zinc sulfate application beneficial."
    },
    {
      crop_name: "Wheat",
      organic_fertilizers: ["Farmyard Manure", "Compost", "Vermicompost"],
      chemical_fertilizers: ["NPK 12:32:16", "Urea"],
      application_timing: "50% at sowing, 25% at first irrigation, 25% at second irrigation",
      dosage_per_acre: "Organic: 4-6 tonnes/acre, Chemical: 100-120 kg/acre",
      special_notes: "Sulfur application improves grain quality and yield."
    },
    {
      crop_name: "Maize",
      organic_fertilizers: ["Compost", "Green Manure"],
      chemical_fertilizers: ["NPK 20:20:0", "Urea"],
      application_timing: "Apply at sowing and top dress at knee-high stage",
      dosage_per_acre: "Organic: 3-5 tonnes/acre, Chemical: 80-100 kg/acre",
      special_notes: "Zinc application helps prevent deficiency."
    },
    {
      crop_name: "Cotton",
      organic_fertilizers: ["Farmyard Manure", "Compost", "Neem Cake"],
      chemical_fertilizers: ["NPK 20:10:10", "Ammonium Sulfate"],
      application_timing: "Basal application before sowing, top dressing at flowering and boll formation",
      dosage_per_acre: "Organic: 5-10 tonnes/acre, Chemical: 80-100 kg/acre",
      special_notes: "Foliar sprays of micronutrients during square formation increase yield."
    },
    {
      crop_name: "Sugarcane",
      organic_fertilizers: ["Pressmud", "Compost", "Green Manure"],
      chemical_fertilizers: ["NPK 18:18:0", "Urea"],
      application_timing: "Apply at planting and during tillering stage",
      dosage_per_acre: "Organic: 10-12 tonnes/acre, Chemical: 150-200 kg/acre",
      special_notes: "Apply potash for better sugar recovery."
    },
    {
      crop_name: "Groundnut",
      organic_fertilizers: ["Farmyard Manure", "Compost"],
      chemical_fertilizers: ["NPK 6:12:12", "Gypsum"],
      application_timing: "Apply at sowing and at flowering stage",
      dosage_per_acre: "Organic: 2-4 tonnes/acre, Chemical: 60-80 kg/acre",
      special_notes: "Gypsum application improves pod filling and disease resistance."
    },
    {
      crop_name: "Soybean",
      organic_fertilizers: ["Compost", "Farmyard Manure"],
      chemical_fertilizers: ["NPK 12:32:16", "Urea"],
      application_timing: "Apply at sowing and at pod formation stage",
      dosage_per_acre: "Organic: 3-5 tonnes/acre, Chemical: 60-80 kg/acre",
      special_notes: "Inoculate seeds with Rhizobium for better nitrogen fixation."
    },
    {
      crop_name: "Chickpea",
      organic_fertilizers: ["Farmyard Manure", "Compost"],
      chemical_fertilizers: ["NPK 10:26:26", "DAP"],
      application_timing: "Apply at sowing",
      dosage_per_acre: "Organic: 2-3 tonnes/acre, Chemical: 40-60 kg/acre",
      special_notes: "Phosphorus application increases root growth and yield."
    },
    {
      crop_name: "Potato",
      organic_fertilizers: ["Farmyard Manure", "Compost", "Vermicompost"],
      chemical_fertilizers: ["NPK 8:16:16", "Potassium Sulfate"],
      application_timing: "Apply at planting and during tuber formation",
      dosage_per_acre: "Organic: 5-8 tonnes/acre, Chemical: 120-150 kg/acre",
      special_notes: "Potassium is crucial for tuber development and quality."
    },
    {
      crop_name: "Tomato",
      organic_fertilizers: ["Farmyard Manure", "Compost", "Vermicompost"],
      chemical_fertilizers: ["NPK 10:10:10", "Urea"],
      application_timing: "Apply at transplanting and top dress during flowering and fruit setting",
      dosage_per_acre: "Organic: 4-6 tonnes/acre, Chemical: 80-100 kg/acre",
      special_notes: "Calcium application prevents blossom end rot."
    },
    {
      crop_name: "Onion",
      organic_fertilizers: ["Farmyard Manure", "Compost"],
      chemical_fertilizers: ["NPK 12:16:20", "Urea"],
      application_timing: "Apply at planting and top dress during bulb formation",
      dosage_per_acre: "Organic: 4-5 tonnes/acre, Chemical: 100-120 kg/acre",
      special_notes: "Sulfur application improves bulb quality and pungency."
    },
    {
      crop_name: "Chilli",
      organic_fertilizers: ["Farmyard Manure", "Compost", "Neem Cake"],
      chemical_fertilizers: ["NPK 18:18:18", "Urea"],
      application_timing: "Apply at transplanting and top dress during flowering and fruiting",
      dosage_per_acre: "Organic: 3-5 tonnes/acre, Chemical: 80-100 kg/acre",
      special_notes: "Potassium application improves fruit quality and color."
    },
    {
      crop_name: "Mango",
      organic_fertilizers: ["Farmyard Manure", "Compost", "Vermicompost"],
      chemical_fertilizers: ["NPK 10:10:10", "Urea"],
      application_timing: "Apply after harvest and before flowering",
      dosage_per_acre: "Organic: 10-15 tonnes/acre, Chemical: 2-3 kg/tree",
      special_notes: "Zinc and boron application improves fruit quality and yield."
    },
    {
      crop_name: "Banana",
      organic_fertilizers: ["Farmyard Manure", "Compost", "Pressmud"],
      chemical_fertilizers: ["NPK 10:20:20", "Urea"],
      application_timing: "Apply at planting and top dress during growth stages",
      dosage_per_acre: "Organic: 15-20 tonnes/acre, Chemical: 250-300 kg/acre",
      special_notes: "Potassium is crucial for fruit development and quality."
    },
  ];
  
  const fertilizerData = fertilizers.map(fert => ({
    id: generateUUID(),
    crop_name: fert.crop_name,
    organic_fertilizers: fert.organic_fertilizers,
    chemical_fertilizers: fert.chemical_fertilizers,
    application_timing: fert.application_timing,
    dosage_per_acre: fert.dosage_per_acre,
    special_notes: fert.special_notes
  }));
  
  let retries = 3;
  let success = false;
  
  while (retries > 0 && !success) {
    try {
      const { error } = await supabase.from('fertilizer_recommendations').insert(fertilizerData);
      if (error) {
        if (error.message.includes('fetch failed') || error.message.includes('network')) {
          retries--;
          if (retries > 0) {
            console.log(`⚠️  Network error, retrying fertilizer recommendations... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
        }
        console.error('Error inserting fertilizer recommendations:', error.message);
        break;
      } else {
        console.log(`✅ Completed: ${fertilizerData.length} fertilizer recommendations inserted`);
        success = true;
      }
    } catch (err: any) {
      retries--;
      if (retries > 0) {
        console.log(`⚠️  Error inserting fertilizer recommendations, retrying... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.error('Error inserting fertilizer recommendations:', err?.message || err);
      }
    }
  }
}

// Populate Traditional Practices
async function populateTraditionalPractices() {
  console.log('🌾 Populating traditional_practices...');
  
  const practices = [
    { title: "Zero Tillage", description: "Growing crops without disturbing the soil through tillage.", category: "Technique", season: "Year-round" },
    { title: "Drip Irrigation", description: "Supplying water directly to the plant roots through a network of pipes.", category: "Irrigation", season: "Summer" },
    { title: "Vermicomposting", description: "Using earthworms to convert organic waste into fertilizer.", category: "Soil care", season: "Year-round" },
    { title: "Agroforestry", description: "Integrating trees and shrubs into crop and animal farming systems.", category: "Technique", season: "Year-round" },
    { title: "Mulching", description: "Covering the soil with organic material to retain moisture.", category: "Soil care", season: "Summer" },
    { title: "Crop Rotation", description: "Growing different crops in succession on the same land.", category: "Technique", season: "Year-round" },
    { title: "Contour Ploughing", description: "Ploughing along the contour lines to reduce soil erosion.", category: "Soil care", season: "Monsoon" },
    { title: "Intercropping", description: "Growing two or more crops together in the same field.", category: "Technique", season: "Year-round" },
    { title: "Organic Manuring", description: "Applying organic manure to improve soil fertility.", category: "Soil care", season: "Year-round" },
    { title: "Rainwater Harvesting", description: "Collecting and storing rainwater for irrigation.", category: "Irrigation", season: "Monsoon" },
    { title: "Green Manuring", description: "Growing plants to be ploughed under for soil enrichment.", category: "Soil care", season: "Monsoon" },
    { title: "System of Rice Intensification (SRI)", description: "A method to increase rice yields with less water.", category: "Technique", season: "Monsoon" },
    { title: "Trap Cropping", description: "Planting crops to attract pests away from main crops.", category: "Pest control", season: "Year-round" },
    { title: "Biofertilizers", description: "Using living organisms to enhance soil fertility.", category: "Soil care", season: "Year-round" },
    { title: "Flood Irrigation", description: "Irrigating fields by flooding them with water.", category: "Irrigation", season: "Summer" },
    { title: "Manual Weeding", description: "Removing weeds by hand or simple tools.", category: "Technique", season: "Year-round" },
    { title: "Neem-based Pest Control", description: "Using neem extracts to control pests.", category: "Pest control", season: "Year-round" },
    { title: "Sprinkler Irrigation", description: "Applying water to crops using sprinklers.", category: "Irrigation", season: "Summer" },
    { title: "Seed Treatment", description: "Treating seeds with fungicides or bioagents before sowing.", category: "Technique", season: "Year-round" },
    { title: "Mixed Cropping", description: "Growing two or more crops simultaneously on the same land.", category: "Technique", season: "Year-round" },
  ];
  
  const practiceData = practices.map(practice => ({
    id: generateUUID(),
    title: practice.title,
    description: practice.description,
    category: practice.category,
    season: practice.season
  }));
  
  let retries = 3;
  let success = false;
  
  while (retries > 0 && !success) {
    try {
      const { error } = await supabase.from('traditional_practices').insert(practiceData);
      if (error) {
        if (error.message.includes('fetch failed') || error.message.includes('network')) {
          retries--;
          if (retries > 0) {
            console.log(`⚠️  Network error, retrying traditional practices... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
        }
        console.error('Error inserting traditional practices:', error.message);
        break;
      } else {
        console.log(`✅ Completed: ${practiceData.length} traditional practices inserted`);
        success = true;
      }
    } catch (err: any) {
      retries--;
      if (retries > 0) {
        console.log(`⚠️  Error inserting traditional practices, retrying... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.error('Error inserting traditional practices:', err?.message || err);
      }
    }
  }
}

// Populate Community Forum Posts
async function populateCommunityForumPosts() {
  console.log('💬 Populating community_posts...');

  try {
    const { data: existing, error: countError } = await supabase
      .from('community_posts')
      .select('id', { count: 'exact', head: true });
    if (countError && !countError.message.includes('fetch failed')) {
      console.log('⚠️  Skipping community_posts (table may not exist):', countError.message);
      return;
    }
  } catch (e: any) {
    console.log('⚠️  Skipping community_posts (unavailable):', e?.message || e);
    return;
  }

  const demoPosts = [
    {
      id: generateUUID(),
      title: 'Organic pest control that actually works?',
      content: 'Looking for tried-and-true organic methods to handle aphids on okra and brinjal.',
      topic: 'Pest Control',
      user_id: 'seed-user-1',
      likes: 5,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      reactions: { helpful: 2, insightful: 1, disagree: 0 }
    },
    {
      id: generateUUID(),
      title: 'SRI method water savings for rice',
      content: 'Anyone measured the actual water savings from SRI vs conventional methods?',
      topic: 'Water Management',
      user_id: 'seed-user-2',
      likes: 3,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      reactions: { helpful: 1, insightful: 1, disagree: 0 }
    },
    {
      id: generateUUID(),
      title: 'Turmeric price trends before harvest',
      content: 'Harvest in 4 weeks—what prices are you seeing in your markets?',
      topic: 'Market Insights',
      user_id: 'seed-user-3',
      likes: 4,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      reactions: { helpful: 1, insightful: 0, disagree: 0 }
    },
    {
      id: generateUUID(),
      title: 'Traditional seed storage to maintain viability',
      content: 'What are your best low-cost traditional methods for seed storage over summer?',
      topic: 'Traditional Practices',
      user_id: 'seed-user-4',
      likes: 7,
      created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      reactions: { helpful: 3, insightful: 2, disagree: 0 }
    }
  ];

  // Insert in one batch; ignore failure if reactions JSON column is missing by inserting minimal fields
  try {
    const { error } = await supabase.from('community_posts').insert(demoPosts);
    if (error) {
      // Retry with minimal fields
      console.log('ℹ️  Retrying community_posts insert without reactions field...');
      const minimal = demoPosts.map(({ reactions, ...rest }) => rest);
      const { error: err2 } = await supabase.from('community_posts').insert(minimal);
      if (err2) {
        console.log('⚠️  Could not seed community_posts:', err2.message);
      } else {
        console.log(`✅ Seeded ${minimal.length} community posts (minimal schema)`);
      }
    } else {
      console.log(`✅ Seeded ${demoPosts.length} community posts`);
    }
  } catch (e: any) {
    console.log('⚠️  Could not seed community_posts:', e?.message || e);
  }
}

// Populate Recipes
async function populateRecipes() {
  console.log('🍳 Populating recipes...');
  
  const recipes = [
    {
      title: "Pani Puri",
      description: "A traditional recipe for pani puri.",
      cooking_time: "30 min",
      ingredients: ["Semolina", "Potatoes", "Chickpeas", "Tamarind", "Spices"]
    },
    {
      title: "Biryani",
      description: "A classic Indian rice dish with aromatic spices and meat or vegetables.",
      cooking_time: "60 min",
      ingredients: ["Rice", "Chicken/Vegetables", "Spices", "Yogurt", "Onion"]
    },
    {
      title: "Paneer Tikka",
      description: "A popular North Indian appetizer made from paneer cubes marinated in spices and grilled.",
      cooking_time: "45 min",
      ingredients: ["Paneer", "Yogurt", "Spices", "Capsicum", "Onion"]
    },
    {
      title: "Samosa",
      description: "Crispy pastry filled with spiced potatoes and peas.",
      cooking_time: "40 min",
      ingredients: ["All-purpose flour", "Potatoes", "Peas", "Spices", "Oil"]
    },
    {
      title: "Dosa",
      description: "Thin, crispy crepe made from fermented rice and lentil batter.",
      cooking_time: "20 min",
      ingredients: ["Rice", "Urad dal (black gram)", "Fenugreek seeds", "Salt"]
    },
    {
      title: "Idli",
      description: "Soft, fluffy steamed cakes made from fermented rice and lentil batter.",
      cooking_time: "25 min",
      ingredients: ["Rice", "Urad dal (black gram)", "Salt"]
    },
    {
      title: "Pav Bhaji",
      description: "Spicy mashed vegetable curry served with buttered bread rolls.",
      cooking_time: "50 min",
      ingredients: ["Mixed vegetables", "Tomatoes", "Onions", "Pav bhaji masala", "Butter", "Pav (bread rolls)"]
    },
    {
      title: "Rogan Josh",
      description: "An aromatic Kashmiri lamb curry.",
      cooking_time: "90 min",
      ingredients: ["Lamb", "Yogurt", "Ginger", "Garlic", "Fennel powder", "Kashmiri chili"]
    },
    {
      title: "Butter Chicken",
      description: "Creamy and flavorful chicken curry.",
      cooking_time: "60 min",
      ingredients: ["Chicken", "Tomatoes", "Butter", "Cream", "Ginger-garlic paste", "Spices"]
    },
    {
      title: "Chole Bhature",
      description: "Spicy chickpea curry with fried bread.",
      cooking_time: "75 min",
      ingredients: ["Chickpeas", "Onions", "Tomatoes", "Spices", "Flour", "Yogurt"]
    },
    {
      title: "Dhokla",
      description: "Steamed savory cake from Gujarat.",
      cooking_time: "40 min",
      ingredients: ["Besan (gram flour)", "Yogurt", "Ginger-green chili paste", "Eno (fruit salt)", "Mustard seeds"]
    },
    {
      title: "Aloo Paratha",
      description: "Indian flatbread stuffed with spiced potatoes.",
      cooking_time: "45 min",
      ingredients: ["Wheat flour", "Potatoes", "Onions", "Green chilies", "Spices", "Ghee"]
    },
    {
      title: "Rajma",
      description: "North Indian kidney bean curry.",
      cooking_time: "120 min",
      ingredients: ["Kidney beans", "Onions", "Tomatoes", "Ginger", "Garlic", "Spices"]
    },
    {
      title: "Baingan Bharta",
      description: "Smoky roasted eggplant mash with tomatoes and spices.",
      cooking_time: "60 min",
      ingredients: ["Eggplant", "Tomatoes", "Onions", "Ginger", "Garlic", "Spices"]
    },
  ];
  
  const recipeData = recipes.map(recipe => ({
    id: generateUUID(),
    title: recipe.title,
    description: recipe.description,
    cooking_time: recipe.cooking_time,
    ingredients: recipe.ingredients
  }));
  
  let retries = 3;
  let success = false;
  
  while (retries > 0 && !success) {
    try {
      const { error } = await supabase.from('recipes').insert(recipeData);
      if (error) {
        if (error.message.includes('fetch failed') || error.message.includes('network')) {
          retries--;
          if (retries > 0) {
            console.log(`⚠️  Network error, retrying recipes... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
        }
        console.error('Error inserting recipes:', error.message);
        break;
      } else {
        console.log(`✅ Completed: ${recipeData.length} recipes inserted`);
        success = true;
      }
    } catch (err: any) {
      retries--;
      if (retries > 0) {
        console.log(`⚠️  Error inserting recipes, retrying... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.error('Error inserting recipes:', err?.message || err);
      }
    }
  }
}

// Test Supabase connection
async function testConnection() {
  console.log('🔌 Testing Supabase connection...');
  try {
    const { data, error } = await supabase.from('crop_recommendations').select('id').limit(1);
    if (error && !error.message.includes('fetch failed')) {
      console.log('⚠️  Connection test result:', error.message);
    } else {
      console.log('✅ Supabase connection successful!\n');
    }
  } catch (err: any) {
    console.log('⚠️  Could not test connection (this is OK if tables are empty):', err?.message || err);
    console.log('   Proceeding with data insertion...\n');
  }
}

// Main function
async function main() {
  console.log('🚀 Starting database population...\n');
  
  // Test connection first
  await testConnection();
  
  try {
    await populateCropRecommendations();
    await populateMarketPrices();
    await populateWeatherData();
    await populateFertilizerRecommendations();
    await populateTraditionalPractices();
    await populateRecipes();
    await populateCommunityForumPosts();
    
    console.log('\n✅ Database population completed successfully!');
    console.log('💡 Note: Some network errors may occur due to connection issues. Check your Supabase dashboard to verify data was inserted.');
  } catch (error) {
    console.error('\n❌ Error during database population:', error);
    console.log('💡 Tip: Check your Supabase URL and API key in .env file');
    process.exit(1);
  }
}

// Run the script
main();

