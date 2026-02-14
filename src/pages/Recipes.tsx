import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Utensils } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Recipe {
  id?: string;
  name: string;
  description?: string;
  cookingTime?: string;
  ingredients: string[];
  steps: string[];
  nutrition?: Record<string, string | number>;
  imageUrl?: string;
  videoScript?: string;
  [key: string]: unknown;
}

async function saveRecipeToSupabase(recipe: Recipe) {
  try {
    const payload: any = {
      title: recipe.name,
      name: recipe.name,
      description: recipe.description || '',
      cooking_time: recipe.cookingTime || '',
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      steps: Array.isArray(recipe.steps) ? recipe.steps : [],
      nutrition: recipe.nutrition || {},
      image_url: recipe.imageUrl || null,
      video_script: recipe.videoScript || null,
      updated_at: new Date().toISOString()
    };
    // Try upsert by title/name if unique; fall back to insert
    const { error } = await supabase
      .from('recipes')
      .upsert(payload, { onConflict: 'title' });
    if (error) {
      await supabase.from('recipes').insert(payload);
    }
  } catch (_) {
    // ignore if table not available
  }
}

const SUGGESTED_DISHES = [
  'Biryani', 'Dosa', 'Idli', 'Samosa', 'Pav Bhaji', 'Rogan Josh', 'Butter Chicken', 'Chole Bhature', 'Dhokla', 'Pani Puri',
  'Aloo Paratha', 'Rajma', 'Baingan Bharta', 'Paneer Tikka', 'Fish Curry', 'Dal Makhani', 'Kadhi', 'Vada Pav', 'Poha', 'Upma'
];

// Demo: generate a catalog of ~50 Indian dishes with templated ingredients and nutrition
const DEMO_DISH_NAMES: string[] = [
  'Biryani','Veg Pulao','Jeera Rice','Khichdi','Masala Dosa','Plain Dosa','Idli','Uttapam','Medu Vada','Sambhar',
  'Rasam','Upma','Poha','Paratha','Aloo Paratha','Paneer Tikka','Palak Paneer','Chole','Rajma','Dal Tadka',
  'Dal Makhani','Kadhi Pakora','Baingan Bharta','Bhindi Masala','Aloo Gobi','Mix Veg Curry','Malai Kofta','Korma','Fish Curry','Prawn Curry',
  'Chicken Curry','Butter Chicken','Mutton Curry','Rogan Josh','Keema','Kheema Pav','Vada Pav','Pav Bhaji','Misal Pav','Dabeli',
  'Pani Puri','Bhel Puri','Sev Puri','Dahi Puri','Dhokla','Khandvi','Thepla','Handvo','Kheer','Gajar ka Halwa'
];

function buildDemoRecipe(name: string): Recipe {
  const base = name.toLowerCase();
  const time = 20 + (base.length % 60);
  const isSouth = base.includes('dosa') || base.includes('idli') || base.includes('sambhar') || base.includes('rasam') || base.includes('uttapam');
  const isRice = base.includes('biryani') || base.includes('pulao') || base.includes('rice') || base.includes('khichdi');
  const isSnack = base.includes('vada') || base.includes('pav') || base.includes('puri') || base.includes('bhel') || base.includes('sev') || base.includes('dhokla') || base.includes('thepla') || base.includes('handvo');
  const isPaneer = base.includes('paneer');
  const isChicken = base.includes('chicken');
  const isMutton = base.includes('mutton') || base.includes('rogan');

  const ingredients = [
    ...(isSouth ? ['Rice 2 cups','Urad dal 1 cup','Fenugreek seeds 1 tsp'] : []),
    ...(isRice ? ['Basmati rice 2 cups','Whole spices (bay, cinnamon, clove)','Yogurt 1/2 cup'] : []),
    ...(isSnack ? ['Besan 1 cup','Semolina 1/2 cup','Curd 1/2 cup'] : []),
    'Oil 2 tbsp','Onion 1 medium','Tomato 2 medium','Ginger-garlic paste 1 tsp','Salt to taste',
    isPaneer ? 'Paneer 200 g' :
    isChicken ? 'Chicken 500 g' :
    isMutton ? 'Mutton 500 g' :
    base.includes('fish') ? 'Fish 400 g' :
    base.includes('prawn') ? 'Prawns 300 g' :
    base.includes('poha') ? 'Poha (flattened rice) 2 cups' :
    base.includes('paratha') ? 'Wheat flour dough 2 cups' :
    base.includes('rajma') ? 'Rajma (kidney beans) 1 cup soaked' :
    base.includes('chole') || base.includes('chana') ? 'Chickpeas 1 cup soaked' :
    base.includes('dal') ? 'Lentils 1 cup' :
    isRice ? 'Vegetables/Protein of choice 2 cups' : 'Mixed vegetables 2 cups'
  ];

  const steps = isSouth ? [
    'Soak rice, urad dal and fenugreek; grind and ferment overnight.',
    'Heat tawa, spread batter thin (for dosa) or steam in moulds (for idli).',
    'Serve hot with sambhar and coconut chutney.'
  ] : isRice ? [
    'Rinse basmati and soak 20 minutes; drain.',
    'Sauté whole spices, onion and ginger-garlic; add protein/veg.',
    'Layer rice, add water/stock and yogurt; cook on low till fluffy.'
  ] : isSnack ? [
    'Combine besan/semolina with curd, spices and water to a batter/dough.',
    'Ferment briefly (if required) and shape/steam/fry as per snack style.',
    'Serve with chutneys or tea.'
  ] : isPaneer || isChicken || isMutton ? [
    'Marinate protein with yogurt, spices and ginger-garlic (20–60 min).',
    'Sauté onions and tomatoes to a masala; add marinated protein.',
    'Cook till tender; finish with garam masala and coriander.'
  ] : [
    'Heat oil; sauté onions till golden.',
    'Add tomatoes and spices; cook to a thick masala.',
    'Add main ingredient and simmer till done; adjust seasoning.'
  ];
  const nutrition = {
    Calories: 250 + (base.length % 200),
    Protein: 6 + (base.includes('paneer')||base.includes('chicken')||base.includes('mutton')||base.includes('fish')?14:4),
    Carbs: 25 + (base.includes('rice')||base.includes('poha')?20:10),
    Fat: 8 + (base.includes('butter')||base.includes('makhani')?10:4),
    Fiber: 3 + (base.includes('veg')||base.includes('dal')?3:1),
    'Vitamin A': 10,
    'Vitamin C': 8,
    Iron: 10,
    Calcium: base.includes('paneer')?20:8,
    Note: 'Balanced meal portion for a healthy adult when consumed with salad and water.'
  } as Record<string, string|number>;
  return {
    id: `demo-${name}`,
    name,
    description: `${name} prepared with everyday Indian kitchen ingredients.`,
    cookingTime: `${time} min`,
    ingredients,
    steps,
    nutrition,
    imageUrl: `https://source.unsplash.com/800x600/?${encodeURIComponent(name + ' Indian food')}`
  };
}

const DEMO_RECIPES_50: Recipe[] = DEMO_DISH_NAMES.slice(0, 50).map(buildDemoRecipe);

// Fallback recipes for popular dishes
const FALLBACK_RECIPES: Record<string, any> = {
  "pani puri": {
    name: "Pani Puri",
    description: "A traditional recipe for pani puri.",
    cookingTime: "30 min",
    ingredients: ["Semolina", "Potatoes", "Chickpeas", "Tamarind", "Spices"],
    steps: [
      "Prepare puris by frying semolina dough.",
      "Make spicy water with tamarind and spices.",
      "Boil potatoes and chickpeas, mash together.",
      "Fill puris with potato mix and dip in spicy water."
    ],
    nutrition: { "Protein": 8, "Vitamin C": 12, "Iron": 10 }
  },
  "biryani": {
    name: "Biryani",
    description: "A classic Indian rice dish with aromatic spices and meat or vegetables.",
    cookingTime: "60 min",
    ingredients: ["Rice", "Chicken/Vegetables", "Spices", "Yogurt", "Onion"],
    steps: [
      "Marinate chicken/vegetables with yogurt and spices.",
      "Fry onions and layer with rice and marinated mix.",
      "Cook on low heat until done."
    ],
    nutrition: { "Protein": 20, "Vitamin A": 10, "Iron": 15 }
  },
  "paneer tikka": {
    name: "Paneer Tikka",
    description: "A popular North Indian appetizer made from paneer cubes marinated in spices and grilled.",
    cookingTime: "45 min",
    ingredients: ["Paneer", "Yogurt", "Spices", "Capsicum", "Onion"],
    steps: [
      "Marinate paneer cubes with yogurt and spices for 30 minutes.",
      "Skewer paneer, onion, and capsicum pieces alternately.",
      "Grill or bake until golden and slightly charred.",
      "Serve hot with mint chutney."
    ],
    nutrition: { "Protein": 25, "Vitamin A": 15, "Vitamin C": 10, "Calcium": 20, "Iron": 8 }
  },
  // Add more dishes as needed
  "samosa": {
    name: "Samosa",
    description: "Crispy pastry filled with spiced potatoes and peas.",
    cookingTime: "40 min",
    ingredients: ["All-purpose flour", "Potatoes", "Peas", "Spices", "Oil"],
    steps: [
      "Prepare dough.",
      "Make potato and pea filling.",
      "Fold dough into triangles and fill.",
      "Deep fry until golden brown."
    ],
    nutrition: { "Carbs": 20, "Fat": 15 }
  },
  "dosa": {
    name: "Dosa",
    description: "Thin, crispy crepe made from fermented rice and lentil batter.",
    cookingTime: "20 min",
    ingredients: ["Rice", "Urad dal (black gram)", "Fenugreek seeds", "Salt"],
    steps: [
      "Grind rice and dal into batter and ferment.",
      "Pour batter on hot tawa and spread thinly.",
      "Cook until crispy.",
      "Serve with sambar and chutney."
    ],
    nutrition: { "Protein": 5, "Carbs": 25 }
  },
  "idli": {
    name: "Idli",
    description: "Soft, fluffy steamed cakes made from fermented rice and lentil batter.",
    cookingTime: "25 min",
    ingredients: ["Rice", "Urad dal (black gram)", "Salt"],
    steps: [
      "Grind rice and dal into batter and ferment.",
      "Pour batter into idli molds and steam.",
      "Serve with sambar and chutney."
    ],
    nutrition: { "Protein": 4, "Carbs": 20 }
  },
  "pav bhaji": {
    name: "Pav Bhaji",
    description: "Spicy mashed vegetable curry served with buttered bread rolls.",
    cookingTime: "50 min",
    ingredients: ["Mixed vegetables", "Tomatoes", "Onions", "Pav bhaji masala", "Butter", "Pav (bread rolls)"],
    steps: [
      "Boil and mash vegetables.",
      "Cook tomatoes, onions, and spices with mashed vegetables.",
      "Add butter and pav bhaji masala.",
      "Toast pav with butter and serve with bhaji."
    ],
    nutrition: { "Vitamin C": 15, "Fiber": 8 }
  },
  "rogan josh": {
    name: "Rogan Josh",
    description: "An aromatic Kashmiri lamb curry.",
    cookingTime: "90 min",
    ingredients: ["Lamb", "Yogurt", "Ginger", "Garlic", "Fennel powder", "Kashmiri chili"],
    steps: [
      "Marinate lamb with yogurt, ginger, garlic, and spices.",
      "Cook lamb in oil with onions and tomatoes.",
      "Add water and simmer until meat is tender.",
      "Finish with ghee and aromatic spices."
    ],
    nutrition: { "Protein": 25, "Iron": 20 }
  },
  "butter chicken": {
    name: "Butter Chicken",
    description: "Creamy and flavorful chicken curry.",
    cookingTime: "60 min",
    ingredients: ["Chicken", "Tomatoes", "Butter", "Cream", "Ginger-garlic paste", "Spices"],
    steps: [
      "Marinate chicken.",
      "Make tomato gravy with butter and spices.",
      "Add chicken and cream, simmer.",
      "Serve with naan or rice."
    ],
    nutrition: { "Protein": 28, "Fat": 30 }
  },
  "chole bhature": {
    name: "Chole Bhature",
    description: "Spicy chickpea curry with fried bread.",
    cookingTime: "75 min",
    ingredients: ["Chickpeas", "Onions", "Tomatoes", "Spices", "Flour", "Yogurt"],
    steps: [
      "Cook chickpeas with spices.",
      "Prepare dough for bhature.",
      "Fry bhature until puffed.",
      "Serve chole with hot bhature."
    ],
    nutrition: { "Fiber": 15, "Protein": 10 }
  },
  "dhokla": {
    name: "Dhokla",
    description: "Steamed savory cake from Gujarat.",
    cookingTime: "40 min",
    ingredients: ["Besan (gram flour)", "Yogurt", "Ginger-green chili paste", "Eno (fruit salt)", "Mustard seeds"],
    steps: [
      "Prepare batter with besan, yogurt, and spices.",
      "Steam the batter.",
      "Prepare tempering with mustard seeds and curry leaves.",
      "Pour tempering over dhokla and cut into pieces."
    ],
    nutrition: { "Protein": 8, "Vitamin C": 5 }
  },
  "aloo paratha": {
    name: "Aloo Paratha",
    description: "Indian flatbread stuffed with spiced potatoes.",
    cookingTime: "45 min",
    ingredients: ["Wheat flour", "Potatoes", "Onions", "Green chilies", "Spices", "Ghee"],
    steps: [
      "Prepare dough.",
      "Boil and mash potatoes, mix with spices.",
      "Stuff dough with potato filling and roll into paratha.",
      "Cook on a tawa with ghee."
    ],
    nutrition: { "Carbs": 30, "Fiber": 5 }
  },
  "rajma": {
    name: "Rajma",
    description: "North Indian kidney bean curry.",
    cookingTime: "120 min",
    ingredients: ["Kidney beans", "Onions", "Tomatoes", "Ginger", "Garlic", "Spices"],
    steps: [
      "Soak kidney beans overnight and boil.",
      "Sauté onions, tomatoes, ginger, garlic, and spices.",
      "Add boiled rajma and simmer until thick.",
      "Serve with rice."
    ],
    nutrition: { "Protein": 15, "Fiber": 20 }
  },
  "baingan bharta": {
    name: "Baingan Bharta",
    description: "Smoky roasted eggplant mash with tomatoes and spices.",
    cookingTime: "60 min",
    ingredients: ["Eggplant", "Tomatoes", "Onions", "Ginger", "Garlic", "Spices"],
    steps: [
      "Roast eggplant and mash.",
      "Sauté onions, tomatoes, ginger, garlic, and spices.",
      "Add mashed eggplant and cook.",
      "Garnish with coriander."
    ],
    nutrition: { "Fiber": 10, "Vitamin C": 8 }
  },
  "kadi pakora": {
    name: "Kadi Pakora",
    description: "Yogurt-based curry with gram flour fritters.",
    cookingTime: "50 min",
    ingredients: ["Yogurt", "Besan (gram flour)", "Spices", "Onions (for pakora)"],
    steps: [
      "Prepare kadi base with yogurt and besan.",
      "Cook kadi until thickened.",
      "Prepare pakoras and add to kadi.",
      "Temper with ghee and spices."
    ],
    nutrition: { "Protein": 7, "Calcium": 10 }
  },
  "dal makhani": {
    name: "Dal Makhani",
    description: "Creamy black lentil and kidney bean curry.",
    cookingTime: "150 min",
    ingredients: ["Black lentils (urad dal)", "Kidney beans (rajma)", "Butter", "Cream", "Tomatoes", "Spices"],
    steps: [
      "Soak and boil lentils and beans.",
      "Cook with tomato puree, butter, and spices.",
      "Simmer on low heat.",
      "Finish with cream."
    ],
    nutrition: { "Protein": 12, "Fiber": 15, "Iron": 18 }
  },
  "palak paneer": {
    name: "Palak Paneer",
    description: "Spinach and paneer curry.",
    cookingTime: "40 min",
    ingredients: ["Spinach", "Paneer", "Tomatoes", "Onions", "Spices", "Cream"],
    steps: [
      "Blanch and puree spinach.",
      "Sauté onions, tomatoes, and spices.",
      "Add spinach puree and paneer cubes.",
      "Simmer and finish with cream."
    ],
    nutrition: { "Vitamin A": 20, "Calcium": 15, "Iron": 10 }
  },
  "chicken tikka masala": {
    name: "Chicken Tikka Masala",
    description: "Grilled chicken in a rich, creamy tomato sauce.",
    cookingTime: "70 min",
    ingredients: ["Chicken", "Yogurt", "Spices", "Tomatoes", "Cream", "Onions"],
    steps: [
      "Marinate and grill chicken.",
      "Make tomato-based gravy with spices and cream.",
      "Add grilled chicken to gravy.",
      "Simmer until cooked through."
    ],
    nutrition: { "Protein": 30, "Fat": 25 }
  },
  "vindaloo": {
    name: "Vindaloo",
    description: "Spicy and tangy curry from Goa.",
    cookingTime: "90 min",
    ingredients: ["Meat (Pork, Chicken, or Lamb)", "Vinegar", "Spices", "Garlic", "Ginger"],
    steps: [
      "Marinate meat with vinegar, spices, ginger, and garlic.",
      "Cook meat with onions and tomatoes.",
      "Simmer until tender and gravy thickens."
    ],
    nutrition: { "Protein": 28, "Iron": 15 }
  },
  "fish curry": {
    name: "Fish Curry",
    description: "Fish cooked in a spiced gravy.",
    cookingTime: "40 min",
    ingredients: ["Fish", "Coconut milk", "Tomatoes", "Onions", "Tamarind", "Spices"],
    steps: [
      "Sauté onions and tomatoes with spices.",
      "Add tamarind and coconut milk, bring to boil.",
      "Add fish pieces and simmer until cooked."
    ],
    nutrition: { "Protein": 22, "Omega-3s": 10 }
  },
  "masala dosa": {
    name: "Masala Dosa",
    description: "Crispy dosa filled with spiced potato mixture.",
    cookingTime: "30 min",
    ingredients: ["Dosa batter", "Potatoes", "Onions", "Spices", "Oil"],
    steps: [
      "Prepare dosa batter (as for plain dosa).",
      "Make spiced potato filling.",
      "Spread batter on tawa, add filling, and fold."
    ],
    nutrition: { "Carbs": 35, "Fiber": 6 }
  },
  "uttapam": {
    name: "Uttapam",
    description: "Thick savory pancake made from fermented rice and lentil batter with toppings.",
    cookingTime: "25 min",
    ingredients: ["Dosa/Idli batter", "Onions", "Tomatoes", "Chilies", "Coriander"],
    steps: [
      "Pour batter on hot tawa.",
      "Add chopped vegetables and herbs on top.",
      "Cook on both sides until golden brown."
    ],
    nutrition: { "Protein": 6, "Vitamin C": 8 }
  },
  "vada": {
    name: "Vada",
    description: "Savory fritter, often made from lentil or potato.",
    cookingTime: "30 min",
    ingredients: ["Urad dal (black gram) or Potatoes", "Spices", "Curry leaves", "Oil for frying"],
    steps: [
      "Grind soaked urad dal or mash boiled potatoes.",
      "Mix with spices and herbs.",
      "Shape into vadas and deep fry."
    ],
    nutrition: { "Protein": 7, "Fiber": 4 }
  },
  "sambhar": {
    name: "Sambhar",
    description: "Spicy lentil and vegetable stew.",
    cookingTime: "45 min",
    ingredients: ["Toor dal (split pigeon peas)", "Mixed vegetables", "Tamarind", "Sambhar powder", "Spices"],
    steps: [
      "Cook toor dal and vegetables.",
      "Add tamarind paste and sambhar powder, simmer.",
      "Temper with mustard seeds and curry leaves."
    ],
    nutrition: { "Protein": 8, "Fiber": 12 }
  },
  "rasam": {
    name: "Rasam",
    description: "Spicy South Indian soup.",
    cookingTime: "20 min",
    ingredients: ["Tomatoes", "Tamarind", "Lentils (optional)", "Rasam powder", "Spices"],
    steps: [
      "Boil tomatoes, tamarind, and spices.",
      "Add cooked lentils (if using) and rasam powder.",
      "Simmer and temper with mustard seeds and curry leaves."
    ],
    nutrition: { "Vitamin C": 10 }
  },
  "upma": {
    name: "Upma",
    description: "Savory porridge made from semolina.",
    cookingTime: "20 min",
    ingredients: ["Semolina (rava)", "Onions", "Vegetables", "Mustard seeds", "Curry leaves"],
    steps: [
      "Roast semolina.",
      "Sauté onions and vegetables with mustard seeds and curry leaves.",
      "Add water and roasted semolina, cook until thickened."
    ],
    nutrition: { "Carbs": 25, "Fiber": 4 }
  },
  "poha": {
    name: "Poha",
    description: "Flattened rice dish.",
    cookingTime: "15 min",
    ingredients: ["Flattened rice (poha)", "Onions", "Mustard seeds", "Turmeric", "Lemon juice"],
    steps: [
      "Rinse poha.",
      "Sauté onions with mustard seeds and turmeric.",
      "Add poha and salt, mix well.",
      "Garnish with lemon juice and coriander."
    ],
    nutrition: { "Carbs": 30, "Iron": 5 }
  },
  "gajar ka halwa": {
    name: "Gajar ka Halwa",
    description: "Sweet pudding made from grated carrots, milk, and sugar.",
    cookingTime: "60 min",
    ingredients: ["Carrots", "Milk", "Sugar", "Ghee", "Cardamom", "Nuts"],
    steps: [
      "Grate carrots.",
      "Cook carrots with milk until milk evaporates.",
      "Add sugar and ghee, cook until thick.",
      "Add cardamom and nuts."
    ],
    nutrition: { "Vitamin A": 25, "Fat": 20 }
  },
  "gulab jamun": {
    name: "Gulab Jamun",
    description: "Deep-fried milk solids balls soaked in sugar syrup.",
    cookingTime: "40 min",
    ingredients: ["Khoya (reduced milk solids) or milk powder", "All-purpose flour", "Sugar", "Cardamom"],
    steps: [
      "Make dough from khoya/milk powder and flour.",
      "Shape into balls and deep fry.",
      "Prepare sugar syrup with cardamom.",
      "Soak fried balls in warm syrup."
    ],
    nutrition: { "Sugar": 40, "Fat": 18 }
  },
  "jalebi": {
    name: "Jalebi",
    description: "Crispy fried sweet pretzels soaked in sugar syrup.",
    cookingTime: "30 min",
    ingredients: ["All-purpose flour", "Yogurt", "Sugar", "Saffron", "Oil for frying"],
    steps: [
      "Prepare batter with flour and yogurt and ferment.",
      "Make sugar syrup with saffron.",
      "Pipe batter into hot oil in pretzel shapes and fry.",
      "Soak fried jalebis in warm syrup."
    ],
    nutrition: { "Sugar": 35, "Carbs": 30 }
  },
  "laddu": {
    name: "Laddu",
    description: "Sphere-shaped sweets.",
    cookingTime: "30 min",
    ingredients: ["Besan (gram flour) or other flours", "Ghee", "Sugar", "Nuts", "Cardamom"],
    steps: [
      "Roast flour in ghee.",
      "Mix with sugar, nuts, and cardamom.",
      "Shape into laddus."
    ],
    nutrition: { "Fat": 25, "Sugar": 30 }
  },
  "barfi": {
    name: "Barfi",
    description: "Milk-based sweet confection.",
    cookingTime: "50 min",
    ingredients: ["Milk powder or Khoya", "Sugar", "Ghee", "Cardamom", "Nuts"],
    steps: [
      "Cook milk powder/khoya with sugar and ghee until thick.",
      "Spread in a tray and let it set.",
      "Cut into squares and garnish with nuts."
    ],
    nutrition: { "Fat": 22, "Sugar": 35 }
  },
  "kheer": {
    name: "Kheer",
    description: "Rice pudding made with milk, sugar, and rice.",
    cookingTime: "60 min",
    ingredients: ["Rice", "Milk", "Sugar", "Cardamom", "Nuts", "Raisins"],
    steps: [
      "Wash rice and cook with milk on low heat.",
      "Add sugar, cardamom, nuts, and raisins.",
      "Simmer until thick."
    ],
    nutrition: { "Carbs": 30, "Calcium": 15 }
  },
  "rasgulla": {
    name: "Rasgulla",
    description: "Spongy cheese balls soaked in sugar syrup.",
    cookingTime: "50 min",
    ingredients: ["Chhena (Indian cheese)", "Sugar", "Cardamom"],
    steps: [
      "Make chhena from milk.",
      "Knead chhena and shape into balls.",
      "Boil balls in sugar syrup until spongy."
    ],
    nutrition: { "Sugar": 38, "Protein": 5 }
  },
  "sandesh": {
    name: "Sandesh",
    description: "Bengali sweet made from chhena and sugar.",
    cookingTime: "30 min",
    ingredients: ["Chhena (Indian cheese)", "Sugar", "Cardamom"],
    steps: [
      "Make chhena from milk.",
      "Knead chhena with sugar.",
      "Cook on low heat until mixture thickens.",
      "Shape into sandesh."
    ],
    nutrition: { "Protein": 6, "Sugar": 30 }
  },
  "modak": {
    name: "Modak",
    description: "Sweet dumpling with coconut and jaggery filling.",
    cookingTime: "40 min",
    ingredients: ["Rice flour or wheat flour", "Coconut", "Jaggery", "Cardamom"],
    steps: [
      "Prepare outer shell dough.",
      "Make filling with coconut and jaggery.",
      "Fill dough and shape into modak.",
      "Steam the modak."
    ],
    nutrition: { "Carbs": 40, "Fiber": 5 }
  },
  "pesarattu": {
    name: "Pesarattu",
    description: "Andhra style crepe made from green gram (pesarattu) batter.",
    cookingTime: "20 min",
    ingredients: ["Green gram (pesarattu)", "Ginger", "Green chilies", "Onion"],
    steps: [
      "Grind soaked green gram with ginger and chilies.",
      "Pour batter on hot tawa and spread.",
      "Add chopped onions and cook until crispy."
    ],
    nutrition: { "Protein": 10, "Fiber": 8 }
  },
  "medu vada": {
    name: "Medu Vada",
    description: "Savory donut-shaped fritter made from urad dal.",
    cookingTime: "30 min",
    ingredients: ["Urad dal (black gram)", "Ginger", "Green chilies", "Curry leaves", "Oil for frying"],
    steps: [
      "Grind soaked urad dal into batter.",
      "Mix with ginger, chilies, and curry leaves.",
      "Shape into donuts and deep fry until golden."
    ],
    nutrition: { "Protein": 8, "Fiber": 5 }
  },
  "bisi bele bath": {
    name: "Bisi Bele Bath",
    description: "Spicy rice and lentil dish from Karnataka.",
    cookingTime: "60 min",
    ingredients: ["Rice", "Toor dal (split pigeon peas)", "Mixed vegetables", "Bisi Bele Bath powder", "Tamarind"],
    steps: [
      "Cook rice and dal together.",
      "Cook vegetables separately.",
      "Combine cooked rice, dal, vegetables, tamarind, and Bisi Bele Bath powder.",
      "Simmer until well combined and flavors meld."
    ],
    nutrition: { "Fiber": 10, "Protein": 7 }
  },
  "pongal": {
    name: "Pongal",
    description: "South Indian dish made from rice and lentils.",
    cookingTime: "30 min",
    ingredients: ["Rice", "Moong dal (split yellow lentils)", "Ghee", "Ginger", "Black peppercorns", "Cumin seeds"],
    steps: [
      "Cook rice and moong dal together until soft.",
      "Temper with ghee, ginger, peppercorns, and cumin seeds.",
      "Mix tempering into cooked rice and dal."
    ],
    nutrition: { "Carbs": 30, "Protein": 6 }
  },
  "avial": {
    name: "Avial",
    description: "Mixed vegetable curry with coconut and yogurt from Kerala.",
    cookingTime: "40 min",
    ingredients: ["Mixed vegetables", "Coconut", "Yogurt", "Green chilies", "Curry leaves", "Coconut oil"],
    steps: [
      "Cook mixed vegetables.",
      "Grind coconut and green chilies.",
      "Combine cooked vegetables, coconut paste, and yogurt.",
      "Temper with coconut oil and curry leaves."
    ],
    nutrition: { "Vitamin C": 15, "Fiber": 10 }
  },
  "erissery": {
    name: "Erissery",
    description: "Kerala style pumpkin and lentil curry with coconut.",
    cookingTime: "40 min",
    ingredients: ["Pumpkin", "Black chickpeas or cowpeas", "Coconut", "Turmeric", "Cumin", "Curry leaves"],
    steps: [
      "Cook pumpkin and lentils.",
      "Grind coconut with turmeric and cumin.",
      "Combine cooked ingredients with coconut paste.",
      "Temper with mustard seeds and curry leaves."
    ],
    nutrition: { "Vitamin A": 20, "Fiber": 12 }
  },
  "thalipeeth": {
    name: "Thalipeeth",
    description: " savory multi-grain flatbread from Maharashtra.",
    cookingTime: "25 min",
    ingredients: ["Mixed grain flours", "Onions", "Green chilies", "Coriander", "Spices"],
    steps: [
      "Mix flours, onions, chilies, coriander, and spices with water to form dough.",
      "Pat dough onto a hot tawa.",
      "Cook with oil until crispy."
    ],
    nutrition: { "Fiber": 10, "Protein": 8 }
  },
  "misal pav": {
    name: "Misal Pav",
    description: "Spicy sprout curry topped with farsan, onions, and coriander, served with pav.",
    cookingTime: "50 min",
    ingredients: ["Sprouts (matki)", "Onions", "Tomatoes", "Ginger-garlic paste", "Misal masala", "Farsan", "Pav"],
    steps: [
      "Cook sprouts.",
      "Prepare spicy curry base with onions, tomatoes, ginger-garlic, and misal masala.",
      "Add cooked sprouts to curry.",
      "Serve hot topped with farsan, chopped onions, and coriander, with pav."
    ],
    nutrition: { "Protein": 12, "Fiber": 10 }
  },
  "vada pav": {
    name: "Vada Pav",
    description: "Spicy potato fritter (batata vada) served in a bread roll (pav) with chutneys.",
    cookingTime: "30 min",
    ingredients: ["Potatoes", "Besan (gram flour)", "Spices", "Garlic chutney", "Tamarind chutney", "Pav"],
    steps: [
      "Boil and mash potatoes, mix with spices.",
      "Prepare besan batter.",
      "Shape potato mixture into balls, dip in batter, and deep fry (batata vada).",
      "Slice pav, spread chutneys, place batata vada inside, and serve."
    ],
    nutrition: { "Carbs": 25, "Fat": 15 }
  },
  "dabeli": {
    name: "Dabeli",
    description: "Spicy potato mixture filled in a pav, topped with chutneys, sev, and pomegranate seeds.",
    cookingTime: "20 min",
    ingredients: ["Potatoes", "Dabeli masala", "Tamarind chutney", "Garlic chutney", "Sev", "Pomegranate seeds", "Pav"],
    steps: [
      "Prepare spicy potato mixture with dabeli masala.",
      "Slice pav and fill with potato mixture.",
      "Top with chutneys, sev, and pomegranate seeds.",
      "Lightly toast the filled pav."
    ],
    nutrition: { "Carbs": 30, "Sugar": 10 }
  },
  "kachori": {
    name: "Kachori",
    description: "Deep-fried pastry filled with spicy lentil or potato filling.",
    cookingTime: "40 min",
    ingredients: ["All-purpose flour", "Mung dal or Potatoes", "Spices", "Oil for frying"],
    steps: [
      "Prepare dough.",
      "Make spicy lentil or potato filling.",
      "Stuff dough with filling and flatten.",
      "Deep fry until golden and crispy."
    ],
    nutrition: { "Fat": 20, "Fiber": 6 }
  },
  "mathri": {
    name: "Mathri",
    description: "Flaky savory biscuits.",
    cookingTime: "45 min",
    ingredients: ["All-purpose flour", "Ghee or Oil", "Carom seeds (ajwain)", "Black peppercorns"],
    steps: [
      "Prepare stiff dough with flour, ghee, carom seeds, peppercorns, and salt.",
      "Roll out and cut into shapes.",
      "Prick with a fork and deep fry on low heat until crispy."
    ],
    nutrition: { "Fat": 25, "Carbs": 20 }
  },
  "namak pare": {
    name: "Namak Pare",
    description: "Savory fried snacks.",
    cookingTime: "30 min",
    ingredients: ["All-purpose flour", "Ghee or Oil", "Carom seeds (ajwain)", "Salt"],
    steps: [
      "Prepare stiff dough with flour, ghee, carom seeds, and salt.",
      "Roll out and cut into diamond shapes.",
      "Deep fry until golden and crispy."
    ],
    nutrition: { "Fat": 20, "Carbs": 25 }
  },
  "chakli": {
    name: "Chakli",
    description: "Spiral-shaped savory snack.",
    cookingTime: "40 min",
    ingredients: ["Rice flour", "Besan (gram flour)", "Butter", "Sesame seeds", "Spices"],
    steps: [
      "Prepare dough with flours, butter, sesame seeds, and spices.",
      "Use a chakli press to form spirals.",
      "Deep fry until golden and crispy."
    ],
    nutrition: { "Fat": 22, "Carbs": 30 }
  },
  "murukku": {
    name: "Murukku",
    description: "Crispy South Indian snack.",
    cookingTime: "30 min",
    ingredients: ["Rice flour", "Urad dal flour", "Butter", "Sesame seeds", "Spices"],
    steps: [
      "Prepare dough with rice flour, urad dal flour, butter, sesame seeds, and spices.",
      "Use a murukku press to form shapes.",
      "Deep fry until golden and crispy."
    ],
    nutrition: { "Fat": 20, "Carbs": 35 }
  },
  "ribbon pakoda": {
    name: "Ribbon Pakoda",
    description: "Flat ribbon-shaped savory snack.",
    cookingTime: "30 min",
    ingredients: ["Rice flour", "Besan (gram flour)", "Butter", "Spices"],
    steps: [
      "Prepare dough with flours, butter, and spices.",
      "Use a ribbon pakoda press to form ribbons.",
      "Deep fry until golden and crispy."
    ],
    nutrition: { "Fat": 18, "Carbs": 30 }
  },
  "shankarpaali": {
    name: "Shankarpaali",
    description: "Sweet or savory diamond-shaped biscuits.",
    cookingTime: "40 min",
    ingredients: ["All-purpose flour", "Sugar (for sweet) or Salt (for savory)", "Ghee or Oil"],
    steps: [
      "Prepare dough with flour, sugar/salt, and ghee/oil.",
      "Roll out and cut into diamond shapes.",
      "Deep fry until golden and crispy."
    ],
    nutrition: { "Fat": 22, "Carbs": 35 }
  },
  "anjali chips": {
    name: "Anjali Chips",
    description: "Crispy banana chips from Kerala.",
    cookingTime: "20 min",
    ingredients: ["Raw bananas", "Coconut oil", "Salt", "Turmeric powder"],
    steps: [
      "Slice raw bananas thinly.",
      "Fry in hot coconut oil with salt and turmeric until crispy.",
      "Drain excess oil."
    ],
    nutrition: { "Fat": 25, "Carbs": 20 }
  },
  "tapioca chips": {
    name: "Tapioca Chips",
    description: "Crispy chips made from tapioca root.",
    cookingTime: "20 min",
    ingredients: ["Tapioca root", "Coconut oil", "Salt"],
    steps: [
      "Peel and slice tapioca root thinly.",
      "Fry in hot coconut oil with salt until crispy.",
      "Drain excess oil."
    ],
    nutrition: { "Carbs": 30, "Fat": 22 }
  },
  "murabba": {
    name: "Murabba",
    description: "Sweet fruit preserve.",
    cookingTime: "60 min",
    ingredients: ["Fruit (Amla, Apple, etc.)", "Sugar", "Cardamom"],
    steps: [
      "Prepare fruit (clean, core, etc.).",
      "Cook fruit with sugar and cardamom until syrup thickens.",
      "Store in airtight jars."
    ],
    nutrition: { "Sugar": 50, "Vitamin C": 10 }
  },
  "chutney": {
    name: "Chutney",
    description: "Savory condiment.",
    cookingTime: "15 min",
    ingredients: ["Fruits, vegetables, or herbs", "Spices", "Tamarind or Lemon juice"],
    steps: [
      "Grind or finely chop ingredients with spices and liquid.",
      "Mix well."
    ],
    nutrition: { "Vitamin C": 8, "Fiber": 5 }
  },
  "pickle": {
    name: "Pickle",
    description: "Preserved fruits or vegetables in oil and spices.",
    cookingTime: "varies",
    ingredients: ["Fruits or vegetables", "Oil", "Spices", "Vinegar or Lemon juice"],
    steps: [
      "Prepare fruits/vegetables.",
      "Mix with spices and oil.",
      "Add vinegar/lemon juice and store to ferment/mature."
    ],
    nutrition: { "Sodium": 20, "Vitamin C": 5 }
  }
};

// Additional fallback recipes for popular dishes (Adding 30 more)
const ADDITIONAL_FALLBACK_RECIPES: Record<string, any> = {
  "rogan josh": {
    name: "Rogan Josh",
    description: "An aromatic Kashmiri lamb curry.",
    cookingTime: "90 min",
    ingredients: ["Lamb", "Yogurt", "Ginger", "Garlic", "Fennel powder", "Kashmiri chili"],
    steps: [
      "Marinate lamb with yogurt, ginger, garlic, and spices.",
      "Cook lamb in oil with onions and tomatoes.",
      "Add water and simmer until meat is tender.",
      "Finish with ghee and aromatic spices."
    ],
    nutrition: { "Protein": 25, "Iron": 20 }
  },
  "butter chicken": {
    name: "Butter Chicken",
    description: "Creamy and flavorful chicken curry.",
    cookingTime: "60 min",
    ingredients: ["Chicken", "Tomatoes", "Butter", "Cream", "Ginger-garlic paste", "Spices"],
    steps: [
      "Marinate chicken.",
      "Make tomato gravy with butter and spices.",
      "Add chicken and cream, simmer.",
      "Serve with naan or rice."
    ],
    nutrition: { "Protein": 28, "Fat": 30 }
  },
  "chole bhature": {
    name: "Chole Bhature",
    description: "Spicy chickpea curry with fried bread.",
    cookingTime: "75 min",
    ingredients: ["Chickpeas", "Onions", "Tomatoes", "Spices", "Flour", "Yogurt"],
    steps: [
      "Cook chickpeas with spices.",
      "Prepare dough for bhature.",
      "Fry bhature until puffed.",
      "Serve chole with hot bhature."
    ],
    nutrition: { "Fiber": 15, "Protein": 10 }
  },
  "dhokla": {
    name: "Dhokla",
    description: "Steamed savory cake from Gujarat.",
    cookingTime: "40 min",
    ingredients: ["Besan (gram flour)", "Yogurt", "Ginger-green chili paste", "Eno (fruit salt)", "Mustard seeds"],
    steps: [
      "Prepare batter with besan, yogurt, and spices.",
      "Steam the batter.",
      "Prepare tempering with mustard seeds and curry leaves.",
      "Pour tempering over dhokla and cut into pieces."
    ],
    nutrition: { "Protein": 8, "Vitamin C": 5 }
  },
  "aloo paratha": {
    name: "Aloo Paratha",
    description: "Indian flatbread stuffed with spiced potatoes.",
    cookingTime: "45 min",
    ingredients: ["Wheat flour", "Potatoes", "Onions", "Green chilies", "Spices", "Ghee"],
    steps: [
      "Prepare dough.",
      "Boil and mash potatoes, mix with spices.",
      "Stuff dough with potato filling and roll into paratha.",
      "Cook on a tawa with ghee."
    ],
    nutrition: { "Carbs": 30, "Fiber": 5 }
  },
  "rajma": {
    name: "Rajma",
    description: "North Indian kidney bean curry.",
    cookingTime: "120 min",
    ingredients: ["Kidney beans", "Onions", "Tomatoes", "Ginger", "Garlic", "Spices"],
    steps: [
      "Soak kidney beans overnight and boil.",
      "Sauté onions, tomatoes, ginger, garlic, and spices.",
      "Add boiled rajma and simmer until thick.",
      "Serve with rice."
    ],
    nutrition: { "Protein": 15, "Fiber": 20 }
  },
  // Add more dishes as needed
};

// Merge the initial FALLBACK_RECIPES with additional recipes
Object.assign(FALLBACK_RECIPES, ADDITIONAL_FALLBACK_RECIPES);

// Gemini Pro API key from environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDo1ndEm0_eLxpOenbjcJWLwvGGLndtAAM";

// Function to call Gemini Pro API for recipe generation
async function fetchRecipeFromGemini(dish: string): Promise<Recipe[]> {
  const prompt = `Generate a detailed traditional Indian recipe for ${dish}. Include a description, cooking time, ingredients, step-by-step preparation, nutrition information, and instructions for generating a video of the recipe.`;
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    const data = await response.json();
    // Parse Gemini response (assuming text format)
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    // Simple parsing: try to extract fields from the text
    // (In production, use a more robust parser or structured output)
    const recipe: Recipe = { name: dish, description: '', ingredients: [], steps: [], nutrition: {}, cookingTime: '' };

    // Improved parsing: Use regex to find sections and extract content
    const descriptionMatch = text.match(/Description:\s*(.*?)(?:\n\n|$)/s);
    if (descriptionMatch && descriptionMatch[1]) recipe.description = descriptionMatch[1].trim();

    const cookingTimeMatch = text.match(/Cooking Time:\s*(.*?)(?:\n\n|$)/s);
    if (cookingTimeMatch && cookingTimeMatch[1]) recipe.cookingTime = cookingTimeMatch[1].trim();

    const ingredientsMatch = text.match(/Ingredients:\s*(.*?)(?:\n\n|$)/s);
    if (ingredientsMatch && ingredientsMatch[1]) {
      recipe.ingredients = ingredientsMatch[1].split('\n').map(item => item.replace(/^[-\*]\s*/, '').trim()).filter(item => item);
    }

    const stepsMatch = text.match(/(?:Steps|Preparation|Method):\s*(.*?)(?:\n\n|$)/s);
    if (stepsMatch && stepsMatch[1]) {
      recipe.steps = stepsMatch[1].split('\n').map(item => item.replace(/^\d+\.\s*/, '').trim()).filter(item => item);
    }

    const nutritionMatch = text.match(/Nutrition:\s*(.*?)(?:\n\n|$)/s);
    if (nutritionMatch && nutritionMatch[1]) {
      const nutritionLines = nutritionMatch[1].split('\n').map(line => line.trim()).filter(line => line);
      nutritionLines.forEach(line => {
        const parts = line.split(':');
        if (parts.length === 2) {
          recipe.nutrition[parts[0].trim()] = parts[1].trim().replace(/%$/, ''); // Remove trailing % for easier handling
        }
      });
    }

    // Fallbacks if nothing parsed
    if (!recipe.ingredients.length) recipe.ingredients = ["See description above."];
    if (!recipe.steps.length) recipe.steps = ["See description above."];
    if (!recipe.description) recipe.description = text; // Use raw text as fallback description
    return [recipe];
  } catch (err) {
    return [];
  }
}

const Recipes = () => {
  const [dishName, setDishName] = React.useState('');
  const [recipes, setRecipes] = React.useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searched, setSearched] = React.useState(false);
  const [suggestedDish, setSuggestedDish] = React.useState('');
  const [suggestedRecipes, setSuggestedRecipes] = React.useState<Recipe[]>([]);

  // Suggest a random traditional dish and fetch recipes from Supabase backend
  React.useEffect(() => {
    const randomDish = SUGGESTED_DISHES[Math.floor(Math.random() * SUGGESTED_DISHES.length)];
    setSuggestedDish(randomDish);
    setIsLoading(true);
    
    // First try to fetch from Supabase recipes table
    const fetchRecipes = async () => {
      try {
        // Try Supabase table first
        const { data: supabaseRecipes, error } = await supabase
          .from('recipes')
          .select('*')
          .limit(50);
        
        if (!error && supabaseRecipes && supabaseRecipes.length > 0) {
          const recipes = supabaseRecipes.map((r: any, idx: number) => ({
            id: r.id || idx,
            name: r.title || r.name || '',
            description: r.description || '',
            cookingTime: r.cooking_time || r.cookingTime || '',
            ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
            steps: Array.isArray(r.steps) ? r.steps : [],
            nutrition: r.nutrition || {},
          }));
          setSuggestedRecipes(recipes);
          setIsLoading(false);
          return;
        }
        
        // If no Supabase data, try edge function
        const response = await fetch('https://derildzszqbqbgeygznk.functions.supabase.co/generate-recipes-large');
        if (response.ok) {
          const data = await response.json();
          const result = Array.isArray(data) ? data : data.recipes || [];
          const shuffled = result.sort(() => 0.5 - Math.random());
          setSuggestedRecipes(shuffled.slice(0, 50).map((r: any, idx: number) => ({
            id: r.id || idx,
            name: r.title || r.name || '',
            description: r.description || '',
            cookingTime: r.cookingTime || r.cooking_time || '',
            ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
            steps: Array.isArray(r.steps) ? r.steps : [],
            nutrition: r.nutrition || {},
          })));
        } else {
          // Final fallback: show fixed 50 demo recipes
          setSuggestedRecipes(DEMO_RECIPES_50);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setSuggestedRecipes(DEMO_RECIPES_50);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecipes();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSearched(true);
    setRecipes([]);
    try {
      const geminiRecipes = await fetchRecipeFromGemini(dishName);
      if (geminiRecipes.length > 0) {
        // attach an image for UX
        const withImages = geminiRecipes.map((r) => ({
          ...r,
          imageUrl: r.imageUrl || `https://source.unsplash.com/800x600/?${encodeURIComponent(r.name + ' Indian recipe')}`
        }));
        setRecipes(withImages);
      } else {
        setRecipes([]); // Will trigger fallback card
      }
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-agri-green-dark mb-8">Find a Recipe</h1>
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mb-8">
          <Input
            type="text"
            placeholder="Enter dish name (e.g., Biryani)"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            className="pl-10"
            required
          />
          <Button type="submit" disabled={isLoading || !dishName}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
        {isLoading && (
          <div className="text-center py-8">Loading recipes...</div>
        )}
        {error && (
          <div className="text-center text-red-500 py-4">{error}</div>
        )}
        {searched ? (
          <>
            {(!isLoading && recipes.length === 0 && !error) && (() => {
              const fallback: React.ReactNode = (() => {
                const fallbackData = FALLBACK_RECIPES[dishName.trim().toLowerCase()] || {
                  name: dishName.charAt(0).toUpperCase() + dishName.slice(1),
                  description: `A traditional recipe for ${dishName}.`,
                  cookingTime: "45 min",
                  ingredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
                  steps: [
                    `Step 1 for making ${dishName}.`,
                    `Step 2 for making ${dishName}.`,
                    `Step 3 for making ${dishName}.`
                  ],
                  nutrition: { "Protein": 10, "Vitamin A": 5, "Vitamin C": 5, "Calcium": 5, "Iron": 5 }
                };
                return (
                  <div className="text-center text-gray-500 py-4">
                    No recipes found for "{dishName}".<br />
                    <div className="mt-4 max-w-lg mx-auto">
                      <Card className="p-6">
                        <div className="w-12 h-12 bg-agri-cream rounded-full flex items-center justify-center mb-4">
                          <Utensils className="h-6 w-6 text-agri-green" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{fallbackData.name}</h3>
                        <p className="text-gray-600 mb-4">{fallbackData.description}</p>
                        <div className="text-sm text-gray-500">
                          <p>Cooking time: {fallbackData.cookingTime}</p>
                          <p className="mt-2">Main ingredients:</p>
                          <ul className="list-disc list-inside mt-1">
                            {fallbackData.ingredients.map((ingredient: string, idx: number) => (
                              <li key={idx}>{ingredient}</li>
                            ))}
                          </ul>
                          <div className="mt-2">
                            <p className="font-semibold">Preparation Steps:</p>
                            <ol className="list-decimal list-inside mt-1">
                              {fallbackData.steps.map((step: string, idx: number) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ol>
                          </div>
                          <div className="mt-2">
                            <p className="font-semibold">Nutrition (% Daily Value):</p>
                            <ul className="list-disc list-inside mt-1">
                              {Object.entries(fallbackData.nutrition).map(([key, value]) => (
                                <li key={key}>{key}: {String(value)}%</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <Button className="w-full mt-4" disabled>
                          View Recipe
                        </Button>
                      </Card>
                    </div>
                  </div>
                );
              })();
              return fallback;
            })()}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="p-6">
                  <div className="w-12 h-12 bg-agri-cream rounded-full flex items-center justify-center mb-4">
                    <Utensils className="h-6 w-6 text-agri-green" />
                  </div>
                  {recipe.imageUrl && (
                    <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                  )}
                  <h3 className="font-bold text-lg mb-2">{recipe.name}</h3>
                  <p className="text-gray-600 mb-4">{recipe.description || 'No description available.'}</p>
                  <div className="text-sm text-gray-500">
                    <p>Cooking time: {recipe.cookingTime || 'N/A'}</p>
                    <p className="mt-2">Main ingredients:</p>
                    <ul className="list-disc list-inside mt-1">
                      {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
                        recipe.ingredients.map((ingredient: string, index: number) => (
                          <li key={index}>{ingredient}</li>
                        ))
                      ) : (
                        <li>No ingredients listed.</li>
                      )}
                    </ul>
                    {/* Preparation steps */}
                    {Array.isArray(recipe.steps) && recipe.steps.length > 0 && (
                      <div className="mt-2">
                        <p className="font-semibold">Preparation Steps:</p>
                        <ol className="list-decimal list-inside mt-1">
                          {recipe.steps.map((step: string, idx: number) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                    {/* Nutrition info */}
                    {recipe.nutrition && Object.keys(recipe.nutrition).length > 0 && (
                      <div className="mt-2">
                        <p className="font-semibold">Nutrition (% Daily Value):</p>
                        <ul className="list-disc list-inside mt-1">
                          {Object.entries(recipe.nutrition).map(([key, value]) => (
                            <li key={key}>{key}: {String(value)}%</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button className="w-1/2" disabled>
                      View Recipe
                    </Button>
                    <Button
                      className="w-1/2"
                      variant="outline"
                      onClick={async () => {
                        const [r] = await fetchRecipeFromGemini(recipe.name);
                        if (r) {
                          r.videoScript = r.description || 'Narrate steps with ingredient overlays and cooking shots.';
                          const updated = { ...recipe, videoScript: r.videoScript } as Recipe;
                          setRecipes(prev => prev.map(x => x.id === recipe.id ? updated : x));
                          await saveRecipeToSupabase(updated);
                        }
                      }}
                    >
                      Generate Video Script
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      className="w-full"
                      variant="secondary"
                      onClick={async () => {
                        await saveRecipeToSupabase(recipe);
                      }}
                    >
                      Save to Library
                    </Button>
                  </div>
                  {recipe.videoScript && (
                    <div className="mt-4 text-xs text-gray-600 bg-agri-cream-light p-3 rounded">
                      <p className="font-semibold mb-1">Video Script (demo):</p>
                      <p className="whitespace-pre-wrap">{recipe.videoScript}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 text-lg text-agri-green-dark font-semibold">
              Suggested Dish: <span className="font-bold">{suggestedDish}</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedRecipes.map((recipe) => (
                <Card key={recipe.id} className="p-6">
                  <div className="w-12 h-12 bg-agri-cream rounded-full flex items-center justify-center mb-4">
                    <Utensils className="h-6 w-6 text-agri-green" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{recipe.name}</h3>
                  <p className="text-gray-600 mb-4">{recipe.description || 'No description available.'}</p>
                  <div className="text-sm text-gray-500">
                    <p>Cooking time: {recipe.cookingTime || 'N/A'}</p>
                    <p className="mt-2">Main ingredients:</p>
                    <ul className="list-disc list-inside mt-1">
                      {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
                        recipe.ingredients.map((ingredient: string, index: number) => (
                          <li key={index}>{ingredient}</li>
                        ))
                      ) : (
                        <li>No ingredients listed.</li>
                      )}
                    </ul>
                  </div>
                  <Button className="w-full mt-4" disabled>
                    View Recipe
                  </Button>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};
export default Recipes;
