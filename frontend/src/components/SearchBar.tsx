import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from './ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({ onSearch, placeholder = 'Search products...', autoFocus = false }: SearchBarProps) {
  const [query, setQuery] = useState('');

  // Debounce search to avoid excessive calls
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
  }, [onSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#262930]/40" size={18} />
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="pl-10 pr-10 h-12 bg-white/50 border-[#262930]/10 focus:border-[#D04007]"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#262930]/40 hover:text-[#D04007] transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
