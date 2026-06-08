export interface GlobalMarketRow {
  symbol: string;
  name: string;
  price: number;
  change30: number;
  trend: string;
  forecast: string;
  fontColor?: string;
  backColor?: string;
}

export interface SolidWaveScannerRow {
  rank: number;
  symbol: string;
  name: string;
  price: number;
  volume: number;
  price30: number;
  momentum: number;
  patternScore: number;
  signal: 'دبل 🔥' | 'انطلاق 🚀' | 'مراقبة 🛡️';
  stopLoss: number;
  targetPrice: number;
  expectedGain: number;
}

export interface PortfolioRow {
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  price: number;
  cashTotal: number;
  profit: number;
  marketValue: number;
}

export interface ModelCriteria {
  minVolume: number;
  minFib: number;
  minScore: number;
}

export interface HistoryRow {
  date: string;
  symbol: string;
  name: string;
  entryPrice: number;
  target: number;
  result: string;
}

export interface ScriptRunLog {
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'error';
  message: string;
}

export interface TelegramAlert {
  id: string;
  timestamp: string;
  message: string;
}

export interface WaveChartColors {
  wave1: string;
  wave2: string;
  wave3: string;
  wave4: string;
  wave5: string;
  fibLevel: string;
  fibZone: string;
}

