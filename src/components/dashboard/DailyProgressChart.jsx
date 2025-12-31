import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';

export const DailyProgressChart = ({ currentDate, logs, onPrevMonth, onNextMonth }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const isCurrentMonth = isSameMonth(currentDate, new Date());

  const data = daysInMonth.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return {
      date: format(day, 'd'),
      fullDate: format(day, 'MMM d'),
      count: logs[dateStr]?.completedHabits?.length || 0,
    };
  });

  return (
    <Card className="bg-[var(--bg-card)] border-[var(--border-base)] rounded-2xl p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-base)] flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Daily Progress
          </h3>
          <p className="text-sm text-[var(--text-muted)]">
            Track how many habits you complete each day
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[var(--bg-app)] rounded-lg p-1 self-start sm:self-auto">
          <Button variant="ghost" size="sm" onClick={onPrevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[100px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onNextMonth}
            disabled={isCurrentMonth}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-base)" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              interval={2}
            />
            <YAxis 
               hide={false}
               axisLine={false}
               tickLine={false}
               tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
               allowDecimals={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--bg-card-glass)', 
                backdropFilter: 'blur(8px)',
                borderColor: 'var(--border-base)',
                color: 'var(--text-base)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              cursor={{ stroke: 'var(--color-primary-500)', strokeWidth: 1 }}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="var(--color-primary-500)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCount)" 
              animationDuration={1500}
              dot={{ r: 4, strokeWidth: 2, fill: 'var(--bg-card)', stroke: 'var(--color-primary-500)' }}
              activeDot={{ r: 6, strokeWidth: 2, fill: 'var(--color-primary-500)', stroke: 'var(--bg-card)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
