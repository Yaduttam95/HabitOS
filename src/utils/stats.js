import { subDays, format, isSameDay, parseISO } from 'date-fns';

export const calculateStreak = (logs, habits) => {
  if (!habits || habits.length === 0) return 0;
  
  let streak = 0;
  // Start from today
  let currentDate = new Date();
  
  // If no habits completed today yet, check if we should start counting from yesterday
  const todayStr = format(currentDate, 'yyyy-MM-dd');
  const todayLog = logs[todayStr];
  const hasActivityToday = todayLog?.completedHabits?.length > 0;
  
  if (!hasActivityToday) {
    currentDate = subDays(currentDate, 1);
  }

  // Iterate backwards max 365 days
  for (let i = 0; i < 365; i++) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const dayLog = logs[dateStr];
    
    // Check if any habit was completed this day
    // We filter by existing habits to ensure deleted habits don't count if we want to be strict,
    // but usually historical data stays. For now let's just check if ANY habit was done.
    const completedCount = dayLog?.completedHabits?.filter(id => habits.some(h => h.id === id))?.length || 0;
    
    if (completedCount > 0) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      break;
    }
  }
  
  return streak;
};
