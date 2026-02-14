import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import DiseaseImageUpload from "@/components/disease-detection/DiseaseImageUpload";
import DiseaseAnalysisResult from "@/components/disease-detection/DiseaseAnalysisResult";
import CommonDiseasesGrid from "@/components/disease-detection/CommonDiseasesGrid";

// Add details for more diseases
const DISEASE_DETAILS: Record<string, { description: string; treatment: string }> = {
  "Tomato Late Blight": {
    description: "Late blight is a disease of tomato caused by the fungus-like oomycete pathogen Phytophthora infestans. It affects leaves, stems, and fruits, and can lead to significant yield loss if not managed properly.",
    treatment: "1. Remove affected plant parts immediately.\n2. Apply copper-based fungicide as per directions.\n3. Ensure proper spacing between plants for air circulation.\n4. Water at the base of plants, avoid wetting leaves.\n5. Plant resistant varieties in future seasons."
  },
  "Rice Blast": {
    description: "A fungal disease caused by Magnaporthe oryzae, resulting in diamond-shaped lesions on rice leaves.",
    treatment: "1. Use resistant varieties.\n2. Apply recommended fungicides.\n3. Avoid excess nitrogen fertilizer.\n4. Maintain field sanitation."
  },
  "Wheat Rust": {
    description: "A fungal disease causing orange-red pustules on wheat leaves and stems, reducing yield.",
    treatment: "1. Grow resistant varieties.\n2. Apply fungicides at the first sign of disease.\n3. Remove volunteer wheat plants."
  },
  "Cotton Leaf Curl": {
    description: "A viral disease transmitted by whiteflies, causing leaf curling and stunted growth in cotton plants.",
    treatment: "1. Use resistant varieties.\n2. Control whitefly population with neem oil or insecticides.\n3. Remove infected plants.\n4. Practice crop rotation.\n5. Maintain field hygiene."
  },
  "Potato Early Blight": {
    description: "A fungal disease causing dark brown spots with concentric rings on potato leaves, leading to defoliation.",
    treatment: "1. Use disease-free seed potatoes.\n2. Apply copper-based fungicides.\n3. Practice crop rotation (avoid planting potatoes in same field for 3-4 years).\n4. Ensure proper spacing for air circulation.\n5. Remove and destroy infected plant debris."
  },
  "Mango Black Spot": {
    description: "A fungal disease causing black spots on mango fruits and leaves, affecting fruit quality and marketability.",
    treatment: "1. Apply Bordeaux mixture or copper fungicides before flowering.\n2. Prune infected branches.\n3. Maintain orchard hygiene.\n4. Use resistant varieties.\n5. Apply fungicides at 15-day intervals during flowering."
  },
  "Banana Panama Disease": {
    description: "A soil-borne fungal disease causing wilting and death of banana plants, particularly affecting Cavendish varieties.",
    treatment: "1. Use disease-free planting material.\n2. Practice crop rotation.\n3. Improve soil drainage.\n4. Use resistant varieties.\n5. Avoid planting in infected soil for several years."
  },
  "Sugarcane Red Rot": {
    description: "A fungal disease causing red discoloration in sugarcane internodes, leading to reduced sugar content.",
    treatment: "1. Use disease-free setts.\n2. Practice crop rotation.\n3. Remove and burn infected plants.\n4. Apply fungicides to setts before planting.\n5. Maintain field sanitation."
  },
  "Maize Downy Mildew": {
    description: "A fungal disease causing white downy growth on maize leaves, leading to stunted growth and reduced yield.",
    treatment: "1. Use resistant varieties.\n2. Apply fungicides containing metalaxyl or mancozeb.\n3. Practice crop rotation.\n4. Remove infected plants.\n5. Ensure proper field drainage."
  },
  "Chilli Leaf Curl": {
    description: "A viral disease causing leaf curling, yellowing, and stunted growth in chilli plants, transmitted by whiteflies.",
    treatment: "1. Control whitefly population with yellow sticky traps.\n2. Use neem oil or insecticides.\n3. Remove infected plants.\n4. Use resistant varieties.\n5. Maintain field hygiene."
  },
  "Brinjal Phomopsis Blight": {
    description: "A fungal disease causing leaf spots and fruit rot in brinjal, leading to significant yield loss.",
    treatment: "1. Use disease-free seeds.\n2. Apply copper-based fungicides.\n3. Practice crop rotation.\n4. Remove infected plant parts.\n5. Ensure proper spacing and ventilation."
  },
  "Okra Yellow Vein Mosaic": {
    description: "A viral disease causing yellow vein patterns on okra leaves, transmitted by whiteflies.",
    treatment: "1. Control whitefly population.\n2. Remove infected plants.\n3. Use resistant varieties.\n4. Apply neem-based pesticides.\n5. Maintain field hygiene."
  },
  "Grapevine Powdery Mildew": {
    description: "A fungal disease causing white powdery growth on grape leaves and fruits, affecting quality.",
    treatment: "1. Apply sulfur-based fungicides.\n2. Prune for better air circulation.\n3. Use resistant varieties.\n4. Apply fungicides during early growth stages.\n5. Maintain proper vine spacing."
  },
  "Apple Scab": {
    description: "A fungal disease causing dark, scaly lesions on apple leaves and fruits, reducing market value.",
    treatment: "1. Apply fungicides during bud break and early growth.\n2. Prune for better air circulation.\n3. Remove fallen leaves and fruits.\n4. Use resistant varieties.\n5. Practice orchard sanitation."
  },
  "Citrus Canker": {
    description: "A bacterial disease causing raised lesions on citrus leaves, stems, and fruits, leading to fruit drop.",
    treatment: "1. Prune infected branches.\n2. Apply copper-based bactericides.\n3. Use disease-free planting material.\n4. Maintain orchard hygiene.\n5. Control leaf miner insects."
  },
  "Papaya Ring Spot": {
    description: "A viral disease causing ring spots and mosaic patterns on papaya leaves, stunting plant growth.",
    treatment: "1. Use disease-free planting material.\n2. Control aphid vectors.\n3. Remove infected plants.\n4. Maintain field hygiene.\n5. Use resistant varieties if available."
  },
  "Guava Wilt": {
    description: "A fungal disease causing wilting and death of guava trees, often starting from one branch.",
    treatment: "1. Remove and destroy infected plants.\n2. Improve soil drainage.\n3. Avoid waterlogging.\n4. Use resistant varieties.\n5. Practice crop rotation if replanting."
  },
  "Pomegranate Bacterial Blight": {
    description: "A bacterial disease causing leaf spots and fruit rot in pomegranate, leading to significant losses.",
    treatment: "1. Apply copper-based bactericides.\n2. Prune infected parts.\n3. Maintain orchard hygiene.\n4. Avoid overhead irrigation.\n5. Use disease-free planting material."
  },
  "Peanut Leaf Spot": {
    description: "A fungal disease causing brown spots on peanut leaves, leading to defoliation and reduced yield.",
    treatment: "1. Use resistant varieties.\n2. Apply fungicides containing chlorothalonil.\n3. Practice crop rotation.\n4. Remove infected plant debris.\n5. Ensure proper spacing."
  },
  "Soybean Rust": {
    description: "A fungal disease causing yellow-orange pustules on soybean leaves, reducing photosynthesis and yield.",
    treatment: "1. Apply fungicides at early pod development.\n2. Use resistant varieties.\n3. Practice crop rotation.\n4. Monitor fields regularly.\n5. Apply fungicides containing azoxystrobin or tebuconazole."
  }
};

const COMMON_DISEASES = [
  "Tomato Late Blight",
  "Rice Blast",
  "Wheat Rust",
  "Cotton Leaf Curl",
  "Potato Early Blight",
  "Mango Black Spot",
  "Banana Panama Disease",
  "Sugarcane Red Rot",
  "Maize Downy Mildew",
  "Chilli Leaf Curl",
  "Brinjal Phomopsis Blight",
  "Okra Yellow Vein Mosaic",
  "Grapevine Powdery Mildew",
  "Apple Scab",
  "Citrus Canker",
  "Papaya Ring Spot",
  "Guava Wilt",
  "Pomegranate Bacterial Blight",
  "Peanut Leaf Spot",
  "Soybean Rust",
  "Sunflower Downy Mildew",
  "Groundnut Rust",
  "Onion Purple Blotch",
  "Garlic White Rot",
  "Cabbage Black Rot",
  "Cauliflower Clubroot",
  "Carrot Alternaria Leaf Blight",
  "Cucumber Mosaic Virus",
  "Pumpkin Powdery Mildew",
  "Watermelon Anthracnose",
  "Muskmelon Downy Mildew",
  "Pea Powdery Mildew",
  "Bean Mosaic Virus",
  "Lettuce Downy Mildew",
  "Spinach White Rust",
  "Mustard Alternaria Blight",
  "Barley Stripe Rust",
  "Sorghum Ergot",
  "Pear Fire Blight",
  "Plum Pocket",
  "Cherry Leaf Spot",
  "Strawberry Leaf Spot",
  "Pineapple Heart Rot",
  "Coffee Leaf Rust",
  "Tea Blister Blight",
  "Rubber Powdery Mildew",
  "Jute Anthracnose",
  "Sesame Phyllody",
  "Linseed Rust",
  "Castor Gray Mold",
  "Tobacco Mosaic Virus"
];

const DiseaseDetection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    disease: string;
    confidence: number;
    description: string;
    treatment: string;
  } | null>(null);

  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setResult(null);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please select an image to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate API call with timeout (mock)
    setTimeout(() => {
      // Randomly select a disease for demo
      const randomDisease = COMMON_DISEASES[Math.floor(Math.random() * COMMON_DISEASES.length)];
      const details = DISEASE_DETAILS[randomDisease] || {
        description: `No detailed description available for ${randomDisease}.`,
        treatment: `1. Remove affected parts.\n2. Use recommended fungicide.\n3. Practice crop rotation.\n4. Consult local experts.`
      };
      setResult({
        disease: randomDisease,
        confidence: Math.round(80 + Math.random() * 20 * 10) / 10, // 80-100%
        description: details.description,
        treatment: details.treatment,
      });
      setIsAnalyzing(false);

      toast({
        title: "Analysis complete",
        description: "We've identified the plant disease in your image.",
        variant: "default",
      });
    }, 2000);
  };

  const clearImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setResult(null);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-agri-green-dark mb-4">Plant Disease Detection</h1>
            <p className="text-gray-600">
              Upload a photo of your plant to identify diseases and get treatment recommendations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <DiseaseImageUpload
                imagePreview={imagePreview}
                isAnalyzing={isAnalyzing}
                handleFileChange={handleFileChange}
                handleUpload={handleUpload}
                clearImage={clearImage}
              />
            </Card>

            <Card className="p-6">
              <DiseaseAnalysisResult
                isAnalyzing={isAnalyzing}
                result={result}
              />
            </Card>
          </div>
          <CommonDiseasesGrid />
        </div>
      </div>
    </Layout>
  );
};

export default DiseaseDetection;
