
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
    <div className="p-4 border-t border-border">
      <div className="flex space-x-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about specific assets, market trends, or investment advice..."
          className="min-h-[60px] resize-none bg-background border-border text-foreground placeholder:text-muted-foreground"
          disabled={isLoading}
        />
        <Button
          onClick={onSend}
          disabled={!input.trim() || isLoading}
          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 self-end"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
