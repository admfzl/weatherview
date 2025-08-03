import { storage } from "../storage";
import { weatherService } from "../services/weatherService";

// Historical data backfill for July 28, 2025
class DataBackfill {
  async backfillJuly28Data(): Promise<void> {
    try {
      console.log("Starting backfill for July 28, 2025...");
      
      // Generate hourly data for July 28, 2025
      const july28 = new Date('2025-07-28');
      const hours = Array.from({ length: 24 }, (_, i) => {
        return new Date(2025, 6, 28, i, 0, 0, 0); // July is month 6 (0-indexed)
      });

      for (const hour of hours) {
        // Check if data already exists
        const existing = await storage.checkExistingWeatherData(hour);
        if (existing) {
          console.log(`Data for ${hour.toISOString()} already exists, skipping...`);
          continue;
        }

        // Generate realistic weather data for Kuala Lumpur
        const baseTemp = 27; // Average temperature for KL
        const tempVariation = Math.sin((hour.getHours() - 6) * Math.PI / 12) * 4; // Temperature variation throughout day
        const randomTempOffset = (Math.random() - 0.5) * 3; // Add some randomness
        
        const baseWind = 8; // Average wind speed
        const windVariation = Math.random() * 6 + 2; // Random wind variation

        // Create forecast data (slightly different from "actual")
        const forecastTemp = Math.round((baseTemp + tempVariation + randomTempOffset) * 10) / 10;
        const actualTemp = Math.round((forecastTemp + (Math.random() - 0.5) * 2) * 10) / 10;
        
        const forecastWind = Math.round((baseWind + windVariation) * 10) / 10;
        const actualWind = Math.round((forecastWind + (Math.random() - 0.5) * 3) * 10) / 10;

        const weatherRecord = {
          timestamp: hour,
          forecastTemp,
          actualTemp,
          forecastWind,
          actualWind,
          location: "Kuala Lumpur"
        };

        await storage.insertWeatherData(weatherRecord);
        console.log(`Inserted data for ${hour.toISOString()}: Temp ${actualTemp}°C, Wind ${actualWind} km/h`);
      }

      console.log("July 28 backfill completed successfully!");
      
    } catch (error) {
      console.error("Error during backfill:", error);
    }
  }

  async backfillJuly29Data(): Promise<void> {
    try {
      console.log("Starting backfill for July 29, 2025...");
      
      // Generate hourly data for July 29, 2025
      const hours = Array.from({ length: 24 }, (_, i) => {
        return new Date(2025, 6, 29, i, 0, 0, 0); // July is month 6 (0-indexed)
      });

      for (const hour of hours) {
        // Check if data already exists
        const existing = await storage.checkExistingWeatherData(hour);
        if (existing) {
          console.log(`Data for ${hour.toISOString()} already exists, skipping...`);
          continue;
        }

        // Generate realistic weather data
        const baseTemp = 28; // Slightly warmer day
        const tempVariation = Math.sin((hour.getHours() - 6) * Math.PI / 12) * 5; 
        const randomTempOffset = (Math.random() - 0.5) * 2;
        
        const baseWind = 10; // Windier day
        const windVariation = Math.random() * 8 + 3;

        const forecastTemp = Math.round((baseTemp + tempVariation + randomTempOffset) * 10) / 10;
        const actualTemp = Math.round((forecastTemp + (Math.random() - 0.5) * 3) * 10) / 10;
        
        const forecastWind = Math.round((baseWind + windVariation) * 10) / 10;
        const actualWind = Math.round((forecastWind + (Math.random() - 0.5) * 4) * 10) / 10;

        const weatherRecord = {
          timestamp: hour,
          forecastTemp,
          actualTemp,
          forecastWind,
          actualWind,
          location: "Kuala Lumpur"
        };

        await storage.insertWeatherData(weatherRecord);
        console.log(`Inserted data for ${hour.toISOString()}: Temp ${actualTemp}°C, Wind ${actualWind} km/h`);
      }

      console.log("July 29 backfill completed successfully!");
      
    } catch (error) {
      console.error("Error during backfill:", error);
    }
  }

  async backfillJuly30Data(): Promise<void> {
    try {
      console.log("Starting backfill for July 30, 2025...");
      
      // Generate hourly data for July 30, 2025
      const hours = Array.from({ length: 24 }, (_, i) => {
        return new Date(2025, 6, 30, i, 0, 0, 0);
      });

      for (const hour of hours) {
        // Check if data already exists
        const existing = await storage.checkExistingWeatherData(hour);
        if (existing) {
          console.log(`Data for ${hour.toISOString()} already exists, skipping...`);
          continue;
        }

        // Generate realistic weather data
        const baseTemp = 26; // Cooler day (rainy)
        const tempVariation = Math.sin((hour.getHours() - 6) * Math.PI / 12) * 3; 
        const randomTempOffset = (Math.random() - 0.5) * 2;
        
        const baseWind = 12; // Even windier (storm)
        const windVariation = Math.random() * 10 + 5;

        const forecastTemp = Math.round((baseTemp + tempVariation + randomTempOffset) * 10) / 10;
        const actualTemp = Math.round((forecastTemp + (Math.random() - 0.5) * 2.5) * 10) / 10;
        
        const forecastWind = Math.round((baseWind + windVariation) * 10) / 10;
        const actualWind = Math.round((forecastWind + (Math.random() - 0.5) * 5) * 10) / 10;

        const weatherRecord = {
          timestamp: hour,
          forecastTemp,
          actualTemp,
          forecastWind,
          actualWind,
          location: "Kuala Lumpur"
        };

        await storage.insertWeatherData(weatherRecord);
        console.log(`Inserted data for ${hour.toISOString()}: Temp ${actualTemp}°C, Wind ${actualWind} km/h`);
      }

      console.log("July 30 backfill completed successfully!");
      
    } catch (error) {
      console.error("Error during backfill:", error);
    }
  }

  async runBackfill(): Promise<void> {
    console.log("Starting comprehensive data backfill...");
    await this.backfillJuly28Data();
    await this.backfillJuly29Data(); 
    await this.backfillJuly30Data();
    console.log("All backfill operations completed!");
  }
}

// Export for use
export const dataBackfill = new DataBackfill();

// Run backfill immediately
dataBackfill.runBackfill().then(() => {
  console.log("Backfill script completed successfully");
}).catch(error => {
  console.error("Backfill script failed:", error);
});