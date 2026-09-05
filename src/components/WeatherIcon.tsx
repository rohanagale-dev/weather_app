import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  Snowflake,
  LucideProps,
} from 'lucide-react';
import { getWeatherCondition } from '../utils/wmoCodes';

interface WeatherIconProps extends LucideProps {
  weatherCode: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ weatherCode, className = 'w-6 h-6', ...props }) => {
  const condition = getWeatherCondition(weatherCode);

  switch (condition.iconName) {
    case 'Sun':
      return <Sun className={`${condition.color} ${className}`} {...props} />;
    case 'CloudSun':
      return <CloudSun className={`${condition.color} ${className}`} {...props} />;
    case 'CloudFog':
      return <CloudFog className={`${condition.color} ${className}`} {...props} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={`${condition.color} ${className}`} {...props} />;
    case 'CloudRain':
      return <CloudRain className={`${condition.color} ${className}`} {...props} />;
    case 'CloudLightning':
      return <CloudLightning className={`${condition.color} ${className}`} {...props} />;
    case 'Snowflake':
      return <Snowflake className={`${condition.color} ${className}`} {...props} />;
    case 'Cloud':
    default:
      return <Cloud className={`${condition.color} ${className}`} {...props} />;
  }
};
