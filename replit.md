# WeatherView - IoT Weather Monitoring System

## Overview

WeatherView is a full-stack IoT weather monitoring application that collects real-time weather data from the Open-Meteo API and provides comprehensive analysis of forecast accuracy. The system features automated data collection, interactive visualizations, and Mean Squared Error (MSE) calculations to evaluate forecasting performance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Structure
- **Frontend**: React with TypeScript, served from `client/` directory
- **Backend**: Express.js server with TypeScript, located in `server/` directory
- **Shared**: Common schemas and types in `shared/` directory
- **Database**: PostgreSQL with Drizzle ORM for data persistence

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter for client-side routing
- **Charts**: Chart.js for data visualizations
- **Backend Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon serverless PostgreSQL
- **Build Tool**: Vite for frontend bundling, esbuild for backend

## Key Components

### Frontend Architecture
The frontend follows a component-based architecture with:
- **Pages**: Dashboard, Analysis, Database, MSE, About
- **Components**: Reusable UI components (CurrentWeather, WeatherChart, DataTable, etc.)
- **Layouts**: Sidebar navigation with responsive design
- **Types**: TypeScript interfaces for weather data structures
- **Hooks**: Custom hooks for mobile detection and toast notifications

### Backend Architecture
The server implements a RESTful API with:
- **Routes**: Weather data endpoints (`/api/weather/*`)
- **Services**: Weather data collection and API integration
- **Storage**: Database abstraction layer with PostgreSQL operations
- **Middleware**: Request logging and error handling

### Database Schema
The application uses a simple but effective schema:
- **weather_data table**: Stores forecast vs actual weather comparisons
  - timestamp, forecastTemp, actualTemp, forecastWind, actualWind, location
- **users table**: Basic user structure (currently unused)

## Data Flow

### Data Collection Pipeline
1. **Automated Collection**: Weather collector service fetches data hourly from Open-Meteo API
2. **Data Processing**: Compares forecast data with actual weather measurements
3. **Database Storage**: Stores timestamped weather records for analysis
4. **Real-time Updates**: Frontend queries refresh every minute for current data

### API Integration
- **External API**: Open-Meteo weather service for Kuala Lumpur coordinates
- **Data Points**: Temperature, wind speed, precipitation probability
- **Update Frequency**: Hourly data collection with minute-level frontend updates

### Frontend Data Management
- **Query Client**: TanStack React Query manages server state
- **Caching Strategy**: Infinite stale time with manual refresh intervals
- **Error Handling**: Graceful degradation with loading states

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **chart.js**: Data visualization library
- **@radix-ui/***: Unstyled, accessible UI primitives

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the application
- **Tailwind CSS**: Utility-first styling framework
- **ESBuild**: Fast backend bundling

### API Services
- **Open-Meteo API**: Weather data provider (no authentication required)
- **Neon Database**: Serverless PostgreSQL hosting

## Deployment Strategy

### Multi-Platform Architecture
WeatherView is designed for **modular deployment** across multiple hosting platforms:

- **Render**: Full-stack with included PostgreSQL (recommended for beginners)
- **Cloudflare Pages**: Serverless with edge functions (best performance)
- **Netlify**: JAMstack with serverless functions (developer-friendly)
- **Vercel**: Serverless with advanced optimizations (Next.js style)
- **Docker**: Containerized deployment for any cloud provider

### Build Process
- **Frontend**: Vite builds client assets to `dist/public`
- **Backend**: ESBuild bundles server code with platform-specific adapters
- **Database**: Drizzle Kit handles schema migrations
- **Platform Scripts**: Automated build scripts for each hosting provider

### Platform-Specific Configurations
- **`deployment/render.yaml`**: Complete Render Blueprint with PostgreSQL
- **`deployment/cloudflare-pages.yaml`**: Cloudflare Pages with Functions
- **`deployment/netlify.toml`**: Netlify configuration with Functions
- **`deployment/vercel.json`**: Vercel serverless configuration
- **`deployment/docker/`**: Docker containerization setup

### Environment Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **Platform Variables**: Platform-specific environment variables
- **External Database**: Neon, Supabase, or PlanetScale for serverless platforms
- **Development**: Hot reload with Vite dev server
- **Production**: Platform-specific static asset serving

### Scaling Considerations
- **Database**: Connection pooling with serverless PostgreSQL providers
- **API Limits**: Open-Meteo has generous free tier limits
- **Global CDN**: Cloudflare and Vercel provide worldwide edge deployment
- **Data Retention**: No automatic cleanup implemented (consider for production)
- **Background Jobs**: Platform-specific worker/cron implementations

### Performance Optimizations
- **Frontend**: Component lazy loading and query caching
- **Backend**: Efficient database queries with proper indexing
- **API**: Hourly data collection minimizes external API calls
- **Edge Deployment**: Serverless functions deployed globally
- **Static Assets**: CDN optimization for charts and images