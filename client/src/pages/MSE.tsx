import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import type { MSEData, DailyMSEData, WeatherData } from "@/types/weather";

export default function MSE() {
  const { data: mseData } = useQuery<MSEData>({
    queryKey: ["/api/weather/mse"],
  });

  const { data: dailyMSE = [] } = useQuery<DailyMSEData[]>({
    queryKey: ["/api/weather/daily-mse"],
  });

  const { data: weatherData = [] } = useQuery<WeatherData[]>({
    queryKey: ["/api/weather/data"],
  });

  const calculateAccuracy = (mse: number) => {
    // Simple accuracy metric based on MSE (lower MSE = higher accuracy)
    return Math.max(0, (100 - mse * 10)).toFixed(1);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-6 space-y-6">
        <div className="weather-card rounded-lg p-6 shadow-lg border border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-2">Mean Square Error Analysis</h1>
          <p className="text-gray-400">Comprehensive accuracy metrics for weather forecasting</p>
        </div>

        {/* Overall MSE Cards */}
        <section className="weather-card rounded-lg p-6 shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Overall Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--dark-bg)] rounded-lg p-6 border border-gray-700">
              <h4 className="text-sm text-gray-400 mb-2">Temperature Forecasting</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">MSE:</span>
                  <span className="text-2xl font-bold weather-accent">
                    {mseData?.temperatureMSE?.toFixed(3) || "0.000"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Accuracy:</span>
                  <span className="text-lg font-semibold weather-success">
                    {mseData ? calculateAccuracy(mseData.temperatureMSE) : "0.0"}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-[var(--dark-bg)] rounded-lg p-6 border border-gray-700">
              <h4 className="text-sm text-gray-400 mb-2">Wind Speed Forecasting</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">MSE:</span>
                  <span className="text-2xl font-bold weather-secondary">
                    {mseData?.windMSE?.toFixed(3) || "0.000"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Accuracy:</span>
                  <span className="text-lg font-semibold weather-success">
                    {mseData ? calculateAccuracy(mseData.windMSE) : "0.0"}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MSE Methodology */}
        <section className="weather-card rounded-lg p-6 shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">MSE Calculation Methodology</h3>
          <div className="space-y-4 text-gray-300">
            <div>
              <h4 className="font-medium text-white mb-2">Formula:</h4>
              <p className="bg-[var(--dark-bg)] p-3 rounded border border-gray-700 font-mono text-sm">
                MSE = Σ(forecast - actual)² / n
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Where:</h4>
              <ul className="space-y-1 text-sm">
                <li>• n = Total number of observations</li>
                <li>• forecast = Predicted value from Open-Meteo API</li>
                <li>• actual = Real-time measured value</li>
                <li>• Lower MSE indicates better forecast accuracy</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Daily MSE Table */}
        <section className="weather-card rounded-lg p-6 shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Daily MSE History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm weather-table">
              <thead className="bg-[var(--dark-bg)]">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Temperature MSE</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Wind MSE</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Temp Accuracy</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">Wind Accuracy</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {dailyMSE.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      No daily MSE data available
                    </td>
                  </tr>
                ) : (
                  dailyMSE.map((day) => (
                    <tr key={day.date} className="border-b border-gray-700 hover:bg-[var(--dark-bg)]">
                      <td className="px-4 py-3">{day.date}</td>
                      <td className="px-4 py-3 weather-accent font-medium">{day.temperatureMSE.toFixed(3)}</td>
                      <td className="px-4 py-3 weather-secondary font-medium">{day.windMSE.toFixed(3)}</td>
                      <td className="px-4 py-3 weather-success">{calculateAccuracy(day.temperatureMSE)}%</td>
                      <td className="px-4 py-3 weather-success">{calculateAccuracy(day.windMSE)}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Summary Statistics */}
        <section className="weather-card rounded-lg p-6 shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Summary Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[var(--dark-bg)] rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-400">Total Data Points</p>
              <p className="text-2xl font-bold text-white">{weatherData.length}</p>
            </div>
            <div className="bg-[var(--dark-bg)] rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-400">Best Temp Accuracy</p>
              <p className="text-2xl font-bold weather-success">
                {dailyMSE.length > 0 
                  ? `${calculateAccuracy(Math.min(...dailyMSE.map(d => d.temperatureMSE)))}%`
                  : "N/A"
                }
              </p>
            </div>
            <div className="bg-[var(--dark-bg)] rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-400">Best Wind Accuracy</p>
              <p className="text-2xl font-bold weather-success">
                {dailyMSE.length > 0 
                  ? `${calculateAccuracy(Math.min(...dailyMSE.map(d => d.windMSE)))}%`
                  : "N/A"
                }
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
