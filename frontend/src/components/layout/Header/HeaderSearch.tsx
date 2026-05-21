import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';

const HeaderSearch: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
      setSearchText('');
      setIsSearchFocused(false);
      searchInputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setSearchText('');
    searchInputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-3xl mx-4">
      <div className={`
        relative flex items-center w-full
        transition-all duration-300 ease-in-out
        ${isSearchFocused ? 'scale-105' : 'scale-100'}
      `}>
        
        {/* Category Dropdown (Left Side) */}
        <div className="hidden md:block relative">
          <select 
            className="
              h-10 px-3 text-xs bg-gray-100 border border-gray-300 
              rounded-l-lg border-r-0 text-gray-700
              hover:bg-gray-200 cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:border-transparent
              appearance-none pr-6
            "
          >
            <option value="">All Departments</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="books">Books</option>
            <option value="home">Home & Kitchen</option>
            <option value="sports">Sports</option>
          </select>
          <svg className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Search Input */}
        <div className="relative flex-1">
            <input
              ref={searchInputRef}
              type="text"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                setIsSearchFocused(true);
                if (searchText.length >= 2) setShowSuggestions(true);
              }}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search Amazon..."
              className="w-full h-[42px] px-4 text-sm
                         border border-gray-300 md:rounded-none md:border-l-0 rounded-l-lg
                         text-white bg-amazon-navy placeholder-gray-400
                         focus:outline-none transition-all"
            />
          
          {/* Clear Button */}
          {searchText && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 
                       p-1 text-gray-400 hover:text-gray-600 
                       rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaTimes size={14} />
            </button>
          )}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="
            h-10 px-5 bg-amazon-orange hover:bg-amazon-orange-dark
            text-white font-medium
            rounded-r-lg
            transition-all duration-200
            hover:shadow-lg hover:scale-105
            active:scale-95
            focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:ring-offset-2
            flex items-center justify-center gap-1.5
          "
        >
          <FaSearch size={16} />
          <span className="hidden sm:inline text-sm">Search</span>
        </button>

        {/* Focus Overlay (Background Blur) */}
        {isSearchFocused && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-40 z-[-1]"
            onClick={() => {
              setIsSearchFocused(false);
              searchInputRef.current?.blur();
            }}
          />
        )}
      </div>
    </form>
  );
};

export default HeaderSearch;
