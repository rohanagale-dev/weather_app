/**
 * Core type definitions for weather forecasting, Open-Meteo API integrations,
 * and layman planning recommendations.
 */

export type TemperatureUnit = 'celsius' | 'fahrenheit';

/**
 * Validated geographical city result from Open-Meteo Geocoding
 */
export interface CityGeo {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code?: string;
  admin1?: string; // State or administrative region
  timezone?: string;
}

/**
 * Current weather conditions
 */
export interface CurrentWeather {
  temperature: number; // in Celsius from API
  relative_humidity: number; // percentage
  apparent_temperature: number; // in Celsius from API
  precipitation: number; // in mm
  weather_code: number; // WMO code
  wind_speed: number; // km/h
  wind_direction: number; // degrees
  uv_index: number;
  time: string;
}

/**
 * Air Quality Index data (strictly displayed for the current day only)
 */
export interface AirQualityCurrent {
  us_aqi: number;
  european_aqi?: number;
  pm2_5?: number;
  pm10?: number;
  category: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  advice: string;
}

/**
 * Day-by-day practical planning advice for laymen
 */
export interface DayRecommendation {
  tag: string;
  suitability: 'great' | 'good' | 'caution' | 'poor';
  umbrellaNeeded: boolean;
  laundryFriendly: boolean;
  outdoorFriendly: boolean;
  clothingTip: string;
  summary: string;
}

/**
 * 7-day daily forecast record
 */
export interface DailyForecast {
  date: string;
  dayName: string;
  formattedDate: string;
  isToday: boolean;
  weather_code: number;
  temp_max: number; // in Celsius from API
  temp_min: number; // in Celsius from API
  precipitation_sum: number; // strictly in mm
  precipitation_probability_max: number; // percentage
  uv_index_max: number;
  wind_speed_max: number; // km/h
  recommendation: DayRecommendation;
}

/**
 * Comprehensive 7-day planning recommendation overview
 */
export interface WeeklyPlanning {
  bestOutdoorDay: string;
  rainDays: string[];
  generalOverview: string;
  umbrellaSummary: string;
  clothingSummary: string;
  clothingBadge: string;
  laundrySummary?: string;
  outdoorSummary: string;
}

/**
 * Consolidated weather state for the active location
 */
export interface WeatherData {
  city: CityGeo;
  current: CurrentWeather;
  airQuality: AirQualityCurrent | null; // ONLY for current day
  daily: DailyForecast[]; // 7 days (including current day)
  weeklyPlanning: WeeklyPlanning;
  lastUpdated: string;
}
