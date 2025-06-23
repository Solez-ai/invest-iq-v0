
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MessageInputProps {
  input: string;
  setInput: (input: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export const MessageInput = ({ input, setInput, onSend, isLoading }: MessageInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
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
          onClick={onSend}
          disabled={!input.trim() || isLoading}
          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
