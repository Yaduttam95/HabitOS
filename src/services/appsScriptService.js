import { format } from 'date-fns';

const RAW_API_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

// Simple API URL logic: Use Netlify proxy in production, or direct URL/Proxy in dev if configured
// But per user request, we assume a robust backend connection is required.
const NETLIFY_FUNCTION_URL = '/.netlify/functions/proxy';

// If running on localhost and RAW_API_URL is set, use it (possibly via a proxy if you set one up, 
// but we are removing the "smart" fallback logic to keep it pure).
// Otherwise use Netlify function.
const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && RAW_API_URL
  ? RAW_API_URL 
  : NETLIFY_FUNCTION_URL;

// Cache for performance
let cache = {
  habits: null,
  logs: null,
  settings: null,
  timestamp: 0
};

const CACHE_DURATION = 30000; // 30 seconds

// ============================================
// CORE API FUNCTIONS
// ============================================

async function fetchAPI(url, options = {}) {
  // If no API URL is defined, we can't do anything.
  if (!API_URL && !RAW_API_URL) {
    throw new Error('No API URL configured');
  }

  const endpoint = url.startsWith('http') || url.startsWith('/') ? url : API_URL + url;

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'API request failed');
  }
  
  return data;
}

// ============================================
// HABITS
// ============================================

export async function getHabits(useCache = true) {
  const now = Date.now();
  
  if (useCache && cache.habits && (now - cache.timestamp) < CACHE_DURATION) {
    return cache.habits;
  }
  
  // No try/catch fallback. If it fails, the app should handle the error (show UI message).
  const data = await fetchAPI(`${API_URL}?action=getHabits&t=${now}`);
  cache.habits = data.habits;
  cache.timestamp = now;
  return data.habits;
}

export async function addHabit(name, color = 'indigo', icon = '⚡️', id = null) {
  const data = await fetchAPI(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      action: 'addHabit',
      name,
      color,
      icon,
      id
    })
  });
  
  // Invalidate cache
  cache.habits = null;
  return data.habit;
}

export async function deleteHabit(id) {
  const data = await fetchAPI(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      action: 'deleteHabit',
      id
    })
  });
  
  // Invalidate cache
  cache.habits = null;
  return data;
}

// ============================================
// DAILY LOGS
// ============================================

export async function getLogs(days = 90, useCache = true) {
  const now = Date.now();
  
  if (useCache && cache.logs && (now - cache.timestamp) < CACHE_DURATION) {
    return cache.logs;
  }
  
  const data = await fetchAPI(`${API_URL}?action=getLogs&days=${days}&t=${now}`);
  cache.logs = data.logs;
  cache.timestamp = now;
  return data.logs;
}

export async function updateLog(dateStr, logData) {
  const data = await fetchAPI(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      action: 'updateLog',
      date: dateStr,
      data: logData
    })
  });
  
  // Invalidate cache
  cache.logs = null;
  return data;
}

export async function toggleHabit(dateStr, habitId, currentLogs) {
  const log = currentLogs[dateStr] || { completedHabits: [], sleep: 0, journal: '' };
  const completedHabits = log.completedHabits || [];
  
  const index = completedHabits.indexOf(habitId);
  let newCompletedHabits;
  
  if (index > -1) {
    // Remove habit
    newCompletedHabits = completedHabits.filter(id => id !== habitId);
  } else {
    // Add habit
    newCompletedHabits = [...completedHabits, habitId];
  }
  
  const updatedLog = {
    ...log,
    completedHabits: newCompletedHabits
  };
  
  await updateLog(dateStr, updatedLog);
  
  return updatedLog;
}

export async function updateSleep(dateStr, hours, currentLogs) {
  const log = currentLogs[dateStr] || { completedHabits: [], sleep: 0, journal: '' };
  
  const updatedLog = {
    ...log,
    sleep: hours
  };
  
  await updateLog(dateStr, updatedLog);
  
  return updatedLog;
}

export async function updateScreenTime(dateStr, hours, currentLogs) {
  const log = currentLogs[dateStr] || { completedHabits: [], sleep: 0, screenTime: 0, journal: '' };
  
  const updatedLog = {
    ...log,
    screenTime: hours
  };
  
  await updateLog(dateStr, updatedLog);
  
  return updatedLog;
}

export async function updateJournal(dateStr, content, currentLogs) {
  const log = currentLogs[dateStr] || { completedHabits: [], sleep: 0, journal: '' };
  
  const updatedLog = {
    ...log,
    journal: content
  };
  
  await updateLog(dateStr, updatedLog);
  
  return updatedLog;
}

// ============================================
// SETTINGS
// ============================================

export async function getSettings(useCache = true) {
  const now = Date.now();
  
  if (useCache && cache.settings && (now - cache.timestamp) < CACHE_DURATION) {
    return cache.settings;
  }
  
  const data = await fetchAPI(`${API_URL}?action=getSettings&t=${now}`);
  cache.settings = data.settings;
  cache.timestamp = now;
  return data.settings;
}

export async function updateSettings(settingsObj) {
  // Update multiple settings
  const promises = Object.entries(settingsObj).map(([key, value]) =>
    fetchAPI(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'updateSetting',
        key,
        value
      })
    })
  );
  
  await Promise.all(promises);
  
  // Invalidate cache
  cache.settings = null;
  return settingsObj;
}

// ============================================
// CACHE MANAGEMENT
// ============================================

export function clearCache() {
  cache = {
    habits: null,
    logs: null,
    settings: null,
    timestamp: 0
  };
}

export function refreshData() {
  return Promise.all([
    getHabits(false),
    getLogs(90, false),
    getSettings(false)
  ]);
}
