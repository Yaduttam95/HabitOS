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
    // 1. Push Pending Changes
    if (this.pendingChanges.length > 0) {
      console.log('Pushing pending changes:', this.pendingChanges);
      
      // Process queue sequentially to maintain order
      for (const change of this.pendingChanges) {
        try {
          switch (change.action) {
            case 'addHabit':
              await appsScript.addHabit(change.data.name, change.data.color, change.data.icon, change.data.id);
              break;
            case 'deleteHabit':
              await appsScript.deleteHabit(change.data.id);
              break;
            case 'updateLog':
              await appsScript.updateLog(change.data.dateStr, change.data.logData);
              break;
            case 'updateSettings':
              await appsScript.updateSettings(change.data.settings);
              break;
          }
        } catch (error) {
          console.error('Failed to sync change:', change, error);
          // If a change fails, we stop syncing to prevent data corruption
          // In a more advanced app, we might retry or have a deadlock queue
          throw new Error('Sync failed. Please try again.');
        }
      }
      
      // Clear queue after successful sync
      this.pendingChanges = [];
      this.saveQueue();
    }

    // 2. Pull Fresh Data
    const [habits, logs, settings] = await Promise.all([
        appsScript.getHabits(false), // force fetch
        appsScript.getLogs(90, false),
        appsScript.getSettings(false)
    ]);

    // 3. Update Local Storage with fresh data
    // 3. Update Storage (Habits/Logs -> Session, Settings -> Local)
    sessionStorage.setItem('habits', JSON.stringify(habits));
    sessionStorage.setItem('logs', JSON.stringify(logs));
    localStorage.setItem('settings', JSON.stringify(settings));

    return { habits, logs, settings };
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

  async toggleHabit(dateStr, habitId) {
    const logs = await this.getLogs();
    const log = logs[dateStr] || { completedHabits: [], sleep: 0, journal: '' };
    const completedHabits = log.completedHabits || [];
    
    // 1. Update Session
    const index = completedHabits.indexOf(habitId);
    if (index > -1) {
      completedHabits.splice(index, 1);
    } else {
      completedHabits.push(habitId);
    }
    
    const updatedLog = { ...log, completedHabits };
    logs[dateStr] = updatedLog;
    sessionStorage.setItem('logs', JSON.stringify(logs));
    
    // 2. Queue Change (Send entire log for that day)
    this.queueChange('updateLog', { dateStr, logData: updatedLog });
    
    return updatedLog;
  }

  async updateSleep(dateStr, hours) {
    const logs = await this.getLogs();
    const log = logs[dateStr] || { completedHabits: [], sleep: 0, journal: '' };
    
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
    const log = logs[dateStr] || { completedHabits: [], sleep: 0, screenTime: 0, journal: '' };
    
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
    const log = logs[dateStr] || { completedHabits: [], sleep: 0, journal: '' };
    
    // 1. Update Session
    const updatedLog = { ...log, journal: content };
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
