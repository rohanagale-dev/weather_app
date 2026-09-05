/**
 * WMO (World Meteorological Organization) weather interpretation codes
 * mapped to layman descriptions and semantic indicators.
 */

export interface WeatherCondition {
  code: number;
  description: string;
  iconName: 'Sun' | 'CloudSun' | 'Cloud' | 'CloudFog' | 'CloudDrizzle' | 'CloudRain' | 'CloudLightning' | 'Snowflake';
  color: string;
}

export const WMO_CODE_MAP: Record<number, WeatherCondition> = {
  0: { code: 0, description: 'Clear sky', iconName: 'Sun', color: 'text-amber-500' },
  1: { code: 1, description: 'Mainly clear', iconName: 'Sun', color: 'text-amber-500' },
  2: { code: 2, description: 'Partly cloudy', iconName: 'CloudSun', color: 'text-sky-500' },
  3: { code: 3, description: 'Overcast', iconName: 'Cloud', color: 'text-slate-500' },
  45: { code: 45, description: 'Foggy', iconName: 'CloudFog', color: 'text-slate-400' },
  48: { code: 48, description: 'Depositing rime fog', iconName: 'CloudFog', color: 'text-slate-400' },
  51: { code: 51, description: 'Light drizzle', iconName: 'CloudDrizzle', color: 'text-cyan-500' },
  53: { code: 53, description: 'Moderate drizzle', iconName: 'CloudDrizzle', color: 'text-cyan-600' },
  55: { code: 55, description: 'Dense drizzle', iconName: 'CloudDrizzle', color: 'text-cyan-700' },
  56: { code: 56, description: 'Freezing drizzle', iconName: 'Snowflake', color: 'text-blue-400' },
  57: { code: 57, description: 'Dense freezing drizzle', iconName: 'Snowflake', color: 'text-blue-500' },
  61: { code: 61, description: 'Slight rain', iconName: 'CloudRain', color: 'text-blue-500' },
  63: { code: 63, description: 'Moderate rain', iconName: 'CloudRain', color: 'text-blue-600' },
  65: { code: 65, description: 'Heavy rain', iconName: 'CloudRain', color: 'text-blue-700' },
  66: { code: 66, description: 'Freezing rain', iconName: 'Snowflake', color: 'text-indigo-400' },
  67: { code: 67, description: 'Heavy freezing rain', iconName: 'Snowflake', color: 'text-indigo-600' },
  71: { code: 71, description: 'Slight snowfall', iconName: 'Snowflake', color: 'text-indigo-400' },
  73: { code: 73, description: 'Moderate snowfall', iconName: 'Snowflake', color: 'text-indigo-500' },
  75: { code: 75, description: 'Heavy snowfall', iconName: 'Snowflake', color: 'text-indigo-600' },
  77: { code: 77, description: 'Snow grains', iconName: 'Snowflake', color: 'text-indigo-300' },
  80: { code: 80, description: 'Slight rain showers', iconName: 'CloudRain', color: 'text-blue-500' },
  81: { code: 81, description: 'Moderate rain showers', iconName: 'CloudRain', color: 'text-blue-600' },
  82: { code: 82, description: 'Violent rain showers', iconName: 'CloudRain', color: 'text-blue-700' },
  85: { code: 85, description: 'Slight snow showers', iconName: 'Snowflake', color: 'text-indigo-400' },
  86: { code: 86, description: 'Heavy snow showers', iconName: 'Snowflake', color: 'text-indigo-600' },
  95: { code: 95, description: 'Thunderstorm', iconName: 'CloudLightning', color: 'text-purple-600' },
  96: { code: 96, description: 'Thunderstorm with slight hail', iconName: 'CloudLightning', color: 'text-purple-600' },
  99: { code: 99, description: 'Thunderstorm with heavy hail', iconName: 'CloudLightning', color: 'text-purple-700' },
};

export function getWeatherCondition(code: number): WeatherCondition {
  return WMO_CODE_MAP[code] || {
    code,
    description: 'Cloudy',
    iconName: 'Cloud',
    color: 'text-slate-500',
  };
}
