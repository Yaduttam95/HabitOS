import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SleepChart } from './SleepChart';
import { Moon, Clock, TrendingUp, Save } from 'lucide-react';
import { format } from 'date-fns';

export const SleepTracker = () => {
  const { logs, updateSleep } = useData();
  const [hours, setHours] = useState('');
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const handleSave = () => {
    const value = parseFloat(hours);
    if (!isNaN(value) && value >= 0 && value <= 24) {
      updateSleep(today, value);
      setHours('');
    } else {
      alert('Please enter a valid number of hours (0-24)');
    }
  };

  const currentSleep = logs[today]?.sleep;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Sleep Tracker</h1>
        <p className="text-[var(--text-muted)]">Monitor your rest and recovery.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Input Section */}
        <Card className="h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-primary-900/30">
              <Moon className="w-6 h-6 text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold">Log Sleep</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">
                Hours slept last night
              </label>
              <input 
                type="number" 
                step="0.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder={currentSleep ? currentSleep + " hours logged" : "e.g. 7.5"}
                className="w-full bg-[var(--bg-app)] border border-[var(--border-base)] rounded-xl px-4 py-3 text-[var(--text-base)] focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>
            <Button className="w-full" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" /> Save Log
            </Button>
          </div>
        </Card>

        {/* Chart Section */}
        <Card className="md:col-span-2 min-h-[400px]">
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-400" />
            Sleep Trends (Last 14 Days)
          </h3>
          <SleepChart logs={logs} days={14} height={300} />
        </Card>
      </div>
    </div>
  );
};

export default SleepTracker;
