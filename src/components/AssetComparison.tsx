import { useState, useEffect } from 'react';
import { BarChart3, Search, X, Plus, Trash2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { finnhubAPI, type StockQuote, type CompanyProfile, type NewsSentiment } from '@/utils/finnhubAPI';
import { openRouterAPI } from '@/utils/openRouterAPI';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface AssetData {
  symbol: string;
  name: string;
  type: string;
  quote?: StockQuote;
  profile?: CompanyProfile;
  sentiment?: NewsSentiment;
}

const assetCategories = {
  us: {
    label: 'US Stocks',
    icon: '🇺🇸',
    assets: ['AAPL', 'GOOGL', 'TSLA', 'MSFT', 'NVDA', 'AMZN', 'META', 'NFLX']
  },
  global: {
    label: 'Global Stocks',
    icon: '🌍',
    assets: ['NS:RELIANCE', 'NS:TCS', 'TSE:7203', 'LON:SHEL', 'EPA:MC']
  },
  etfs: {
    label: 'ETFs',
    icon: '📦',
    assets: ['SPY', 'QQQ', 'VTI', 'IWM', 'EFA', 'GLD', 'TLT']
  },
  crypto: {
    label: 'Cryptocurrency',
    icon: '₿',
    assets: ['BINANCE:BTCUSDT', 'BINANCE:ETHUSDT', 'BINANCE:ADAUSDT']
  }
};

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
      // Fetch real-time data for all selected assets
      const assetsWithData = await Promise.all(
        selectedAssets.map(asset => fetchAssetData(asset))
      );

      // Construct AI prompt
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

  const filteredAssets = Object.entries(assetCategories).reduce((acc, [key, category]) => {
    const filtered = category.assets.filter(symbol =>
      symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getAssetName(symbol).toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[key] = { ...category, assets: filtered };
    }
    return acc;
  }, {} as typeof assetCategories);

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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Asset Selection Panel */}
        <div className="xl:col-span-1 space-y-4">
          <div className="glass-card p-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">Select Assets</h2>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border"
              />
            </div>

            {/* Category Tabs */}
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="grid w-full grid-cols-4 mb-4">
                {Object.entries(assetCategories).map(([key, category]) => (
                  <TabsTrigger key={key} value={key} className="text-xs">
                    {category.icon}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(filteredAssets).map(([key, category]) => (
                <TabsContent key={key} value={key}>
                  <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                    {category.assets.map((symbol) => (
                      <div
                        key={symbol}
                        draggable
                        onDragStart={(e) => handleDragStart(e, symbol, key)}
                        className="glass-card p-3 cursor-grab hover:scale-105 transition-transform active:cursor-grabbing"
                      >
                        <div className="text-sm font-medium text-foreground">{symbol}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {getAssetName(symbol)}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        {/* Comparison Panel - Now takes more space */}
        <div className="xl:col-span-2 space-y-4">
          {/* Drop Zone */}
          <div
            className={cn(
              "glass-card p-6 border-2 border-dashed transition-all duration-200 min-h-[200px]",
              draggedOver ? "border-primary bg-primary/5" : "border-muted",
              selectedAssets.length === 0 && "flex items-center justify-center"
            )}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDraggedOver(true);
            }}
            onDragLeave={() => setDraggedOver(false)}
          >
            {selectedAssets.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Drag assets here to compare</p>
                <p className="text-sm">2-3 assets required</p>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Selected Assets ({selectedAssets.length}/3)
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAll}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {selectedAssets.map((asset) => (
                    <div key={asset.symbol} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div>
                        <div className="font-medium text-foreground">{asset.symbol}</div>
                        <div className="text-sm text-muted-foreground">{asset.name}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAsset(asset.symbol)}
                        className="text-muted-foreground hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Compare Button */}
          <Button
            onClick={handleCompare}
            disabled={selectedAssets.length < 2 || selectedAssets.length > 3 || loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Compare Assets
              </>
            )}
          </Button>

          {/* AI Response with Markdown */}
          {aiResponse && (
            <div className="glass-card p-6 animate-in fade-in-50 duration-500">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                AI Analysis
              </h3>
              <div className="text-foreground prose prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-3" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-lg font-semibold mb-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-base font-medium mb-2" {...props} />,
                    p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-3 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-3 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                    em: ({node, ...props}) => <em className="italic" {...props} />,
                    code: ({node, ...props}) => {
                      const hasParent = node?.parent?.type === 'element' && node.parent.tagName === 'pre';
                      return hasParent ? 
                        <code className="block bg-muted p-3 rounded text-sm font-mono whitespace-pre-wrap" {...props} /> :
                        <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props} />;
                    },
                    pre: ({node, ...props}) => <pre className="bg-muted p-3 rounded text-sm font-mono whitespace-pre-wrap overflow-x-auto" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic" {...props} />,
                  }}
                >
                  {aiResponse}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {!aiResponse && selectedAssets.length > 0 && (
            <div className="glass-card p-6 text-center text-muted-foreground">
              <p>Once you click "Compare Assets", the AI will analyze and respond here with detailed insights.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
