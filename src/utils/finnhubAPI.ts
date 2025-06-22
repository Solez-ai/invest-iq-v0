
// Finnhub API utilities for real-time stock data
const FINNHUB_API_KEY = 'demo'; // Users will need to replace with their key
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

export interface StockQuote {
  c: number; // current price
  d: number; // change
  dp: number; // percent change
  h: number; // high
  l: number; // low
  o: number; // open
  pc: number; // previous close
}

export interface CompanyProfile {
  country: string;
  currency: string;
  exchange: string;
  finnhubIndustry: string;
  ipo: string;
  logo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
}

export interface NewsItem {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

export interface NewsSentiment {
  buzz: {
    articlesInLastWeek: number;
    buzz: number;
    weeklyAverage: number;
  };
  companyNewsScore: number;
  sectorAverageNewsScore: number;
  sentiment: {
    bearishPercent: number;
    bullishPercent: number;
  };
  symbol: string;
}

class FinnhubAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = FINNHUB_API_KEY;
    this.baseUrl = FINNHUB_BASE_URL;
  }

  private async fetchData(endpoint: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}&token=${this.apiKey}`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Finnhub API Error:', error);
      throw error;
    }
  }

  async getQuote(symbol: string): Promise<StockQuote> {
    return this.fetchData(`/quote?symbol=${symbol}`);
  }

  async getCompanyProfile(symbol: string): Promise<CompanyProfile> {
    return this.fetchData(`/stock/profile2?symbol=${symbol}`);
  }

  async getCompanyNews(symbol: string, from?: string, to?: string): Promise<NewsItem[]> {
    const fromDate = from || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const toDate = to || new Date().toISOString().split('T')[0];
    return this.fetchData(`/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}`);
  }

  async getNewsSentiment(symbol: string): Promise<NewsSentiment> {
    return this.fetchData(`/news-sentiment?symbol=${symbol}`);
  }

  async getCandles(symbol: string, resolution: string = 'D', from?: number, to?: number): Promise<any> {
    const fromTime = from || Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);
    const toTime = to || Math.floor(Date.now() / 1000);
    return this.fetchData(`/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${fromTime}&to=${toTime}`);
  }

  async getRecommendations(symbol: string): Promise<any> {
    return this.fetchData(`/stock/recommendation?symbol=${symbol}`);
  }

  // Mock data for demo purposes when API key is not available
  getMockQuote(symbol: string): StockQuote {
    const mockData: { [key: string]: StockQuote } = {
      'AAPL': { c: 192.40, d: -1.34, dp: -0.69, h: 194.12, l: 191.75, o: 193.80, pc: 193.74 },
      'GOOGL': { c: 2847.60, d: 23.45, dp: 0.83, h: 2865.20, l: 2834.10, o: 2840.15, pc: 2824.15 },
      'TSLA': { c: 248.42, d: 12.89, dp: 5.47, h: 252.30, l: 243.67, o: 245.20, pc: 235.53 },
      'MSFT': { c: 378.85, d: -2.45, dp: -0.64, h: 382.40, l: 376.90, o: 380.25, pc: 381.30 },
      'NVDA': { c: 875.30, d: 45.67, dp: 5.50, h: 890.12, l: 850.45, o: 860.20, pc: 829.63 }
    };
    return mockData[symbol] || { c: 100, d: 0, dp: 0, h: 105, l: 95, o: 102, pc: 100 };
  }
}

export const finnhubAPI = new FinnhubAPI();
