// Cloudflare Pages Adapter for WeatherView
// This adapter configures the application for Cloudflare Pages with Functions

import { storage } from '../../server/storage.js';
import { weatherService } from '../../server/services/weatherService.js';

// Cloudflare Pages Function for weather API
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Route handling
    if (pathname.includes('/api/weather/current')) {
      const latest = await storage.getLatestWeatherData();
      return Response.json(latest || { message: "No data found" }, { headers: corsHeaders });
    }
    
    if (pathname.includes('/api/weather/data')) {
      const data = await storage.getWeatherData();
      return Response.json(data, { headers: corsHeaders });
    }
    
    if (pathname.includes('/api/weather/mse')) {
      const data = await storage.getWeatherData();
      const mse = weatherService.calculateMSE(data);
      return Response.json(mse, { headers: corsHeaders });
    }

    if (pathname.includes('/api/weather/daily-mse')) {
      const data = await storage.getWeatherData();
      const dailyMSE = weatherService.calculateDailyMSE(data);
      return Response.json(dailyMSE, { headers: corsHeaders });
    }
    
    return new Response('API endpoint not found', { 
      status: 404, 
      headers: corsHeaders 
    });
    
  } catch (error) {
    console.error('Cloudflare Function error:', error);
    return Response.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
}