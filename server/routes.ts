import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { weatherService } from "./services/weatherService";
import { insertWeatherDataSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current weather data
  app.get("/api/weather/current", async (req, res) => {
    try {
      const latest = await storage.getLatestWeatherData();
      if (!latest) {
        return res.status(404).json({ message: "No weather data found" });
      }
      res.json(latest);
    } catch (error) {
      console.error("Error fetching current weather:", error);
      res.status(500).json({ message: "Failed to fetch current weather data" });
    }
  });

  // Get weather data with optional date filtering
  app.get("/api/weather/data", async (req, res) => {
    try {
      const { startDate, endDate, limit } = req.query;
      
      let data;
      if (startDate && endDate) {
        data = await storage.getWeatherDataByDateRange(
          new Date(startDate as string),
          new Date(endDate as string)
        );
      } else {
        data = await storage.getWeatherData(limit ? parseInt(limit as string) : undefined);
      }
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  // Get MSE calculations
  app.get("/api/weather/mse", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      let data;
      if (startDate && endDate) {
        data = await storage.getWeatherDataByDateRange(
          new Date(startDate as string),
          new Date(endDate as string)
        );
      } else {
        data = await storage.getWeatherData();
      }

      const mse = weatherService.calculateMSE(data);
      res.json(mse);
    } catch (error) {
      console.error("Error calculating MSE:", error);
      res.status(500).json({ message: "Failed to calculate MSE" });
    }
  });

  // Get daily MSE data
  app.get("/api/weather/daily-mse", async (req, res) => {
    try {
      const data = await storage.getWeatherData();
      const dailyMSE = weatherService.calculateDailyMSE(data);
      res.json(dailyMSE);
    } catch (error) {
      console.error("Error calculating daily MSE:", error);
      res.status(500).json({ message: "Failed to calculate daily MSE" });
    }
  });

  // Export data as CSV
  app.get("/api/weather/export", async (req, res) => {
    try {
      const data = await storage.getWeatherData();
      const csv = weatherService.exportToCSV(data);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="weather_data.csv"');
      res.send(csv);
    } catch (error) {
      console.error("Error exporting data:", error);
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  // Trigger manual data collection
  app.post("/api/weather/collect", async (req, res) => {
    try {
      const { weatherCollector } = await import("./services/weatherCollector");
      await weatherCollector.collectData();
      res.json({ message: "Data collection triggered successfully" });
    } catch (error) {
      console.error("Error triggering data collection:", error);
      res.status(500).json({ message: "Failed to trigger data collection" });
    }
  });

  const httpServer = createServer(app);

  // Start automated weather data collection
  const { weatherCollector } = await import("./services/weatherCollector");
  weatherCollector.startAutomatedCollection();

  return httpServer;
}
