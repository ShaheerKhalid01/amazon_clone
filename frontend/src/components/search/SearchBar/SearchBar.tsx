import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@services/product.service';
import { useDebounce } from '@hooks/useDebounce';
import { FaSearch, FaTimes, FaHistory, FaChartLine } from 'react-icons/fa';

interface SearchBarProps {
  variant?: 'header' | 'full';
  onSearch?: (query: string) => void;
  initialValue?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

/**
 * Search Bar Component
 * Advanced search with auto-suggestions and recent searches
 */
const SearchBar: React.FC<SearchBarProps> = ({
  variant = 'full',
  onSearch,
  initialValue = '',
  placeholder = 'Search Amazon...',
  autoFocus = false,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);

  // Fetch suggestions
  const { data: suggestions = [] } = useQuery({
    queryKey: ['search-suggestions', debouncedQuery],
    queryFn: () => productService.searchProducts(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    select: (data: any) => data?.slice(0, 10) || [],
  });

  // Recent searches from localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('recentSearches') || '[]');
    } catch {
      return [];
    }
  });

  // Trending searches (mock data)
  const trendingSearches = [
    'wireless earbuds',
    'gaming laptop',
    'yoga mat',
    'coffee maker',
    'running shoes',
  ];

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = getSuggestionItems();
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          handleSelect(items[selectedIndex]);
        } else {
          handleSubmit();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Get suggestion items based on current state
  const getSuggestionItems = (): string[] => {
    if (query.length >= 2 && suggestions.length > 0) {
      return suggestions.map((s: any) => s.title || s.text || s);
    }
    if (query.length === 0) {
      return trendingSearches;
    }
    return [];
  };

  // Handle search submission
  const handleSubmit = () => {
    if (!query.trim()) return;

    // Save to recent searches
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    setShowSuggestions(false);
    
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  // Handle suggestion selection
  const handleSelect = (item: string) => {
    setQuery(item);
    setShowSuggestions(false);
    
    if (onSearch) {
      onSearch(item);
    } else {
      navigate(`/search?q=${encodeURIComponent(item)}`);
    }
  };

  // Clear search
  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className={`flex ${variant === 'header' ? '' : 'shadow-lg'}`}>
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="w-full px-4 py-3 pr-10 text-gray-900 border border-gray-300 rounded-l-lg 
                     focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:border-transparent"
            role="combobox"
            aria-expanded={showSuggestions}
            aria-controls="search-suggestions"
            aria-autocomplete="list"
          />
          
          {/* Clear Button */}
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={handleSubmit}
          className="bg-amazon-orange hover:bg-amazon-orange-dark text-white px-6 rounded-r-lg 
                   transition-colors flex items-center justify-center"
        >
          <FaSearch className="text-xl" />
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          id="search-suggestions"
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl 
                   max-h-96 overflow-y-auto"
          role="listbox"
        >
          {/* Auto-suggestions */}
          {query.length >= 2 && suggestions.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs text-gray-500 font-medium uppercase">
                Suggestions
              </div>
              {suggestions.map((item: any, index: number) => {
                const text = item.title || item.text || item;
                return (
                  <button
                    key={index}
                    onClick={() => handleSelect(text)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-3
                      ${index === selectedIndex ? 'bg-gray-100' : ''}`}
                    role="option"
                    aria-selected={index === selectedIndex}
                  >
                    <FaSearch className="text-gray-400 flex-shrink-0" />
                    <span>{text}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Recent Searches */}
          {query.length === 0 && recentSearches.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs text-gray-500 font-medium uppercase">
                Recent Searches
              </div>
              {recentSearches.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(item)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-3
                    ${index === selectedIndex ? 'bg-gray-100' : ''}`}
                >
                  <FaHistory className="text-gray-400 flex-shrink-0" />
                  <span>{item}</span>
                </button>
              ))}
            </div>
          )}

          {/* Trending Searches */}
          {query.length === 0 && (
            <div>
              <div className="px-4 py-2 text-xs text-gray-500 font-medium uppercase">
                Trending Searches
              </div>
              {trendingSearches.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(item)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-3
                    ${index === selectedIndex ? 'bg-gray-100' : ''}`}
                >
                  <FaChartLine className="text-orange-400 flex-shrink-0" />
                  <span>{item}</span>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {query.length >= 2 && suggestions.length === 0 && (
            <div className="px-4 py-4 text-center text-gray-500">
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try different keywords</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
