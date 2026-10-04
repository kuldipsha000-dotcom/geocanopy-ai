/**
 * CHART.JS ANALYTICS DASHBOARD
 * ==============================
 * All charts use VERIFIED data from Forest Survey of India (FSI).
 * Every chart has a visible source label.
 *
 * Data Source: Forest Survey of India (FSI)
 *   India State of Forest Report (ISFR) — biennial series
 *   https://fsi.nic.in/
 */

'use strict';

const Charts = (() => {

  // ── Chart.js defaults ─────────────────────────────────────────────────────
  function applyGlobalDefaults() {
    Chart.defaults.color = '#9dc9af';
    Chart.defaults.font.family = "'Inter', 'Segoe UI', system-ui, sans-serif";
    Chart.defaults.font.size   = 12;
    Chart.defaults.borderColor = 'rgba(42,72,53,0.5)';

    // Custom plugin: source label on every chart
    Chart.register({
      id: 'sourceLabel',
      afterDraw(chart) {
        const src = chart.options.sourceLabel;
        if (!src) return;
        const { ctx, chartArea } = chart;
        ctx.save();
        ctx.font = '10px Inter, system-ui';
        ctx.fillStyle = 'rgba(90,138,109,0.7)';
        ctx.textAlign = 'right';
        ctx.fillText(src, chartArea.right, chartArea.bottom + 36);
        ctx.restore();
      }
    });
  }

  // ── GREEN PALETTE ─────────────────────────────────────────────────────────
  const G = {
    bright:  '#3db56c',
    mid:     '#2d7a50',
    dark:    '#1a4731',
    light:   '#74c99a',
    pale:    '#c5ead6',
    danger:  '#d44c4c',
    warn:    '#f0a500',
    info:    '#4a9aba',
    grid:    'rgba(42,72,53,0.4)',
    bg:      'rgba(17,28,22,0.6)'
  };

  const gradientFill = (ctx, color1, color2) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
  };

  // ── 1. Forest Cover Trend Line (2001–2023) ────────────────────────────────
  function initTrendChart() {
    const canvas = document.getElementById('chartTrend');
    if (!canvas) return;

    const { data } = ForestData.FOREST_COVER_TREND;
    const labels   = data.map(d => d.year.toString());
    const values   = data.map(d => d.forestCoverSqKm);

    const ctx = canvas.getContext('2d');
    const gradient = gradientFill(ctx, 'rgba(61,181,108,0.35)', 'rgba(61,181,108,0.02)');

    new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Forest Cover (sq km)',
          data:  values,
          borderColor:     G.bright,
          backgroundColor: gradient,
          borderWidth:     2.5,
          pointBackgroundColor: G.bright,
          pointBorderColor:    '#0d2818',
          pointRadius:     4,
          pointHoverRadius: 7,
          fill:    true,
          tension: 0.35
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10,15,13,0.95)',
            borderColor:     G.grid,
            borderWidth:     1,
            titleColor:      '#e8f5ee',
            bodyColor:       '#9dc9af',
            callbacks: {
              label: ctx => ` Forest Cover: ${ctx.parsed.y.toLocaleString('en-IN')} sq km`,
              afterLabel: () => ' Source: FSI ISFR biennial series'
            }
          },
          sourceLabel: 'Source: Forest Survey of India (FSI) | ISFR 2023 | fsi.nic.in'
        },
        scales: {
          x: {
            grid:  { color: G.grid },
            ticks: { color: '#9dc9af' }
          },
          y: {
            grid:  { color: G.grid },
            ticks: {
              color: '#9dc9af',
              callback: v => (v / 1000).toFixed(0) + 'K km²'
            },
            title: {
              display: true,
              text:    'Forest Cover (sq km)',
              color:   '#5a8a6d'
            }
          }
        }
      }
    });
  }

  // ── 2. Top 15 States by Forest Area (Bar) ─────────────────────────────────
  function initAreaChart() {
    const canvas = document.getElementById('chartStatesArea');
    if (!canvas) return;

    const topStates = ForestData.TOP_STATES_BY_AREA;
    const labels    = topStates.map(s => s.state);
    const values    = topStates.map(s => s.forestCoverSqKm);

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Forest Cover (sq km)',
          data:  values,
          backgroundColor: values.map((_, i) =>
            i === 0 ? G.bright :
            i < 3   ? G.mid    :
                      G.dark
          ),
          borderColor:  'transparent',
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10,15,13,0.95)',
            borderColor:     G.grid,
            borderWidth:     1,
            titleColor:      '#e8f5ee',
            bodyColor:       '#9dc9af',
            callbacks: {
              label: ctx => ` ${ctx.parsed.x.toLocaleString('en-IN')} sq km`
            }
          },
          sourceLabel: 'Source: FSI, ISFR 2021 | fsi.nic.in'
        },
        scales: {
          x: {
            grid:  { color: G.grid },
            ticks: {
              color: '#9dc9af',
              callback: v => (v / 1000).toFixed(0) + 'K'
            },
            title: { display: true, text: 'Forest Cover (sq km)', color: '#5a8a6d' }
          },
          y: {
            grid:  { display: false },
            ticks: { color: '#9dc9af', font: { size: 11 } }
          }
        }
      }
    });
  }

  // ── 3. Top 10 States by % of State Area (Horizontal Bar) ──────────────────
  function initPercentChart() {
    const canvas = document.getElementById('chartStatesPct');
    if (!canvas) return;

    const top10 = ForestData.TOP_STATES_BY_PERCENTAGE.slice(0, 10);
    const labels = top10.map(s => s.state);
    const values = top10.map(s => s.forestPercentage);

    const colors = values.map(v =>
      v > 75 ? '#1a7c3e' :
      v > 60 ? '#238b45' :
      v > 45 ? '#41ab5d' :
      v > 30 ? '#74c476' : G.mid
    );

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Forest % of State Area',
          data:  values,
          backgroundColor: colors,
          borderRadius:    4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10,15,13,0.95)',
            borderColor:     G.grid,
            borderWidth:     1,
            titleColor:      '#e8f5ee',
            bodyColor:       '#9dc9af',
            callbacks: {
              label: ctx => ` ${ctx.parsed.x}% of state area under forest`
            }
          },
          sourceLabel: 'Source: FSI, ISFR 2021 | Calculated from published area data'
        },
        scales: {
          x: {
            grid:  { color: G.grid },
            max:   100,
            ticks: { color: '#9dc9af', callback: v => v + '%' },
            title: { display: true, text: '% of State Geographical Area', color: '#5a8a6d' }
          },
          y: {
            grid:  { display: false },
            ticks: { color: '#9dc9af', font: { size: 11 } }
          }
        }
      }
    });
  }

  // ── 4. Forest Cover Change 2019→2021 Selected States ──────────────────────
  function initChangeChart() {
    const canvas = document.getElementById('chartChange');
    if (!canvas) return;

    const { data } = ForestData.FOREST_COVER_CHANGE;
    const labels = data.map(d => d.state);
    const values = data.map(d => d.changeSqKm);

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Change (sq km)',
          data:  values,
          backgroundColor: values.map(v => v >= 0 ? 'rgba(61,181,108,0.75)' : 'rgba(212,76,76,0.75)'),
          borderColor:     values.map(v => v >= 0 ? G.bright : G.danger),
          borderWidth:     1,
          borderRadius:    4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10,15,13,0.95)',
            borderColor:     G.grid,
            borderWidth:     1,
            titleColor:      '#e8f5ee',
            bodyColor:       '#9dc9af',
            callbacks: {
              label: ctx => {
                const v = ctx.parsed.y;
                return ` ${v >= 0 ? '+' : ''}${v} sq km (${v >= 0 ? 'gain' : 'loss'})`;
              }
            }
          },
          sourceLabel: 'Source: FSI, ISFR 2021 (change vs ISFR 2019) | fsi.nic.in'
        },
        scales: {
          x: {
            grid:  { display: false },
            ticks: { color: '#9dc9af', font: { size: 10 }, maxRotation: 35 }
          },
          y: {
            grid:  { color: G.grid },
            ticks: {
              color: '#9dc9af',
              callback: v => (v >= 0 ? '+' : '') + v + ' km²'
            },
            title: { display: true, text: 'Forest Cover Change (sq km)', color: '#5a8a6d' }
          }
        }
      }
    });
  }

  // ── 5. National Forest vs Tree Cover Doughnut ─────────────────────────────
  function initCompositionChart() {
    const canvas = document.getElementById('chartComposition');
    if (!canvas) return;

    const { NATIONAL_STATS_2023 } = ForestData;
    const forest = NATIONAL_STATS_2023.forestCover.areaSqKm;
    const tree   = NATIONAL_STATS_2023.treeCover.areaSqKm;
    const other  = NATIONAL_STATS_2023.totalGeographicalArea - forest - tree;

    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: [
          'Forest Cover',
          'Tree Cover (outside forest)',
          'Other Land Use'
        ],
        datasets: [{
          data: [forest, tree, other],
          backgroundColor: [G.bright, G.mid, 'rgba(42,72,53,0.4)'],
          borderColor:     ['#0d2818','#0d2818','#0d2818'],
          borderWidth:     2,
          hoverOffset:     8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#9dc9af', padding: 16, font: { size: 11 } }
          },
          tooltip: {
            backgroundColor: 'rgba(10,15,13,0.95)',
            borderColor:     G.grid,
            borderWidth:     1,
            titleColor:      '#e8f5ee',
            bodyColor:       '#9dc9af',
            callbacks: {
              label: ctx => {
                const pct = ((ctx.parsed / NATIONAL_STATS_2023.totalGeographicalArea) * 100).toFixed(2);
                return ` ${ctx.parsed.toLocaleString('en-IN')} sq km (${pct}% of India)`;
              }
            }
          },
          sourceLabel: 'Source: FSI, ISFR 2023 | fsi.nic.in'
        }
      }
    });
  }

  // ── 6. Forest Cover Year-on-Year Growth Rate ──────────────────────────────
  function initGrowthChart() {
    const canvas = document.getElementById('chartGrowth');
    if (!canvas) return;

    const { data } = ForestData.FOREST_COVER_TREND;
    // Compute change between successive reports
    const labels = [];
    const values = [];
    for (let i = 1; i < data.length; i++) {
      labels.push(`${data[i-1].year}→${data[i].year}`);
      values.push(data[i].forestCoverSqKm - data[i-1].forestCoverSqKm);
    }

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Forest Cover Change (sq km)',
          data:  values,
          backgroundColor: values.map(v => v >= 0 ? 'rgba(61,181,108,0.7)' : 'rgba(212,76,76,0.7)'),
          borderColor:     values.map(v => v >= 0 ? G.bright : G.danger),
          borderWidth:     1,
          borderRadius:    3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10,15,13,0.95)',
            borderColor:     G.grid,
            borderWidth:     1,
            titleColor:      '#e8f5ee',
            bodyColor:       '#9dc9af',
            callbacks: {
              label: ctx => {
                const v = ctx.parsed.y;
                return ` ${v >= 0 ? '+' : ''}${v.toLocaleString('en-IN')} sq km`;
              }
            }
          },
          sourceLabel: 'Source: FSI ISFR biennial series | Calculated from consecutive reports'
        },
        scales: {
          x: {
            grid:  { display: false },
            ticks: { color: '#9dc9af', font: { size: 10 }, maxRotation: 30 }
          },
          y: {
            grid:  { color: G.grid },
            ticks: {
              color: '#9dc9af',
              callback: v => (v >= 0 ? '+' : '') + v.toLocaleString('en-IN')
            },
            title: { display: true, text: 'Change in Forest Cover (sq km)', color: '#5a8a6d' }
          }
        }
      }
    });
  }

  function init() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded');
      return;
    }
    applyGlobalDefaults();
    initTrendChart();
    initAreaChart();
    initPercentChart();
    initChangeChart();
    initCompositionChart();
    initGrowthChart();
  }

  return { init };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', Charts.init);
} else {
  Charts.init();
}
