
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
          {role === 'assistant' ? (
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-base font-bold mb-2 text-foreground" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-sm font-semibold mb-2 text-foreground" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-sm font-medium mb-1 text-foreground" {...props} />,
                p: ({node, ...props}) => <p className="mb-2 leading-relaxed text-foreground" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2 space-y-1 text-foreground" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2 space-y-1 text-foreground" {...props} />,
                li: ({node, ...props}) => <li className="leading-relaxed text-foreground" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                em: ({node, ...props}) => <em className="italic text-foreground" {...props} />,
                code: ({node, ...props}) => {
                  const hasParent = (node as any)?.parent?.type === 'element' && (node as any).parent.tagName === 'pre';
                  return hasParent ? 
                    <code className="block bg-accent p-2 rounded text-xs font-mono whitespace-pre-wrap mt-1 text-foreground" {...props} /> :
                    <code className="bg-accent px-1 py-0.5 rounded text-xs font-mono text-foreground" {...props} />;
                },
                pre: ({node, ...props}) => <pre className="bg-accent p-2 rounded text-xs font-mono whitespace-pre-wrap mt-1 overflow-x-auto text-foreground" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-border pl-2 italic text-muted-foreground" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          ) : (
            <span className="whitespace-pre-wrap">{content}</span>
          )}
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
