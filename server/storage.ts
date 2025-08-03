import { weatherData, type WeatherData, type InsertWeatherData, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, desc, gte, lte, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Weather data methods
  insertWeatherData(data: InsertWeatherData): Promise<WeatherData>;
  getWeatherData(limit?: number): Promise<WeatherData[]>;
  getWeatherDataByDateRange(startDate: Date, endDate: Date): Promise<WeatherData[]>;
  getLatestWeatherData(): Promise<WeatherData | undefined>;
  checkExistingWeatherData(timestamp: Date): Promise<WeatherData | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(weatherData).where(eq(weatherData.id, parseInt(id)));
    return user as any || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return undefined; // Not implemented for weather app
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return {} as User; // Not implemented for weather app
  }

  async insertWeatherData(data: InsertWeatherData): Promise<WeatherData> {
    const [result] = await db
      .insert(weatherData)
      .values(data)
      .returning();
    return result;
  }

  async getWeatherData(limit: number = 1000): Promise<WeatherData[]> {
    return await db
      .select()
      .from(weatherData)
      .orderBy(desc(weatherData.timestamp))
      .limit(limit);
  }

  async getWeatherDataByDateRange(startDate: Date, endDate: Date): Promise<WeatherData[]> {
    return await db
      .select()
      .from(weatherData)
      .where(
        and(
          gte(weatherData.timestamp, startDate),
          lte(weatherData.timestamp, endDate)
        )
      )
      .orderBy(desc(weatherData.timestamp));
  }

  async getLatestWeatherData(): Promise<WeatherData | undefined> {
    const [latest] = await db
      .select()
      .from(weatherData)
      .orderBy(desc(weatherData.timestamp))
      .limit(1);
    return latest || undefined;
  }

  async checkExistingWeatherData(timestamp: Date): Promise<WeatherData | undefined> {
    const [existing] = await db
      .select()
      .from(weatherData)
      .where(eq(weatherData.timestamp, timestamp))
      .limit(1);
    return existing || undefined;
  }
}

export const storage = new DatabaseStorage();
