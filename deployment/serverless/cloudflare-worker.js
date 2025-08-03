// Cloudflare Worker for WeatherView API
// Serverless edge deployment

import { storage } from '../../server/storage.js';
import { weatherService } from '../../server/services/weatherService.js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Initialize storage with environment variables
      if (env.DATABASE_URL) {
        // Configure database connection for edge runtime
        process.env.DATABASE_URL = env.DATABASE_URL;
      }

      // API Routes
      if (pathname.startsWith('/api/weather/')) {
        return await handleWeatherAPI(pathname, request);
      }

      // Serve static files (handled by Cloudflare Pages)
      return new Response('Not Found', { status: 404, headers: corsHeaders });
      
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ error: 'Internal Server Error', message: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  },
};

async function handleWeatherAPI(pathname, request) {
  const headers = { ...corsHeaders, 'Content-Type': 'application/json' };

  if (pathname.includes('/current')) {
    const latest = await storage.getLatestWeatherData();
    return new Response(JSON.stringify(latest || { message: "No data found" }), { headers });
  }
  
  if (pathname.includes('/data')) {
    const data = await storage.getWeatherData();
    return new Response(JSON.stringify(data), { headers });
  }
  
  if (pathname.includes('/mse')) {
    const data = await storage.getWeatherData();
    const mse = weatherService.calculateMSE(data);
    return new Response(JSON.stringify(mse), { headers });
  }

  if (pathname.includes('/daily-mse')) {
    const data = await storage.getWeatherData();
    const dailyMSE = weatherService.calculateDailyMSE(data);
    return new Response(JSON.stringify(dailyMSE), { headers });
  }
  
  return new Response('API endpoint not found', { status: 404, headers });
}