#!/bin/bash
set -e

echo "🚀 Building WeatherView for Render..."

# Install dependencies
npm install

# Build client
echo "🎨 Building React frontend..."
npm run build

# Build server with specific configuration for Render
echo "⚡ Building Express server for Render..."
esbuild server/index.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outdir=dist \
  --define:process.env.NODE_ENV='"production"'

# Push database schema
echo "🗄️ Setting up database..."
npm run db:push

echo "✅ Render build completed!"