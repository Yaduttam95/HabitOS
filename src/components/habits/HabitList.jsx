import React from 'react';
import { Check, Plus } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import clsx from 'clsx';
import { format } from 'date-fns';

export const HabitList = ({ date }) => {
  const { habits, logs, toggleHabit, addHabit } = useData();
  const currentDayStr = date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');

  const todayLog = logs[currentDayStr] || { completedHabits: [] };
  const completedIds = todayLog.completedHabits || [];

  const handleAdd = () => {
    const name = window.prompt("Enter habit name:");
    if (name) addHabit(name);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[var(--text-base)]">Today's Habits</h2>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" /> Add Habit
        </Button>
      </div>

      <div className="grid gap-3">
        {habits.length === 0 ? (
          <Card className="text-center py-12 text-[var(--text-muted)]">
            No habits yet. Start by adding one!
          </Card>
        ) : (
          habits.map(habit => {
            const isCompleted = completedIds.includes(habit.id);
            return (
              <div 
                key={habit.id}
                onClick={() => toggleHabit(currentDayStr, habit.id)}
                className={clsx(
                  'group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer',
                  isCompleted 
                    ? 'bg-primary-900/20 border-primary-500/30' 
                    : 'bg-[var(--bg-subtle)] border-[var(--border-base)] hover:border-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={clsx(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                    isCompleted 
                      ? 'bg-primary-500 border-primary-500' 
                      : 'border-[var(--text-muted)] group-hover:border-[var(--text-base)]'
                  )}>
                    {isCompleted && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className={clsx(
                    "text-sm font-medium px-2 py-0.5 rounded-md uppercase tracking-wider transition-all",
                    isCompleted 
                      ? "bg-primary-500/10 text-[var(--text-muted)] line-through decoration-primary-500/50" 
                      : "bg-[var(--bg-hover)] text-[var(--text-muted)]"
                  )}>
                    {habit.name}
                  </span>
                </div>
                
                {/* Streak count could go here */}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
