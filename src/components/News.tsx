
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, Clock } from 'lucide-react';
import { finnhubAPI, NewsItem } from '@/utils/finnhubAPI';

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'crypto':
      return 'bg-orange-500';
    case 'forex':
      return 'bg-green-500';
    case 'general':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString();
};

export const News = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Fetch news data with 24-hour refresh
  const { data: generalNews, isLoading: generalLoading } = useQuery({
    queryKey: ['news', 'general'],
    queryFn: () => finnhubAPI.getMarketNews('general'),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchInterval: 24 * 60 * 60 * 1000, // 24 hours
  });

  const { data: cryptoNews, isLoading: cryptoLoading } = useQuery({
    queryKey: ['news', 'crypto'],
    queryFn: () => finnhubAPI.getMarketNews('crypto'),
    staleTime: 24 * 60 * 60 * 1000,
    refetchInterval: 24 * 60 * 60 * 1000,
  });

  const { data: forexNews, isLoading: forexLoading } = useQuery({
    queryKey: ['news', 'forex'],
    queryFn: () => finnhubAPI.getMarketNews('forex'),
    staleTime: 24 * 60 * 60 * 1000,
    refetchInterval: 24 * 60 * 60 * 1000,
  });

  const allNews = [
    ...(generalNews || []),
    ...(cryptoNews || []),
    ...(forexNews || [])
  ].sort((a, b) => b.datetime - a.datetime);

  const filteredNews = (category: string) => {
    if (category === 'all') return allNews;
    return allNews.filter(item => item.category.toLowerCase() === category);
  };

  const NewsCard = ({ item }: { item: NewsItem }) => (
    <Card className="glass-card mb-4 hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-3">
          <h3 className="font-semibold text-foreground line-clamp-2 flex-1">
            {item.headline}
          </h3>
          <Badge className={`${getCategoryColor(item.category)} text-white text-xs shrink-0`}>
            {item.category}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{formatTimestamp(item.datetime)}</span>
          <span>•</span>
          <span>{item.source}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {item.image && (
          <img 
            src={item.image} 
            alt={item.headline}
            className="w-full h-32 object-cover rounded-lg mb-3"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
          {item.summary}
        </p>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium"
        >
          Read Full Article
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardContent>
    </Card>
  );

  const isLoading = generalLoading || cryptoLoading || forexLoading;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Market News</h1>
        <p className="text-muted-foreground">
          Stay updated with the latest financial market news and insights
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="general">Stocks</TabsTrigger>
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
          <TabsTrigger value="forex">Forex</TabsTrigger>
        </TabsList>

        <div className="flex-1">
          <TabsContent value="all" className="h-full mt-0">
            <ScrollArea className="h-full">
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="pr-4">
                  {filteredNews('all').map((item) => (
                    <NewsCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="general" className="h-full mt-0">
            <ScrollArea className="h-full">
              <div className="pr-4">
                {filteredNews('general').map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="crypto" className="h-full mt-0">
            <ScrollArea className="h-full">
              <div className="pr-4">
                {filteredNews('crypto').map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="forex" className="h-full mt-0">
            <ScrollArea className="h-full">
              <div className="pr-4">
                {filteredNews('forex').map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
