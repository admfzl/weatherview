import { useQuery } from "@tanstack/react-query";
import type { WeatherData } from "@/types/weather";

export default function CurrentWeather() {
  const { data: currentWeather, isLoading } = useQuery<WeatherData>({
    queryKey: ["/api/weather/current"],
    refetchInterval: 60000, // Refresh every minute
  });

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <section className="weather-card rounded-lg p-6 shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Current Weather</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[var(--dark-bg)] rounded-lg p-4 border border-gray-700 animate-pulse">
              <div className="h-4 bg-gray-600 rounded mb-2"></div>
              <div className="h-6 bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!currentWeather) {
    return (
      <section className="weather-card rounded-lg p-6 shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Current Weather</h3>
        <div className="text-center py-8">
          <p className="text-gray-400">No current weather data available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="weather-card rounded-lg p-6 shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Current Weather</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location Card */}
        <div className="bg-[var(--dark-bg)] rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Location:</p>
          <p className="text-lg font-semibold text-white">{currentWeather.location}</p>
        </div>
        
        {/* Date Card */}
        <div className="bg-[var(--dark-bg)] rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Date:</p>
          <p className="text-lg font-semibold text-white">{formatDate()}</p>
        </div>
        
        {/* Temperature Card */}
        <div className="bg-[var(--dark-bg)] rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Temperature:</p>
          <p className="text-lg font-semibold weather-accent">{currentWeather.actualTemp.toFixed(1)} °C</p>
        </div>
        
        {/* Wind Speed Card */}
        <div className="bg-[var(--dark-bg)] rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Wind Speed:</p>
          <p className="text-lg font-semibold weather-secondary">{currentWeather.actualWind.toFixed(1)} km/h</p>
        </div>
      </div>
    </section>
  );
}
