
export interface HouseFeatures {
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  locationQuality: 'low' | 'medium' | 'high' | 'luxury';
  lotSize?: number;
}

export interface PredictionResult {
  estimatedPrice: number;
  confidenceScore: number;
  marketTrend: string;
  featuresUsed: HouseFeatures;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: Date;
  prediction?: PredictionResult;
}
