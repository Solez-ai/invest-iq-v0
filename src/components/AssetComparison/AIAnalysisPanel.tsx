
import { Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIAnalysisPanelProps {
  aiResponse: string;
  selectedAssets: any[];
}

export const AIAnalysisPanel = ({ aiResponse, selectedAssets }: AIAnalysisPanelProps) => {
  if (aiResponse) {
    return (
      <div className="glass-card p-6 animate-in fade-in-50 duration-500">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          AI Analysis
        </h3>
        <div className="text-foreground prose prose-invert max-w-none">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-3" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-lg font-semibold mb-2" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-base font-medium mb-2" {...props} />,
              p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-3 space-y-1" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-3 space-y-1" {...props} />,
              li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
              strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
              em: ({node, ...props}) => <em className="italic" {...props} />,
              code: ({node, ...props}) => {
                const hasParent = (node as any)?.parent?.type === 'element' && (node as any).parent.tagName === 'pre';
                return hasParent ? 
                  <code className="block bg-muted p-3 rounded text-sm font-mono whitespace-pre-wrap" {...props} /> :
                  <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props} />;
              },
              pre: ({node, ...props}) => <pre className="bg-muted p-3 rounded text-sm font-mono whitespace-pre-wrap overflow-x-auto" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic" {...props} />,
            }}
          >
            {aiResponse}
          </ReactMarkdown>
        </div>
      </div>
    );
  }

  if (selectedAssets.length > 0) {
    return (
      <div className="glass-card p-6 text-center text-muted-foreground">
        <p>Once you click "Compare Assets", the AI will analyze and respond here with detailed insights.</p>
      </div>
    );
  }

  return null;
};
