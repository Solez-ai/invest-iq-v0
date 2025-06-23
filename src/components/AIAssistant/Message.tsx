
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface MessageProps {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const Message = ({ content, role, timestamp }: MessageProps) => {
  return (
    <div
      className={cn(
        "flex gap-3",
        role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      {role === 'assistant' && (
        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[80%] p-3 rounded-lg",
          role === 'user'
            ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
            : 'bg-muted text-foreground border border-border'
        )}
      >
        <div className="text-sm">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className={cn("text-base font-bold mb-2", role === 'user' ? 'text-white' : 'text-foreground')} {...props} />,
              h2: ({node, ...props}) => <h2 className={cn("text-sm font-semibold mb-2", role === 'user' ? 'text-white' : 'text-foreground')} {...props} />,
              h3: ({node, ...props}) => <h3 className={cn("text-sm font-medium mb-1", role === 'user' ? 'text-white' : 'text-foreground')} {...props} />,
              p: ({node, ...props}) => <p className={cn("mb-2 leading-relaxed", role === 'user' ? 'text-white' : 'text-foreground')} {...props} />,
              ul: ({node, ...props}) => <ul className={cn("list-disc ml-4 mb-2 space-y-1", role === 'user' ? 'text-white' : 'text-foreground')} {...props} />,
              ol: ({node, ...props}) => <ol className={cn("list-decimal ml-4 mb-2 space-y-1", role === 'user' ? 'text-white' : 'text-foreground')} {...props} />,
              li: ({node, ...props}) => <li className={cn("leading-relaxed", role === 'user' ? 'text-white' : 'text-foreground')} {...props} />,
              strong: ({node, ...props}) => <strong className={cn("font-semibold", role === 'user' ? 'text-white' : 'text-foreground')} {...props} />,
              em: ({node, ...props}) => <em className={cn("italic", role === 'user' ? 'text-white' : 'text-foreground')} {...props} />,
              code: ({node, ...props}) => {
                const hasParent = (node as any)?.parent?.type === 'element' && (node as any).parent.tagName === 'pre';
                return hasParent ? 
                  <code className={cn("block p-2 rounded text-xs font-mono whitespace-pre-wrap mt-1", 
                    role === 'user' ? 'bg-black/20 text-white' : 'bg-accent text-foreground')} {...props} /> :
                  <code className={cn("px-1 py-0.5 rounded text-xs font-mono", 
                    role === 'user' ? 'bg-black/20 text-white' : 'bg-accent text-foreground')} {...props} />;
              },
              pre: ({node, ...props}) => <pre className={cn("p-2 rounded text-xs font-mono whitespace-pre-wrap mt-1 overflow-x-auto", 
                role === 'user' ? 'bg-black/20 text-white' : 'bg-accent text-foreground')} {...props} />,
              blockquote: ({node, ...props}) => <blockquote className={cn("border-l-2 pl-2 italic", 
                role === 'user' ? 'border-white/50 text-white/80' : 'border-border text-muted-foreground')} {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
        <div className={cn(
          "text-xs mt-1",
          role === 'user' ? 'text-white/70' : 'text-muted-foreground'
        )}>
          {timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
      
      {role === 'user' && (
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
};
