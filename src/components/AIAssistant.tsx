
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { openRouterAPI, type ChatMessage } from '@/utils/openRouterAPI';
import { finnhubAPI } from '@/utils/finnhubAPI';
import { cn } from '@/lib/utils';

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
      content: "Hi! I'm your AI investment assistant. I can analyze real-time market data and help you make informed investment decisions. Ask me about stocks, market trends, or any investment questions!",
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
    // Extract stock symbols from the message
    const stockSymbols = userMessage.match(/\b[A-Z]{1,5}\b/g) || [];
    const commonStocks = ['AAPL', 'GOOGL', 'TSLA', 'MSFT', 'NVDA'];
    
    let marketData = '';
    
    // If specific stocks mentioned, get their data
    if (stockSymbols.length > 0) {
      for (const symbol of stockSymbols.slice(0, 3)) { // Limit to 3 stocks
        try {
          const quote = finnhubAPI.getMockQuote(symbol);
          marketData += `\n${symbol} Current Data:
- Price: $${quote.c.toFixed(2)}
- Change: ${quote.d >= 0 ? '+' : ''}${quote.d.toFixed(2)} (${quote.dp.toFixed(2)}%)
- High: $${quote.h.toFixed(2)}, Low: $${quote.l.toFixed(2)}
- Previous Close: $${quote.pc.toFixed(2)}`;
        } catch (error) {
          console.error(`Error fetching ${symbol} data:`, error);
        }
      }
    } else if (userMessage.toLowerCase().includes('market') || userMessage.toLowerCase().includes('today')) {
      // General market inquiry - provide data for major stocks
      for (const symbol of commonStocks.slice(0, 3)) {
        const quote = finnhubAPI.getMockQuote(symbol);
        marketData += `\n${symbol}: $${quote.c.toFixed(2)} (${quote.dp >= 0 ? '+' : ''}${quote.dp.toFixed(2)}%)`;
      }
    }

    return `Current Market Data:${marketData}

User Question: ${userMessage}

Please provide investment advice based on the real-time data above. Be specific and actionable while emphasizing risk management.`;
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
                <div className="text-sm whitespace-pre-wrap">
                  {message.content}
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
            placeholder="Ask about stocks, market trends, or investment advice..."
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
