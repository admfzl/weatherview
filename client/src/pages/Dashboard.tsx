import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import CurrentWeather from "@/components/CurrentWeather";
import DateFilter from "@/components/DateFilter";
import WeatherChart from "@/components/WeatherChart";
import DataTable from "@/components/DataTable";
import type { WeatherData, DateRange } from "@/types/weather";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  const { data: weatherData = [], isLoading } = useQuery<WeatherData[]>({
    queryKey: dateRange 
      ? ["/api/weather/data", { startDate: dateRange.startDate, endDate: dateRange.endDate }]
      : ["/api/weather/data"],
    refetchInterval: 60000, // Refresh every minute
  });

  const handleExport = async () => {
    try {
      const response = await fetch("/api/weather/export");
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "weather_data.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="p-6 space-y-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading weather data...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-6 space-y-6">
        <CurrentWeather />
        
        <DateFilter onDateRangeChange={setDateRange} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <WeatherChart 
            data={weatherData} 
            type="temperature" 
            title="Forecast vs Actual Temperature (°C)" 
          />
          <WeatherChart 
            data={weatherData} 
            type="wind" 
            title="Wind Speed Comparison (km/h)" 
          />
        </div>

        <DataTable data={weatherData} onExport={handleExport} />
      </main>
    </div>
  );
}
