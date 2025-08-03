import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  CloudSun, 
  BarChart3, 
  Database, 
  Calculator, 
  Info,
  Activity
} from "lucide-react";

const navigationItems = [
  { path: "/dashboard", label: "Dashboard", icon: Activity },
  { path: "/analysis", label: "Analysis", icon: BarChart3 },
  { path: "/database", label: "Database", icon: Database },
  { path: "/mse", label: "MSE", icon: Calculator },
  { path: "/about", label: "About Us", icon: Info },
];

export default function Sidebar() {
  const [location] = useLocation();
  
  return (
    <div className="w-64 weather-sidebar shadow-lg border-r border-gray-700">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-[var(--primary)] rounded-lg flex items-center justify-center">
            <CloudSun className="text-white text-lg" size={20} />
          </div>
          <h1 className="text-xl font-bold text-white">WeatherView</h1>
        </div>
        
        {/* Navigation Menu */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path || (location === "/" && item.path === "/dashboard");
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-[var(--primary)] text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
