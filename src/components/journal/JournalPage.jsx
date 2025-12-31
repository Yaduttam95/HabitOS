import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { JournalEditor } from './JournalEditor';
import { Book, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, addMonths, subMonths, isSameDay } from 'date-fns';
import clsx from 'clsx';

export const JournalPage = () => {
  const { logs, updateJournal } = useData();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const startDate = startOfMonth(currentMonth);
  const endDate = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const startDay = getDay(startDate); // 0 (Sun) to 6 (Sat)

  const handleSave = (content) => {
    if (selectedDate) {
      updateJournal(format(selectedDate, 'yyyy-MM-dd'), content);
      setSelectedDate(null);
    }
  };

  const getEntry = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return logs[dateStr]?.journal || '';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 mb-2 drop-shadow-sm">Journal</h1>
        <p className="text-[var(--text-muted)]">Reflect on your journey.</p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}>
             <ChevronLeft className="w-5 h-5" />
           </Button>
           <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}>
             <ChevronRight className="w-5 h-5" />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-[var(--text-muted)] py-2">
            {day}
          </div>
        ))}
        
        {/* Empty cells for padding */}
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map(date => {
            const hasEntry = !!getEntry(date);
            const isToday = isSameDay(date, new Date());
            
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={clsx(
                  'aspect-square rounded-xl border flex flex-col items-center justify-center relative group transition-all',
                  hasEntry 
                    ? 'bg-[var(--bg-hover)] border-[var(--border-base)] hover:bg-[var(--bg-card)]' 
                    : 'bg-[var(--bg-app)] border-[var(--border-base)] hover:bg-[var(--bg-hover)]',
                  isToday && 'ring-2 ring-primary-500 ring-offset-2 ring-offset-[var(--bg-app)]'
                )}
              >
                <span className={clsx(
                  'text-lg font-medium mb-1',
                  hasEntry ? 'text-[var(--text-base)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-base)]'
                )}>
                  {format(date, 'd')}
                </span>
                
                {hasEntry && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                )}
              </button>
            );
        })}
      </div>

      {selectedDate && (
        <JournalEditor 
          date={selectedDate}
          initialContent={getEntry(selectedDate)}
          onSave={handleSave}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
};


