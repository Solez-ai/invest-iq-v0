
import { Bot, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIAssistantHeaderProps {
  onClose: () => void;
}

export const AIAssistantHeader = ({ onClose }: AIAssistantHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <h3 className="font-semibold text-foreground">AI Assistant</h3>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="p-2 hover:bg-muted"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
