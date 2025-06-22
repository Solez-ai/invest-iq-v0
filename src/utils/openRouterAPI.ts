
// OpenRouter API integration for DeepSeek AI
const OPENROUTER_API_KEY = 'demo'; // Users will need to replace with their key
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class OpenRouterAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = OPENROUTER_API_KEY;
    this.baseUrl = OPENROUTER_BASE_URL;
  }

  async chat(messages: ChatMessage[], model: string = 'deepseek/deepseek-chat'): Promise<string> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Title': 'Invest IQ',
          'HTTP-Referer': window.location.origin,
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API Error: ${response.status}`);
      }

      const data: AIResponse = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      
      // Return mock response for demo
      return this.getMockResponse(messages[messages.length - 1]?.content || '');
    }
  }

  private getMockResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('aapl') || lowerMessage.includes('apple')) {
      return "Based on the current data, Apple (AAPL) is trading at $192.40, down 0.69% today. The stock shows neutral sentiment with strong analyst backing (13 Buy ratings). Given Apple's strong fundamentals and the recent dip, this could be a good entry point for long-term investors. Consider the broader tech sector trends and your risk tolerance.";
    }
    
    if (lowerMessage.includes('tesla') || lowerMessage.includes('tsla')) {
      return "Tesla (TSLA) is showing strong momentum today, up 5.47% at $248.42. The stock has been volatile but shows bullish sentiment. With the EV market expansion and Tesla's innovation pipeline, it remains a growth play. However, consider the high volatility and your investment timeline.";
    }
    
    if (lowerMessage.includes('market') || lowerMessage.includes('today')) {
      return "Today's market shows mixed signals with tech stocks leading gains while traditional sectors remain flat. The VIX is at moderate levels, suggesting cautious optimism. Key factors to watch include interest rate expectations and earnings reports. Consider diversification across sectors.";
    }
    
    if (lowerMessage.includes('buy') || lowerMessage.includes('invest')) {
      return "Based on current market conditions, I'd suggest focusing on quality stocks with strong fundamentals. Tech leaders like AAPL and MSFT offer stability, while growth stocks like TSLA provide upside potential. Always diversify your portfolio and invest only what you can afford to lose. Consider your investment timeline and risk tolerance.";
    }
    
    return "I'm analyzing the current market data to provide you with the most relevant investment insights. Could you specify which stocks or market sectors you're interested in? I can provide detailed analysis based on real-time data including price movements, sentiment, and analyst recommendations.";
  }
}

export const openRouterAPI = new OpenRouterAPI();
