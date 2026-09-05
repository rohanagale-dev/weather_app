import { AirQualityCurrent, DailyForecast, DayRecommendation, WeeklyPlanning } from '../types';

/**
 * Calculates layman Air Quality rating and practical health advisory
 * Note: Used exclusively for the current day as per requirements.
 */
export function getAirQualityDetails(aqiValue: number, pm2_5?: number, pm10?: number): AirQualityCurrent {
  const rounded = Math.round(aqiValue);

  if (rounded <= 50) {
    return {
      us_aqi: rounded,
      pm2_5,
      pm10,
      category: 'Good',
      advice: 'Air quality is ideal. Perfect conditions for outdoor exercise, walking, and opening windows.',
    };
  }
  if (rounded <= 100) {
    return {
      us_aqi: rounded,
      pm2_5,
      pm10,
      category: 'Moderate',
      advice: 'Air quality is acceptable. Extremely sensitive individuals should consider taking occasional breaks during heavy outdoor exertion.',
    };
  }
  if (rounded <= 150) {
    return {
      us_aqi: rounded,
      pm2_5,
      pm10,
      category: 'Unhealthy for Sensitive Groups',
      advice: 'Children, elderly people, and those with respiratory or heart conditions should limit strenuous outdoor activities.',
    };
  }
  if (rounded <= 200) {
    return {
      us_aqi: rounded,
      pm2_5,
      pm10,
      category: 'Unhealthy',
      advice: 'Everyone may start feeling irritation. Avoid prolonged outdoor running or heavy exercise; prefer indoor activities.',
    };
  }
  if (rounded <= 300) {
    return {
      us_aqi: rounded,
      pm2_5,
      pm10,
      category: 'Very Unhealthy',
      advice: 'Health alert. Keep windows closed, run an air purifier, and wear a filtration mask if you must go outside.',
    };
  }
  return {
    us_aqi: rounded,
    pm2_5,
    pm10,
    category: 'Hazardous',
    advice: 'Emergency conditions. Avoid all outdoor physical activity and remain indoors with filtered air.',
  };
}

/**
 * Generates an actionable, layman-friendly recommendation for a single day.
 */
export function generateDayRecommendation(
  tempMax: number,
  tempMin: number,
  precipSum: number,
  precipProb: number,
  weatherCode: number,
  uvMax: number,
  windMax: number
): DayRecommendation {
  const isRainCode = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weatherCode);
  const isSnowCode = [56, 57, 66, 67, 71, 73, 75, 77, 85, 86].includes(weatherCode);
  const isThunderstorm = [95, 96, 99].includes(weatherCode);

  const umbrellaNeeded = precipSum >= 0.8 || precipProb >= 40 || isRainCode;
  const isWet = precipSum >= 1.0 || precipProb >= 50 || isRainCode || isSnowCode;

  // Laundry drying suitability
  const laundryFriendly = !isWet && precipProb < 30 && tempMax >= 15 && uvMax >= 2;

  // Clothing tip based on max/min temperatures
  let clothingTip = '';
  if (tempMax < 5) {
    clothingTip = 'Heavy winter coat, scarf, and warm insulated gloves recommended.';
  } else if (tempMax < 14) {
    clothingTip = 'Chilly weather: dress in warm layers with a jacket or sweater.';
  } else if (tempMax < 21) {
    clothingTip = 'Pleasant: a light jacket, cardigan, or long sleeves will keep you comfortable.';
  } else if (tempMax < 29) {
    clothingTip = 'Comfortably warm: comfortable t-shirt, breathable fabrics, and sunglasses.';
  } else {
    clothingTip = 'Hot conditions: wear loose light clothing, a sun hat, and drink plenty of water.';
  }

  if (uvMax >= 6) {
    clothingTip += ' Apply sunscreen (SPF 30+).';
  }

  // Determine suitability & tag
  let suitability: DayRecommendation['suitability'] = 'good';
  let tag = 'Pleasant Day';
  let summary = '';

  if (isThunderstorm) {
    suitability = 'poor';
    tag = 'Thunderstorm Alert';
    summary = 'Thunderstorms expected. Best to plan indoor activities and avoid open areas.';
  } else if (isSnowCode) {
    suitability = 'caution';
    tag = 'Snow Expected';
    summary = 'Snowfall or icy conditions expected. Allow extra travel time and dress warmly.';
  } else if (isWet && precipSum >= 5) {
    suitability = 'poor';
    tag = 'Heavy Rain / Wet';
    summary = 'Substantial rain expected. Keep umbrella close and wear water-resistant shoes.';
  } else if (isWet) {
    suitability = 'caution';
    tag = 'Rain Showers';
    summary = 'Passing rain showers likely. Carry a compact umbrella just in case.';
  } else if (windMax >= 40) {
    suitability = 'caution';
    tag = 'Brisk & Windy';
    summary = 'Gusty winds expected. Secure lightweight balcony items and wear a windbreaker.';
  } else if (tempMax >= 31) {
    suitability = 'caution';
    tag = 'Hot & Sunny';
    summary = 'High heat. Schedule outdoor exercise early in the morning or late evening.';
  } else if (tempMax >= 18 && tempMax <= 27 && precipProb < 20 && uvMax >= 3) {
    suitability = 'great';
    tag = 'Ideal Outdoor Day';
    summary = 'Splendid weather. Highly recommended for sports, parks, cycling, or outdoor dining.';
  } else if (tempMax >= 15 && tempMax <= 28 && precipProb < 35) {
    suitability = 'good';
    tag = 'Good for Outings';
    summary = 'Comfortable conditions overall with minimal weather disruptions expected.';
  } else {
    suitability = 'good';
    tag = 'Mild & Quiet';
    summary = 'Steady weather without extreme shifts. Standard routine plans look solid.';
  }

  const outdoorFriendly = suitability === 'great' || (suitability === 'good' && !umbrellaNeeded);

  return {
    tag,
    suitability,
    umbrellaNeeded,
    laundryFriendly,
    outdoorFriendly,
    clothingTip,
    summary,
  };
}

/**
 * Builds the 7-day planning overview for layman users
 */
export function buildWeeklyPlanning(dailyList: DailyForecast[]): WeeklyPlanning {
  if (dailyList.length === 0) {
    return {
      bestOutdoorDay: 'N/A',
      rainDays: [],
      generalOverview: 'Weather data is currently loading.',
      umbrellaSummary: 'Check daily forecast for rain updates.',
      clothingSummary: 'Review daily conditions for attire advice.',
      clothingBadge: 'Comfortable',
      laundrySummary: 'Review daily conditions.',
      outdoorSummary: 'Review daily conditions.',
    };
  }

  // Find rain days
  const rainDayNames = dailyList
    .filter((d) => d.recommendation.umbrellaNeeded)
    .map((d) => (d.isToday ? 'Today' : d.dayName));

  // Find best outdoor day
  let bestDay = dailyList[0];
  let bestScore = -1;

  dailyList.forEach((d) => {
    let score = 0;
    if (d.recommendation.suitability === 'great') score += 10;
    else if (d.recommendation.suitability === 'good') score += 6;
    else if (d.recommendation.suitability === 'caution') score += 2;

    if (!d.recommendation.umbrellaNeeded) score += 4;
    if (d.precipitation_sum < 0.2) score += 3;
    if (d.temp_max >= 18 && d.temp_max <= 26) score += 4;
    if (d.wind_speed_max < 20) score += 2;

    if (score > bestScore) {
      bestScore = score;
      bestDay = d;
    }
  });

  const bestDayLabel = bestDay.isToday ? 'Today' : bestDay.dayName;

  // Summaries
  let umbrellaSummary = '';
  if (rainDayNames.length === 0) {
    umbrellaSummary = 'No significant rain expected this week. Leave the umbrella at home!';
  } else if (rainDayNames.length === 1) {
    umbrellaSummary = `Keep an umbrella handy on ${rainDayNames[0]}. The rest of the week looks mostly dry.`;
  } else {
    umbrellaSummary = `Carry an umbrella on ${rainDayNames.join(', ')} due to anticipated rain.`;
  }

  // Analyze 7-day temperature and condition profile for what to wear
  const avgTempMax = dailyList.reduce((acc, d) => acc + d.temp_max, 0) / dailyList.length;
  const minTempMin = Math.min(...dailyList.map((d) => d.temp_min));
  const maxTempMax = Math.max(...dailyList.map((d) => d.temp_max));
  const hasRain = rainDayNames.length > 0;
  const tempSpread = maxTempMax - minTempMin;

  let clothingBadge = 'Balanced';
  let clothingSummary = '';

  if (maxTempMax < 6) {
    clothingBadge = 'Heavy Winter';
    clothingSummary = 'Dress in heavy winter coats, thermal innerwear, warm scarves, and insulated gloves.';
  } else if (avgTempMax < 14) {
    clothingBadge = 'Warm Layers';
    clothingSummary = 'Chilly weather ahead: dress in warm layers with sweaters, hoodies, and a windproof jacket.';
  } else if (tempSpread >= 12 && avgTempMax >= 15 && avgTempMax <= 24) {
    clothingBadge = 'Layered Attire';
    clothingSummary = 'Noticeable day-to-night shifts: start with light jackets in the morning and switch to breathable tees by afternoon.';
  } else if (avgTempMax <= 22) {
    clothingBadge = 'Light Layers';
    clothingSummary = 'Comfortable mild weather: casual long sleeves, light cardigans, or an easy zip-up jacket will keep you cozy.';
  } else if (avgTempMax <= 28) {
    clothingBadge = 'Mild & Casual';
    clothingSummary = 'Pleasantly warm: opt for breathable cotton tops, comfortable shorts or trousers, and sunglasses.';
  } else {
    clothingBadge = 'Summer Wear';
    clothingSummary = 'Hot temperatures: choose lightweight, loose-fitting fabrics, UV sun hats, and stay hydrated.';
  }

  if (hasRain && !clothingSummary.includes('water-resistant')) {
    clothingSummary += ' Pair with water-resistant footwear on rainy days.';
  }

  const laundryDays = dailyList
    .filter((d) => d.recommendation.laundryFriendly)
    .map((d) => (d.isToday ? 'Today' : d.dayName));

  let laundrySummary = '';
  if (laundryDays.length > 0) {
    laundrySummary = `Prime days for outdoor laundry drying: ${laundryDays.slice(0, 3).join(', ')}.`;
  } else {
    laundrySummary = 'High humidity or showers indicate indoor clothes drying is safer this week.';
  }

  const outdoorSummary = `Top pick for outdoor workouts, errands, or park outings is ${bestDayLabel} (${bestDay.recommendation.tag.toLowerCase()}).`;

  let generalOverview = '';
  if (rainDayNames.length >= 4) {
    generalOverview = 'Expect an unsettled, damp week with frequent rain showers. Plan plenty of indoor leisure activities.';
  } else if (rainDayNames.length === 0) {
    generalOverview = 'A glorious, dry 7-day stretch ahead with clear skies and reliable weather for outdoor plans.';
  } else {
    generalOverview = `A balanced week ahead with mixed conditions. ${bestDayLabel} stands out as the most pleasant day, while ${rainDayNames.join(' and ')} will see wet weather.`;
  }

  return {
    bestOutdoorDay: bestDayLabel,
    rainDays: rainDayNames,
    generalOverview,
    umbrellaSummary,
    clothingSummary,
    clothingBadge,
    laundrySummary,
    outdoorSummary,
  };
}

/**
 * Temperature converter helper
 */
export function formatTemperature(celsius: number, unit: 'celsius' | 'fahrenheit'): string {
  if (unit === 'fahrenheit') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}
