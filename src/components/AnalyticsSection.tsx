import React, { useEffect, useRef } from 'react';
import {
  FOREST_COVER_TREND,
  NATIONAL_STATS_2023,
  STATE_FOREST_DATA,
  FOREST_COVER_CHANGE,
} from '../data/forestData';
import { BarChart3, LineChart, PieChart, TrendingUp } from 'lucide-react';

declare const Chart: any;

export const AnalyticsSection: React.FC = () => {
  const chartTrendRef = useRef<HTMLCanvasElement | null>(null);
  const chartCompRef = useRef<HTMLCanvasElement | null>(null);
  const chartGrowthRef = useRef<HTMLCanvasElement | null>(null);
  const chartTopAreaRef = useRef<HTMLCanvasElement | null>(null);
  const chartTopPctRef = useRef<HTMLCanvasElement | null>(null);
  const chartChangeRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof Chart === 'undefined') return;

    const chartInstances: any[] = [];

    // Global Chart.js dark theme settings
    Chart.defaults.color = '#9dc9af';
    Chart.defaults.font.family = 'Inter, sans-serif';

    // 1. Trend Line Chart
    if (chartTrendRef.current) {
      const ctx = chartTrendRef.current.getContext('2d');
      if (ctx) {
        const chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: FOREST_COVER_TREND.map((d) => d.year.toString()),
            datasets: [
              {
                label: 'Forest Cover (sq km)',
                data: FOREST_COVER_TREND.map((d) => d.forestCoverSqKm),
                borderColor: '#3db56c',
                backgroundColor: 'rgba(61, 181, 108, 0.1)',
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#3db56c',
                pointRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: {
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                min: 660000,
              },
              x: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
              },
            },
          },
        });
        chartInstances.push(chart);
      }
    }

    // 2. Composition Doughnut
    if (chartCompRef.current) {
      const ctx = chartCompRef.current.getContext('2d');
      if (ctx) {
        const stats = NATIONAL_STATS_2023;
        const otherArea = stats.totalGeographicalArea - stats.totalForestAndTreeCover.areaSqKm;

        const chart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Forest Cover', 'Tree Cover', 'Other Land'],
            datasets: [
              {
                data: [stats.forestCover.areaSqKm, stats.treeCover.areaSqKm, otherArea],
                backgroundColor: ['#3db56c', '#74c99a', '#22382c'],
                borderColor: '#0d1812',
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { color: '#ffffff' } },
            },
          },
        });
        chartInstances.push(chart);
      }
    }

    // 3. Growth Rate Bar Chart
    if (chartGrowthRef.current) {
      const ctx = chartGrowthRef.current.getContext('2d');
      if (ctx) {
        const labels: string[] = [];
        const values: number[] = [];
        for (let i = 1; i < FOREST_COVER_TREND.length; i++) {
          labels.push(`${FOREST_COVER_TREND[i - 1].year}→${FOREST_COVER_TREND[i].year}`);
          values.push(FOREST_COVER_TREND[i].forestCoverSqKm - FOREST_COVER_TREND[i - 1].forestCoverSqKm);
        }

        const chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Net Change (sq km)',
                data: values,
                backgroundColor: values.map((v) => (v >= 0 ? '#3db56c' : '#e07b39')),
                borderRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { grid: { color: 'rgba(255, 255, 255, 0.1)' } },
              x: { grid: { display: false } },
            },
          },
        });
        chartInstances.push(chart);
      }
    }

    // 4. Top 15 Area Chart
    if (chartTopAreaRef.current) {
      const ctx = chartTopAreaRef.current.getContext('2d');
      if (ctx) {
        const top15 = [...STATE_FOREST_DATA].sort((a, b) => b.forestCoverSqKm - a.forestCoverSqKm).slice(0, 15);

        const chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: top15.map((s) => s.state),
            datasets: [
              {
                axis: 'y',
                label: 'Forest Cover (sq km)',
                data: top15.map((s) => s.forestCoverSqKm),
                backgroundColor: '#3db56c',
                borderRadius: 4,
              },
            ],
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: 'rgba(255, 255, 255, 0.1)' } },
              y: { grid: { display: false } },
            },
          },
        });
        chartInstances.push(chart);
      }
    }

    // 5. Top 10 Pct Chart
    if (chartTopPctRef.current) {
      const ctx = chartTopPctRef.current.getContext('2d');
      if (ctx) {
        const topPct = [...STATE_FOREST_DATA]
          .map((s) => ({ ...s, pct: (s.forestCoverSqKm / s.geoAreaSqKm) * 100 }))
          .sort((a, b) => b.pct - a.pct)
          .slice(0, 10);

        const chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: topPct.map((s) => s.state),
            datasets: [
              {
                axis: 'y',
                label: '% of Area',
                data: topPct.map((s) => parseFloat(s.pct.toFixed(1))),
                backgroundColor: '#74c99a',
                borderRadius: 4,
              },
            ],
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, max: 100 },
              y: { grid: { display: false } },
            },
          },
        });
        chartInstances.push(chart);
      }
    }

    // 6. Change Chart
    if (chartChangeRef.current) {
      const ctx = chartChangeRef.current.getContext('2d');
      if (ctx) {
        const chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: FOREST_COVER_CHANGE.map((d) => d.state),
            datasets: [
              {
                label: 'Change (sq km)',
                data: FOREST_COVER_CHANGE.map((d) => d.changeSqKm),
                backgroundColor: FOREST_COVER_CHANGE.map((d) => (d.changeSqKm >= 0 ? '#3db56c' : '#d44c4c')),
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { grid: { color: 'rgba(255, 255, 255, 0.1)' } },
              x: { grid: { display: false } },
            },
          },
        });
        chartInstances.push(chart);
      }
    }

    return () => {
      chartInstances.forEach((chart) => chart.destroy());
    };
  }, []);

  return (
    <section id="analytics" className="py-20 px-6 sm:px-12 bg-black text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#3db56c] font-mono font-semibold mb-2 flex items-center gap-2">
              <BarChart3 size={16} /> Data Visualisations & Trends
            </div>
            <h2 className="text-3xl sm:text-5xl font-playfair italic font-normal tracking-tight">
              Analytics Dashboard
            </h2>
            <p className="text-sm text-white/60 mt-2 max-w-2xl leading-relaxed">
              Real-data graphs illustrating India&apos;s forest cover evolution, state rankings, and land composition from FSI ISFR biennial series.
            </p>
          </div>

          <div className="text-xs text-white/50 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
            Source: FSI ISFR Biennial Series (2001–2023)
          </div>
        </div>

        {/* Grid 1: Trend & Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <LineChart size={18} className="text-[#3db56c]" /> India Forest Cover Trend (2001–2023)
            </h3>
            <p className="text-xs text-white/50 mb-6">Biennial assessment in sq km</p>
            <div className="h-72 w-full">
              <canvas ref={chartTrendRef} />
            </div>
            <div className="text-[10px] text-white/40 border-t border-white/10 pt-3 mt-4">
              Source: FSI ISFR Reports 2001–2023 · fsi.nic.in
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <PieChart size={18} className="text-[#3db56c]" /> Land Cover Composition (ISFR 2023)
            </h3>
            <p className="text-xs text-white/50 mb-6">Forest Cover vs Tree Cover vs Other Land Use</p>
            <div className="h-72 w-full">
              <canvas ref={chartCompRef} />
            </div>
            <div className="text-[10px] text-white/40 border-t border-white/10 pt-3 mt-4">
              Source: FSI ISFR 2023 · fsi.nic.in
            </div>
          </div>
        </div>

        {/* Growth Rate Chart */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 mb-8">
          <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#3db56c]" /> Biennial Forest Cover Net Change
          </h3>
          <p className="text-xs text-white/50 mb-6">Net change in sq km between consecutive ISFR reports (Green = Gain, Orange = Loss)</p>
          <div className="h-64 w-full">
            <canvas ref={chartGrowthRef} />
          </div>
          <div className="text-[10px] text-white/40 border-t border-white/10 pt-3 mt-4">
            Source: Calculated from consecutive FSI reports
          </div>
        </div>

        {/* Grid 2: State Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white mb-1">Top 15 States by Forest Area (ISFR 2021)</h3>
            <p className="text-xs text-white/50 mb-6">Total forest cover in sq km</p>
            <div className="h-80 w-full">
              <canvas ref={chartTopAreaRef} />
            </div>
            <div className="text-[10px] text-white/40 border-t border-white/10 pt-3 mt-4">
              Source: FSI ISFR 2021 · fsi.nic.in
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white mb-1">Top 10 States by % of Area (ISFR 2021)</h3>
            <p className="text-xs text-white/50 mb-6">Forest cover as percentage of geographical area</p>
            <div className="h-80 w-full">
              <canvas ref={chartTopPctRef} />
            </div>
            <div className="text-[10px] text-white/40 border-t border-white/10 pt-3 mt-4">
              Source: FSI ISFR 2021 · fsi.nic.in
            </div>
          </div>
        </div>

        {/* Forest Cover Change Chart */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
          <h3 className="text-lg font-bold text-white mb-1">Forest Cover Change by State (ISFR 2019 → 2021)</h3>
          <p className="text-xs text-white/50 mb-6">Selected states showing maximum net gain/loss in sq km</p>
          <div className="h-64 w-full">
            <canvas ref={chartChangeRef} />
          </div>
          <div className="text-[10px] text-white/40 border-t border-white/10 pt-3 mt-4">
            Source: FSI ISFR 2021 compared with 2019 data
          </div>
        </div>
      </div>
    </section>
  );
};
