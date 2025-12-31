import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Plus, RefreshCw } from 'lucide-react';
import { MonthlyGrid } from './MonthlyGrid';
import { OverallProgress } from './OverallProgress';
import { DailyProgressChart } from './DailyProgressChart';
import { SleepChart } from '../sleep/SleepChart';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { calculateStreak } from '../../utils/stats';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <Card className="flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-[var(--text-muted)] font-medium">{label}</p>
      <p className="text-2xl font-bold text-[var(--text-base)]">{value}</p>
    </div>
  </Card>
);

export const Dashboard = () => {
  const { habits, logs, settings, updateSleep, addHabit, refreshData, syncing } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Calculate Stats for the month/current status
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  const totalHabits = habits.length;
  
  // Today's completion
  const todayLog = logs[dateStr] || { completedHabits: [] };
  const completedToday = todayLog.completedHabits?.filter(id => habits.some(h => h.id === id)).length || 0;
  
  // Average Rate (Simple calculation based on all time or this month? Let's do this month for consistency)
  const monthStart = startOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: new Date() }); // days passed so far
  let totalPossible = daysInMonth.length * totalHabits;
  let totalCompleted = 0;
  
  daysInMonth.forEach(day => {
      const dStr = format(day, 'yyyy-MM-dd');
      const c = logs[dStr]?.completedHabits?.length || 0;
      totalCompleted += c;
  });
  
  const averageRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  // Best Day (Max habits completed in a day this month)
  let bestDayCount = 0;
  daysInMonth.forEach(day => {
    const dStr = format(day, 'yyyy-MM-dd');
    const count = logs[dStr]?.completedHabits?.length || 0;
    if (count > bestDayCount) bestDayCount = count;
  });

  // Active Days (Days with at least 1 habit completed)
  let activeDays = 0;
  daysInMonth.forEach(day => {
    const dStr = format(day, 'yyyy-MM-dd');
    const count = logs[dStr]?.completedHabits?.length || 0;
    if (count > 0) activeDays++;
  });

  const handleMonthChange = (direction) => {
    setCurrentDate(prev => direction === 'prev' ? subDays(startOfMonth(prev), 1) : addDays(endOfMonth(prev), 1));
  };

  const handleAddHabit = () => {
    const name = window.prompt("Enter habit name:");
    if (name && name.trim()) {
      addHabit(name.trim());
    }
  };

  const handleSync = async () => {
    try {
      await refreshData();
    } catch (error) {
      alert('Sync failed. Please check your internet connection.');
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">HabitOS</h1>
          <p className="text-[var(--text-muted)]">Track your daily habits and build consistency</p>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-base)] shadow-sm">
                <Button variant="ghost" size="sm" onClick={() => handleMonthChange('prev')}>
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <span className="text-sm font-semibold w-32 text-center text-[var(--text-base)] uppercase tracking-wide">
                    {format(currentDate, 'MMMM yyyy')}
                </span>
                <Button variant="ghost" size="sm" onClick={() => handleMonthChange('next')} disabled={isSameDay(startOfMonth(currentDate), startOfMonth(new Date()))}>
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handleSync} disabled={syncing} variant="outline">
                <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync'}
              </Button>
              <Button onClick={handleAddHabit}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Habit
              </Button>
            </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Monthly Grid */}
        <div className="lg:col-span-2">
            <MonthlyGrid currentDate={currentDate} />
        </div>

        {/* Right Column: Overall Progress */}
        <div>
            <OverallProgress currentDate={currentDate} />
        </div>
      </div>

      {/* Middle: Chart */}
      <div>
        <DailyProgressChart currentDate={currentDate} logs={logs} />
      </div>

      {/* Bottom: Colored Stats & Sleep */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-500/10 border-blue-500/20">
            <h3 className="text-2xl font-bold text-blue-600 mb-1">{totalCompleted}</h3>
            <p className="text-sm font-medium text-blue-600/80">Total Completed</p>
        </Card>
        <Card className="bg-emerald-500/10 border-emerald-500/20">
            <h3 className="text-2xl font-bold text-emerald-600 mb-1">{averageRate}%</h3>
            <p className="text-sm font-medium text-emerald-600/80">Average Rate</p>
        </Card>
        <Card className="bg-purple-500/10 border-purple-500/20">
            <h3 className="text-2xl font-bold text-purple-600 mb-1">{bestDayCount}</h3>
            <p className="text-sm font-medium text-purple-600/80">Best Day</p>
        </Card>
        <Card className="bg-orange-500/10 border-orange-500/20">
            <h3 className="text-2xl font-bold text-orange-600 mb-1">{activeDays}</h3>
            <p className="text-sm font-medium text-orange-600/80">Active Days</p>
        </Card>
      </div>
      
      {/* Retain Sleep Widget as a smaller section or integrate later. For now, let's keep it simple as requested UI didn't show it explicitly but user might still want it. I'll add a small discrete section below. */}
      {/* <div className="pt-8 border-t border-[var(--border-base)]">
         <h3 className="font-semibold mb-4 text-[var(--text-base)]">Sleep Tracking</h3>
          <SleepChart logs={logs} days={14} height={200} />
      </div> */}
    </div>
  );
};


