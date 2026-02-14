import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Leaf, Sprout, Trees } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useRealtimeTable } from "@/hooks/useRealtimeTable";
import { supabase } from '@/integrations/supabase/client';

interface FertilizerRecommendation {
  id?: string;
  cropName: string;
  organicFertilizers: string[];
  chemicalFertilizers: string[];
  applicationTiming: string;
  dosagePerAcre: string;
  specialNotes: string;
}

// High-fidelity set (closer to SAUs/ICAR guidance, kg/acre). Used first when no backend.
const PRIORITY_FERTILIZER_RECOMMENDATIONS: FertilizerRecommendation[] = [
  {
    cropName: "Rice (Transplanted)",
    organicFertilizers: ["FYM 8-10 t", "Compost 5 t", "Green manure (dhaincha)"],
    chemicalFertilizers: ["N 40-50", "P2O5 20-24", "K2O 20-24", "Zinc sulfate 10 kg"],
    applicationTiming: "50% N + full P & K basal; 25% N at active tillering; 25% N at panicle initiation",
    dosagePerAcre: "Urea ~110 kg, DAP ~55 kg, MOP ~35 kg (adjust if DAP used)",
    specialNotes: "Keep 2–3 cm water after transplanting; split N with moist soil; use leaf color chart for topdress."
  },
  {
    cropName: "Wheat (Irrigated)",
    organicFertilizers: ["FYM 4-5 t", "Compost 3 t"],
    chemicalFertilizers: ["N 40-45", "P2O5 20", "K2O 10"],
    applicationTiming: "50% N + full P & K at sowing; 25% N at CRI (20-25 DAS); 25% N at booting",
    dosagePerAcre: "Urea ~100 kg, DAP ~45 kg, MOP ~15 kg",
    specialNotes: "Sulfur 10 kg improves grain protein; ensure first irrigation at CRI."
  },
  {
    cropName: "Maize (Kharif)",
    organicFertilizers: ["FYM 5-6 t", "Compost 3 t"],
    chemicalFertilizers: ["N 50-60", "P2O5 25", "K2O 25", "Zinc sulfate 10 kg"],
    applicationTiming: "30% N + full P & K at sowing; 40% N at 25-30 DAS; 30% N at tasseling",
    dosagePerAcre: "Urea ~130 kg, DAP ~55 kg, MOP ~40 kg",
    specialNotes: "Band place fertilizer 5 cm aside/5 cm deep; avoid water stress at tasseling."
  },
  {
    cropName: "Cotton (Bt)",
    organicFertilizers: ["FYM 8-10 t", "Compost 5 t", "Neem cake 200 kg"],
    chemicalFertilizers: ["N 50-55", "P2O5 25", "K2O 25", "MgSO4 10 kg"],
    applicationTiming: "40% N + full P & K basal; 30% N at square formation; 30% N at boll formation",
    dosagePerAcre: "Urea ~120 kg, DAP ~55 kg, MOP ~40 kg",
    specialNotes: "Foliar 1% KNO3 at boll development improves boll weight."
  },
  {
    cropName: "Sugarcane (Plant)",
    organicFertilizers: ["FYM/Pressmud 12-15 t", "Compost 10 t"],
    chemicalFertilizers: ["N 80-90", "P2O5 26-30", "K2O 50-55"],
    applicationTiming: "Apply full P & K + 50% N at planting; 25% N at 60 DAP; 25% N at 90-100 DAP with earthing-up",
    dosagePerAcre: "Urea ~190 kg, DAP ~70 kg, MOP ~85 kg",
    specialNotes: "Add 25 kg MgSO4 in light soils; maintain moisture for tillering."
  },
  {
    cropName: "Soybean",
    organicFertilizers: ["FYM 5 t", "Compost 3 t"],
    chemicalFertilizers: ["N 12-15", "P2O5 30-32", "K2O 15", "Sulfur 10 kg"],
    applicationTiming: "All fertilizers basal; no topdress N if nodulation good",
    dosagePerAcre: "Urea ~35 kg, DAP ~70 kg, MOP ~25 kg, elemental S ~15 kg",
    specialNotes: "Rhizobium + PSB seed inoculation critical; avoid waterlogging."
  },
  {
    cropName: "Groundnut (Rainfed)",
    organicFertilizers: ["FYM 5 t", "Compost 3 t"],
    chemicalFertilizers: ["N 10", "P2O5 24", "K2O 24", "Gypsum 200 kg at flowering"],
    applicationTiming: "Basal all fertilizers; gypsum at peak flowering in two bands",
    dosagePerAcre: "Urea ~20 kg, SSP ~150 kg, MOP ~40 kg, Gypsum 200 kg",
    specialNotes: "Calcium & sulfur from gypsum boost pod filling; maintain weed-free first 35 days."
  },
  {
    cropName: "Mustard",
    organicFertilizers: ["FYM 3-4 t", "Compost 2 t"],
    chemicalFertilizers: ["N 30-35", "P2O5 20", "K2O 10", "Sulfur 12-15 kg"],
    applicationTiming: "50% N + full P & K basal; 50% N at 30 DAS",
    dosagePerAcre: "Urea ~80 kg, DAP ~45 kg, MOP ~15 kg, Bentonite-S 20 kg",
    specialNotes: "Sulfur improves oil content; avoid lodging with balanced N."
  },
  {
    cropName: "Potato",
    organicFertilizers: ["FYM 8-10 t", "Compost 5 t"],
    chemicalFertilizers: ["N 55-60", "P2O5 30", "K2O 60"],
    applicationTiming: "Basal: full P & K + 40% N; 30% N at earthing-up; 30% N at tuber initiation",
    dosagePerAcre: "Urea ~140 kg, DAP ~65 kg, MOP ~100 kg",
    specialNotes: "Potassium is key for tuber quality; keep uniform moisture."
  },
  {
    cropName: "Tomato (Irrigated)",
    organicFertilizers: ["FYM 8 t", "Compost 4 t", "Neem cake 150 kg"],
    chemicalFertilizers: ["N 40-50", "P2O5 25", "K2O 40"],
    applicationTiming: "Basal: 30% N + full P & K; 40% N at first flowering; 30% N at fruit set",
    dosagePerAcre: "Urea ~120 kg, DAP ~55 kg, MOP ~70 kg",
    specialNotes: "Add 1% CaNO3 foliar to prevent blossom end rot; drip fertigation improves use-efficiency."
  },
  {
    cropName: "Onion (Rabi)",
    organicFertilizers: ["FYM 8-10 t", "Compost 5 t"],
    chemicalFertilizers: ["N 45", "P2O5 25", "K2O 40", "Sulfur 10 kg"],
    applicationTiming: "Basal: full P & K + 40% N; 30% N at 25-30 DAT; 30% N at bulb initiation",
    dosagePerAcre: "Urea ~110 kg, DAP ~55 kg, MOP ~70 kg",
    specialNotes: "Sulfur improves bulb pungency and storability."
  },
  {
    cropName: "Banana (Tissue culture, 12 mo)",
    organicFertilizers: ["FYM 15-20 t", "Pressmud 5 t"],
    chemicalFertilizers: ["N 70-80", "P2O5 25", "K2O 120"],
    applicationTiming: "Split into 6-8 fertigation/side-dress doses from planting to bunch emergence",
    dosagePerAcre: "Urea ~190 kg, DAP ~55 kg, MOP ~200 kg",
    specialNotes: "Potassium drives bunch weight; maintain mulching + drip for uniform growth."
  },
  {
    cropName: "Mango (Bearing, per tree basis scaled/acre)",
    organicFertilizers: ["FYM 100-150 kg/tree", "Compost 50 kg/tree"],
    chemicalFertilizers: ["N 1.0-1.5 kg", "P2O5 1.0 kg", "K2O 1.5 kg per tree"],
    applicationTiming: "Split pre-flowering and post-harvest; incorporate within basin",
    dosagePerAcre: "Scale by tree count (e.g., 40 trees/acre)",
    specialNotes: "Apply Zn/B sprays at pea-size fruit; maintain basin mulching."
  },
  {
    cropName: "Coffee (Arabica)",
    organicFertilizers: ["FYM 5 t", "Compost 3 t", "Coffee pulp"],
    chemicalFertilizers: ["N 20", "P2O5 15", "K2O 20", "Lime per soil test"],
    applicationTiming: "Split pre-blossom and post-monsoon",
    dosagePerAcre: "Urea ~45 kg, SSP ~95 kg, MOP ~35 kg",
    specialNotes: "Shade management + liming (pH 6-6.5) critical for uptake."
  },
  {
    cropName: "Tea",
    organicFertilizers: ["Pruned litter incorporation", "Compost 3 t", "FYM 5 t"],
    chemicalFertilizers: ["N 35-40", "P2O5 10", "K2O 30", "Sulfur 8-10 kg"],
    applicationTiming: "4-5 equal splits during active flush (Mar–Oct)",
    dosagePerAcre: "Urea ~90 kg, SSP ~45 kg, MOP ~50 kg",
    specialNotes: "Frequent light splits avoid scorch; maintain soil pH 4.5-5.5."
  },
];

// Legacy broad fallback (kept for breadth)
const STATIC_FERTILIZER_RECOMMENDATIONS: FertilizerRecommendation[] = [
  {
    cropName: "Rice",
    organicFertilizers: ["Farmyard Manure", "Green Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:26:26", "Urea", "DAP"],
    applicationTiming: "Basal application during land preparation, top dressing at tillering and panicle initiation",
    dosagePerAcre: "Organic: 5-8 tonnes/acre, Chemical: 100-150 kg/acre",
    specialNotes: "Split nitrogen application recommended. Zinc sulfate application beneficial."
  },
  {
    cropName: "Wheat",
    organicFertilizers: ["Farmyard Manure", "Compost", "Vermicompost"],
    chemicalFertilizers: ["NPK 12:32:16", "Urea"],
    applicationTiming: "50% at sowing, 25% at first irrigation, 25% at second irrigation",
    dosagePerAcre: "Organic: 4-6 tonnes/acre, Chemical: 100-120 kg/acre",
    specialNotes: "Sulfur application improves grain quality and yield."
  },
  {
    cropName: "Maize",
    organicFertilizers: ["Compost", "Green Manure"],
    chemicalFertilizers: ["NPK 20:20:0", "Urea"],
    applicationTiming: "Apply at sowing and top dress at knee-high stage",
    dosagePerAcre: "Organic: 3-5 tonnes/acre, Chemical: 80-100 kg/acre",
    specialNotes: "Zinc application helps prevent deficiency."
  },
  {
    cropName: "Cotton",
    organicFertilizers: ["Farmyard Manure", "Compost", "Neem Cake"],
    chemicalFertilizers: ["NPK 20:10:10", "Ammonium Sulfate"],
    applicationTiming: "Basal application before sowing, top dressing at flowering and boll formation",
    dosagePerAcre: "Organic: 5-10 tonnes/acre, Chemical: 80-100 kg/acre",
    specialNotes: "Foliar sprays of micronutrients during square formation increase yield."
  },
  {
    cropName: "Sugarcane",
    organicFertilizers: ["Pressmud", "Compost", "Green Manure"],
    chemicalFertilizers: ["NPK 18:18:0", "Urea"],
    applicationTiming: "Apply at planting and during tillering stage",
    dosagePerAcre: "Organic: 10-12 tonnes/acre, Chemical: 150-200 kg/acre",
    specialNotes: "Apply potash for better sugar recovery."
  },
  {
    cropName: "Groundnut",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 6:12:12", "Gypsum"],
    applicationTiming: "Apply at sowing and at flowering stage",
    dosagePerAcre: "Organic: 2-4 tonnes/acre, Chemical: 60-80 kg/acre",
    specialNotes: "Gypsum application improves pod filling and disease resistance."
  },
  {
    cropName: "Soybean",
    organicFertilizers: ["Compost", "Farmyard Manure"],
    chemicalFertilizers: ["NPK 12:32:16", "Urea"],
    applicationTiming: "Apply at sowing and at pod formation stage",
    dosagePerAcre: "Organic: 3-5 tonnes/acre, Chemical: 60-80 kg/acre",
    specialNotes: "Inoculate seeds with Rhizobium for better nitrogen fixation."
  },
  {
    cropName: "Chickpea",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:26:26", "DAP"],
    applicationTiming: "Apply at sowing",
    dosagePerAcre: "Organic: 2-3 tonnes/acre, Chemical: 40-60 kg/acre",
    specialNotes: "Phosphorus application increases root growth and yield."
  },
  {
    cropName: "Pigeonpea",
    organicFertilizers: ["Compost", "Farmyard Manure"],
    chemicalFertilizers: ["NPK 12:24:12", "Urea"],
    applicationTiming: "Apply at sowing and at flowering stage",
    dosagePerAcre: "Organic: 2-4 tonnes/acre, Chemical: 50-70 kg/acre",
    specialNotes: "Potash application improves disease resistance."
  },
  {
    cropName: "Mustard",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 15:15:15", "Urea"],
    applicationTiming: "Apply at sowing and at flowering stage",
    dosagePerAcre: "Organic: 2-3 tonnes/acre, Chemical: 40-60 kg/acre",
    specialNotes: "Sulfur application increases oil content."
  },
  {
    cropName: "Potato",
    organicFertilizers: ["Farmyard Manure", "Compost", "Vermicompost"],
    chemicalFertilizers: ["NPK 8:16:16", "Potassium Sulfate"],
    applicationTiming: "Apply at planting and during tuber formation",
    dosagePerAcre: "Organic: 5-8 tonnes/acre, Chemical: 120-150 kg/acre",
    specialNotes: "Potassium is crucial for tuber development and quality."
  },
  {
    cropName: "Tomato",
    organicFertilizers: ["Farmyard Manure", "Compost", "Vermicompost"],
    chemicalFertilizers: ["NPK 10:10:10", "Urea"],
    applicationTiming: "Apply at transplanting and top dress during flowering and fruit setting",
    dosagePerAcre: "Organic: 4-6 tonnes/acre, Chemical: 80-100 kg/acre",
    specialNotes: "Calcium application prevents blossom end rot."
  },
  {
    cropName: "Onion",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 12:16:20", "Urea"],
    applicationTiming: "Apply at planting and top dress during bulb formation",
    dosagePerAcre: "Organic: 4-5 tonnes/acre, Chemical: 100-120 kg/acre",
    specialNotes: "Sulfur application improves bulb quality and pungency."
  },
  {
    cropName: "Chilli",
    organicFertilizers: ["Farmyard Manure", "Compost", "Neem Cake"],
    chemicalFertilizers: ["NPK 18:18:18", "Urea"],
    applicationTiming: "Apply at transplanting and top dress during flowering and fruiting",
    dosagePerAcre: "Organic: 3-5 tonnes/acre, Chemical: 80-100 kg/acre",
    specialNotes: "Potassium application improves fruit quality and color."
  },
  {
    cropName: "Brinjal",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:10:10", "Urea"],
    applicationTiming: "Apply at transplanting and top dress during flowering",
    dosagePerAcre: "Organic: 4-5 tonnes/acre, Chemical: 80-100 kg/acre",
    specialNotes: "Balanced nutrition ensures continuous fruiting."
  },
  {
    cropName: "Cabbage",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 12:16:16", "Urea"],
    applicationTiming: "Apply at transplanting and top dress during head formation",
    dosagePerAcre: "Organic: 4-6 tonnes/acre, Chemical: 100-120 kg/acre",
    specialNotes: "Nitrogen is critical for head development."
  },
  {
    cropName: "Cauliflower",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 12:16:16", "Urea"],
    applicationTiming: "Apply at transplanting and top dress during curd formation",
    dosagePerAcre: "Organic: 4-6 tonnes/acre, Chemical: 100-120 kg/acre",
    specialNotes: "Boron application improves curd quality."
  },
  {
    cropName: "Okra",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:10:10", "Urea"],
    applicationTiming: "Apply at sowing and top dress during flowering",
    dosagePerAcre: "Organic: 3-4 tonnes/acre, Chemical: 60-80 kg/acre",
    specialNotes: "Regular harvesting promotes continuous fruiting."
  },
  {
    cropName: "Turmeric",
    organicFertilizers: ["Farmyard Manure", "Compost", "Neem Cake"],
    chemicalFertilizers: ["NPK 10:20:20", "Urea"],
    applicationTiming: "Apply at planting and top dress during rhizome development",
    dosagePerAcre: "Organic: 8-10 tonnes/acre, Chemical: 120-150 kg/acre",
    specialNotes: "Zinc and boron application improves rhizome yield and quality."
  },
  {
    cropName: "Ginger",
    organicFertilizers: ["Farmyard Manure", "Compost", "Neem Cake"],
    chemicalFertilizers: ["NPK 10:20:20", "Urea"],
    applicationTiming: "Apply at planting and top dress during rhizome development",
    dosagePerAcre: "Organic: 8-10 tonnes/acre, Chemical: 120-150 kg/acre",
    specialNotes: "Potassium application improves rhizome quality and storage."
  },
  {
    cropName: "Mango",
    organicFertilizers: ["Farmyard Manure", "Compost", "Vermicompost"],
    chemicalFertilizers: ["NPK 10:10:10", "Urea"],
    applicationTiming: "Apply after harvest and before flowering",
    dosagePerAcre: "Organic: 10-15 tonnes/acre, Chemical: 2-3 kg/tree",
    specialNotes: "Zinc and boron application improves fruit quality and yield."
  },
  {
    cropName: "Banana",
    organicFertilizers: ["Farmyard Manure", "Compost", "Pressmud"],
    chemicalFertilizers: ["NPK 10:20:20", "Urea"],
    applicationTiming: "Apply at planting and top dress during growth stages",
    dosagePerAcre: "Organic: 15-20 tonnes/acre, Chemical: 250-300 kg/acre",
    specialNotes: "Potassium is crucial for fruit development and quality."
  },
  {
    cropName: "Citrus",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:10:10", "Urea"],
    applicationTiming: "Apply after harvest and before flowering",
    dosagePerAcre: "Organic: 8-10 tonnes/acre, Chemical: 1.5-2 kg/tree",
    specialNotes: "Zinc and manganese application prevents deficiency symptoms."
  },
  {
    cropName: "Coconut",
    organicFertilizers: ["Farmyard Manure", "Compost", "Coir Pith"],
    chemicalFertilizers: ["NPK 12:12:17", "Urea"],
    applicationTiming: "Apply in 3-4 split doses throughout the year",
    dosagePerAcre: "Organic: 10-15 tonnes/acre, Chemical: 1.5-2 kg/tree",
    specialNotes: "Potassium application improves nut yield and quality."
  },
  {
    cropName: "Coffee",
    organicFertilizers: ["Farmyard Manure", "Compost", "Coffee Pulp"],
    chemicalFertilizers: ["NPK 12:8:8", "Urea"],
    applicationTiming: "Apply before and after monsoon",
    dosagePerAcre: "Organic: 8-10 tonnes/acre, Chemical: 1-1.5 kg/tree",
    specialNotes: "Nitrogen application improves bean quality."
  },
  {
    cropName: "Tea",
    organicFertilizers: ["Farmyard Manure", "Compost", "Tea Waste"],
    chemicalFertilizers: ["NPK 10:10:10", "Ammonium Sulfate"],
    applicationTiming: "Apply in 3-4 split doses throughout the year",
    dosagePerAcre: "Organic: 6-8 tonnes/acre, Chemical: 100-150 kg/acre",
    specialNotes: "Nitrogen is critical for leaf quality and yield."
  },
  {
    cropName: "Rubber",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:10:10", "Urea"],
    applicationTiming: "Apply before and after monsoon",
    dosagePerAcre: "Organic: 8-10 tonnes/acre, Chemical: 1-1.5 kg/tree",
    specialNotes: "Balanced nutrition ensures healthy latex production."
  },
  {
    cropName: "Jute",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:20:20", "Urea"],
    applicationTiming: "Apply at sowing and top dress during growth",
    dosagePerAcre: "Organic: 4-5 tonnes/acre, Chemical: 80-100 kg/acre",
    specialNotes: "Nitrogen application improves fiber quality."
  },
  {
    cropName: "Bajra",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:26:26", "Urea"],
    applicationTiming: "Apply at sowing and top dress during tillering",
    dosagePerAcre: "Organic: 3-4 tonnes/acre, Chemical: 60-80 kg/acre",
    specialNotes: "Drought-tolerant crop, requires less water."
  },
  {
    cropName: "Jowar",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:26:26", "Urea"],
    applicationTiming: "Apply at sowing and top dress during tillering",
    dosagePerAcre: "Organic: 3-4 tonnes/acre, Chemical: 60-80 kg/acre",
    specialNotes: "Well-suited for dryland farming."
  },
  {
    cropName: "Ragi",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:26:26", "Urea"],
    applicationTiming: "Apply at sowing and top dress during tillering",
    dosagePerAcre: "Organic: 4-5 tonnes/acre, Chemical: 60-80 kg/acre",
    specialNotes: "Rich in calcium and iron, good for health."
  },
  {
    cropName: "Black Gram",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:26:26", "DAP"],
    applicationTiming: "Apply at sowing",
    dosagePerAcre: "Organic: 2-3 tonnes/acre, Chemical: 40-50 kg/acre",
    specialNotes: "Inoculate seeds with Rhizobium for better nitrogen fixation."
  },
  {
    cropName: "Green Gram",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:26:26", "DAP"],
    applicationTiming: "Apply at sowing",
    dosagePerAcre: "Organic: 2-3 tonnes/acre, Chemical: 40-50 kg/acre",
    specialNotes: "Short-duration crop, good for crop rotation."
  },
  {
    cropName: "Sunflower",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 8:16:16", "Urea"],
    applicationTiming: "Apply at sowing and top dress during flowering",
    dosagePerAcre: "Organic: 3-4 tonnes/acre, Chemical: 60-80 kg/acre",
    specialNotes: "Boron application improves seed setting and yield."
  },
  {
    cropName: "Safflower",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 8:16:16", "Urea"],
    applicationTiming: "Apply at sowing and top dress during flowering",
    dosagePerAcre: "Organic: 3-4 tonnes/acre, Chemical: 50-70 kg/acre",
    specialNotes: "Drought-tolerant oilseed crop."
  },
  {
    cropName: "Sesame",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 8:16:16", "Urea"],
    applicationTiming: "Apply at sowing and top dress during flowering",
    dosagePerAcre: "Organic: 2-3 tonnes/acre, Chemical: 40-60 kg/acre",
    specialNotes: "Well-suited for dryland farming."
  },
  {
    cropName: "Castor",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 8:16:16", "Urea"],
    applicationTiming: "Apply at sowing and top dress during flowering",
    dosagePerAcre: "Organic: 3-4 tonnes/acre, Chemical: 60-80 kg/acre",
    specialNotes: "Industrial oilseed crop with high economic value."
  },
  {
    cropName: "Tobacco",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:20:20", "Urea"],
    applicationTiming: "Apply at transplanting and top dress during growth",
    dosagePerAcre: "Organic: 4-5 tonnes/acre, Chemical: 100-120 kg/acre",
    specialNotes: "Potassium application improves leaf quality."
  },
  {
    cropName: "Cardamom",
    organicFertilizers: ["Farmyard Manure", "Compost", "Vermicompost"],
    chemicalFertilizers: ["NPK 10:10:10", "Urea"],
    applicationTiming: "Apply in 3-4 split doses throughout the year",
    dosagePerAcre: "Organic: 8-10 tonnes/acre, Chemical: 1-1.5 kg/plant",
    specialNotes: "High-value spice crop, requires shade."
  },
  {
    cropName: "Black Pepper",
    organicFertilizers: ["Farmyard Manure", "Compost", "Neem Cake"],
    chemicalFertilizers: ["NPK 10:10:10", "Urea"],
    applicationTiming: "Apply in 3-4 split doses throughout the year",
    dosagePerAcre: "Organic: 6-8 tonnes/acre, Chemical: 1-1.5 kg/vine",
    specialNotes: "Climbing vine, requires support structure."
  },
  {
    cropName: "Cumin",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:26:26", "DAP"],
    applicationTiming: "Apply at sowing",
    dosagePerAcre: "Organic: 2-3 tonnes/acre, Chemical: 40-50 kg/acre",
    specialNotes: "Short-duration spice crop, good for intercropping."
  },
  {
    cropName: "Coriander",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:26:26", "DAP"],
    applicationTiming: "Apply at sowing",
    dosagePerAcre: "Organic: 2-3 tonnes/acre, Chemical: 40-50 kg/acre",
    specialNotes: "Fast-growing herb, good for kitchen gardens."
  },
  {
    cropName: "Fenugreek",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:26:26", "DAP"],
    applicationTiming: "Apply at sowing",
    dosagePerAcre: "Organic: 2-3 tonnes/acre, Chemical: 40-50 kg/acre",
    specialNotes: "Short-duration crop, good for crop rotation."
  },
  {
    cropName: "Carrot",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:10:10", "Urea"],
    applicationTiming: "Apply at sowing and top dress during root development",
    dosagePerAcre: "Organic: 3-4 tonnes/acre, Chemical: 60-80 kg/acre",
    specialNotes: "Potassium application improves root quality and color."
  },
  {
    cropName: "Radish",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:10:10", "Urea"],
    applicationTiming: "Apply at sowing",
    dosagePerAcre: "Organic: 2-3 tonnes/acre, Chemical: 50-60 kg/acre",
    specialNotes: "Fast-growing root vegetable."
  },
  {
    cropName: "Beetroot",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:10:10", "Urea"],
    applicationTiming: "Apply at sowing and top dress during root development",
    dosagePerAcre: "Organic: 3-4 tonnes/acre, Chemical: 60-80 kg/acre",
    specialNotes: "Potassium application improves root quality."
  },
  {
    cropName: "Spinach",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:10:10", "Urea"],
    applicationTiming: "Apply at sowing and top dress during growth",
    dosagePerAcre: "Organic: 2-3 tonnes/acre, Chemical: 50-60 kg/acre",
    specialNotes: "Nitrogen application promotes leafy growth."
  },
  {
    cropName: "Lettuce",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:10:10", "Urea"],
    applicationTiming: "Apply at transplanting and top dress during head formation",
    dosagePerAcre: "Organic: 3-4 tonnes/acre, Chemical: 60-80 kg/acre",
    specialNotes: "Nitrogen is critical for leafy growth."
  },
  {
    cropName: "Cucumber",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:10:10", "Urea"],
    applicationTiming: "Apply at transplanting and top dress during flowering",
    dosagePerAcre: "Organic: 3-4 tonnes/acre, Chemical: 60-80 kg/acre",
    specialNotes: "Regular watering is essential for fruit development."
  },
  {
    cropName: "Watermelon",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:10:10", "Urea"],
    applicationTiming: "Apply at planting and top dress during fruiting",
    dosagePerAcre: "Organic: 4-5 tonnes/acre, Chemical: 80-100 kg/acre",
    specialNotes: "Potassium application improves fruit quality and sweetness."
  },
  {
    cropName: "Muskmelon",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:10:10", "Urea"],
    applicationTiming: "Apply at planting and top dress during fruiting",
    dosagePerAcre: "Organic: 4-5 tonnes/acre, Chemical: 80-100 kg/acre",
    specialNotes: "Balanced nutrition ensures good fruit quality."
  },
  {
    cropName: "Pumpkin",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:10:10", "Urea"],
    applicationTiming: "Apply at planting and top dress during fruiting",
    dosagePerAcre: "Organic: 4-5 tonnes/acre, Chemical: 80-100 kg/acre",
    specialNotes: "Potassium application improves fruit quality."
  },
  {
    cropName: "Pea",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:26:26", "DAP"],
    applicationTiming: "Apply at sowing",
    dosagePerAcre: "Organic: 2-3 tonnes/acre, Chemical: 50-60 kg/acre",
    specialNotes: "Inoculate seeds with Rhizobium for better nitrogen fixation."
  },
  {
    cropName: "Bean",
    organicFertilizers: ["Farmyard Manure", "Compost"],
    chemicalFertilizers: ["NPK 10:26:26", "DAP"],
    applicationTiming: "Apply at sowing",
    dosagePerAcre: "Organic: 2-3 tonnes/acre, Chemical: 50-60 kg/acre",
    specialNotes: "Leguminous crop, good for soil health."
  }
];

const FertilizerRecommendations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiFertilizers, setAiFertilizers] = useState<FertilizerRecommendation[] | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<FertilizerRecommendation | null>(null);
  const [loading, setLoading] = useState(false);

  // Try to fetch fertilizer data from Supabase if available
  const { rows: fertilizers, isLoading } = useRealtimeTable<FertilizerRecommendation>(
    "fertilizer_recommendations",
    {}
  );

  useEffect(() => {
    if (!isLoading && (!fertilizers || fertilizers.length === 0)) {
      setLoading(true);
      
      // Try to fetch from Supabase edge function
      const fetchFertilizers = async () => {
        try {
          // First try Supabase function
          const { data, error } = await supabase.functions.invoke('generate-fertilizer-recommendations');
          
          if (!error && data) {
            setAiFertilizers(Array.isArray(data) ? data : []);
            setLoading(false);
            return;
          }
          
          // Fallback to direct fetch
          const response = await fetch("https://derildzszqbqbgeygznk.functions.supabase.co/generate-fertilizer-recommendations");
          if (response.ok) {
            const data = await response.json();
            setAiFertilizers(Array.isArray(data) ? data : []);
          } else {
            setAiFertilizers([]);
          }
        } catch (error) {
          console.error("Error fetching fertilizer recommendations:", error);
          setAiFertilizers([]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchFertilizers();
    }
  }, [isLoading, fertilizers]);

  const handleCropSearch = async (cropName: string) => {
    if (!cropName.trim()) return;
    
    setLoading(true);
    try {
      // First try Supabase function
      const { data, error } = await supabase.functions.invoke('generate-fertilizer-recommendations', {
        body: { cropName: cropName.trim() }
      });
      
      if (!error && data) {
        setSelectedCrop(data);
        toast({
          title: "Success",
          description: `Fertilizer recommendation for ${cropName} loaded successfully.`,
        });
        setLoading(false);
        return;
      }
      
      // Fallback to direct fetch
      const response = await fetch("https://derildzszqbqbgeygznk.functions.supabase.co/generate-fertilizer-recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cropName: cropName.trim() }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSelectedCrop(data);
        toast({
          title: "Success",
          description: `Fertilizer recommendation for ${cropName} loaded successfully.`,
        });
      } else {
        // Use static data as final fallback
        const staticData = STATIC_FERTILIZER_RECOMMENDATIONS.find(f => 
          f.cropName.toLowerCase() === cropName.trim().toLowerCase()
        );
        if (staticData) {
          setSelectedCrop(staticData);
          toast({
            title: "Success",
            description: `Fertilizer recommendation for ${cropName} loaded from database.`,
          });
        } else {
          throw new Error("Failed to get recommendation");
        }
      }
    } catch (error) {
      console.error("Error fetching specific crop recommendation:", error);
      // Use static data as fallback
      const staticData = STATIC_FERTILIZER_RECOMMENDATIONS.find(f => 
        f.cropName.toLowerCase() === cropName.trim().toLowerCase()
      );
      if (staticData) {
        setSelectedCrop(staticData);
        toast({
          title: "Success",
          description: `Fertilizer recommendation for ${cropName} loaded.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to get recommendation for this crop. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCropSearch(searchQuery);
    }
  };

  // Determine which dataset to use and filter based on search
  const displayFertilizers = fertilizers && fertilizers.length > 0
    ? fertilizers
    : aiFertilizers && aiFertilizers.length > 0
      ? aiFertilizers
      : PRIORITY_FERTILIZER_RECOMMENDATIONS.length > 0
        ? [...PRIORITY_FERTILIZER_RECOMMENDATIONS, ...STATIC_FERTILIZER_RECOMMENDATIONS]
        : STATIC_FERTILIZER_RECOMMENDATIONS;
  
  const filteredFertilizers = searchQuery 
    ? displayFertilizers.filter(item => 
        item.cropName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : displayFertilizers;

  // Main content rendering
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-agri-green-dark mb-8">Fertilizer Recommendations</h1>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Input
                type="search"
                placeholder="Search crops or enter specific crop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <Button 
              onClick={() => handleCropSearch(searchQuery)}
              disabled={loading || !searchQuery.trim()}
              className="bg-agri-green hover:bg-agri-green-dark"
            >
              Get Specific Recommendation
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Search from our database or enter a specific crop name to get tailored fertilizer recommendations
          </p>
        </div>

        {/* Show specific crop recommendation if selected */}
        {selectedCrop && (
          <Card className="p-6 mb-8 border-2 border-agri-green bg-agri-cream/20">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-agri-green rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-agri-green-dark">{selectedCrop.cropName}</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedCrop(null)}
                  >
                    Back to List
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-lg mb-2 flex items-center">
                      <Leaf className="h-5 w-5 mr-2 text-agri-green" />
                      Organic Fertilizers
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedCrop.organicFertilizers.map((item, idx) => (
                        <li key={idx} className="text-gray-700">{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-2 flex items-center">
                      <Trees className="h-5 w-5 mr-2 text-agri-green" />
                      Chemical Fertilizers
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedCrop.chemicalFertilizers.map((item, idx) => (
                        <li key={idx} className="text-gray-700">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Application Timing:</h3>
                    <p className="text-gray-700">{selectedCrop.applicationTiming}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">Dosage Per Acre:</h3>
                    <p className="text-gray-700">{selectedCrop.dosagePerAcre}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">Special Notes:</h3>
                    <p className="text-gray-700">{selectedCrop.specialNotes}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* List of fertilizer recommendations */}
        {!selectedCrop && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="p-6 h-64 animate-pulse bg-gray-100">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                </Card>
              ))
            ) : filteredFertilizers.length > 0 ? (
              filteredFertilizers.map((item, index) => (
                <Card key={index} className="p-6 hover:border-agri-green transition-colors cursor-pointer" onClick={() => setSelectedCrop(item)}>
                  <div className="w-12 h-12 bg-agri-cream rounded-full flex items-center justify-center mb-4">
                    <Sprout className="h-6 w-6 text-agri-green" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.cropName}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {item.specialNotes || `Fertilizer recommendations for ${item.cropName} cultivation.`}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {item.organicFertilizers?.slice(0, 2).map((fert, idx) => (
                      <span key={idx} className="px-2 py-1 bg-agri-cream text-agri-green-dark text-xs rounded-full">{fert}</span>
                    ))}
                    {item.organicFertilizers?.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">+{item.organicFertilizers.length - 2} more</span>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No fertilizer recommendations found. Please try a different search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FertilizerRecommendations;
