import { useQuery } from "@tanstack/react-query";
import type { MSEData } from "@/types/weather";

export default function Header() {
  const { data: mseData } = useQuery<MSEData>({
    queryKey: ["/api/weather/mse"],
    refetchInterval: 60000, // Refresh every minute
  });

  const formatTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <header className="weather-card shadow-sm border-b border-gray-700 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">WeatherView</h2>
          <p className="text-gray-400 text-sm mt-1">
            Time Retrieve: {formatTime()}
          </p>
        </div>
        
        {/* MSE Metrics */}
        <div className="flex space-x-6">
          <div className="text-center">
            <p className="text-sm text-gray-400">Temperature MSE</p>
            <p className="text-xl font-bold weather-accent">
              {mseData?.temperatureMSE?.toFixed(3) || "0.000"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">Wind MSE</p>
            <p className="text-xl font-bold weather-secondary">
              {mseData?.windMSE?.toFixed(3) || "0.000"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
