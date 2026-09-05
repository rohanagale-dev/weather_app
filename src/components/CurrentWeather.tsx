import React from 'react';
import {
  Droplets,
  Wind,
  Sun,
  Thermometer,
  ShieldCheck,
  Compass,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { CityGeo, CurrentWeather as CurrentWeatherType, AirQualityCurrent, TemperatureUnit } from '../types';
import { formatTemperature } from '../utils/planner';
import { getWeatherCondition } from '../utils/wmoCodes';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherProps {
  city: CityGeo;
  current: CurrentWeatherType;
  airQuality: AirQualityCurrent | null;
  unit: TemperatureUnit;
  lastUpdated: string;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  city,
  current,
  airQuality,
  unit,
  lastUpdated,
}) => {
  const condition = getWeatherCondition(current.weather_code);

  // AQI color & styling mapping
  const getAqiBadgeStyle = (category?: string) => {
    switch (category) {
      case 'Good':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Moderate':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Unhealthy for Sensitive Groups':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'Unhealthy':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Very Unhealthy':
      case 'Hazardous':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-zinc-50 text-zinc-700 border-zinc-200';
    }
  };

  // UV index category label for laymen
  const getUvLabel = (uv: number) => {
    if (uv <= 2) return { text: 'Low', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (uv <= 5) return { text: 'Moderate', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (uv <= 7) return { text: 'High', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { text: 'Very High', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const uvInfo = getUvLabel(current.uv_index);

  // Calculate AQI progress bar percentage (0 to 300 scale clamped to 100%)
  const aqiValue = airQuality?.us_aqi ?? 0;
  const aqiPercentage = Math.min(Math.max((aqiValue / 200) * 100, 2), 98);

  return (
    <div
      id="current-weather-card"
      className="w-full h-full bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-7 shadow-xs flex flex-col justify-between"
    >
      <div>
        {/* Header with City */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-zinc-900">
              <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                {city.name}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
            </p>
          </div>
        </div>

        {/* Temperature & Visual Condition */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
              <WeatherIcon weatherCode={current.weather_code} className="w-10 h-10" />
            </div>
            <div>
              <div className="text-6xl sm:text-7xl font-light tracking-tighter text-zinc-900 tabular-nums leading-none">
                {formatTemperature(current.temperature, unit)}
              </div>
              <div className="text-sm sm:text-base font-medium text-zinc-800 capitalize mt-1.5">
                {condition.description}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-xs text-zinc-400">
                  Feels like {formatTemperature(current.apparent_temperature, unit)}
                </span>
              </div>
            </div>
          </div>

          {/* Condition Status & Summary Pill */}
          <div className="bg-zinc-50 border border-zinc-200/70 rounded-2xl p-3.5 max-w-xs text-xs">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 font-medium text-zinc-800">
                <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                <span>Current Status</span>
              </div>
            </div>
            <p className="text-zinc-600 leading-relaxed text-[11px]">
              {current.precipitation > 0
                ? `Active precipitation recorded at ${current.precipitation.toFixed(1)} mm.`
                : 'Clear skies or dry conditions with zero active precipitation.'}
            </p>
          </div>
        </div>
      </div>

      {/* Current Metrics Grid with Today's AQI Number included */}
      <div className="mt-7 pt-5 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5">
        {/* Precipitation in mm (strictly required) */}
        <div className="bg-zinc-50/70 rounded-xl p-3 border border-zinc-100/90 flex flex-col justify-between">
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
            <Droplets className="w-3 h-3 text-sky-500" />
            <span>Precipitation</span>
          </div>
          <div className="text-base sm:text-lg font-semibold text-zinc-900 mt-1 tabular-nums">
            {current.precipitation.toFixed(1)} mm
          </div>
          <div className="text-[10px] text-zinc-400 mt-0.5">
            Current intensity
          </div>
        </div>

        {/* Relative Humidity */}
        <div className="bg-zinc-50/70 rounded-xl p-3 border border-zinc-100/90 flex flex-col justify-between">
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
            <Thermometer className="w-3 h-3 text-indigo-500" />
            <span>Humidity</span>
          </div>
          <div className="text-base sm:text-lg font-semibold text-zinc-900 mt-1 tabular-nums">
            {current.relative_humidity}%
          </div>
          <div className="text-[10px] text-zinc-400 mt-0.5">
            Moisture level
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-zinc-50/70 rounded-xl p-3 border border-zinc-100/90 flex flex-col justify-between">
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
            <Wind className="w-3 h-3 text-teal-500" />
            <span>Wind</span>
          </div>
          <div className="text-base sm:text-lg font-semibold text-zinc-900 mt-1 tabular-nums flex items-center gap-1">
            <span>{Math.round(current.wind_speed)} km/h</span>
          </div>
          <div className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1">
            <Compass className="w-3 h-3 text-zinc-400" />
            <span>{current.wind_direction}°</span>
          </div>
        </div>

        {/* UV Index */}
        <div className="bg-zinc-50/70 rounded-xl p-3 border border-zinc-100/90 flex flex-col justify-between">
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
            <Sun className="w-3 h-3 text-amber-500" />
            <span>UV Index</span>
          </div>
          <div className="text-base sm:text-lg font-semibold text-zinc-900 mt-1 tabular-nums flex items-center justify-between">
            <span>{current.uv_index.toFixed(1)}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${uvInfo.color}`}>
              {uvInfo.text}
            </span>
          </div>
          <div className="text-[10px] text-zinc-400 mt-0.5">
            Solar radiation
          </div>
        </div>

        {/* AQI Number (Strictly current day) */}
        <div className="bg-zinc-50/70 rounded-xl p-3 border border-zinc-100/90 col-span-2 sm:col-span-1 flex flex-col justify-between">
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Today's AQI</span>
          </div>
          <div className="text-base sm:text-lg font-semibold text-zinc-900 mt-1 tabular-nums flex items-center justify-between gap-1">
            <span>{airQuality ? airQuality.us_aqi : 'N/A'}</span>
            {airQuality && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full border font-medium truncate ${getAqiBadgeStyle(airQuality.category)}`}>
                {airQuality.category}
              </span>
            )}
          </div>
          <div className="text-[10px] text-zinc-400 mt-0.5 truncate">
            {airQuality ? `${airQuality.category} air quality` : 'Current day only'}
          </div>
        </div>
      </div>
    </div>
  );
};

