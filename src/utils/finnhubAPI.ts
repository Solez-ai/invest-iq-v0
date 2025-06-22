// Finnhub API utilities for real-time stock data
const FINNHUB_API_KEY = 'd1bv6u1r01qsbpuffts0d1bv6u1r01qsbpufftsg'; // Users will need to replace with their key
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
      // Fall back to mock data if API fails
      return this.getMockDataForEndpoint(endpoint);
    }
  }

  private getMockDataForEndpoint(endpoint: string): any {
    if (endpoint.includes('/quote')) {
      const symbol = endpoint.match(/symbol=([A-Z:]+)/)?.[1] || 'AAPL';
      return this.getMockQuote(symbol);
    }
    if (endpoint.includes('/search')) {
      return this.getMockSearchResults();
    }
    return {};
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

  async searchSymbols(query: string): Promise<any> {
    return this.fetchData(`/search?q=${query}`);
  }

  async getETFHoldings(symbol: string): Promise<any> {
    return this.fetchData(`/etf/holdings?symbol=${symbol}`);
  }

  // Mock search results for demo
  getMockSearchResults(): any {
    return {
      result: [
        { symbol: 'AAPL', description: 'Apple Inc', type: 'Common Stock' },
        { symbol: 'GOOGL', description: 'Alphabet Inc Class A', type: 'Common Stock' },
        { symbol: 'TSLA', description: 'Tesla Inc', type: 'Common Stock' },
        { symbol: 'MSFT', description: 'Microsoft Corp', type: 'Common Stock' },
        { symbol: 'NVDA', description: 'NVIDIA Corp', type: 'Common Stock' },
        { symbol: 'SPY', description: 'SPDR S&P 500 ETF Trust', type: 'ETF' },
        { symbol: 'QQQ', description: 'Invesco QQQ Trust Series 1', type: 'ETF' },
        { symbol: 'NS:RELIANCE', description: 'Reliance Industries Ltd', type: 'Common Stock' },
        { symbol: 'BINANCE:BTCUSDT', description: 'Bitcoin/USDT', type: 'Cryptocurrency' },
        { symbol: 'BINANCE:ETHUSDT', description: 'Ethereum/USDT', type: 'Cryptocurrency' },
      ]
    };
  }

  // Mock data for demo purposes when API key is not available
  getMockQuote(symbol: string): StockQuote {
    const mockData: { [key: string]: StockQuote } = {
      'AAPL': { c: 192.40, d: -1.34, dp: -0.69, h: 194.12, l: 191.75, o: 193.80, pc: 193.74 },
      'GOOGL': { c: 2847.60, d: 23.45, dp: 0.83, h: 2865.20, l: 2834.10, o: 2840.15, pc: 2824.15 },
      'TSLA': { c: 248.42, d: 12.89, dp: 5.47, h: 252.30, l: 243.67, o: 245.20, pc: 235.53 },
      'MSFT': { c: 378.85, d: -2.45, dp: -0.64, h: 382.40, l: 376.90, o: 380.25, pc: 381.30 },
      'NVDA': { c: 875.30, d: 45.67, dp: 5.50, h: 890.12, l: 850.45, o: 860.20, pc: 829.63 },
      'AMZN': { c: 142.85, d: 2.34, dp: 1.67, h: 145.20, l: 141.50, o: 142.10, pc: 140.51 },
      'META': { c: 485.60, d: -5.40, dp: -1.10, h: 492.30, l: 483.90, o: 489.20, pc: 491.00 },
      'NFLX': { c: 467.25, d: 8.75, dp: 1.91, h: 470.80, l: 462.10, o: 465.30, pc: 458.50 },
      // Global stocks
      'NS:RELIANCE': { c: 2845.60, d: 45.20, dp: 1.61, h: 2860.50, l: 2835.20, o: 2840.30, pc: 2800.40 },
      'NS:TCS': { c: 3456.75, d: -23.45, dp: -0.67, h: 3480.20, l: 3445.30, o: 3465.80, pc: 3480.20 },
      'TSE:7203': { c: 2340.50, d: 12.30, dp: 0.53, h: 2355.80, l: 2335.20, o: 2342.10, pc: 2328.20 },
      // ETFs
      'SPY': { c: 472.85, d: 2.45, dp: 0.52, h: 474.20, l: 471.30, o: 472.10, pc: 470.40 },
      'QQQ': { c: 385.60, d: 3.85, dp: 1.01, h: 387.90, l: 383.20, o: 384.75, pc: 381.75 },
      'VTI': { c: 245.30, d: 1.85, dp: 0.76, h: 246.10, l: 244.20, o: 245.05, pc: 243.45 },
      'GLD': { c: 185.75, d: -0.95, dp: -0.51, h: 187.20, l: 185.10, o: 186.40, pc: 186.70 },
      // Crypto
      'BINANCE:BTCUSDT': { c: 67845.30, d: 1234.50, dp: 1.85, h: 68200.80, l: 66950.20, o: 67200.40, pc: 66610.80 },
      'BINANCE:ETHUSDT': { c: 3456.78, d: 89.45, dp: 2.66, h: 3480.20, l: 3420.50, o: 3445.80, pc: 3367.33 },
      'BINANCE:ADAUSDT': { c: 0.8945, d: 0.0234, dp: 2.69, h: 0.9120, l: 0.8820, o: 0.8890, pc: 0.8711 },
    };
    
    // Generate random variation for symbols not in mock data
    if (!mockData[symbol]) {
      const basePrice = Math.random() * 500 + 50;
      const change = (Math.random() - 0.5) * 20;
      const changePercent = (change / basePrice) * 100;
      
      return {
        c: basePrice,
        d: change,
        dp: changePercent,
        h: basePrice + Math.random() * 10,
        l: basePrice - Math.random() * 10,
        o: basePrice + (Math.random() - 0.5) * 5,
        pc: basePrice - change
      };
    }
    
    return mockData[symbol];
  }
}

export const finnhubAPI = new FinnhubAPI();
