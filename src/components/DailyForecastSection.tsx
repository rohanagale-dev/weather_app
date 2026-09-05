import React from 'react';
import {
  Calendar,
  Droplets,
} from 'lucide-react';
import { DailyForecast, TemperatureUnit } from '../types';
import { formatTemperature } from '../utils/planner';
import { getWeatherCondition } from '../utils/wmoCodes';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastSectionProps {
  daily: DailyForecast[];
  unit: TemperatureUnit;
}

export const DailyForecastSection: React.FC<DailyForecastSectionProps> = ({ daily, unit }) => {
  // Sleek badge styling for layman suitability
  const getSuitabilityBadge = (suitability: DailyForecast['recommendation']['suitability']) => {
    switch (suitability) {
      case 'great':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      case 'good':
        return 'bg-zinc-100 text-zinc-800 border-zinc-200';
      case 'caution':
        return 'bg-amber-50 text-amber-800 border-amber-200/80';
      case 'poor':
        return 'bg-rose-50 text-rose-800 border-rose-200/80';
      default:
        return 'bg-zinc-50 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <section className="mt-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-zinc-500" />
          <h3 className="text-base sm:text-lg font-semibold tracking-tight text-zinc-900">
            7-Day Weather Forecast
          </h3>
        </div>
        <span className="text-xs text-zinc-400 font-medium">
          Includes today · Daily temperatures · Precipitation in mm
        </span>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {daily.map((day, idx) => {
          const condition = getWeatherCondition(day.weather_code);

          return (
            <div
              key={day.date}
              id={`daily-card-${idx}`}
              className="rounded-2xl border p-4 transition-all duration-150 flex flex-col justify-between bg-white border-zinc-200/80 hover:border-zinc-300 hover:shadow-xs"
            >
              {/* Day Name & Date */}
              <div className="flex items-center justify-between">
                <div>
                  <span
                    className={`text-xs sm:text-sm font-semibold block ${
                      day.isToday ? 'text-zinc-900 font-bold' : 'text-zinc-700'
                    }`}
                  >
                    {day.dayName}
                  </span>
                  <span className="text-[10px] text-zinc-400 block font-medium">
                    {day.formattedDate}
                  </span>
                </div>
                {day.isToday && (
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-zinc-900 text-white rounded-full">
                    Today
                  </span>
                )}
              </div>

              {/* Weather Condition Icon & Text */}
              <div className="my-3.5 flex flex-col items-center text-center">
                <div className="w-10 h-10 flex items-center justify-center mb-1">
                  <WeatherIcon weatherCode={day.weather_code} className="w-8 h-8" />
                </div>
                <span className="text-xs font-medium text-zinc-800 line-clamp-1">
                  {condition.description}
                </span>
              </div>

              {/* Temperature High / Low */}
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-center gap-2">
                <span className="text-sm font-semibold text-zinc-900 tabular-nums">
                  {formatTemperature(day.temp_max, unit)}
                </span>
                <span className="text-xs text-zinc-400 font-normal tabular-nums">
                  {formatTemperature(day.temp_min, unit)}
                </span>
              </div>

              {/* Precipitation in mm (strictly required) */}
              <div className="mt-2 text-center text-[11px] flex items-center justify-center gap-1 font-medium text-zinc-600 bg-zinc-50/90 py-1 rounded-xl border border-zinc-100">
                <Droplets className="w-3 h-3 text-sky-500 shrink-0" />
                <span className="tabular-nums">{day.precipitation_sum.toFixed(1)} mm</span>
                {day.precipitation_probability_max > 0 && (
                  <span className="text-[10px] text-zinc-400 tabular-nums">
                    ({day.precipitation_probability_max}%)
                  </span>
                )}
              </div>

              {/* Layman Suitability Tag */}
              <div className="mt-2.5">
                <span
                  className={`text-[10px] font-medium block text-center px-1.5 py-0.5 rounded-full border truncate ${getSuitabilityBadge(
                    day.recommendation.suitability
                  )}`}
                >
                  {day.recommendation.tag}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

