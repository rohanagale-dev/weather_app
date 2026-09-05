import React from 'react';
import {
  Compass,
  Umbrella,
  Sun,
  Shirt,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { WeeklyPlanning } from '../types';

interface WeeklyPlannerProps {
  planning: WeeklyPlanning;
}

export const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ planning }) => {
  return (
    <div
      id="weekly-planner-card"
      className="w-full h-full bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-7 shadow-xs flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-zinc-500" />
            <h3 className="text-sm sm:text-base font-semibold tracking-tight text-zinc-900">
              Weekly Planning Recommendations
            </h3>
          </div>
          <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-full border border-zinc-200/60">
            7 Days
          </span>
        </div>

        {/* Sleek Hero Overview Banner */}
        <div
          id="weekly-overview-banner"
          className="bg-zinc-900 text-white rounded-xl p-4 sm:p-5 shadow-xs mt-4 relative overflow-hidden"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-zinc-800 text-zinc-200 shrink-0 mt-0.5 border border-zinc-700/60">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                  Weekly Outlook & Strategy
                </h4>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
                  Forecast
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                {planning.generalOverview}
              </p>
            </div>
          </div>
        </div>

        {/* 3 Practical Pillar Recommendations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          {/* Pillar 1: Outdoor Activities */}
          <div
            id="planner-card-outdoor"
            className="bg-zinc-50/70 rounded-xl border border-zinc-100/90 p-3.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1 pb-2.5 border-b border-zinc-200/60">
                <div className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <h5 className="text-xs font-semibold text-zinc-900 truncate">
                    Outdoor
                  </h5>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.2 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full shrink-0">
                  Best: {planning.bestOutdoorDay}
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 mt-2.5 leading-relaxed">
                {planning.outdoorSummary}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-200/60 text-[10px] text-zinc-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
              <span className="truncate">Optimal for walks & running</span>
            </div>
          </div>

          {/* Pillar 2: Umbrella Guide */}
          <div
            id="planner-card-rain"
            className="bg-zinc-50/70 rounded-xl border border-zinc-100/90 p-3.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1 pb-2.5 border-b border-zinc-200/60">
                <div className="flex items-center gap-1.5">
                  <Umbrella className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <h5 className="text-xs font-semibold text-zinc-900 truncate">
                    Umbrella
                  </h5>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.2 bg-sky-50 text-sky-800 border border-sky-200/80 rounded-full shrink-0">
                  {planning.rainDays.length > 0 ? `${planning.rainDays.length} Rain Days` : 'Dry Week'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 mt-2.5 leading-relaxed">
                {planning.umbrellaSummary}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-200/60 text-[10px] text-zinc-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-sky-500 shrink-0" />
              <span className="truncate">Plan commutes & transit</span>
            </div>
          </div>

          {/* Pillar 3: What to Wear */}
          <div
            id="planner-card-clothing"
            className="bg-zinc-50/70 rounded-xl border border-zinc-100/90 p-3.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1 pb-2.5 border-b border-zinc-200/60">
                <div className="flex items-center gap-1.5">
                  <Shirt className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <h5 className="text-xs font-semibold text-zinc-900 truncate">
                    What to Wear
                  </h5>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.2 bg-indigo-50 text-indigo-800 border border-indigo-200/80 rounded-full shrink-0">
                  {planning.clothingBadge}
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 mt-2.5 leading-relaxed">
                {planning.clothingSummary}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-200/60 text-[10px] text-zinc-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-indigo-500 shrink-0" />
              <span className="truncate">Daily outfit & layering tips</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer information */}
      <div className="mt-5 pt-3 border-t border-zinc-100 text-[10px] text-zinc-400 flex items-center justify-between">
        <span>Practical layperson advice calibrated to 7-day forecast</span>
        <span>7-Day Analysis</span>
      </div>
    </div>
  );
};

