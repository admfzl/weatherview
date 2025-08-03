// Render Adapter for WeatherView
// This file configures the application specifically for Render hosting

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerRoutes } from '../../server/routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createRenderApp() {
  const app = express();
  
  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  // CORS for production
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  // Health check endpoint for Render
  app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // Register API routes
  await registerRoutes(app);

  // Serve static files from build directory
  const staticPath = path.join(__dirname, '../../dist/public');
  app.use(express.static(staticPath));

  // SPA fallback
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });

  return app;
}

// For direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const app = await createRenderApp();
  const port = parseInt(process.env.PORT || '10000', 10);
  
  app.listen(port, '0.0.0.0', () => {
    console.log(`WeatherView running on Render at port ${port}`);
  });
}