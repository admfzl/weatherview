#!/bin/bash
set -e

echo "🌤️ Starting WeatherView production server..."
echo "📡 Connecting to database..."
echo "🔄 Initializing weather data collection..."

node dist/index.js