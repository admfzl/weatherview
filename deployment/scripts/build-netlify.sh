#!/bin/bash
set -e

echo "🔷 Building WeatherView for Netlify..."

# Install dependencies
npm install

# Build client
echo "🎨 Building React frontend..."
npm run build

# Create Netlify Functions
echo "⚡ Setting up Netlify Functions..."
mkdir -p netlify/functions

# Build server functions for Netlify
echo "📦 Building API functions..."
esbuild server/routes.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outdir=netlify/functions \
  --entry-names=[name] \
  --define:process.env.NODE_ENV='"production"'

echo "✅ Netlify build completed!"