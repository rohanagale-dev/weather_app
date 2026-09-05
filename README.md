# Weather Forecast & Planner

A fast, responsive, and modern weather forecasting and weekly planning application built with React, TypeScript, Tailwind CSS, and Open-Meteo APIs.

---

## Overview

**Weather Forecast & Planner** provides accurate live conditions, a comprehensive 7-day meteorological forecast, and practical day-to-day planning recommendations (outdoor suitability, umbrella advisories, and what-to-wear layering tips) tailored for everyday decision-making.

The application uses open meteorological datasets without requiring proprietary API keys, featuring real-time geocoding search across global cities and seamless metric/imperial unit toggling.

---

## Features

- **Current Weather Observation**:
  - Real-time temperature and feels-like temperature.
  - Meteorological condition assessment and status indicators.
  - Secondary atmospheric metrics: Humidity, Wind Speed & Direction, UV Index, and Air Quality (AQI / PM2.5 / PM10).

- **Weekly Planning Recommendations**:
  - **Outdoor Pillar**: Identifies the best outdoor day and highlights optimal periods for running, walking, or sports.
  - **Umbrella Guide**: Aggregates expected rain days and offers precipitation warnings.
  - **What to Wear**: Suggests temperature-calibrated daily wardrobe choices, outfit layering strategies, and climate profile tags (e.g., *Layered Attire*, *Light Layers*, *Warm Layers*).

- **7-Day Meteorological Forecast**:
  - Daily maximum and minimum temperatures.
  - Strict precipitation measurement in millimeters (`mm`) alongside maximum precipitation probability (`%`).
  - Clear condition badges (e.g., *Ideal Outdoor Day*, *Rain Showers*, *Partly Cloudy*).

- **Global Geocoding & City Search**:
  - Instant city search with debounced querying against Open-Meteo Geocoding.
  - Quick-select buttons for preset global metropolitan hubs (London, New York, Tokyo, Paris, Sydney).
  - Geolocation detection to quickly locate your current weather conditions.

- **User Preferences**:
  - One-click toggle between Celsius (°C) and Fahrenheit (°F).
  - Manual refresh trigger.
  - Persistent state and responsive layout designed for mobile, tablet, and desktop viewports.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **APIs**: [Open-Meteo Weather & Geocoding APIs](https://open-meteo.com/) (Free, reliable, no API key required)

---

## Project Structure

```text
├── public/                 # Static assets
├── src/
│   ├── components/         # Modular UI components
│   │   ├── CurrentWeather.tsx       # Live conditions & atmospheric metrics grid
│   │   ├── DailyForecastSection.tsx # 7-day forecast cards
│   │   ├── Header.tsx               # App header, search bar, unit toggle, & geolocation
│   │   ├── WeatherIcon.tsx          # Dynamic WMO weather icon mapper
│   │   └── WeeklyPlanner.tsx        # Weekly planning recommendation pillars
│   ├── services/
│   │   └── weatherService.ts        # Open-Meteo API integrations (Forecast, AQI, Geocoding)
│   ├── utils/
│   │   ├── planner.ts               # Heuristic algorithms for attire, rain, and outdoor advice
│   │   └── wmoCodes.ts              # WMO weather code definitions and category mapping
│   ├── types.ts            # TypeScript interfaces and data models
│   ├── App.tsx             # Root dashboard state & layout orchestration
│   ├── main.tsx            # React application entry point
│   └── index.css           # Tailwind CSS styles and custom utilities
├── metadata.json           # Application metadata and platform capabilities
├── package.json            # Project dependencies and run scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **bun** / **yarn**

### Installation

1. Clone or download the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the local development server:
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

### Production Build

Compile the application for production deployment:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

### Type Checking & Linting

Run TypeScript type-checking to verify code integrity:
```bash
npm run lint
```

---

## Data Sources & Attribution

All weather forecast, atmospheric air quality, and geographic search data are retrieved from [Open-Meteo](https://open-meteo.com/):
- **Weather Forecast API**: WMO-compliant temperature, wind, humidity, UV index, and precipitation data.
- **Air Quality API**: US AQI, European AQI, PM2.5, and PM10 particulate levels.
- **Geocoding API**: Global location search and timezone coordinate mapping.

*No API key is required.*

---

## Deployment & CI/CD Workflow

This project is developed in **Google AI Studio**, pushed to **GitHub**, and continuously deployed through **Cloudflare Pages**.

### 1. Export from Google AI Studio to GitHub

1. Open your project in **Google AI Studio**.
2. Click on the **Settings** (gear icon) or project menu in the top navigation.
3. Select **Export to GitHub**.
4. Authenticate your GitHub account and choose to create a new repository or sync commits to an existing repository.

---

### 2. Deploying to Cloudflare Pages (Continuous Deployment)

Cloudflare Pages automatically triggers builds and deploys updates whenever changes are pushed to your GitHub repository.

1. Sign in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** > **Create application** > **Pages**.
3. Select **Connect to Git** and choose your GitHub repository.
4. Configure the build parameters:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Production branch**: `main`
5. Click **Save and Deploy**. Cloudflare Pages will build the app and assign a free `*.pages.dev` URL with automatic SSL and edge caching.

---

### 3. Cloudflare Configuration Notes

- **Zero API Keys Required**: The application communicates with public Open-Meteo meteorological endpoints, so no secret environment variables or server keys need to be added to Cloudflare Pages.
- **Client-Side SPA**: All routing, geocoding requests, and layout rendering are handled client-side on Cloudflare's global edge network.

---

## License

This project is licensed under the [MIT License](LICENSE).
