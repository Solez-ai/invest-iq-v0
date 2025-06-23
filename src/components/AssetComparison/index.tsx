
import { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { finnhubAPI, type StockQuote, type CompanyProfile, type NewsSentiment } from '@/utils/finnhubAPI';
import { openRouterAPI } from '@/utils/openRouterAPI';
import { toast } from '@/hooks/use-toast';
import { AssetCategories, assetCategories } from './AssetCategories';
import { ComparisonDropZone } from './ComparisonDropZone';
import { AIAnalysisPanel } from './AIAnalysisPanel';

interface AssetData {
  symbol: string;
  name: string;
  type: string;
  quote?: StockQuote;
  profile?: CompanyProfile;
  sentiment?: NewsSentiment;
}

interface AssetCategory {
  label: string;
  icon: string;
  assets: string[];
}

export const AssetComparison = () => {
  const [selectedAssets, setSelectedAssets] = useState<AssetData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('us');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [draggedOver, setDraggedOver] = useState(false);

  const getAssetName = (symbol: string) => {
    const nameMap: { [key: string]: string } = {
      'AAPL': 'Apple Inc.',
      'GOOGL': 'Alphabet Inc.',
      'TSLA': 'Tesla Inc.',
      'MSFT': 'Microsoft Corp.',
      'NVDA': 'NVIDIA Corp.',
      'AMZN': 'Amazon.com Inc.',
      'META': 'Meta Platforms',
      'NFLX': 'Netflix Inc.',
      'NS:RELIANCE': 'Reliance Industries',
      'NS:TCS': 'Tata Consultancy Services',
      'TSE:7203': 'Toyota Motor Corp',
      'SPY': 'SPDR S&P 500 ETF',
      'QQQ': 'Invesco QQQ Trust',
      'VTI': 'Vanguard Total Stock Market',
      'BINANCE:BTCUSDT': 'Bitcoin',
      'BINANCE:ETHUSDT': 'Ethereum',
      'BINANCE:ADAUSDT': 'Cardano',
    };
    return nameMap[symbol] || symbol;
  };

  const handleDragStart = (e: React.DragEvent, symbol: string, type: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ symbol, type }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(false);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { symbol, type } = data;
      
      if (selectedAssets.length >= 3) {
        toast({
          title: "Maximum assets reached",
          description: "You can compare up to 3 assets at once.",
          variant: "destructive"
        });
        return;
      }
      
      if (selectedAssets.some(asset => asset.symbol === symbol)) {
        toast({
          title: "Asset already selected",
          description: "This asset is already in the comparison.",
          variant: "destructive"
        });
        return;
      }
      
      const newAsset: AssetData = {
        symbol,
        name: getAssetName(symbol),
        type
      };
      
      setSelectedAssets(prev => [...prev, newAsset]);
      toast({
        title: "Asset added",
        description: `${getAssetName(symbol)} added to comparison.`
      });
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const removeAsset = (symbol: string) => {
    setSelectedAssets(prev => prev.filter(asset => asset.symbol !== symbol));
  };

  const clearAll = () => {
    setSelectedAssets([]);
    setAiResponse('');
  };

  const fetchAssetData = async (asset: AssetData): Promise<AssetData> => {
    try {
      const [quote, profile, sentiment] = await Promise.all([
        finnhubAPI.getQuote(asset.symbol),
        finnhubAPI.getCompanyProfile(asset.symbol),
        finnhubAPI.getNewsSentiment(asset.symbol)
      ]);
      
      return { ...asset, quote, profile, sentiment };
    } catch (error) {
      console.error(`Error fetching data for ${asset.symbol}:`, error);
      return asset;
    }
  };

  const handleCompare = async () => {
    if (selectedAssets.length < 2 || selectedAssets.length > 3) {
      toast({
        title: "Invalid selection",
        description: "Please select 2-3 assets to compare.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setAiResponse('');

    try {
      const assetsWithData = await Promise.all(
        selectedAssets.map(asset => fetchAssetData(asset))
      );

      const assetSummaries = assetsWithData.map(asset => {
        const change = asset.quote ? asset.quote.dp : 0;
        const sentiment = asset.sentiment?.sentiment ? 
          `${asset.sentiment.sentiment.bullishPercent}% Bullish, ${asset.sentiment.sentiment.bearishPercent}% Bearish` : 
          'Neutral';
        
        return `${asset.symbol} (${asset.name}):
- Price: $${asset.quote?.c?.toFixed(2) || 'N/A'} (${change > 0 ? '+' : ''}${change?.toFixed(2) || '0'}%)
- Sentiment: ${sentiment}
- Market Cap: ${asset.profile?.marketCapitalization ? `$${(asset.profile.marketCapitalization / 1000).toFixed(1)}B` : 'N/A'}
- Exchange: ${asset.profile?.exchange || 'N/A'}`;
      }).join('\n\n');

      const prompt = `Compare these ${assetsWithData.length} assets for investment potential:

${assetSummaries}

Based on this real-time data, provide a clear analysis covering:
1. Which asset is better for short-term trading vs long-term holding
2. Risk assessment for each asset
3. Key factors driving current performance
4. Your recommendation with reasoning

Keep your response concise (5-8 bullet points) and actionable.`;

      const aiResult = await openRouterAPI.chat([
        { role: 'system', content: 'You are an expert financial analyst providing clear, data-driven investment comparisons.' },
        { role: 'user', content: prompt }
      ]);

      setAiResponse(aiResult);
      
    } catch (error) {
      console.error('Error during comparison:', error);
      toast({
        title: "Comparison failed",
        description: "Unable to fetch data or analyze assets. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets: { [key: string]: AssetCategory } = Object.entries(assetCategories).reduce((acc, [key, category]) => {
    const filtered = category.assets.filter(symbol =>
      symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getAssetName(symbol).toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[key] = { ...category, assets: filtered };
    }
    return acc;
  }, {} as { [key: string]: AssetCategory });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <BarChart3 className="h-8 w-8" />
            Compare Assets
          </h1>
          <p className="text-muted-foreground">Drag and drop assets to compare with AI analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Asset Selection Panel */}
        <div className="xl:col-span-2 space-y-4">
          <AssetCategories
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            filteredAssets={filteredAssets}
            getAssetName={getAssetName}
            handleDragStart={handleDragStart}
          />
        </div>

        {/* Comparison Panel */}
        <div className="xl:col-span-3 space-y-4">
          <ComparisonDropZone
            selectedAssets={selectedAssets}
            draggedOver={draggedOver}
            setDraggedOver={setDraggedOver}
            handleDrop={handleDrop}
            removeAsset={removeAsset}
            clearAll={clearAll}
            handleCompare={handleCompare}
            loading={loading}
          />

          <AIAnalysisPanel
            aiResponse={aiResponse}
            selectedAssets={selectedAssets}
          />
        </div>
      </div>
    </div>
  );
};
