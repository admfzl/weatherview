#!/bin/bash
set -e

echo "☁️ Building WeatherView for Cloudflare Pages..."

# Install dependencies
npm install

# Build client for static hosting
echo "🎨 Building React frontend..."
npm run build

# Create Cloudflare Functions structure
echo "⚡ Setting up Cloudflare Functions..."
mkdir -p functions/api

# Create individual function files for Cloudflare
echo "📁 Creating API functions..."

# Copy and adapt server routes to Cloudflare Functions format
cat > functions/api/weather.js << 'EOF'
import { db } from '../../server/db.js';
import { storage } from '../../server/storage.js';
import { weatherService } from '../../server/services/weatherService.js';

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  try {
    if (path.includes('/current')) {
      const latest = await storage.getLatestWeatherData();
      return Response.json(latest || { message: "No data found" });
    }
    
    if (path.includes('/data')) {
      const data = await storage.getWeatherData();
      return Response.json(data);
    }
    
    if (path.includes('/mse')) {
      const data = await storage.getWeatherData();
      const mse = weatherService.calculateMSE(data);
      return Response.json(mse);
    }
    
    return new Response('Not Found', { status: 404 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
EOF

echo "✅ Cloudflare Pages build completed!"