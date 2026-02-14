import React from "react";

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

// Static mapping for a few diseases
const DISEASE_DETAILS: Record<string, { description: string; image: string }> = {
  "Tomato Late Blight": {
    description: "A serious disease of tomato caused by Phytophthora infestans, leading to dark lesions on leaves and fruit.",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Tomato_late_blight.jpg"
  },
  "Rice Blast": {
    description: "A fungal disease caused by Magnaporthe oryzae, resulting in diamond-shaped lesions on rice leaves.",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Rice_blast_disease.jpg"
  },
  "Wheat Rust": {
    description: "A fungal disease causing orange-red pustules on wheat leaves and stems, reducing yield.",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Wheat_leaf_rust.jpg"
  },
  "Potato Early Blight": {
    description: "Caused by Alternaria solani, it leads to concentric brown spots on potato leaves.",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Potato_early_blight.jpg"
  },
  "Mango Black Spot": {
    description: "A bacterial disease causing black spots on mango leaves and fruit.",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Mango_black_spot.jpg"
  }
};
const DEFAULT_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/6/6e/Indian_farmer.jpg";
const DEFAULT_DESCRIPTION = "A common plant disease affecting crops in India.";

const CommonDiseasesGrid: React.FC = () => (
  <div className="mt-12 bg-agri-cream-light p-6 rounded-lg">
    <h2 className="text-xl font-bold text-agri-green-dark mb-4">
      Common Plant Diseases
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {COMMON_DISEASES.map((disease, index) => {
        const details = DISEASE_DETAILS[disease] || { description: DEFAULT_DESCRIPTION, image: DEFAULT_IMAGE };
        return (
          <div key={index} className="bg-white p-3 rounded-lg shadow-sm flex flex-col items-center">
            <img
              src={details.image}
              alt={disease}
              className="w-full h-32 object-cover rounded mb-2 border border-agri-cream"
              style={{ maxWidth: 180 }}
            />
            <p className="text-agri-green-dark font-semibold mb-1 text-center">{disease}</p>
            <p className="text-gray-600 text-sm text-center">{details.description}</p>
          </div>
        );
      })}
    </div>
  </div>
);

export default CommonDiseasesGrid;
