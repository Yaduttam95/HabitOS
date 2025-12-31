import React from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { BarChart2 } from 'lucide-react';
import clsx from 'clsx';

export const OverallProgress = ({ currentDate }) => {
  const { habits, logs } = useData();
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Calculate stats per habit
  const habitStats = habits.map(habit => {
    let completedCount = 0;
    daysInMonth.forEach(day => {
       const dateStr = format(day, 'yyyy-MM-dd');
       if (logs[dateStr]?.completedHabits?.includes(habit.id)) {
         completedCount++;
       }
    });
    
    const percentage = Math.round((completedCount / daysInMonth.length) * 100);
    
    return { ...habit, percentage, completedCount };
  });

  return (
    <Card className="bg-[var(--bg-card)] border-[var(--border-base)] rounded-2xl p-6 min-h-[400px] flex flex-col">
      <div className="flex items-center gap-2 mb-6 flex-shrink-0">
        <BarChart2 className="w-5 h-5 text-[var(--text-base)]" />
        <h3 className="text-lg font-bold text-[var(--text-base)]">Overall Progress</h3>
      </div>

      <div className="space-y-6 overflow-y-auto flex-1" style={{ maxHeight: '500px' }}>
        {habitStats.length === 0 ? (
             <p className="text-sm text-[var(--text-muted)]">No habits to show.</p>
        ) : (
            habitStats.map(habit => (
            <div key={habit.id} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                    <span className="text-lg">⚡️</span>
                    <span className="font-medium text-[var(--text-base)]">{habit.name}</span>
                </div>
                <span className="font-bold text-[var(--text-muted)]">{habit.percentage}%</span>
                </div>
                
                <div className="h-2 w-full bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                <div 
                    className="h-full bg-primary-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${habit.percentage}%` }}
                />
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                {habit.completedCount} of {daysInMonth.length} days
                </p>
            </div>
            ))
        )}
      </div>
    </Card>
  );
};
