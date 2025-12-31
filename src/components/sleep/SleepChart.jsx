import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { Card } from '../ui/Card';

export const SleepChart = ({ logs, days = 14, height = 300, showAxis = true }) => {
  const data = React.useMemo(() => {
    const arr = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      arr.push({
        date: format(date, 'MMM d'),
        fullDate: dateStr,
        hours: logs[dateStr]?.sleep ? parseFloat(logs[dateStr].sleep) : 0
      });
    }
    return arr;
  }, [logs, days]);

  return (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          {showAxis && (
            <>
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}h`}
              />
            </>
          )}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-base)',
              color: 'var(--text-base)',
              borderRadius: '12px',
              padding: '12px'
            }}
            itemStyle={{ color: 'var(--color-primary-500)' }}
          />
          <Area 
            type="monotone" 
            dataKey="hours" 
            stroke="var(--color-primary-500)" 
            fillOpacity={1} 
            fill="url(#colorSleep)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
