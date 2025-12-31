import React, { useRef, useEffect } from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { useData } from '../../context/DataContext';
import clsx from 'clsx';
import { Check } from 'lucide-react';
import { Card } from '../ui/Card';

export const MonthlyGrid = ({ currentDate }) => {
  const { habits, logs, toggleHabit } = useData();
  const scrollRef = useRef(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <Card className="bg-[var(--bg-card)] border-[var(--border-base)] rounded-2xl flex flex-col p-6 min-h-[400px]">
      <div className="flex flex-1 gap-0">
        {/* Fixed Left Column - Habit Names */}
        <div className="w-48 flex-shrink-0 flex flex-col pr-4">
          {/* Header */}
          <div className="font-semibold text-[var(--text-muted)] text-sm uppercase tracking-wider pl-2 h-[44px] flex items-center border-b border-[var(--border-base)]">
            Habit
          </div>
          
          {/* Habit Names List */}
          <div className="space-y-4 flex-1 mt-4">
            {habits.length === 0 ? (
              <div className="text-center text-[var(--text-muted)] py-8 text-sm">Add a habit to start tracking!</div>
            ) : (
              habits.map((habit) => (
                <div key={habit.id} className="flex items-center gap-3 h-6">
                  <span className="text-lg">⚡️</span>
                  <span className="text-sm font-medium text-[var(--text-base)] truncate">
                    {habit.name}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Scrollable Right Column - Dates & Checkboxes */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-x-auto overflow-y-visible"
          style={{ scrollbarWidth: 'thin' }}
        >
          <div className="min-w-max">
            {/* Date Headers */}
            <div className="flex gap-2 h-[44px] items-center border-b border-[var(--border-base)]">
              {daysInMonth.map((day) => {
                const isToday = isSameDay(day, new Date());
                return (
                  <div 
                    key={day.toISOString()} 
                    className={clsx(
                      "flex-shrink-0 w-6 text-center text-xs font-medium",
                      isToday ? "text-primary-500" : "text-[var(--text-muted)]"
                    )}
                  >
                    {format(day, 'd')}
                  </div>
                );
              })}
            </div>

            {/* Checkboxes Grid */}
            {habits.length > 0 && (
              <div className="space-y-4 mt-4">
                {habits.map((habit) => (
                  <div key={habit.id} className="flex gap-2 h-6 items-center">
                    {daysInMonth.map((day) => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const isCompleted = logs[dateStr]?.completedHabits?.includes(habit.id);
                      const isFuture = day > new Date();

                      return (
                        <button
                          key={`${habit.id}-${dateStr}`}
                          disabled={isFuture}
                          onClick={() => toggleHabit(dateStr, habit.id)}
                          className={clsx(
                            "flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200",
                            isCompleted 
                              ? "bg-primary-500 text-white shadow-sm shadow-primary-500/30" 
                              : "bg-[var(--bg-subtle)] border border-[var(--border-base)] hover:border-primary-400/50",
                            isFuture && "opacity-30 cursor-not-allowed bg-transparent border-none"
                          )}
                        >
                          {isCompleted && <Check className="w-3 h-3" strokeWidth={3} />}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
