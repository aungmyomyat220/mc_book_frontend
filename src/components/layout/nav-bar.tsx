'use client'
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter } from 'next/navigation';
import { useSearchStore } from '@/hooks/useSearchStore';
import { useSearchSeries } from '@/hooks/useSearchSeries';

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function NavBar() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { query, setQuery } = useSearchStore();
  const debouncedQuery = useDebounce(query, 300);
  const { data } = useSearchSeries(debouncedQuery, !!debouncedQuery);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (seriesName: string) => {
    setQuery(seriesName);
    setShowSuggestions(false);
    router.push(`/myanmar-comic/search?name=${encodeURIComponent(seriesName)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      setShowSuggestions(false);
      router.push(`/myanmar-comic/search?name=${encodeURIComponent(query.trim())}`);
    }
  };

  // Hide suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions]);

  return (
    <div className="mb-4 border-b border-red-500 flex justify-between sm:px-5 px-2">
      <div className="hidden sm:block mb-7">
        <span className="font-bold text-2xl text-white">Myanmar</span>
        <span className="font-bold text-2xl text-red-500">Comic</span>
      </div>

      <div className="relative hidden sm:block" ref={inputRef}>
        <Search className="absolute left-3 top-4.5 transform -translate-y-1/2 text-white w-4 h-4" />
        <Input
          type="text"
          placeholder="စာအုပ်နာမည်ဖြင့်ရှာဖွေရန်..."
          className="w-60 lg:w-80 bg-black border border-primary pl-10 text-white outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
        />
        {showSuggestions && data && data.series && data.series.length > 0 && (
          <div className="absolute z-10 left-0 right-0 bg-black border border-gray-700 rounded shadow-lg mt-1 max-h-60 overflow-y-auto">
            {data.series.map((item) => (
              <div
                key={item.id}
                className="px-4 py-2 hover:bg-gray-800 cursor-pointer text-white"
                onClick={() => handleSuggestionClick(item.title)}
              >
                {item.title}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between w-full sm:hidden">
        <div className="mb-7">
          <span className="font-bold text-2xl text-white">M</span>
          <span className="font-bold text-2xl text-red-500">C</span>
        </div>
        <div className="relative">
          {isSearchExpanded ? (
            <Input
              type="text"
              placeholder="ရှာဖွေရန်..."
              className="w-40 bg-black border border-primary pl-10 text-white text-sm outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setIsSearchExpanded(false)}
            />
          ) : (
            <Search
              className="text-white w-5 h-5 cursor-pointer mt-2"
              onClick={() => setIsSearchExpanded(true)}
            />
          )}
          {isSearchExpanded && showSuggestions && data && data.series && data.series.length > 0 && (
            <div className="absolute z-10 left-0 right-0 bg-black border border-gray-700 rounded shadow-lg mt-1 max-h-60 overflow-y-auto">
              {data.series.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-2 hover:bg-gray-800 cursor-pointer text-white"
                  onMouseDown={() => handleSuggestionClick(item.title)}
                >
                  {item.title}
                </div>
              ))}
            </div>
          )}
          {isSearchExpanded && (
            <Search className="absolute top-3 left-3 text-white w-4 h-4" />
          )}
        </div>
      </div>
    </div>
  );
}
