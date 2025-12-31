import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export const ScreenTimeChart = ({ logs, days = 14, height = 300, showAxis = true, selectedMonth = null }) => {
  const data = React.useMemo(() => {
    let interval;
    
    if (selectedMonth) {
      interval = eachDayOfInterval({
        start: startOfMonth(selectedMonth),
        end: endOfMonth(selectedMonth)
      });
    } else {
      const end = new Date();
      const start = subDays(end, days - 1);
      interval = eachDayOfInterval({ start, end });
    }

    return interval.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return {
        date: format(date, 'd'),
        fullDate: dateStr,
        hours: logs[dateStr]?.screenTime ? parseFloat(logs[dateStr].screenTime) : 0
      };
    });
  }, [logs, days, selectedMonth]);

  return (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorScreenTime" x1="0" y1="0" x2="0" y2="1">
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
              backgroundColor: 'var(--bg-card-glass)', 
              backdropFilter: 'blur(8px)',
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
            fill="url(#colorScreenTime)" 
            dot={{ r: 4, strokeWidth: 2, fill: 'var(--bg-card)', stroke: 'var(--color-primary-500)' }}
            activeDot={{ r: 6, strokeWidth: 2, fill: 'var(--color-primary-500)', stroke: 'var(--bg-card)' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
