import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { WeatherData } from "@/types/weather";

interface DataTableProps {
  data: WeatherData[];
  onExport: () => void;
}

export default function DataTable({ data, onExport }: DataTableProps) {
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [data]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateError = (forecast: number, actual: number) => {
    return (actual - forecast).toFixed(2);
  };

  return (
    <section className="weather-card rounded-lg p-6 shadow-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Weather Data History</h3>
        <Button 
          onClick={onExport}
          className="btn-success text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
        >
          <Download size={16} />
          <span>Export CSV</span>
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm weather-table">
          <thead className="bg-[var(--dark-bg)]">
            <tr>
              <th className="px-4 py-3 text-left text-gray-400 font-medium">Timestamp</th>
              <th className="px-4 py-3 text-left text-gray-400 font-medium">Forecast Temp (°C)</th>
              <th className="px-4 py-3 text-left text-gray-400 font-medium">Actual Temp (°C)</th>
              <th className="px-4 py-3 text-left text-gray-400 font-medium">Temp Error</th>
              <th className="px-4 py-3 text-left text-gray-400 font-medium">Forecast Wind (km/h)</th>
              <th className="px-4 py-3 text-left text-gray-400 font-medium">Actual Wind (km/h)</th>
              <th className="px-4 py-3 text-left text-gray-400 font-medium">Wind Error</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No weather data available
                </td>
              </tr>
            ) : (
              sortedData.map((record) => (
                <tr key={record.id} className="border-b border-gray-700 hover:bg-[var(--dark-bg)]">
                  <td className="px-4 py-3">{formatTimestamp(record.timestamp)}</td>
                  <td className="px-4 py-3">{record.forecastTemp.toFixed(1)}</td>
                  <td className="px-4 py-3">{record.actualTemp.toFixed(1)}</td>
                  <td className="px-4 py-3 weather-accent">
                    {calculateError(record.forecastTemp, record.actualTemp)}
                  </td>
                  <td className="px-4 py-3">{record.forecastWind.toFixed(1)}</td>
                  <td className="px-4 py-3">{record.actualWind.toFixed(1)}</td>
                  <td className="px-4 py-3 weather-secondary">
                    {calculateError(record.forecastWind, record.actualWind)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
