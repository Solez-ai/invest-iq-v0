
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { finnhubAPI } from '@/utils/finnhubAPI';

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    try {
      const results = await finnhubAPI.searchSymbols(query);
      setSearchResults(results.slice(0, 10));
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  return (
    <div className="glass-card p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search stocks, ETFs, crypto..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(e.target.value);
          }}
          className="pl-10 bg-background/50 border-border text-foreground placeholder-muted-foreground"
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-lg border border-border z-10 max-h-60 overflow-y-auto">
            {searchResults.map((result: any, index) => (
              <div
                key={index}
                className="p-3 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
                onClick={() => {
                  setSearchTerm('');
                  setSearchResults([]);
                }}
              >
                <div className="text-foreground font-medium">{result.symbol}</div>
                <div className="text-muted-foreground text-sm">{result.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
