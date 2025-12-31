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
    <div className="flex flex-col gap-1 overflow-x-auto pb-4 custom-scrollbar">
      <div className="flex text-xs text-[var(--text-muted)] gap-1 mb-1">
        {/* Simplified weak implementation: just list months roughly */}
        {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
          <div key={m} className="flex-1 min-w-[30px]">{m}</div>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-[3px] h-[100px] content-start flex-col w-full max-w-full overflow-hidden" 
           style={{ height: '112px', width: 'max-content' }}> 
           {/* GitHub style is usually column-major (weeks) */}
           {/* But CSS grid row-major is easier. Let's try row-major or simple flex wrap? 
               GitHub uses SVG or Canvas or Flex column-major (weeks). 
               Let's stick to a simple flex row wrap grid or CSS Grid 53 columns x 7 rows.
           */}
      </div>
    
      {/* 
         Better approach: CSS Grid 
         52-53 cols, 7 rows.
      */}
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
