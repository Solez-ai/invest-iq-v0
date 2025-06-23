
import { useState } from 'react';
import { openRouterAPI, type ChatMessage } from '@/utils/openRouterAPI';
import { finnhubAPI } from '@/utils/finnhubAPI';
import { AIAssistantHeader } from './AIAssistant/AIAssistantHeader';
import { MessageList } from './AIAssistant/MessageList';
import { MessageInput } from './AIAssistant/MessageInput';

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

  if (!isOpen) return null;

  return (
    <div className="glass-card h-full flex flex-col">
      <AIAssistantHeader onClose={onClose} />
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput 
        input={input}
        setInput={setInput}
        onSend={handleSend}
        isLoading={isLoading}
      />
    </div>
  );
};
