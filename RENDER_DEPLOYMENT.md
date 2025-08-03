# WeatherView Deployment Guide for Render

## Overview
This guide will help you deploy your WeatherView IoT weather dashboard to Render with a PostgreSQL database.

## File Structure for Render

```
weatherview/
├── package.json                 # Root package.json with build scripts
├── package-lock.json           # Lock file
├── render.yaml                 # Render configuration (optional)
├── build.sh                    # Build script for Render
├── start.sh                    # Production start script
├── drizzle.config.ts           # Database configuration
├── client/                     # Frontend code
│   ├── src/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── server/                     # Backend code
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes.ts
│   │   ├── db.ts
│   │   ├── storage.ts
│   │   └── services/
│   └── dist/                   # Built server files
├── shared/                     # Shared types and schemas
│   └── schema.ts
└── dist/                       # Built application
    ├── public/                 # Built frontend
    └── index.js               # Built server
```

## Step 1: Database Setup

### Option A: Render PostgreSQL (Recommended)
1. Go to Render Dashboard → New → PostgreSQL
2. Name: `weatherview-db`
3. Plan: Free tier (sufficient for demo)
4. Region: Choose closest to your users
5. Note down the connection details provided

### Option B: External PostgreSQL (Neon, Supabase, etc.)
1. Create a PostgreSQL database on your preferred provider
2. Get the connection string in format:
   `postgresql://username:password@host:port/database?sslmode=require`

## Step 2: Environment Variables

Set these environment variables in Render:

```bash
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
NODE_ENV=production
PORT=10000
```

## Step 3: Package.json Configuration

Update your root `package.json`:

```json
{
  "name": "weatherview",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "npm run build:client && npm run build:server",
    "build:client": "cd client && npm install && npm run build",
    "build:server": "cd server && npm install && npm run build",
    "start": "node dist/index.js",
    "dev": "npm run dev:server",
    "dev:server": "cd server && npm run dev",
    "db:push": "drizzle-kit push",
    "db:migrate": "drizzle-kit migrate",
    "postinstall": "npm run build"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.9.0",
    "drizzle-orm": "^0.33.0",
    "express": "^4.18.0",
    "ws": "^8.14.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.24.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "tsx": "^4.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## Step 4: Build Scripts

Create `build.sh`:
```bash
#!/bin/bash
set -e

echo "Installing root dependencies..."
npm install

echo "Building client..."
cd client
npm install
npm run build
cd ..

echo "Building server..."
cd server  
npm install
npm run build
cd ..

echo "Running database migrations..."
npm run db:push

echo "Build completed successfully!"
```

Create `start.sh`:
```bash
#!/bin/bash
set -e

echo "Starting WeatherView server..."
node dist/index.js
```

## Step 5: Render Service Configuration

### Web Service Settings:
- **Build Command**: `chmod +x build.sh && ./build.sh`
- **Start Command**: `chmod +x start.sh && ./start.sh`
- **Environment**: Node.js
- **Instance Type**: Free tier (sufficient for demo)
- **Auto-Deploy**: Yes

### Advanced Settings:
- **Health Check Path**: `/api/weather/current`
- **Port**: 10000 (Render default)

## Step 6: Server Configuration Updates

Update `server/src/index.ts` for production:

```typescript
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// API routes
await registerRoutes(app);

// Serve React app for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`WeatherView server running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});
```

## Step 7: Client Build Configuration

Update `client/vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../dist/public",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
```

## Step 8: Database Schema Migration

Update `drizzle.config.ts`:

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./shared/schema.ts",
  out: "./migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
```

## Step 9: Deployment Steps

1. **Prepare Repository**:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Create Render Service**:
   - Go to Render → New → Web Service
   - Connect your GitHub repository
   - Choose the branch (main)
   - Configure as above

3. **Set Environment Variables**:
   - DATABASE_URL from your PostgreSQL service
   - NODE_ENV=production
   - PORT=10000

4. **Deploy**:
   - Click "Create Web Service"
   - Monitor build logs
   - Wait for deployment to complete

## Step 10: Post-Deployment

1. **Verify Database**:
   - Check that tables are created
   - Verify data collection is working

2. **Test Endpoints**:
   - `https://your-app.onrender.com/api/weather/current`
   - `https://your-app.onrender.com/api/weather/data`

3. **Monitor Logs**:
   - Check for any errors in Render dashboard
   - Verify automated data collection is running

## Production Considerations

### Performance:
- Use Render's paid plans for better performance
- Consider Redis for caching (available as Render addon)
- Enable gzip compression

### Security:
- Use environment variables for all secrets
- Enable CORS properly for production
- Add rate limiting to API endpoints

### Monitoring:
- Set up Render's health checks
- Monitor database connection pool
- Track API response times

### Scaling:
- Consider horizontal scaling for high traffic
- Use CDN for static assets
- Implement database connection pooling

## Troubleshooting

### Common Issues:
1. **Build Failures**: Check Node.js version compatibility
2. **Database Connection**: Verify DATABASE_URL format
3. **Static Files**: Ensure build output goes to correct directory
4. **API Errors**: Check server logs in Render dashboard

### Debug Commands:
```bash
# Local testing
npm run build
npm start

# Database testing
npm run db:push
```

## Cost Estimation

### Free Tier Limits:
- Web Service: 750 hours/month
- PostgreSQL: 1GB storage, 1GB transfer
- Bandwidth: 100GB/month

### Upgrade Considerations:
- Paid plans start at $7/month for web service
- PostgreSQL paid plans start at $7/month
- Consider upgrading for production use

This setup will give you a production-ready deployment of your WeatherView application on Render with proper database integration and automated deployments.