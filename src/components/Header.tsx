import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, AlertCircle, X, Loader2, Compass } from 'lucide-react';
import { CityGeo, TemperatureUnit } from '../types';
import { POPULAR_CITIES, searchCities } from '../services/weatherService';

interface HeaderProps {
  currentCity: CityGeo;
  onSelectCity: (city: CityGeo) => void;
  unit: TemperatureUnit;
  onToggleUnit: (unit: TemperatureUnit) => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onSelectCity,
  unit,
  onToggleUnit,
  isLoading,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CityGeo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced search for valid city names
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchCities(trimmed);
        setSuggestions(results);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle selecting a valid city from the suggested list
  const handleSelectSuggestion = (city: CityGeo) => {
    setErrorMessage(null);
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    onSelectCity(city);
  };

  // Handle form submission with STRICT validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      setErrorMessage('Please enter a city name to search.');
      return;
    }

    setIsSearching(true);
    setErrorMessage(null);

    try {
      const results = await searchCities(trimmed);

      // Strict validation: Reject if no valid city or no close match
      if (!results || results.length === 0) {
        setErrorMessage(
          `"${trimmed}" was not found. Please enter a valid city name (e.g. London, Tokyo, New York).`
        );
        setShowDropdown(false);
        return;
      }

      // Automatically select the best match
      handleSelectSuggestion(results[0]);
    } catch (err) {
      setErrorMessage('Unable to verify city at this time. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <header className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main top bar */}
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-4 h-4 text-zinc-100" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-tight text-zinc-900">
                  Weather Planner
                </span>
                <span className="text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200/60">
                  7-Day Forecast
                </span>
              </div>
            </div>
          </div>

          {/* Search Input in Center */}
          <div className="relative flex-1 max-w-lg mx-2" ref={dropdownRef}>
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
                <input
                  id="city-search-input"
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowDropdown(true);
                  }}
                  placeholder="Search city (e.g. London, Tokyo, Paris)..."
                  className={`w-full pl-9 pr-20 py-1.5 text-xs sm:text-sm bg-zinc-50 hover:bg-zinc-100/70 border rounded-full transition-all outline-none ${
                    errorMessage
                      ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                      : 'border-zinc-200/90 focus:border-zinc-900 focus:bg-white focus:ring-2 focus:ring-zinc-900/5'
                  }`}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setSuggestions([]);
                      setShowDropdown(false);
                      setErrorMessage(null);
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-14 p-1 text-zinc-400 hover:text-zinc-600"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  id="btn-search-city"
                  type="submit"
                  disabled={isSearching || isLoading}
                  className="absolute right-1 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 text-white text-xs font-medium rounded-full transition-all flex items-center gap-1 shadow-xs"
                >
                  {isSearching ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <span>Find</span>
                  )}
                </button>
              </div>
            </form>

            {/* Validated Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div
                id="city-suggestions-list"
                className="absolute left-0 right-0 top-full mt-2 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto"
              >
                <div className="px-3.5 py-2 bg-zinc-50/80 border-b border-zinc-100 text-[11px] font-medium text-zinc-400 tracking-wider uppercase">
                  Verified Locations
                </div>
                {suggestions.map((city) => (
                  <button
                    key={`${city.id}-${city.name}-${city.country}`}
                    id={`suggestion-${city.id}`}
                    type="button"
                    onClick={() => handleSelectSuggestion(city)}
                    className="w-full px-3.5 py-2.5 text-left text-xs sm:text-sm hover:bg-zinc-50 flex items-center justify-between transition-colors border-b border-zinc-50 last:border-0 group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 shrink-0 transition-colors" />
                      <span className="font-medium text-zinc-900">{city.name}</span>
                      {city.admin1 && (
                        <span className="text-zinc-400 text-xs truncate">· {city.admin1}</span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-400 font-normal shrink-0 ml-2">
                      {city.country}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Unit Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center bg-zinc-100 p-0.5 rounded-full border border-zinc-200/80">
              <button
                id="btn-unit-celsius"
                type="button"
                onClick={() => onToggleUnit('celsius')}
                className={`px-2.5 sm:px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  unit === 'celsius'
                    ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
                title="Display temperature in Celsius"
              >
                °C
              </button>
              <button
                id="btn-unit-fahrenheit"
                type="button"
                onClick={() => onToggleUnit('fahrenheit')}
                className={`px-2.5 sm:px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  unit === 'fahrenheit'
                    ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
                title="Display temperature in Fahrenheit"
              >
                °F
              </button>
            </div>
          </div>
        </div>

        {/* Sleek Subheader: Popular Cities Pills & Error Bar */}
        <div className="py-2 border-t border-zinc-100 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider whitespace-nowrap mr-1">
              Locations:
            </span>
            {POPULAR_CITIES.map((city) => {
              const isActive = city.id === currentCity.id;
              return (
                <button
                  key={city.id}
                  id={`quick-city-${city.name.toLowerCase()}`}
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    onSelectCity(city);
                  }}
                  className={`px-3 py-0.5 text-xs rounded-full font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900'
                  }`}
                >
                  {city.name}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-zinc-400 whitespace-nowrap hidden md:block">
            Precipitation in mm · Open-Meteo
          </div>
        </div>

        {/* Strict Error Alert */}
        {errorMessage && (
          <div
            id="search-error-alert"
            className="my-2 px-3.5 py-2 bg-rose-50/90 border border-rose-200/80 rounded-xl flex items-center justify-between text-xs text-rose-800"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-700 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

