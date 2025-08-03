import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";
import Header from "@/components/Header";
import DataTable from "@/components/DataTable";
import type { WeatherData } from "@/types/weather";

export default function Database() {
  const { data: weatherData = [], isLoading, refetch } = useQuery<WeatherData[]>({
    queryKey: ["/api/weather/data"],
  });

  const handleManualCollection = async () => {
    try {
      const response = await fetch("/api/weather/collect", { method: "POST" });
      if (response.ok) {
        refetch();
      }
    } catch (error) {
      console.error("Manual collection error:", error);
    }
  };

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

  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-6 space-y-6">
        <div className="weather-card rounded-lg p-6 shadow-lg border border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Database Management</h1>
              <p className="text-gray-400">View and manage weather data collection</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={handleManualCollection}
                className="btn-primary text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
              >
                <RefreshCw size={16} />
                <span>Collect Data</span>
              </Button>
              <Button 
                onClick={handleExport}
                className="btn-success text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Export All</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Database Statistics */}
        <section className="weather-card rounded-lg p-6 shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Database Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[var(--dark-bg)] rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-400">Total Records</p>
              <p className="text-2xl font-bold text-white">{weatherData.length}</p>
            </div>
            <div className="bg-[var(--dark-bg)] rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-400">Latest Update</p>
              <p className="text-lg font-semibold text-white">
                {weatherData.length > 0 
                  ? new Date(weatherData[0].timestamp).toLocaleDateString()
                  : "No data"
                }
              </p>
            </div>
            <div className="bg-[var(--dark-bg)] rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-400">Data Range</p>
              <p className="text-lg font-semibold text-white">
                {weatherData.length > 0 
                  ? `${Math.ceil(weatherData.length / 24)} days`
                  : "0 days"
                }
              </p>
            </div>
            <div className="bg-[var(--dark-bg)] rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-400">Collection Status</p>
              <p className="text-lg font-semibold weather-success">Active</p>
            </div>
          </div>
        </section>

        <DataTable data={weatherData} onExport={handleExport} />
      </main>
    </div>
  );
}
