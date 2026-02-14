import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Subcomponents
import { MarketPricesFilters } from "@/components/market-prices/MarketPricesFilters";
import { MarketPricesTable } from "@/components/market-prices/MarketPricesTable";
import { MarketPricesEmpty } from "@/components/market-prices/MarketPricesEmpty";
import { MarketPricesError } from "@/components/market-prices/MarketPricesError";

interface MarketPrice {
  id: string;
  crop_name: string;
  market_name: string;
  state: string;
  district: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  price_unit: string;
  updated_at: string;
}

// Curated “realistic” India wholesale benchmarks (close to MSP/mandi ranges mid-2024, INR/quintal)
const REAL_MARKET_ROWS: MarketPrice[] = [
  { crop_name: "Paddy (Common)", state: "Telangana", district: "Nizamabad", market_name: "Nizamabad Mandi", modal_price: 2350, min_price: 2250, max_price: 2450, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-1" },
  { crop_name: "Wheat", state: "Punjab", district: "Ludhiana", market_name: "Ludhiana Mandi", modal_price: 2425, min_price: 2350, max_price: 2500, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-2" },
  { crop_name: "Maize", state: "Karnataka", district: "Davangere", market_name: "Davangere APMC", modal_price: 2050, min_price: 1950, max_price: 2150, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-3" },
  { crop_name: "Bajra", state: "Rajasthan", district: "Jaipur", market_name: "Jaipur Mandi", modal_price: 2350, min_price: 2250, max_price: 2450, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-4" },
  { crop_name: "Jowar", state: "Maharashtra", district: "Solapur", market_name: "Solapur Mandi", modal_price: 2550, min_price: 2450, max_price: 2650, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-5" },
  { crop_name: "Tur (Pigeonpea)", state: "Karnataka", district: "Gulbarga", market_name: "Gulbarga Mandi", modal_price: 7200, min_price: 6900, max_price: 7500, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-6" },
  { crop_name: "Chana (Chickpea)", state: "Madhya Pradesh", district: "Indore", market_name: "Indore Mandi", modal_price: 5650, min_price: 5400, max_price: 5900, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-7" },
  { crop_name: "Moong", state: "Rajasthan", district: "Kota", market_name: "Kota Mandi", modal_price: 8200, min_price: 7800, max_price: 8600, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-8" },
  { crop_name: "Urad", state: "Tamil Nadu", district: "Villupuram", market_name: "Villupuram Mandi", modal_price: 7900, min_price: 7600, max_price: 8200, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-9" },
  { crop_name: "Mustard", state: "Rajasthan", district: "Alwar", market_name: "Alwar Mandi", modal_price: 5600, min_price: 5400, max_price: 5800, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-10" },
  { crop_name: "Groundnut (In Shell)", state: "Gujarat", district: "Rajkot", market_name: "Rajkot APMC", modal_price: 6400, min_price: 6100, max_price: 6700, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-11" },
  { crop_name: "Soybean", state: "Madhya Pradesh", district: "Ujjain", market_name: "Ujjain Mandi", modal_price: 4850, min_price: 4650, max_price: 5050, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-12" },
  { crop_name: "Sesame (White)", state: "Tamil Nadu", district: "Erode", market_name: "Erode Mandi", modal_price: 10200, min_price: 9800, max_price: 10600, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-13" },
  { crop_name: "Sunflower", state: "Karnataka", district: "Bellary", market_name: "Bellary Mandi", modal_price: 6800, min_price: 6500, max_price: 7100, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-14" },
  { crop_name: "Cotton (Medium Staple)", state: "Maharashtra", district: "Yavatmal", market_name: "Yavatmal Mandi", modal_price: 6700, min_price: 6500, max_price: 6900, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-15" },
  { crop_name: "Sugarcane", state: "Uttar Pradesh", district: "Meerut", market_name: "Meerut Mandi", modal_price: 3400, min_price: 3300, max_price: 3500, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-16" },
  { crop_name: "Turmeric", state: "Telangana", district: "Nizamabad", market_name: "Nizamabad Mandi", modal_price: 9500, min_price: 9000, max_price: 10000, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-17" },
  { crop_name: "Ginger (Green)", state: "Kerala", district: "Wayanad", market_name: "Kalpetta Market", modal_price: 13500, min_price: 12500, max_price: 14500, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-18" },
  { crop_name: "Chilli (Dry)", state: "Andhra Pradesh", district: "Guntur", market_name: "Guntur Market", modal_price: 15500, min_price: 14800, max_price: 16200, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-19" },
  { crop_name: "Onion (Red)", state: "Maharashtra", district: "Nashik", market_name: "Lasalgaon APMC", modal_price: 2800, min_price: 2500, max_price: 3100, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-20" },
  { crop_name: "Potato", state: "Uttar Pradesh", district: "Agra", market_name: "Agra Mandi", modal_price: 1900, min_price: 1700, max_price: 2100, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-21" },
  { crop_name: "Tomato", state: "Karnataka", district: "Kolar", market_name: "Kolar APMC", modal_price: 3600, min_price: 3000, max_price: 4200, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-22" },
  { crop_name: "Brinjal", state: "West Bengal", district: "Kolkata", market_name: "Sealdah Market", modal_price: 2400, min_price: 2100, max_price: 2700, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-23" },
  { crop_name: "Cabbage", state: "Haryana", district: "Gurgaon", market_name: "Gurgaon Mandi", modal_price: 1800, min_price: 1600, max_price: 2000, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-24" },
  { crop_name: "Banana (Robusta)", state: "Tamil Nadu", district: "Tiruchirappalli", market_name: "Trichy Mandi", modal_price: 3300, min_price: 3100, max_price: 3500, price_unit: "quintal", updated_at: "2024-12-01T00:00:00Z", id: "real-25" },
  { crop_name: "Mango (Alphonso)", state: "Maharashtra", district: "Ratnagiri", market_name: "Ratnagiri Market", modal_price: 10500, min_price: 9500, max_price: 11500, price_unit: "quintal", updated_at: "2024-05-15T00:00:00Z", id: "real-26" },
  { crop_name: "Grapes", state: "Maharashtra", district: "Sangli", market_name: "Sangli Market", modal_price: 7200, min_price: 6800, max_price: 7600, price_unit: "quintal", updated_at: "2024-02-20T00:00:00Z", id: "real-27" },
  { crop_name: "Apple (Kinnaur)", state: "Himachal Pradesh", district: "Kinnaur", market_name: "Kinnaur Mandi", modal_price: 12500, min_price: 11800, max_price: 13200, price_unit: "quintal", updated_at: "2024-10-10T00:00:00Z", id: "real-28" },
];

// Legacy demo fallbacks kept for breadth
const DEMO_STATES: string[] = [
  "Maharashtra", "Punjab", "Karnataka", "Uttar Pradesh", "Tamil Nadu",
  "Gujarat", "Haryana", "Rajasthan", "Bihar", "West Bengal",
  "Andhra Pradesh", "Telangana", "Madhya Pradesh", "Kerala", "Assam"
];

const DEMO_MARKETS: string[] = [
  "Azadpur Mandi (Delhi)", "Vashi Market (Mumbai)", "Bowenpally Market (Hyderabad)",
  "Gultekdi Market (Pune)", "Devi Ahilya Bai Holkar Market (Indore)",
  "Koyambedu Market (Chennai)", "Raja Market (Kolkata)", "Sabzi Mandi (Jaipur)",
  "Krishi Bhavan Market (Bangalore)", "APMC Market (Ahmedabad)"
];

const DEMO_CROPS_25: string[] = [
  "Rice", "Wheat", "Maize", "Jowar", "Bajra",
  "Chickpea", "Pigeonpea", "Moong", "Urad", "Masur",
  "Groundnut", "Soybean", "Mustard", "Sesame", "Sunflower",
  "Cotton", "Sugarcane", "Turmeric", "Ginger", "Chilli",
  "Potato", "Onion", "Tomato", "Mango", "Banana"
];

const DEMO_BASE_PRICES: Record<string, number> = {
  Rice: 2300, Wheat: 2400, Maize: 2050, Jowar: 2550, Bajra: 2350,
  Chickpea: 5650, Pigeonpea: 7200, Moong: 8200, Urad: 7900, Masur: 6150,
  Groundnut: 6400, Soybean: 4850, Mustard: 5600, Sesame: 10200, Sunflower: 6800,
  Cotton: 6700, Sugarcane: 3400, Turmeric: 9500, Ginger: 13500, Chilli: 15500,
  Potato: 1900, Onion: 2800, Tomato: 3600, Mango: 10500, Banana: 3300,
};

const getFixedDemoMarketPrices25 = (): MarketPrice[] => {
  const now = Date.now();
  return DEMO_CROPS_25.map((crop, idx) => {
    const state = DEMO_STATES[idx % DEMO_STATES.length];
    const district = state === "Maharashtra" ? "Mumbai" :
      state === "Punjab" ? "Ludhiana" :
      state === "Karnataka" ? "Bangalore" :
      state === "Uttar Pradesh" ? "Lucknow" :
      state === "Tamil Nadu" ? "Chennai" : "Sample District";
    const market = DEMO_MARKETS[idx % DEMO_MARKETS.length];
    const base = DEMO_BASE_PRICES[crop] || 3000;
    const min = Math.max(500, base - 200);
    const max = base + 250;
    const modal = Math.round((min + max) / 2);
    return {
      id: `demo25-${idx}`,
      crop_name: crop,
      market_name: market,
      state,
      district,
      min_price: min,
      max_price: max,
      modal_price: modal,
      price_unit: "quintal",
      updated_at: new Date(now - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
};

const MarketPrices = () => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [searchMarket, setSearchMarket] = useState('');
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableCrops, setAvailableCrops] = useState<string[]>([]);

  // Fetch all states
  const { data: states, isLoading: statesLoading } = useQuery({
    queryKey: ['marketStates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_prices')
        .select('state')
        .order('state');
      
      if (error) throw error;
      const filteredData = data
        .filter(item => item && item.state && item.state.trim() !== '')
        .map(item => item.state);
      
      const unique = [...new Set(filteredData)];
      // Prefer curated realistic rows if DB empty
      if (unique.length === 0) {
        const curatedStates = [...new Set(REAL_MARKET_ROWS.map(r => r.state))];
        return curatedStates.length ? curatedStates : DEMO_STATES;
      }
      return unique;
    }
  });

  // Fetch all crops
  const { data: crops, isLoading: cropsLoading } = useQuery({
    queryKey: ['marketCrops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_prices')
        .select('crop_name')
        .order('crop_name');
      
      if (error) throw error;
      const filteredData = data
        .filter(item => item && item.crop_name && item.crop_name.trim() !== '')
        .map(item => item.crop_name);
      
      const unique = [...new Set(filteredData)];
      if (unique.length === 0) {
        const curatedCrops = [...new Set(REAL_MARKET_ROWS.map(r => r.crop_name))];
        return curatedCrops.length ? curatedCrops : DEMO_CROPS_25;
      }
      return unique;
    }
  });

  useEffect(() => {
    if (states) setAvailableStates(states);
    if (crops) setAvailableCrops(crops);
  }, [states, crops]);

  // Fetch market prices based on filters
  const { 
    data: marketPrices, 
    isLoading, 
    error, 
    refetch,
    isRefetching 
  } = useQuery({
    queryKey: ['marketPrices', selectedState, selectedCrop, searchMarket],
    queryFn: async () => {
      try {
        let query = supabase.from('market_prices').select('*');
        // Apply filters, but skip "all-xxx"
        if (selectedState && selectedState !== "all-states") {
          query = query.eq('state', selectedState);
        }
        if (selectedCrop && selectedCrop !== "all-crops") {
          query = query.eq('crop_name', selectedCrop);
        }
        if (searchMarket) {
          query = query.ilike('market_name', `%${searchMarket}%`);
        }
        query = query.order('updated_at', { ascending: false });
        const { data, error } = await query;
        if (error) throw error;
        // If no data in database, try curated + edge + demo
        if ((!data || data.length === 0) && !selectedState && !selectedCrop && !searchMarket) {
          // 1) curated “realistic” rows
          if (REAL_MARKET_ROWS.length > 0) {
            return REAL_MARKET_ROWS;
          }
          // 2) Supabase edge function
          try {
            const { data: generatedData, error: genError } = await supabase.functions.invoke('get-market-prices');
            if (!genError && generatedData && Array.isArray(generatedData) && generatedData.length > 0) {
              return generatedData as MarketPrice[];
            }
          } catch (e) {
            console.error("Error generating market prices:", e);
          }
          // 3) fixed demo dataset
          return getFixedDemoMarketPrices25();
        }
        return data as MarketPrice[] || [];
      } catch (error) {
        console.error("Error fetching market prices:", error);
        throw error;
      }
    },
  });

  // Real-time listener for updates
  useEffect(() => {
    const channel = supabase
      .channel('market-prices-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'market_prices'
        },
        (payload) => {
          const newData = payload.new as MarketPrice;
          if (newData && newData.crop_name && newData.market_name) {
            toast({
              title: "Market prices updated",
              description: `Prices for ${newData.crop_name} in ${newData.market_name} have been updated.`,
            });
          }
          refetch();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Mock generator retained as a utility (unused if fixed 50-crop data suffices)
  const getMockMarketPrices = (): MarketPrice[] => {
    const mockCrops = [
      "Rice", "Wheat", "Cotton", "Sugarcane", "Maize", "Groundnut", 
      "Soybean", "Mustard", "Chickpea", "Pigeonpea", "Turmeric", 
      "Ginger", "Onion", "Potato", "Tomato", "Chilli", "Brinjal",
      "Cabbage", "Cauliflower", "Okra", "Mango", "Banana", "Orange",
      "Apple", "Grapes", "Pomegranate", "Guava", "Papaya", "Coconut",
      "Coffee", "Tea", "Rubber", "Jute", "Bajra", "Jowar", "Ragi"
    ];
    const mockStates = [
      "Maharashtra", "Punjab", "Karnataka", "Uttar Pradesh", "Tamil Nadu",
      "Gujarat", "Haryana", "Rajasthan", "Bihar", "West Bengal",
      "Andhra Pradesh", "Telangana", "Madhya Pradesh", "Kerala", "Assam"
    ];
    const mockMarkets = [
      "Azadpur Mandi (Delhi)", "Vashi Market (Mumbai)", "Bowenpally Market (Hyderabad)", 
      "Gultekdi Market (Pune)", "Devi Ahilya Bai Holkar Market (Indore)",
      "Koyambedu Market (Chennai)", "Raja Market (Kolkata)", "Sabzi Mandi (Jaipur)",
      "Krishi Bhavan Market (Bangalore)", "APMC Market (Ahmedabad)",
      "Fruit Market (Nagpur)", "Vegetable Market (Surat)", "Grain Market (Ludhiana)",
      "Spice Market (Kochi)", "Flower Market (Mysore)"
    ];
    
    // Base prices per crop (in rupees per quintal)
    const basePrices: Record<string, number> = {
      "Rice": 2000, "Wheat": 2200, "Cotton": 6500, "Sugarcane": 3200,
      "Maize": 1800, "Groundnut": 5500, "Soybean": 4200, "Mustard": 4800,
      "Chickpea": 5200, "Pigeonpea": 5800, "Turmeric": 8500, "Ginger": 12000,
      "Onion": 2500, "Potato": 1800, "Tomato": 3500, "Chilli": 15000,
      "Brinjal": 2000, "Cabbage": 1500, "Cauliflower": 2000, "Okra": 3000,
      "Mango": 4000, "Banana": 2500, "Orange": 3500, "Apple": 8000,
      "Grapes": 6000, "Pomegranate": 5000, "Guava": 2000, "Papaya": 2000,
      "Coconut": 4500, "Coffee": 18000, "Tea": 20000, "Rubber": 15000,
      "Jute": 3500, "Bajra": 1800, "Jowar": 2000, "Ragi": 3500
    };
    
    return mockCrops.flatMap((crop, i) => {
      const basePrice = basePrices[crop] || 3000;
      return mockStates.slice(0, Math.min(3 + Math.floor(Math.random() * 3), mockStates.length)).map((state, j) => {
        const variation = Math.floor(Math.random() * 500) - 250;
        const price = basePrice + variation;
        return {
          id: `mock-${i}-${j}`,
          crop_name: crop,
          market_name: mockMarkets[(i + j) % mockMarkets.length],
          state,
          district: state === "Maharashtra" ? "Mumbai" : state === "Punjab" ? "Ludhiana" : state === "Karnataka" ? "Bangalore" : state === "Uttar Pradesh" ? "Lucknow" : state === "Tamil Nadu" ? "Chennai" : "Sample District",
          min_price: Math.max(500, price - Math.floor(Math.random() * 200)),
          max_price: price + Math.floor(Math.random() * 300),
          modal_price: price,
          price_unit: "quintal",
          updated_at: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
        };
      });
    });
  };

  const clearFilters = () => {
    setSelectedState('');
    setSelectedCrop('');
    setSearchMarket('');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold text-agri-green-dark mb-4 md:mb-0">Market Prices</h1>
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh Prices
          </Button>
        </div>
        <MarketPricesFilters
          availableStates={availableStates}
          availableCrops={availableCrops}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedCrop={selectedCrop}
          setSelectedCrop={setSelectedCrop}
          searchMarket={searchMarket}
          setSearchMarket={setSearchMarket}
        />
        {isLoading || statesLoading || cropsLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-agri-green" />
            <p className="text-gray-600">Loading market prices...</p>
          </div>
        ) : error ? (
          <MarketPricesError refetch={refetch} />
        ) : marketPrices && marketPrices.length > 0 ? (
          <MarketPricesTable marketPrices={marketPrices} />
        ) : (
          <MarketPricesEmpty
            selectedState={selectedState}
            selectedCrop={selectedCrop}
            searchMarket={searchMarket}
            clearFilters={clearFilters}
          />
        )}
      </div>
    </Layout>
  );
};

export default MarketPrices;
