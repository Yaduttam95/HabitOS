import * as appsScript from './appsScriptService';

// Storage adapter - implemented with Offline-First Manual Sync
// 1. Reads always come from LocalStorage (fast, offline)
// 2. Writes update LocalStorage immediately AND get added to a 'pendingChanges' queue
// 3. Sync() pushes pending changes to backend, then pulls fresh data
class StorageAdapter {
  constructor() {
    this.useGoogleSheets = true; // Always true
    this.pendingChanges = JSON.parse(localStorage.getItem('pendingChanges') || '[]');
    // No need to wipe manually; sessionStorage is naturally empty on new session
  }

  // Helper to queue changes
  queueChange(action, data) {
    this.pendingChanges.push({ action, data, timestamp: Date.now() });
    this.saveQueue();
  }

  saveQueue() {
    localStorage.setItem('pendingChanges', JSON.stringify(this.pendingChanges));
  }

  // ============================================
  // LOAD & SYNC
  // ============================================

  // Main Sync Function - Called by "Sync" button
  async syncData() {
    // 1. Unified Sync (Push + Pull in one request)
    try {
      console.log('Syncing data...', this.pendingChanges.length, 'changes');
      
      const response = await appsScript.syncAll(this.pendingChanges || []);
      
      // Clear queue after successful sync
      if (this.pendingChanges.length > 0) {
        this.pendingChanges = [];
        this.saveQueue();
      }
      
      const { habits, logs, settings } = response;

      // 3. Update Storage (Habits/Logs -> Session, Settings -> Local)
      sessionStorage.setItem('habits', JSON.stringify(habits));
      sessionStorage.setItem('logs', JSON.stringify(logs));
      localStorage.setItem('settings', JSON.stringify(settings));

      return { habits, logs, settings };
    } catch (error) {
      console.error('Failed to sync data:', error);
      throw new Error('Sync failed. Please try again.');
    }
  }

  // ============================================
  // READS (Always from LocalStorage)
  // ============================================

  async getHabits() {
    const habits = sessionStorage.getItem('habits');
    return habits ? JSON.parse(habits) : [];
  }

  async getLogs() {
    const logs = sessionStorage.getItem('logs');
    return logs ? JSON.parse(logs) : {};
  }

  async getSettings() {
    const settings = localStorage.getItem('settings');
    return settings ? JSON.parse(settings) : {
      username: 'User',
      theme: 'indigo',
      mode: 'dark',
      useGoogleSheets: true
    };
  }

  // ============================================
  // WRITES (Local Update + Queue)
  // ============================================

  async addHabit(name, color = 'indigo', icon = '⚡️') {
    const habits = await this.getHabits();
    const newHabit = {
      id: `habit-${Date.now()}`, // Generate local ID
      name,
      createdAt: new Date().toISOString(),
      color,
      icon
    };
    
    // 1. Update Session
    habits.push(newHabit);
    sessionStorage.setItem('habits', JSON.stringify(habits));
    
    // 2. Queue Change (Pass the ID so backend uses it)
    this.queueChange('addHabit', { 
        name: newHabit.name, 
        color: newHabit.color, 
        icon: newHabit.icon, 
        id: newHabit.id 
    });
    
    return newHabit;
  }

  async deleteHabit(id) {
    const habits = await this.getHabits();
    
    // 1. Update Session
    const filtered = habits.filter(h => h.id !== id);
    sessionStorage.setItem('habits', JSON.stringify(filtered));
    
    // 2. Queue Change
    this.queueChange('deleteHabit', { id });
  }

  // Helper to ensure we have a complete log object with safe defaults
  _getSafeLog(logs, dateStr) {
    const existing = logs[dateStr];
    return {
      completedHabits: existing?.completedHabits || [],
      sleep: existing?.sleep || 0,
      journal: existing?.journal || '',
      screenTime: existing?.screenTime || 0,
      moneySpent: existing?.moneySpent || []
    };
  }

  async toggleHabit(dateStr, habitId) {
    const logs = await this.getLogs();
    const log = this._getSafeLog(logs, dateStr);
    const completedHabits = [...log.completedHabits];
    
    // 1. Update Session
    const index = completedHabits.indexOf(habitId);
    if (index > -1) {
      completedHabits.splice(index, 1);
    } else {
      completedHabits.push(habitId);
    }
    
    // Create new log object preserving all other fields
    const updatedLog = { 
        ...log, 
        completedHabits
    };

    logs[dateStr] = updatedLog;
    sessionStorage.setItem('logs', JSON.stringify(logs));
    
    // 2. Queue Change (Send entire log for that day)
    this.queueChange('updateLog', { dateStr, logData: updatedLog });
    
    return updatedLog;
  }

  async updateSleep(dateStr, hours) {
    const logs = await this.getLogs();
    const log = this._getSafeLog(logs, dateStr);
    
    // 1. Update Session
    const updatedLog = { ...log, sleep: hours };
    logs[dateStr] = updatedLog;
    sessionStorage.setItem('logs', JSON.stringify(logs));
    
    // 2. Queue Change
    this.queueChange('updateLog', { dateStr, logData: updatedLog });
    
    return updatedLog;
  }

  async updateScreenTime(dateStr, hours) {
    const logs = await this.getLogs();
    const log = this._getSafeLog(logs, dateStr);
    
    // 1. Update Session
    const updatedLog = { ...log, screenTime: hours };
    logs[dateStr] = updatedLog;
    sessionStorage.setItem('logs', JSON.stringify(logs));
    
    // 2. Queue Change
    this.queueChange('updateLog', { dateStr, logData: updatedLog });
    
    return updatedLog;
  }

  async updateJournal(dateStr, content) {
    const logs = await this.getLogs();
    const log = this._getSafeLog(logs, dateStr);
    
    // 1. Update Session
    const updatedLog = { ...log, journal: content };
    logs[dateStr] = updatedLog;
    sessionStorage.setItem('logs', JSON.stringify(logs));
    
    this.queueChange('updateLog', { dateStr, logData: updatedLog });
    
    return updatedLog;
  }

  async addExpense(dateStr, item, amount, category = 'General') {
    const logs = await this.getLogs();
    const log = this._getSafeLog(logs, dateStr);
    
    // Ensure moneySpent is an array (handle legacy migration on client side)
    let currentExpenses = log.moneySpent;
    if (typeof currentExpenses === 'number') {
      currentExpenses = currentExpenses > 0 ? [{ id: 'legacy', item: 'Uncategorized', amount: currentExpenses, category: 'General' }] : [];
    } else if (!Array.isArray(currentExpenses)) {
      currentExpenses = [];
    }

    const newExpense = {
      id: Date.now().toString(),
      item,
      amount,
      category,
      timestamp: new Date().toISOString()
    };
    
    // 1. Update Session
    const updatedExpenses = [...currentExpenses, newExpense];
    const updatedLog = { ...log, moneySpent: updatedExpenses };
    
    logs[dateStr] = updatedLog;
    sessionStorage.setItem('logs', JSON.stringify(logs));
    
    // 2. Queue Change
    this.queueChange('updateLog', { dateStr, logData: updatedLog });
    
    return updatedLog;
  }

  async saveSettings(settings) {
    // 1. Update Local
    localStorage.setItem('settings', JSON.stringify(settings));
    
    // 2. Queue Change
    this.queueChange('updateSettings', { settings });
    
    return settings;
  }
}

export const storage = new StorageAdapter();
