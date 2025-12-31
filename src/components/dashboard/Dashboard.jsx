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

import { TrendingUp, Award, Calendar, CheckCircle2 } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, colorClass }) => (
  <Card className={`relative overflow-hidden group hover:border-${colorClass}-500/50 transition-colors`}>
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-${colorClass}-500`}>
      <Icon className="w-16 h-16 transform translate-x-4 -translate-y-4" />
    </div>
    <div className="relative z-10 flex flex-col justify-between h-full space-y-2">
      <div className={`p-2 w-fit rounded-lg bg-${colorClass}-500/10 text-${colorClass}-500`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-[var(--text-base)]">{value}</h3>
        <p className="text-sm font-medium text-[var(--text-muted)]">{label}</p>
      </div>
    </div>
  </Card>
);

import { AddHabitModal } from '../ui/modals/AddHabitModal';

export const Dashboard = () => {
  const { habits, logs, settings, updateSleep, addHabit, refreshData, syncing } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  
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

  const handleAddHabit = (name, color, icon) => {
    addHabit(name, color, icon);
    setIsAddHabitOpen(false);
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
      <AddHabitModal 
        isOpen={isAddHabitOpen} 
        onClose={() => setIsAddHabitOpen(false)} 
        onAdd={handleAddHabit} 
      />
      {/* Header */}
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 mb-2 drop-shadow-sm">Habit OS</h1>
          <p className="text-[var(--text-muted)]">Track your daily habits and build consistency</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-base)] shadow-sm w-full sm:w-auto justify-between sm:justify-start">
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
            
            <div className="flex gap-3 w-full sm:w-auto">
              <Button onClick={handleSync} disabled={syncing} variant="outline" className="flex-1 sm:flex-none justify-center">
                <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync'}
              </Button>
              <Button onClick={() => setIsAddHabitOpen(true)} className="flex-1 sm:flex-none justify-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Habit
              </Button>
            </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Monthly Grid */}
        <div className="xl:col-span-2">
            <MonthlyGrid currentDate={currentDate} />
        </div>

        {/* Right Column: Overall Progress */}
        <div>
            <OverallProgress currentDate={currentDate} />
        </div>
      </div>

      {/* Middle: Chart */}
      <div>
        <DailyProgressChart 
          currentDate={currentDate} 
          logs={logs} 
          onPrevMonth={() => handleMonthChange('prev')} 
          onNextMonth={() => handleMonthChange('next')} 
        />
      </div>

      {/* Bottom: Colored Stats & Sleep */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard 
            icon={CheckCircle2}
            label="Total Completed"
            value={totalCompleted}
            colorClass="blue"
        />
        <StatCard 
            icon={TrendingUp}
            label="Average Rate"
            value={`${averageRate}%`}
            colorClass="emerald"
        />
        <StatCard 
            icon={Award}
            label="Best Day"
            value={bestDayCount}
            colorClass="purple"
        />
        <StatCard 
            icon={Calendar}
            label="Active Days"
            value={activeDays}
            colorClass="orange"
        />
      </div>
      
      {/* Retain Sleep Widget as a smaller section or integrate later. For now, let's keep it simple as requested UI didn't show it explicitly but user might still want it. I'll add a small discrete section below. */}
      {/* <div className="pt-8 border-t border-[var(--border-base)]">
         <h3 className="font-semibold mb-4 text-[var(--text-base)]">Sleep Tracking</h3>
          <SleepChart logs={logs} days={14} height={200} />
      </div> */}
    </div>
  );
};


