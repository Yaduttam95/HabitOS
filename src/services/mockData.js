export const MOCK_HABITS = [
  { id: '1', name: 'Morning Meditation', color: 'indigo', icon: '🧘', createdAt: '2024-01-01T00:00:00.000Z' },
  { id: '2', name: 'Read 30 Mins', color: 'emerald', icon: '📚', createdAt: '2024-01-01T00:00:00.000Z' },
  { id: '3', name: 'Workout', color: 'rose', icon: '💪', createdAt: '2024-01-01T00:00:00.000Z' },
  { id: '4', name: 'Drink 3L Water', color: 'cyan', icon: '💧', createdAt: '2024-01-01T00:00:00.000Z' },
  { id: '5', name: 'Code Project', color: 'violet', icon: '💻', createdAt: '2024-01-01T00:00:00.000Z' }
];

export const MOCK_SETTINGS = {
  username: 'Demo User',
  theme: 'indigo',
  mode: 'dark',
  useGoogleSheets: false
};

const generateMockLogs = () => {
  const logs = {};
  const today = new Date();
  
  // Generate logs for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Random completion
    const completedHabits = MOCK_HABITS
      .filter(() => Math.random() > 0.4) // 60% chance of completion
      .map(h => h.id);
      
    // Random sleep between 5-9 hours
    const sleep = Math.floor(Math.random() * (9 - 5 + 1) + 5);

    // Random screen time between 1-8 hours
    const screenTime = parseFloat((Math.random() * (8 - 1) + 1).toFixed(1));
    
    logs[dateStr] = {
      completedHabits,
      sleep,
      screenTime,
      journal: i % 3 === 0 ? "Had a productive day! focused on coding and health." : ""
    };
  }
  return logs;
};

export const MOCK_LOGS = generateMockLogs();
