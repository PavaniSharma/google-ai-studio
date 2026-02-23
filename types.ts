
export interface CropEntry {
  id: string;
  name: string;
  yield: number; // in Quintals or Kg
  yieldUnit: 'Quintal' | 'Kg' | 'Ton';
  estimatedCost: number; // INR
}

export interface MarketData {
  cropName: string;
  currentPrice: number; // INR per unit
  priceUnit: string;
  sourceUrls: string[];
  lastUpdated: string;
  marketTrend: 'Up' | 'Down' | 'Stable';
  analysis: string;
}

export interface CalculationResult {
  revenue: number;
  cost: number;
  profit: number;
  profitMargin: number;
  marketData: MarketData;
}
