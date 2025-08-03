import { useRef, useEffect } from "react";
import { Chart, ChartConfiguration, registerables } from "chart.js";
import type { WeatherData } from "@/types/weather";

Chart.register(...registerables);

interface WeatherChartProps {
  data: WeatherData[];
  type: "temperature" | "wind";
  title: string;
  height?: number;
}

export default function WeatherChart({ data, type, title, height = 320 }: WeatherChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const labels = data.map(d => 
      new Date(d.timestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit'
      })
    );

    const isTemperature = type === "temperature";
    const forecastData = data.map(d => isTemperature ? d.forecastTemp : d.forecastWind);
    const actualData = data.map(d => isTemperature ? d.actualTemp : d.actualWind);

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: `Forecast ${isTemperature ? 'Temp' : 'Wind'}`,
            data: forecastData,
            borderColor: 'hsl(36, 87%, 52%)', // accent color
            backgroundColor: 'hsla(36, 87%, 52%, 0.1)',
            tension: 0.4,
            pointBackgroundColor: 'hsl(36, 87%, 52%)',
            pointBorderColor: 'hsl(36, 87%, 52%)',
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: `Actual ${isTemperature ? 'Temp' : 'Wind'}`,
            data: actualData,
            borderColor: isTemperature ? 'hsl(207, 65%, 47%)' : 'hsl(166, 60%, 53%)', // primary or secondary
            backgroundColor: isTemperature ? 'hsla(207, 65%, 47%, 0.1)' : 'hsla(166, 60%, 53%, 0.1)',
            tension: 0.4,
            pointBackgroundColor: isTemperature ? 'hsl(207, 65%, 47%)' : 'hsl(166, 60%, 53%)',
            pointBorderColor: isTemperature ? 'hsl(207, 65%, 47%)' : 'hsl(166, 60%, 53%)',
            pointRadius: 4,
            pointHoverRadius: 6,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: 'hsl(0, 0%, 88%)',
              font: {
                family: 'Open Sans',
                size: 12
              }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'hsl(220, 26%, 25%)',
            titleColor: 'hsl(0, 0%, 98%)',
            bodyColor: 'hsl(0, 0%, 88%)',
            borderColor: 'hsl(240, 3.7%, 25%)',
            borderWidth: 1,
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        scales: {
          x: {
            ticks: { 
              color: 'hsl(240, 5%, 64.9%)',
              font: {
                family: 'Open Sans',
                size: 11
              }
            },
            grid: { 
              color: 'hsl(240, 3.7%, 25%)',
              drawBorder: false
            }
          },
          y: {
            ticks: { 
              color: 'hsl(240, 5%, 64.9%)',
              font: {
                family: 'Open Sans',
                size: 11
              }
            },
            grid: { 
              color: 'hsl(240, 3.7%, 25%)',
              drawBorder: false
            }
          }
        }
      }
    };

    chartInstanceRef.current = new Chart(ctx, config);

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data, type]);

  if (!data.length) {
    return (
      <section className="weather-card rounded-lg p-6 shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center h-80">
          <p className="text-gray-400">No data available for chart</p>
        </div>
      </section>
    );
  }

  return (
    <section className="weather-card rounded-lg p-6 shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="chart-container" style={{ height: `${height}px` }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </section>
  );
}
