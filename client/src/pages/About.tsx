import Header from "@/components/Header";
import { CloudSun, Users, Target, BarChart3 } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-6 space-y-6">
        <div className="weather-card rounded-lg p-6 shadow-lg border border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-2">About WeatherView</h1>
          <p className="text-gray-400">University IoT Weather Monitoring System</p>
        </div>

        {/* Project Overview */}
        <section className="weather-card rounded-lg p-6 shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Project Overview</h3>
          <p className="text-gray-300 mb-4">
            WeatherView is an IoT-based weather monitoring system developed for academic purposes. 
            The system fetches real-time weather data from the Open-Meteo API, stores it in a database, 
            and provides comprehensive analysis of forecast accuracy using Mean Squared Error (MSE) calculations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="flex items-start space-x-3">
              <CloudSun className="weather-primary mt-1" size={20} />
              <div>
                <h4 className="font-medium text-white">Real-time Data Collection</h4>
                <p className="text-sm text-gray-400">Automated hourly collection from Open-Meteo API</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <BarChart3 className="weather-secondary mt-1" size={20} />
              <div>
                <h4 className="font-medium text-white">Interactive Visualizations</h4>
                <p className="text-sm text-gray-400">Dynamic charts showing forecast vs actual data</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Members */}
        <section className="weather-card rounded-lg p-6 shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Team Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[var(--dark-bg)] rounded-lg p-4 border border-gray-700">
              <div className="flex items-center space-x-3 mb-2">
                <Users className="weather-primary" size={16} />
                <h4 className="font-medium text-white">Mohamad Adam Bin Mohd Faizal</h4>
              </div>
              <p className="text-sm text-gray-400">Student ID: 22002016</p>
              <p className="text-sm text-gray-400">Course: Information Technology</p>
            </div>
            <div className="bg-[var(--dark-bg)] rounded-lg p-4 border border-gray-700">
              <div className="flex items-center space-x-3 mb-2">
                <Users className="weather-primary" size={16} />
                <h4 className="font-medium text-white">Syabil Adib Bin Nazrul Hairy</h4>
              </div>
              <p className="text-sm text-gray-400">Student ID: 24001125</p>
              <p className="text-sm text-gray-400">Course: Information Technology</p>
            </div>
          </div>
        </section>

        {/* Project Objectives */}
        <section className="weather-card rounded-lg p-6 shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Project Objectives</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Target className="weather-accent mt-1" size={16} />
              <div>
                <h4 className="font-medium text-white">Real-Time Weather Data Updates</h4>
                <p className="text-sm text-gray-400">
                  Fetch real-time and forecasted weather data using the Open-Meteo API without relying on physical sensors.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Target className="weather-accent mt-1" size={16} />
              <div>
                <h4 className="font-medium text-white">Data Visualization</h4>
                <p className="text-sm text-gray-400">
                  Present weather information through interactive charts and sortable tables for enhanced user interpretation.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Target className="weather-accent mt-1" size={16} />
              <div>
                <h4 className="font-medium text-white">Forecast Error Metrics</h4>
                <p className="text-sm text-gray-400">
                  Compute and display forecast error metrics such as Mean Squared Error (MSE) to evaluate forecasting performance.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Target className="weather-accent mt-1" size={16} />
              <div>
                <h4 className="font-medium text-white">Cost-Effective Implementation</h4>
                <p className="text-sm text-gray-400">
                  Build a fully functional dashboard without physical hardware, relying only on free-tier services.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Stack */}
        <section className="weather-card rounded-lg p-6 shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Technical Implementation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-white mb-3">Frontend Technologies</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• React with TypeScript</li>
                <li>• Chart.js for data visualization</li>
                <li>• Tailwind CSS for styling</li>
                <li>• React Query for state management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-3">Backend Technologies</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Node.js with Express</li>
                <li>• PostgreSQL database</li>
                <li>• Open-Meteo API integration</li>
                <li>• Automated data collection</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Course Information */}
        <section className="weather-card rounded-lg p-6 shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Course Information</h3>
          <div className="bg-[var(--dark-bg)] rounded-lg p-4 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-white">Course Code</h4>
                <p className="text-sm text-gray-400">TFB2093/TEB2203</p>
              </div>
              <div>
                <h4 className="font-medium text-white">Course Name</h4>
                <p className="text-sm text-gray-400">Internet of Things</p>
              </div>
              <div>
                <h4 className="font-medium text-white">Lecturer</h4>
                <p className="text-sm text-gray-400">Ts Dr Ooi Boon Yaik</p>
              </div>
              <div>
                <h4 className="font-medium text-white">Submission Date</h4>
                <p className="text-sm text-gray-400">26 July 2025</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
