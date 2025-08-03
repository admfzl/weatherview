import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import WeatherChart from "@/components/WeatherChart";
import DateFilter from "@/components/DateFilter";
import type { WeatherData, DateRange, DailyMSEData } from "@/types/weather";

export default function Analysis() {
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  const { data: weatherData = [] } = useQuery<WeatherData[]>({
    queryKey: dateRange 
      ? ["/api/weather/data", { startDate: dateRange.startDate, endDate: dateRange.endDate }]
      : ["/api/weather/data"],
  });

  const { data: dailyMSE = [] } = useQuery<DailyMSEData[]>({
    queryKey: ["/api/weather/daily-mse"],
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-6 space-y-6">
        <div className="weather-card rounded-lg p-6 shadow-lg border border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-2">Weather Analysis</h1>
          <p className="text-gray-400">Detailed analysis of weather forecast accuracy and trends</p>
        </div>

        <DateFilter onDateRangeChange={setDateRange} />

        {/* Detailed Charts */}
        <div className="space-y-6">
          <WeatherChart 
            data={weatherData} 
            type="temperature" 
            title="Temperature Analysis - Forecast vs Actual" 
            height={400}
          />
          <WeatherChart 
            data={weatherData} 
            type="wind" 
            title="Wind Speed Analysis - Forecast vs Actual" 
            height={400}
          />
        </div>

        {/* Daily MSE Trends */}
        <section className="weather-card rounded-lg p-6 shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Daily MSE Trends</h3>
          {dailyMSE.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dailyMSE.slice(0, 7).map((day) => (
                <div key={day.date} className="bg-[var(--dark-bg)] rounded-lg p-4 border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">{day.date}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Temp MSE:</span>
                      <span className="text-sm weather-accent font-medium">{day.temperatureMSE.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Wind MSE:</span>
                      <span className="text-sm weather-secondary font-medium">{day.windMSE.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No daily MSE data available</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
