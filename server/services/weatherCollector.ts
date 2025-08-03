import { storage } from "../storage";
import { weatherService } from "./weatherService";

class WeatherCollector {
  private intervalId: NodeJS.Timeout | null = null;
  private readonly COLLECTION_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds

  async collectData(): Promise<void> {
    try {
      console.log("Starting weather data collection...");
      
      // Get forecast data
      const forecastData = await weatherService.getForecastData();
      
      // Get current weather data
      const currentData = await weatherService.getCurrentWeatherData();
      
      // Create timestamp for current hour
      const now = new Date();
      const hourlyTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0);
      
      // Check if data for this hour already exists
      const existing = await storage.checkExistingWeatherData(hourlyTimestamp);
      if (existing) {
        console.log(`Data for ${hourlyTimestamp.toISOString()} already exists, skipping...`);
        return;
      }

      // Find matching forecast data for current timestamp
      const matchingForecast = forecastData.find(f => {
        const forecastTime = new Date(f.time);
        return forecastTime.getTime() === hourlyTimestamp.getTime();
      });

      if (!matchingForecast) {
        console.warn("No matching forecast data found for current timestamp");
        return;
      }

      // Insert weather data
      const weatherRecord = {
        timestamp: hourlyTimestamp,
        forecastTemp: matchingForecast.temperature_2m,
        actualTemp: currentData.temperature_2m,
        forecastWind: matchingForecast.wind_speed_10m,
        actualWind: currentData.wind_speed_10m,
        location: "Kuala Lumpur"
      };

      await storage.insertWeatherData(weatherRecord);
      console.log(`Weather data collected successfully for ${hourlyTimestamp.toISOString()}`);
      
    } catch (error) {
      console.error("Error collecting weather data:", error);
    }
  }

  startAutomatedCollection(): void {
    console.log("Starting automated weather data collection...");
    
    // Collect data immediately
    this.collectData();
    
    // Set up hourly collection
    this.intervalId = setInterval(() => {
      this.collectData();
    }, this.COLLECTION_INTERVAL);
  }

  stopAutomatedCollection(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("Stopped automated weather data collection");
    }
  }
}

export const weatherCollector = new WeatherCollector();
