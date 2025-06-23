
import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { finnhubAPI } from '@/utils/finnhubAPI';

interface SearchResult {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // Load watchlist from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('watchlist') || '[]');
    setWatchlist(stored);
  }, []);

  // Update dropdown position when search results change
  useEffect(() => {
    if (inputRef.current && (loading || searchResults.length > 0)) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [loading, searchResults.length]);

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await finnhubAPI.searchSymbols(query);
      // Handle the actual API response structure
      const results = response.result || response;
      setSearchResults(Array.isArray(results) ? results.slice(0, 8) : []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = (query: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      handleSearch(query);
    }, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const addToWatchlist = (symbol: string) => {
    const updated = [...watchlist, symbol];
    localStorage.setItem('watchlist', JSON.stringify(updated));
    setWatchlist(updated);
    
    // Dispatch event to update other components
    window.dispatchEvent(new CustomEvent('watchlistUpdated'));
  };

  const isInWatchlist = (symbol: string) => {
    return watchlist.includes(symbol);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <>
      <div className="glass-card p-4 relative">
        <div className="relative" ref={inputRef}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stocks, ETFs, crypto..."
            value={searchTerm}
            onChange={handleInputChange}
            className="pl-10 bg-background/50 border-border text-foreground placeholder-muted-foreground"
          />
        </div>
      </div>

      {/* Fixed positioned dropdown portal */}
      {(loading || searchResults.length > 0) && (
        <div 
          className="fixed bg-card rounded-lg border border-border shadow-2xl max-h-80 overflow-y-auto"
          style={{ 
            zIndex: 999999,
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            backgroundColor: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))'
          }}
        >
          {loading && (
            <div className="p-4 text-center text-muted-foreground">
              Searching...
            </div>
          )}
          
          {!loading && searchResults.length > 0 && (
            <div className="py-2">
              {searchResults.map((result, index) => (
                <div
                  key={`${result.symbol}-${index}`}
                  className="flex items-center justify-between p-3 hover:bg-accent/50 border-b border-border last:border-b-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{result.displaySymbol || result.symbol}</span>
                      <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                        {result.type}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {result.description}
                    </div>
                  </div>
                  
                  <div className="ml-3">
                    {isInWatchlist(result.symbol) ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled
                        className="text-xs"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Added
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => {
                          addToWatchlist(result.symbol);
                          clearSearch();
                        }}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && searchTerm.length >= 2 && searchResults.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              No results found for "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </>
  );
};
