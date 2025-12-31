import React from 'react';
import { eachDayOfInterval, format, startOfYear, endOfYear, getDay, isSameDay } from 'date-fns';
import { Tooltip } from 'recharts'; // reusing recharts tooltip logic or just simple title
import clsx from 'clsx';

export const HabitHeatmap = ({ habitId, logs, color = 'bg-green-500' }) => {
  const currentYear = new Date().getFullYear();
  const startDate = startOfYear(new Date(currentYear, 0, 1));
  const endDate = endOfYear(new Date(currentYear, 0, 1));
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Map of date string -> completed status
  // logs structure: { "2024-01-01": { completedHabits: ["id1", ...] } }
  
  return (
    <div className="flex flex-col gap-2 overflow-x-auto pb-4 custom-scrollbar">
      {/* Month Headers */}
      <div className="flex text-xs text-[var(--text-muted)] h-5 relative" style={{ minWidth: 'max-content' }}>
        {eachDayOfInterval({ start: startDate, end: endDate })
          .filter(d => d.getDate() === 1) // Get 1st of each month
          .map(d => {
             const dayIndex = Math.floor((d - startDate) / (1000 * 60 * 60 * 24));
             const colIndex = Math.floor(dayIndex / 7);
             return (
               <div key={d.toString()} className="absolute" style={{ left: `${colIndex * 15}px` }}>
                 {format(d, 'MMM')}
               </div>
             );
          })
        }
      </div>
      
      {/* Heatmap Grid */}
      <div className="grid grid-rows-7 grid-flow-col gap-[3px]" style={{ width: 'max-content' }}>
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayLog = logs[dateStr];
          const isCompleted = dayLog?.completedHabits?.includes(habitId);
          
          return (
            <div 
              key={dateStr}
              title={`${dateStr}: ${isCompleted ? 'Completed' : 'Missed'}`}
              className={clsx(
                'w-3 h-3 rounded-sm transition-colors duration-200',
                isCompleted ? 'bg-primary-500 shadow-sm shadow-primary-900/50' : 'bg-[var(--bg-hover)]'
              )}
            />
          );
        })}
      </div>
    </div>
  );
};
