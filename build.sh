#!/bin/bash
set -e

echo "🔨 Starting WeatherView build process..."

echo "📦 Installing root dependencies..."
npm install

echo "🎨 Building client (React frontend)..."
cd client
npm install
npm run build
cd ..

echo "⚡ Building server (Express backend)..."
cd server
npm install  
npm run build
cd ..

echo "🗄️ Setting up database schema..."
npm run db:push

echo "✅ Build completed successfully!"
echo "🚀 Ready for deployment!"