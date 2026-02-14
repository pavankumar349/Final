import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { BookOpen, Calendar, Search, Leaf, Trees } from 'lucide-react';
import { useRealtimeTable } from "@/hooks/useRealtimeTable";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface TraditionalPractice {
  id?: string;
  title: string;
  description: string;
  category: string;
  season: string;
  benefits?: string;
  regions?: string[];
  [key: string]: unknown;
}

const staticPracticesDemo: TraditionalPractice[] = [
  { id: "1", title: "Zero Tillage", description: "Growing crops without disturbing the soil through tillage.", category: "Technique", season: "Year-round", benefits: "Reduces soil erosion and conserves moisture.", regions: ["Punjab", "Haryana"] },
  { id: "2", title: "Drip Irrigation", description: "Supplying water directly to the plant roots through a network of pipes.", category: "Irrigation", season: "Summer", benefits: "Saves water and increases yield.", regions: ["Maharashtra", "Gujarat"] },
  { id: "3", title: "Vermicomposting", description: "Using earthworms to convert organic waste into fertilizer.", category: "Soil care", season: "Year-round", benefits: "Improves soil fertility and structure.", regions: ["Kerala", "Tamil Nadu"] },
  { id: "4", title: "Agroforestry", description: "Integrating trees and shrubs into crop and animal farming systems.", category: "Technique", season: "Year-round", benefits: "Enhances biodiversity and provides additional income.", regions: ["Karnataka", "Odisha"] },
  { id: "5", title: "Mulching", description: "Covering the soil with organic material to retain moisture.", category: "Soil care", season: "Summer", benefits: "Reduces evaporation and suppresses weeds.", regions: ["Andhra Pradesh"] },
  { id: "6", title: "Crop Rotation", description: "Growing different crops in succession on the same land.", category: "Technique", season: "Year-round", benefits: "Breaks pest cycles and improves soil health.", regions: ["Uttar Pradesh"] },
  { id: "7", title: "Contour Ploughing", description: "Ploughing along the contour lines to reduce soil erosion.", category: "Soil care", season: "Monsoon", benefits: "Prevents runoff and conserves water.", regions: ["Himachal Pradesh"] },
  { id: "8", title: "Intercropping", description: "Growing two or more crops together in the same field.", category: "Technique", season: "Year-round", benefits: "Maximizes land use and reduces pest risk.", regions: ["Madhya Pradesh"] },
  { id: "9", title: "Organic Manuring", description: "Applying organic manure to improve soil fertility.", category: "Soil care", season: "Year-round", benefits: "Enhances soil nutrients and structure.", regions: ["Bihar"] },
  { id: "10", title: "Rainwater Harvesting", description: "Collecting and storing rainwater for irrigation.", category: "Irrigation", season: "Monsoon", benefits: "Ensures water availability during dry spells.", regions: ["Rajasthan"] },
  { id: "11", title: "Green Manuring", description: "Growing plants to be ploughed under for soil enrichment.", category: "Soil care", season: "Monsoon", benefits: "Improves soil organic matter.", regions: ["West Bengal"] },
  { id: "12", title: "System of Rice Intensification (SRI)", description: "A method to increase rice yields with less water.", category: "Technique", season: "Monsoon", benefits: "Boosts yield and saves water.", regions: ["Tamil Nadu"] },
  { id: "13", title: "Trap Cropping", description: "Planting crops to attract pests away from main crops.", category: "Pest control", season: "Year-round", benefits: "Reduces pest damage to main crops.", regions: ["Gujarat"] },
  { id: "14", title: "Biofertilizers", description: "Using living organisms to enhance soil fertility.", category: "Soil care", season: "Year-round", benefits: "Promotes sustainable agriculture.", regions: ["Punjab"] },
  { id: "15", title: "Flood Irrigation", description: "Irrigating fields by flooding them with water.", category: "Irrigation", season: "Summer", benefits: "Simple and cost-effective for certain crops.", regions: ["Uttar Pradesh"] },
  { id: "16", title: "Manual Weeding", description: "Removing weeds by hand or simple tools.", category: "Technique", season: "Year-round", benefits: "Reduces competition for nutrients.", regions: ["Kerala"] },
  { id: "17", title: "Neem-based Pest Control", description: "Using neem extracts to control pests.", category: "Pest control", season: "Year-round", benefits: "Eco-friendly and safe for crops.", regions: ["Andhra Pradesh"] },
  { id: "18", title: "Sprinkler Irrigation", description: "Applying water to crops using sprinklers.", category: "Irrigation", season: "Summer", benefits: "Uniform water distribution.", regions: ["Haryana"] },
  { id: "19", title: "Seed Treatment", description: "Treating seeds with fungicides or bioagents before sowing.", category: "Technique", season: "Year-round", benefits: "Prevents seed-borne diseases.", regions: ["Maharashtra"] },
  { id: "20", title: "Mixed Cropping", description: "Growing two or more crops simultaneously on the same land.", category: "Technique", season: "Year-round", benefits: "Reduces risk of crop failure.", regions: ["Madhya Pradesh"] },
  { id: "21", title: "Stubble Mulching", description: "Leaving crop residues on the field after harvest.", category: "Soil care", season: "Winter", benefits: "Reduces evaporation and soil erosion.", regions: ["Punjab"] },
  { id: "22", title: "Check Dams", description: "Small barriers built across streams to slow water flow.", category: "Irrigation", season: "Monsoon", benefits: "Improves groundwater recharge.", regions: ["Rajasthan"] },
  { id: "23", title: "Solar Drying", description: "Using solar energy to dry crops post-harvest.", category: "Technique", season: "Summer", benefits: "Reduces post-harvest losses.", regions: ["Tamil Nadu"] },
  { id: "24", title: "Cow Dung Manure", description: "Using cow dung as a natural fertilizer.", category: "Soil care", season: "Year-round", benefits: "Improves soil fertility.", regions: ["Bihar"] },
  { id: "25", title: "Furrow Irrigation", description: "Watering crops through small parallel channels.", category: "Irrigation", season: "Summer", benefits: "Efficient for row crops.", regions: ["Gujarat"] },
  { id: "26", title: "Pheromone Traps", description: "Using pheromones to attract and trap pests.", category: "Pest control", season: "Year-round", benefits: "Reduces pest population.", regions: ["Maharashtra"] },
  { id: "27", title: "Cover Cropping", description: "Growing crops to cover soil and prevent erosion.", category: "Soil care", season: "Winter", benefits: "Improves soil health and prevents erosion.", regions: ["Himachal Pradesh"] },
  { id: "28", title: "Sprouted Seed Planting", description: "Planting pre-sprouted seeds for better germination.", category: "Technique", season: "Monsoon", benefits: "Ensures uniform crop stand.", regions: ["West Bengal"] },
  { id: "29", title: "Hand Pollination", description: "Manually transferring pollen to improve fruit set.", category: "Technique", season: "Summer", benefits: "Increases yield in some crops.", regions: ["Kerala"] },
  { id: "30", title: "Fish Farming Integration", description: "Combining fish farming with crop cultivation.", category: "Technique", season: "Year-round", benefits: "Diversifies farm income.", regions: ["Odisha"] },
  { id: "31", title: "Spray Irrigation", description: "Spraying water over crops using pipes and nozzles.", category: "Irrigation", season: "Summer", benefits: "Efficient for large fields.", regions: ["Punjab"] },
  { id: "32", title: "Bio-pesticides", description: "Using natural organisms to control pests.", category: "Pest control", season: "Year-round", benefits: "Reduces chemical use.", regions: ["Andhra Pradesh"] },
  { id: "33", title: "Deep Ploughing", description: "Turning over the soil deeply to control weeds and pests.", category: "Soil care", season: "Summer", benefits: "Improves soil aeration.", regions: ["Haryana"] },
  { id: "34", title: "Windbreaks", description: "Planting trees to protect crops from wind damage.", category: "Technique", season: "Year-round", benefits: "Reduces wind erosion.", regions: ["Rajasthan"] },
  { id: "35", title: "Sprouted Paddy Transplanting", description: "Transplanting sprouted paddy seedlings.", category: "Technique", season: "Monsoon", benefits: "Improves rice yield.", regions: ["West Bengal"] },
  { id: "36", title: "Organic Pest Repellents", description: "Using plant extracts to repel pests.", category: "Pest control", season: "Year-round", benefits: "Safe for environment.", regions: ["Kerala"] },
  { id: "37", title: "Raised Bed Planting", description: "Planting crops on raised soil beds.", category: "Technique", season: "Monsoon", benefits: "Improves drainage and root growth.", regions: ["Punjab"] },
  { id: "38", title: "Flooded Rice Fields", description: "Maintaining standing water in rice fields.", category: "Irrigation", season: "Monsoon", benefits: "Controls weeds and pests in rice.", regions: ["Tamil Nadu"] },
  { id: "39", title: "Soil Solarization", description: "Using solar heat to disinfect soil before planting.", category: "Soil care", season: "Summer", benefits: "Reduces soil-borne diseases.", regions: ["Gujarat"] },
  { id: "40", title: "Manual Harvesting", description: "Harvesting crops by hand for better quality.", category: "Technique", season: "Year-round", benefits: "Reduces crop damage.", regions: ["Bihar"] },
  { id: "41", title: "Sprouted Wheat Sowing", description: "Sowing sprouted wheat seeds for better germination.", category: "Technique", season: "Winter", benefits: "Ensures uniform crop stand.", regions: ["Punjab"] },
  { id: "42", title: "Organic Mulching", description: "Using organic materials to mulch crops.", category: "Soil care", season: "Summer", benefits: "Conserves soil moisture.", regions: ["Maharashtra"] },
  { id: "43", title: "Integrated Pest Management", description: "Combining biological, cultural, and chemical methods for pest control.", category: "Pest control", season: "Year-round", benefits: "Reduces pesticide use.", regions: ["Karnataka"] },
  { id: "44", title: "Sprouted Maize Planting", description: "Planting sprouted maize seeds for better germination.", category: "Technique", season: "Summer", benefits: "Ensures uniform crop stand.", regions: ["Madhya Pradesh"] },
  { id: "45", title: "Water Channeling", description: "Creating channels for efficient water distribution.", category: "Irrigation", season: "Monsoon", benefits: "Prevents waterlogging.", regions: ["Uttar Pradesh"] },
  { id: "46", title: "Organic Seed Treatment", description: "Treating seeds with organic agents before sowing.", category: "Technique", season: "Year-round", benefits: "Prevents seed-borne diseases.", regions: ["Bihar"] },
  { id: "47", title: "Sprouted Barley Sowing", description: "Sowing sprouted barley seeds for better germination.", category: "Technique", season: "Winter", benefits: "Ensures uniform crop stand.", regions: ["Punjab"] },
  { id: "48", title: "Manual Threshing", description: "Threshing crops by hand to separate grain.", category: "Technique", season: "Year-round", benefits: "Reduces grain loss.", regions: ["Haryana"] },
  { id: "49", title: "Organic Composting", description: "Making compost from farm waste.", category: "Soil care", season: "Year-round", benefits: "Improves soil fertility.", regions: ["Kerala"] },
  { id: "50", title: "Sprouted Pulse Sowing", description: "Sowing sprouted pulse seeds for better germination.", category: "Technique", season: "Monsoon", benefits: "Ensures uniform crop stand.", regions: ["Madhya Pradesh"] },
];

// Dynamic image resolver: use known images when available, else an Unsplash query
const STATIC_PRACTICE_IMAGES: Record<string, string> = {
  'Zero Tillage': 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Zero_tillage_wheat.jpg',
  'Drip Irrigation': 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Drip_Irrigation.JPG',
  'Vermicomposting': 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Vermicompost.jpg',
  'Agroforestry': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Agroforestry_example.jpg',
  'Mulching': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Mulching_in_agriculture.jpg',
  'Crop Rotation': 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Crop_rotation_diagram.png',
  'Contour Ploughing': 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Contour_ploughing.jpg',
  'Intercropping': 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Intercropping.jpg',
  'Organic Manuring': 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Organic_fertilizer.jpg',
  'Rainwater Harvesting': 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Rainwater_harvesting.jpg',
};
const getPracticeImage = (title: string) =>
  STATIC_PRACTICE_IMAGES[title] || `https://source.unsplash.com/800x600/?${encodeURIComponent(title + ' agriculture')}`;
const DEFAULT_IMAGE = 'https://source.unsplash.com/800x600/?indian%20farmer';

const TraditionalPractices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPractice, setSelectedPractice] = useState<TraditionalPractice | null>(null);

  const { rows: practices, isLoading } = useRealtimeTable<TraditionalPractice>(
    "traditional_practices",
    {}
  );
  const [aiCrops, setAiCrops] = React.useState<TraditionalPractice[] | null>(null);

  React.useEffect(() => {
    if (!isLoading && (!practices || practices.length === 0)) {
      // Try to fetch from Supabase backend first
      const fetchPractices = async () => {
        try {
          // First try Supabase function
          const { data, error } = await supabase.functions.invoke('generate-traditional-practices-large');
          
          if (!error && data && Array.isArray(data) && data.length > 0) {
            setAiCrops(data);
            return;
          }
          
          // Fallback to direct fetch
          const response = await fetch("https://derildzszqbqbgeygznk.functions.supabase.co/generate-traditional-practices-large");
          if (response.ok) {
            const data = await response.json();
            setAiCrops(Array.isArray(data) && data.length > 0 ? data : staticPracticesDemo);
          } else {
            setAiCrops(staticPracticesDemo);
          }
        } catch (error) {
          console.error("Error fetching traditional practices:", error);
          setAiCrops(staticPracticesDemo);
        }
      };
      
      fetchPractices();
    }
  }, [isLoading, practices]);

  const displayPractices =
    practices && practices.length > 0
      ? practices
      : aiCrops
        ? aiCrops
        : staticPracticesDemo;
  
  // Filter based on search
  const filteredPractices = (searchQuery 
    ? displayPractices.filter(practice => 
        (practice.title?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
        (practice.category?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
        (practice.description?.toLowerCase() ?? "").includes(searchQuery.toLowerCase())
      )
    : displayPractices
  ).slice(0, 50);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-agri-green-dark mb-8">Traditional Farming Practices</h1>

        <div className="relative mb-8 max-w-md">
          <Input
            type="search"
            placeholder="Search practices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>

        {selectedPractice ? (
          <div className="mb-8">
            <Card className="p-6 border-2 border-agri-green">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-agri-cream rounded-full flex items-center justify-center mr-4">
                    <BookOpen className="h-6 w-6 text-agri-green" />
                  </div>
                  <h2 className="text-2xl font-bold">{selectedPractice.title}</h2>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedPractice(null)}
                >
                  Back to List
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">Description</h3>
                  <p className="text-gray-700 mb-4">{selectedPractice.description}</p>
                  
                  {selectedPractice.benefits && (
                    <>
                      <h3 className="font-bold text-lg mb-2">Benefits</h3>
                      <p className="text-gray-700 mb-4">{selectedPractice.benefits}</p>
                    </>
                  )}
                </div>
                <div>
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2">Category</h3>
                    <div className="flex items-center text-gray-700">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>{selectedPractice.category}</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2">Best Season</h3>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{selectedPractice.season}</span>
                    </div>
                  </div>
                  {selectedPractice.regions && (
                    <div>
                      <h3 className="font-bold text-lg mb-2">Regions</h3>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(selectedPractice.regions) ? selectedPractice.regions.map((region: string, index: number) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-agri-cream text-agri-green-dark text-sm rounded-full"
                          >
                            {region}
                          </span>
                        )) : (
                          <span className="text-gray-700">Information not available</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPractices.map((practice) => (
              <Card 
                key={practice.id} 
                className="p-6 hover:border-agri-green hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedPractice(practice)}
              >
                <img
                  src={getPracticeImage(practice.title) || DEFAULT_IMAGE}
                  alt={practice.title}
                  className="w-full h-40 object-cover rounded-lg mb-4 border border-agri-cream"
                />
                <div className="w-12 h-12 bg-agri-cream rounded-full flex items-center justify-center mb-4">
                  {practice.category?.toLowerCase().includes('water') ? (
                    <Trees className="h-6 w-6 text-agri-green" />
                  ) : practice.category?.toLowerCase().includes('pest') ? (
                    <Leaf className="h-6 w-6 text-agri-green" />
                  ) : (
                    <BookOpen className="h-6 w-6 text-agri-green" />
                  )}
                </div>
                <h3 className="font-bold text-lg mb-2">{practice.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{practice.description}</p>
                <div className="flex items-center text-sm text-gray-500 mt-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{practice.season}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>{practice.category}</span>
                </div>
              </Card>
            ))}
            {filteredPractices.length === 0 && (
              <div className="col-span-3 text-center py-10">
                <p>No practices found for "{searchQuery}". Try a different search term.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};
export default TraditionalPractices;
