export interface WeatherData {
  id: number;
  timestamp: string;
  forecastTemp: number;
  actualTemp: number;
  forecastWind: number;
  actualWind: number;
  location: string;
}

export interface MSEData {
  temperatureMSE: number;
  windMSE: number;
}

export interface DailyMSEData {
  date: string;
  temperatureMSE: number;
  windMSE: number;
}

export interface ChartDataPoint {
  timestamp: string;
  forecastTemp: number;
  actualTemp: number;
  forecastWind: number;
  actualWind: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}
