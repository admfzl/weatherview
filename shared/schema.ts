import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const weatherData = pgTable("weather_data", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  forecastTemp: real("forecast_temp").notNull(),
  actualTemp: real("actual_temp").notNull(),
  forecastWind: real("forecast_wind").notNull(),
  actualWind: real("actual_wind").notNull(),
  location: text("location").notNull().default("Kuala Lumpur"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWeatherDataSchema = createInsertSchema(weatherData).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type WeatherData = typeof weatherData.$inferSelect;
export type InsertWeatherData = z.infer<typeof insertWeatherDataSchema>;
