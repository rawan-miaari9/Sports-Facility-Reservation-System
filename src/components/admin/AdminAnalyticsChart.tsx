"use client";

import React, { useState } from 'react';

interface ChartItem {
  day: string;
  util: number;
  revenue: number;
}

interface AnalyticsProps {
  chartData: ChartItem[];
}

export default function AdminAnalyticsChart({ chartData }: AnalyticsProps) {
  const [activeTab, setActiveTab] = useState<'utilization' | 'revenue'>('utilization');

  const maxUtilVal = 45;
  const maxRevVal = 1600;

  return (
    <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-display font-bold text-base text-on-surface">System Performance Analytics</h3>
          <p className="text-on-surface-variant text-[11px] mt-0.5">Real-time daily booking metric visualizations.</p>
        </div>

        <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant">
          <button
            type="button"
            onClick={() => setActiveTab('utilization')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'utilization' ? 'bg-white text-primary shadow-sm' : 'text-outline hover:text-on-surface'
            }`}
          >
            Usage (Hrs)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('revenue')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'revenue' ? 'bg-white text-primary shadow-sm' : 'text-outline hover:text-on-surface'
            }`}
          >
            Revenue ($)
          </button>
        </div>
      </div>

      <div className="h-64 w-full bg-surface-container-lowest p-4 rounded-xl border border-outline-variant relative flex items-end justify-between pt-8">
        <div className="absolute left-4 right-4 top-1/4 border-t border-outline-variant/40" />
        <div className="absolute left-4 right-4 top-2/4 border-t border-outline-variant/40" />
        <div className="absolute left-4 right-4 top-3/4 border-t border-outline-variant/40" />

        {chartData.map((data, index) => {
          const barVal = activeTab === 'utilization' ? data.util : data.revenue;
          const maxVal = activeTab === 'utilization' ? maxUtilVal : maxRevVal;
          const heightPercent = Math.min((barVal / maxVal) * 100, 100);

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 group z-10 relative">
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-[10px] font-mono font-bold px-2 py-1 rounded shadow-md -translate-y-2 pointer-events-none">
                {activeTab === 'utilization' ? `${data.util} hrs` : `$${data.revenue}`}
              </div>

              <div className="w-8 sm:w-12 bg-surface-container-high rounded-t-lg overflow-hidden h-44 flex items-end">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    activeTab === 'utilization' ? 'bg-primary-container' : 'bg-secondary'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              <span className="text-[10px] font-mono text-outline font-bold uppercase">{data.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}