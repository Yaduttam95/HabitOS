import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ScreenTimeChart } from './ScreenTimeChart';
import { Smartphone, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, subDays, addDays, startOfMonth, addMonths, subMonths, isSameMonth } from 'date-fns';

export const ScreenTimePage = () => {
  const { logs, updateScreenTime } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartDate, setChartDate] = useState(new Date()); // Separate state for chart month navigation
  const [screenTimeHours, setScreenTimeHours] = useState('');

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const currentScreenTime = logs[dateStr]?.screenTime || 0;

  const handleSave = () => {
    const hours = parseFloat(screenTimeHours);
    if (!isNaN(hours) && hours >= 0 && hours <= 24) {
      updateScreenTime(dateStr, hours);
      setScreenTimeHours('');
    } else {
      alert('Please enter a valid number between 0 and 24');
    }
  };

  const handlePrevDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const handleNextDay = () => {
    const tomorrow = addDays(selectedDate, 1);
    if (tomorrow <= new Date()) {
      setSelectedDate(tomorrow);
    }
  };

  const handlePrevMonth = () => {
    setChartDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setChartDate(prev => addMonths(prev, 1));
  };

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const isFuture = selectedDate > new Date();
  const isCurrentMonth = isSameMonth(chartDate, new Date());

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Screen Time Tracker</h1>
        <p className="text-[var(--text-muted)]">Track your daily device usage.</p>
      </div>

      {/* Date Selection & Input Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Smartphone className="w-5 h-5 text-primary-500" />
          <h3 className="text-lg font-bold text-[var(--text-base)]">Log Screen Time</h3>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={handlePrevDay}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-[var(--text-muted)] mb-1">
              {isToday ? 'Today' : format(selectedDate, 'EEEE')}
            </p>
            <p className="text-xl font-bold text-[var(--text-base)]">
              {format(selectedDate, 'MMMM d, yyyy')}
            </p>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleNextDay}
            disabled={isToday}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Current Screen Time Display */}
        {currentScreenTime > 0 && (
          <div className="mb-4 p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
            <p className="text-sm text-[var(--text-muted)] mb-1">Current screen time logged</p>
            <p className="text-2xl font-bold text-primary-500">{currentScreenTime} hours</p>
          </div>
        )}

        {/* Input Form */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm text-[var(--text-muted)] mb-2">
              Hours
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={screenTimeHours}
              onChange={(e) => setScreenTimeHours(e.target.value)}
              className="w-full bg-[var(--bg-app)] border border-[var(--border-base)] rounded-xl px-4 py-3 text-[var(--text-base)] focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder={currentScreenTime > 0 ? `${currentScreenTime} hours logged` : "e.g. 4.5"}
              disabled={isFuture}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleSave} disabled={isFuture || !screenTimeHours}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {isFuture && (
          <p className="text-sm text-yellow-500 mt-2">
            Cannot log data for future dates
          </p>
        )}
      </Card>

      {/* Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-bold text-[var(--text-base)]">Monthly Overview</h3>
          </div>
          
          <div className="flex items-center gap-2 bg-[var(--bg-app)] rounded-lg p-1">
            <Button variant="ghost" size="sm" onClick={handlePrevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[100px] text-center">
              {format(chartDate, 'MMMM yyyy')}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleNextMonth}
              disabled={isCurrentMonth}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <ScreenTimeChart logs={logs} selectedMonth={chartDate} height={300} />
      </Card>
    </div>
  );
};
