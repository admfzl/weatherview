import type { WeatherData } from "@shared/schema";

interface ForecastDataPoint {
  time: string;
  temperature_2m: number;
  wind_speed_10m: number;
  precipitation_probability: number;
}

interface CurrentWeatherData {
  temperature_2m: number;
  wind_speed_10m: number;
  weathercode: number;
}

interface MSEResult {
  temperatureMSE: number;
  windMSE: number;
}

interface DailyMSEResult {
  date: string;
  temperatureMSE: number;
  windMSE: number;
}

class WeatherService {
  private readonly FORECAST_API_URL = "https://api.open-meteo.com/v1/forecast?latitude=3.139&longitude=101.6869&hourly=temperature_2m,precipitation_probability,wind_speed_10m&timezone=Asia%2FKuala_Lumpur";
  private readonly CURRENT_API_URL = "https://api.open-meteo.com/v1/forecast?latitude=3.139&longitude=101.6869&current=temperature_2m,wind_speed_10m,weathercode&timezone=Asia%2FKuala_Lumpur";

  async getForecastData(): Promise<ForecastDataPoint[]> {
    try {
      const response = await fetch(this.FORECAST_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the data into our expected format
      const hourlyData: ForecastDataPoint[] = [];
      for (let i = 0; i < data.hourly.time.length; i++) {
        hourlyData.push({
          time: data.hourly.time[i],
          temperature_2m: data.hourly.temperature_2m[i],
          wind_speed_10m: data.hourly.wind_speed_10m[i],
          precipitation_probability: data.hourly.precipitation_probability?.[i] || 0
        });
      }
      
      return hourlyData;
    } catch (error) {
      console.error("Error fetching forecast data:", error);
      throw new Error("Failed to fetch forecast data from Open-Meteo API");
    }
  }

  async getCurrentWeatherData(): Promise<CurrentWeatherData> {
    try {
      const response = await fetch(this.CURRENT_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        temperature_2m: data.current.temperature_2m,
        wind_speed_10m: data.current.wind_speed_10m,
        weathercode: data.current.weathercode
      };
    } catch (error) {
      console.error("Error fetching current weather data:", error);
      throw new Error("Failed to fetch current weather data from Open-Meteo API");
    }
  }

  calculateMSE(data: WeatherData[]): MSEResult {
    if (data.length === 0) {
      return { temperatureMSE: 0, windMSE: 0 };
    }

    const tempSquaredErrors = data.map(d => Math.pow(d.forecastTemp - d.actualTemp, 2));
    const windSquaredErrors = data.map(d => Math.pow(d.forecastWind - d.actualWind, 2));

    const temperatureMSE = tempSquaredErrors.reduce((sum, error) => sum + error, 0) / data.length;
    const windMSE = windSquaredErrors.reduce((sum, error) => sum + error, 0) / data.length;

    return {
      temperatureMSE: Number(temperatureMSE.toFixed(3)),
      windMSE: Number(windMSE.toFixed(3))
    };
  }

  calculateDailyMSE(data: WeatherData[]): DailyMSEResult[] {
    if (data.length === 0) {
      return [];
    }

    // Group data by date
    const dailyData = new Map<string, WeatherData[]>();
    
    data.forEach(record => {
      const date = record.timestamp.toISOString().split('T')[0];
      if (!dailyData.has(date)) {
        dailyData.set(date, []);
      }
      dailyData.get(date)!.push(record);
    });

    // Calculate MSE for each day
    const dailyMSE: DailyMSEResult[] = [];
    
    dailyData.forEach((dayData, date) => {
      const mse = this.calculateMSE(dayData);
      dailyMSE.push({
        date,
        temperatureMSE: mse.temperatureMSE,
        windMSE: mse.windMSE
      });
    });

    return dailyMSE.sort((a, b) => a.date.localeCompare(b.date));
  }

  exportToCSV(data: WeatherData[]): string {
    const headers = [
      "Timestamp",
      "Forecast Temperature (°C)",
      "Actual Temperature (°C)",
      "Temperature Error",
      "Forecast Wind Speed (km/h)",
      "Actual Wind Speed (km/h)",
      "Wind Speed Error"
    ];

    const rows = data.map(record => [
      record.timestamp.toISOString(),
      record.forecastTemp.toString(),
      record.actualTemp.toString(),
      (record.actualTemp - record.forecastTemp).toFixed(2),
      record.forecastWind.toString(),
      record.actualWind.toString(),
      (record.actualWind - record.forecastWind).toFixed(2)
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    return csvContent;
  }
}

export const weatherService = new WeatherService();
