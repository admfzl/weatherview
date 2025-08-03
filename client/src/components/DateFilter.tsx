import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DateRange } from "@/types/weather";

interface DateFilterProps {
  onDateRangeChange: (dateRange: DateRange | null) => void;
}

export default function DateFilter({ onDateRangeChange }: DateFilterProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleApply = () => {
    if (startDate && endDate) {
      onDateRangeChange({ startDate, endDate });
    }
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    onDateRangeChange(null);
  };

  return (
    <section className="weather-card rounded-lg p-6 shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Filter Chart by Date Range</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <Label className="block text-sm text-gray-400 mb-2">From:</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="weather-input"
          />
        </div>
        
        <div>
          <Label className="block text-sm text-gray-400 mb-2">To:</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="weather-input"
          />
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={handleApply}
            className="w-full btn-primary text-white py-3 px-6 rounded-lg font-medium"
            disabled={!startDate || !endDate}
          >
            Apply
          </Button>
          <Button 
            onClick={handleReset}
            variant="secondary"
            className="w-full bg-gray-600 hover:bg-gray-500 text-white py-3 px-6 rounded-lg font-medium"
          >
            Reset
          </Button>
        </div>
      </div>
    </section>
  );
}
