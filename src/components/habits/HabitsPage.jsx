import React from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';
import { HabitHeatmap } from './HabitHeatmap';
import { Button } from '../ui/Button';
import { Plus, Trash2 } from 'lucide-react';

export const HabitsPage = () => {
  const { habits, logs, addHabit, deleteHabit } = useData();

  const handleAdd = () => {
    const name = window.prompt("New Habit Name:");
    if (name) addHabit(name);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      try {
        await deleteHabit(id);
      } catch (error) {
        alert('Failed to delete habit. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Yearly Overview</h1>
          <p className="text-[var(--text-muted)]">Track your consistency across the year.</p>
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto justify-center">
          <Plus className="w-4 h-4 mr-2" /> Add Habit
        </Button>
      </div>

      <div className="space-y-6">
        {habits.length === 0 ? (
           <Card className="p-12 text-center text-[var(--text-muted)]">
             No habits found. Create one to see the heatmap!
           </Card>
        ) : (
          habits.map(habit => (
            <Card key={habit.id} className="overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full bg-primary-500`} />
                  <h3 className="font-semibold text-lg">{habit.name}</h3>
                </div>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(habit.id)}>
                   <Trash2 className="w-4 h-4 text-[var(--text-muted)] hover:text-red-500" />
                </Button>
              </div>
              
              <div className="overflow-x-auto pb-2">
                <HabitHeatmap habitId={habit.id} logs={logs} />
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};


