/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CurrentWeather } from './components/CurrentWeather';
import { DailyForecastSection } from './components/DailyForecastSection';
import { WeeklyPlanner } from './components/WeeklyPlanner';
import { CityGeo, TemperatureUnit, WeatherData } from './types';
import { POPULAR_CITIES, fetchWeatherForCity } from './services/weatherService';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  // Application State
  const [selectedCity, setSelectedCity] = useState<CityGeo>(POPULAR_CITIES[0]); // Default to London
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('celsius'); // Requirement: display temp in Celsius by default
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Load weather data for the chosen valid city
  const loadWeather = useCallback(async (city: CityGeo) => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const data = await fetchWeatherForCity(city);
      setWeatherData(data);
    } catch (err: any) {
      console.error('Error fetching weather data:', err);
      setFetchError(
        'Unable to retrieve weather data from Open-Meteo. Please check your internet connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch initial weather and on city selection
  useEffect(() => {
    loadWeather(selectedCity);
  }, [selectedCity, loadWeather]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 flex flex-col font-sans antialiased selection:bg-zinc-900 selection:text-white">
      {/* Search Header & Configuration Bar */}
      <Header
        currentCity={selectedCity}
        onSelectCity={(city) => setSelectedCity(city)}
        unit={unit}
        onToggleUnit={(newUnit) => setUnit(newUnit)}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
        {/* Initial Loading State */}
        {isLoading && !weatherData && (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4 border border-zinc-200">
              <Loader2 className="w-6 h-6 text-zinc-800 animate-spin" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900">
              Fetching weather data for {selectedCity.name}...
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Synchronizing with Open-Meteo meteorological and atmospheric sensors
            </p>
          </div>
        )}

        {/* Fetch Error State */}
        {fetchError && (
          <div
            id="fetch-error-container"
            className="my-12 p-8 bg-white border border-rose-200/80 rounded-2xl shadow-xs text-center max-w-md mx-auto"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200/60">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900">
              Weather Data Unavailable
            </h3>
            <p className="text-xs text-zinc-500 mt-1.5 mb-5 leading-relaxed">
              {fetchError}
            </p>
            <button
              id="btn-retry-weather"
              type="button"
              onClick={() => loadWeather(selectedCity)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-full transition-all shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Fetching Weather</span>
            </button>
          </div>
        )}

        {/* Loaded Weather Content */}
        {weatherData && (
          <div className="space-y-7">
            {/* Subtle loading indicator overlay while refreshing in background */}
            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-1.5 px-3.5 bg-zinc-100 text-zinc-700 text-xs font-medium rounded-full w-fit mx-auto border border-zinc-200/80">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Updating conditions...</span>
              </div>
            )}

            {/* Top Grid: Current Weather (with AQI number) & Weekly Planning Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              <div className="lg:col-span-6 flex">
                <CurrentWeather
                  city={weatherData.city}
                  current={weatherData.current}
                  airQuality={weatherData.airQuality}
                  unit={unit}
                  lastUpdated={weatherData.lastUpdated}
                />
              </div>
              <div className="lg:col-span-6 flex">
                <WeeklyPlanner planning={weatherData.weeklyPlanning} />
              </div>
            </div>

            {/* 7-Day Forecast (including today, min/max temps, precipitation in mm) */}
            <DailyForecastSection daily={weatherData.daily} unit={unit} />
          </div>
        )}
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="border-t border-zinc-200/80 bg-white py-6 mt-16 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <p>
            Data sourced directly from{' '}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-zinc-700 hover:underline"
            >
              Open-Meteo API
            </a>{' '}
            • Free & Open Meteorological Services
          </p>
          <p className="text-zinc-400">
            Precipitation strictly in mm • Temperature toggle in °C / °F
          </p>
        </div>
      </footer>
    </div>
  );
}
