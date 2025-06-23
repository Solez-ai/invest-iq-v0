
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { openRouterAPI, type ChatMessage } from '@/utils/openRouterAPI';
import { finnhubAPI } from '@/utils/finnhubAPI';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const AIAssistant = ({ isOpen, onClose }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI investment assistant. I can analyze real-time market data across US stocks, global markets, ETFs, and cryptocurrencies. Ask me about specific assets, market trends, or portfolio strategies!",
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const enhancePromptWithMarketData = async (userMessage: string): Promise<string> => {
    // Extract stock symbols from the message (including global and crypto formats)
    const stockSymbols = userMessage.match(/\b([A-Z]{1,5}|[A-Z]+:[A-Z]+|BINANCE:[A-Z]+)\b/g) || [];
    const commonAssets = {
      us: ['AAPL', 'GOOGL', 'TSLA', 'MSFT', 'NVDA'],
      global: ['NS:RELIANCE', 'NS:TCS', 'TSE:7203'],
      etfs: ['SPY', 'QQQ', 'VTI', 'GLD'],
      crypto: ['BINANCE:BTCUSDT', 'BINANCE:ETHUSDT', 'BINANCE:ADAUSDT']
    };
    
    let marketData = '';
    
    // If specific assets mentioned, get their data
    if (stockSymbols.length > 0) {
      for (const symbol of stockSymbols.slice(0, 5)) { // Limit to 5 assets
        try {
          const quote = finnhubAPI.getMockQuote(symbol);
          const assetType = symbol.includes('BINANCE:') ? 'Crypto' : 
                          symbol.includes(':') ? 'Global Stock' :
                          ['SPY', 'QQQ', 'VTI', 'GLD', 'TLT'].includes(symbol) ? 'ETF' : 'US Stock';
          
          marketData += `\n${symbol} (${assetType}) Current Data:
- Price: $${quote.c.toFixed(2)}
- Change: ${quote.d >= 0 ? '+' : ''}${quote.d.toFixed(2)} (${quote.dp.toFixed(2)}%)
- High: $${quote.h.toFixed(2)}, Low: $${quote.l.toFixed(2)}
- Previous Close: $${quote.pc.toFixed(2)}`;
        } catch (error) {
          console.error(`Error fetching ${symbol} data:`, error);
        }
      }
    } else if (userMessage.toLowerCase().includes('market') || userMessage.toLowerCase().includes('today')) {
      // General market inquiry - provide data across asset types
      const sampleAssets = [
        ...commonAssets.us.slice(0, 2),
        ...commonAssets.global.slice(0, 1),
        ...commonAssets.etfs.slice(0, 1),
        ...commonAssets.crypto.slice(0, 1)
      ];
      
      for (const symbol of sampleAssets) {
        const quote = finnhubAPI.getMockQuote(symbol);
        const assetType = symbol.includes('BINANCE:') ? 'Crypto' : 
                        symbol.includes(':') ? 'Global' :
                        ['SPY', 'QQQ', 'VTI', 'GLD'].includes(symbol) ? 'ETF' : 'US';
        
        marketData += `\n${symbol} (${assetType}): $${quote.c.toFixed(2)} (${quote.dp >= 0 ? '+' : ''}${quote.dp.toFixed(2)}%)`;
      }
    } else if (userMessage.toLowerCase().includes('crypto')) {
      // Crypto-specific inquiry
      for (const symbol of commonAssets.crypto.slice(0, 3)) {
        const quote = finnhubAPI.getMockQuote(symbol);
        marketData += `\n${symbol.replace('BINANCE:', '')}: $${quote.c.toFixed(2)} (${quote.dp >= 0 ? '+' : ''}${quote.dp.toFixed(2)}%)`;
      }
    } else if (userMessage.toLowerCase().includes('etf')) {
      // ETF-specific inquiry
      for (const symbol of commonAssets.etfs.slice(0, 3)) {
        const quote = finnhubAPI.getMockQuote(symbol);
        marketData += `\n${symbol}: $${quote.c.toFixed(2)} (${quote.dp >= 0 ? '+' : ''}${quote.dp.toFixed(2)}%)`;
      }
    }

    return `Current Market Data:${marketData}

User Question: ${userMessage}

Please provide investment advice based on the real-time data above. Consider different asset classes (US stocks, global stocks, ETFs, crypto) and emphasize risk management and diversification.`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Enhance the prompt with real market data
      const enhancedPrompt = await enhancePromptWithMarketData(input);
      
      const chatMessages: ChatMessage[] = [
        {
          role: 'system',
          content: 'You are an expert investment advisor AI that analyzes real-time market data to provide actionable investment insights. Always base your advice on the provided market data and emphasize risk management. Be concise but thorough.'
        },
        {
          role: 'user',
          content: enhancedPrompt
        }
      ];

      const response = await openRouterAPI.chat(chatMessages);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting to my analysis systems right now. Please try again in a moment.",
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="glass-card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-semibold text-white">AI Assistant</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-2 hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              
              <div
                className={cn(
                  "max-w-[80%] p-3 rounded-lg",
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                    : 'bg-white/10 text-white'
                )}
              >
                <div className="text-sm">
                  {message.role === 'assistant' ? (
                    <ReactMarkdown
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-base font-bold mb-2" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-sm font-semibold mb-2" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-sm font-medium mb-1" {...props} />,
                        p: ({node, ...props}) => <p className="mb-2 leading-relaxed" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                        em: ({node, ...props}) => <em className="italic" {...props} />,
                        code: ({node, ...props}) => {
                          const hasParent = node?.parent?.type === 'element' && node.parent.tagName === 'pre';
                          return hasParent ? 
                            <code className="block bg-white/20 p-2 rounded text-xs font-mono whitespace-pre-wrap mt-1" {...props} /> :
                            <code className="bg-white/20 px-1 py-0.5 rounded text-xs font-mono" {...props} />;
                        },
                        pre: ({node, ...props}) => <pre className="bg-white/20 p-2 rounded text-xs font-mono whitespace-pre-wrap mt-1 overflow-x-auto" {...props} />,
                        blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-white/40 pl-2 italic" {...props} />,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <span className="whitespace-pre-wrap">{message.content}</span>
                  )}
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
              
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about specific assets, market trends, or investment advice..."
            className="bg-white/10 border-white/20 text-white placeholder-white/60"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
