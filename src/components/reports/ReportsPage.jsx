import { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';
import { TrendingUp, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { subDays, format, eachDayOfInterval, parseISO } from 'date-fns';

export const ReportsPage = () => {
  const { habits, logs } = useData();

  // Compute charts for last 3 months (90 days)
  const chartData = useMemo(() => {
    const endDate = new Date();
    const startDate = subDays(endDate, 90);
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    return dateRange.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayLog = logs[dateStr] || {};
      const completedCount = dayLog.completedHabits?.length || 0;
      
      return {
        date: format(date, 'MMM dd'),
        completed: completedCount,
        fullDate: dateStr
      };
    });
  }, [logs]);

  // Compute habit consistency stats
  const habitStats = useMemo(() => {
    return habits.map(habit => {
      let completedCount = 0;
      let totalDays = 0;
      const createdAt = parseISO(habit.createdAt);
      
      // Calculate from creation date or beginning of logs
      // For simplicity, iterate logs
      Object.keys(logs).forEach(dateStr => {
        if (logs[dateStr]?.completedHabits?.includes(habit.id)) {
          completedCount++;
        }
      });
      // This is a naive total, ideally diff(now, created)
      // MVP: just raw count
      
      return {
        ...habit,
        totalCompleted: completedCount
      };
    }).sort((a, b) => b.totalCompleted - a.totalCompleted);
  }, [habits, logs]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 mb-2 drop-shadow-sm">Reports</h1>
        <p className="text-[var(--text-muted)]">Analyze your progress over time.</p>
      </div>

      <Card className="h-[400px]">
        <h3 className="font-semibold mb-6 flex items-center gap-2">
           <TrendingUp className="w-5 h-5 text-primary-500" />
           90 Day Activity Trend
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
               <XAxis 
                  dataKey="date" 
                  stroke="#525252" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                  minTickGap={30}
                />
               <YAxis 
                  stroke="#525252" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                />
               <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-card-glass)', 
                    backdropFilter: 'blur(8px)',
                    borderColor: 'var(--border-base)', 
                    borderRadius: '8px',
                    color: 'var(--text-base)'
                  }}
                  itemStyle={{ color: 'var(--color-primary-500)' }}
               />
               <Line 
                 type="monotone" 
                 dataKey="completed" 
                 stroke="var(--color-primary-400)" 
                 strokeWidth={3} 
                 dot={false} 
                 activeDot={{ r: 6 }}
                />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Top Habits
          </h3>
          <div className="space-y-4">
            {habitStats.slice(0, 5).map((habit, index) => (
              <div key={habit.id} className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/50">
                <div className="flex items-center gap-3">
                  <span className="text-[var(--text-muted)] font-mono text-sm">#{index + 1}</span>
                  <span className="font-medium">{habit.name}</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-[var(--bg-hover)] text-sm font-semibold text-[var(--text-base)]">
                  {habit.totalCompleted} days
                </div>
              </div>
            ))}
            {habitStats.length === 0 && <p className="text-[var(--text-muted)] text-sm">No data yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};


