
import { Plus, X, Trash2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AssetData {
  symbol: string;
  name: string;
  type: string;
}

interface ComparisonDropZoneProps {
  selectedAssets: AssetData[];
  draggedOver: boolean;
  setDraggedOver: (value: boolean) => void;
  handleDrop: (e: React.DragEvent) => void;
  removeAsset: (symbol: string) => void;
  clearAll: () => void;
  handleCompare: () => void;
  loading: boolean;
}

export const ComparisonDropZone = ({
  selectedAssets,
  draggedOver,
  setDraggedOver,
  handleDrop,
  removeAsset,
  clearAll,
  handleCompare,
  loading
}: ComparisonDropZoneProps) => {
  return (
    <>
      {/* Drop Zone */}
      <div
        className={cn(
          "glass-card p-6 border-2 border-dashed transition-all duration-200 min-h-[200px]",
          draggedOver ? "border-primary bg-primary/5" : "border-muted",
          selectedAssets.length === 0 && "flex items-center justify-center"
        )}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDraggedOver(true);
        }}
        onDragLeave={() => setDraggedOver(false)}
      >
        {selectedAssets.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Drag assets here to compare</p>
            <p className="text-sm">2-3 assets required</p>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Selected Assets ({selectedAssets.length}/3)
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="text-muted-foreground hover:text-foreground"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
            
            <div className="space-y-2">
              {selectedAssets.map((asset) => (
                <div key={asset.symbol} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">{asset.symbol}</div>
                    <div className="text-sm text-muted-foreground">{asset.name}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAsset(asset.symbol)}
                    className="text-muted-foreground hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Compare Button */}
      <Button
        onClick={handleCompare}
        disabled={selectedAssets.length < 2 || selectedAssets.length > 3 || loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        size="lg"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Analyzing...
          </>
        ) : (
          <>
            <Zap className="h-4 w-4 mr-2" />
            Compare Assets
          </>
        )}
      </Button>
    </>
  );
};
