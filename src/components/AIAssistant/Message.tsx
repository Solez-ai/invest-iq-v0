
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
            : 'bg-white/10 text-white'
        )}
      >
        <div className="text-sm">
          {role === 'assistant' ? (
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
                  const hasParent = (node as any)?.parent?.type === 'element' && (node as any).parent.tagName === 'pre';
                  return hasParent ? 
                    <code className="block bg-white/20 p-2 rounded text-xs font-mono whitespace-pre-wrap mt-1" {...props} /> :
                    <code className="bg-white/20 px-1 py-0.5 rounded text-xs font-mono" {...props} />;
                },
                pre: ({node, ...props}) => <pre className="bg-white/20 p-2 rounded text-xs font-mono whitespace-pre-wrap mt-1 overflow-x-auto" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-white/40 pl-2 italic" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          ) : (
            <span className="whitespace-pre-wrap">{content}</span>
          )}
        </div>
        <div className="text-xs opacity-70 mt-1">
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
