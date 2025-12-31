import * as appsScript from './appsScriptService';

// Storage adapter - Always uses Google Sheets
class StorageAdapter {
  constructor() {
    this.useGoogleSheets = true; // Always use Google Sheets
  }

  setUseGoogleSheets(enabled) {
    // Keep this method for compatibility but always use Google Sheets
    this.useGoogleSheets = true;
  }

  // ============================================
  // HABITS
  // ============================================

  async getHabits() {
    if (this.useGoogleSheets) {
      return await appsScript.getHabits();
    }
    
    const habits = localStorage.getItem('habits');
    return habits ? JSON.parse(habits) : [];
  }

  async saveHabits(habits) {
    if (this.useGoogleSheets) {
      // Google Sheets handles this per-habit, not batch
      // This is only called during migration
      return habits;
    }
    
    localStorage.setItem('habits', JSON.stringify(habits));
    return habits;
  }

  async addHabit(name) {
    if (this.useGoogleSheets) {
      return await appsScript.addHabit(name);
    }
    
    const habits = await this.getHabits();
    const newHabit = {
      id: `habit-${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      color: 'indigo',
      icon: '⚡️'
    };
    habits.push(newHabit);
    await this.saveHabits(habits);
    return newHabit;
  }

  async deleteHabit(id) {
    if (this.useGoogleSheets) {
      await appsScript.deleteHabit(id);
      return;
    }
    
    const habits = await this.getHabits();
    const filtered = habits.filter(h => h.id !== id);
    await this.saveHabits(filtered);
  }

  // ============================================
  // LOGS
  // ============================================

  async getLogs() {
    if (this.useGoogleSheets) {
      return await appsScript.getLogs(90);
    }
    
    const logs = localStorage.getItem('logs');
    return logs ? JSON.parse(logs) : {};
  }

  async saveLogs(logs) {
    if (this.useGoogleSheets) {
      // Google Sheets handles this per-log, not batch
      return logs;
    }
    
    localStorage.setItem('logs', JSON.stringify(logs));
    return logs;
  }

  async toggleHabit(dateStr, habitId) {
    if (this.useGoogleSheets) {
      const logs = await this.getLogs();
      const updatedLog = await appsScript.toggleHabit(dateStr, habitId, logs);
      return updatedLog;
    }
    
    const logs = await this.getLogs();
    const log = logs[dateStr] || { completedHabits: [], sleep: 0, journal: '' };
    const completedHabits = log.completedHabits || [];
    
    const index = completedHabits.indexOf(habitId);
    if (index > -1) {
      completedHabits.splice(index, 1);
    } else {
      completedHabits.push(habitId);
    }
    
    logs[dateStr] = { ...log, completedHabits };
    await this.saveLogs(logs);
    return logs[dateStr];
  }

  async updateSleep(dateStr, hours) {
    if (this.useGoogleSheets) {
      const logs = await this.getLogs();
      const updatedLog = await appsScript.updateSleep(dateStr, hours, logs);
      return updatedLog;
    }
    
    const logs = await this.getLogs();
    const log = logs[dateStr] || { completedHabits: [], sleep: 0, journal: '' };
    logs[dateStr] = { ...log, sleep: hours };
    await this.saveLogs(logs);
    return logs[dateStr];
  }

  async updateJournal(dateStr, content) {
    if (this.useGoogleSheets) {
      const logs = await this.getLogs();
      const updatedLog = await appsScript.updateJournal(dateStr, content, logs);
      return updatedLog;
    }
    
    const logs = await this.getLogs();
    const log = logs[dateStr] || { completedHabits: [], sleep: 0, journal: '' };
    logs[dateStr] = { ...log, journal: content };
    await this.saveLogs(logs);
    return logs[dateStr];
  }

  // ============================================
  // SETTINGS
  // ============================================

  async getSettings() {
    if (this.useGoogleSheets) {
      return await appsScript.getSettings();
    }
    
    const settings = localStorage.getItem('settings');
    return settings ? JSON.parse(settings) : {
      username: 'User',
      theme: 'indigo',
      mode: 'dark'
    };
  }

  async saveSettings(settings) {
    if (this.useGoogleSheets) {
      await appsScript.updateSettings(settings);
      return settings;
    }
    
    localStorage.setItem('settings', JSON.stringify(settings));
    return settings;
  }

  // ============================================
  // MIGRATION
  // ============================================

  async migrateToGoogleSheets() {
    // Get all localStorage data
    const habits = JSON.parse(localStorage.getItem('habits') || '[]');
    const logs = JSON.parse(localStorage.getItem('logs') || '{}');
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');

    // Upload to Google Sheets
    for (const habit of habits) {
      await appsScript.addHabit(habit.name, habit.color, habit.icon);
    }

    for (const [dateStr, log] of Object.entries(logs)) {
      await appsScript.updateLog(dateStr, log);
    }

    await appsScript.updateSettings(settings);

    return { habits: habits.length, logs: Object.keys(logs).length };
  }

  async clearLocalStorage() {
    localStorage.removeItem('habits');
    localStorage.removeItem('logs');
    localStorage.removeItem('settings');
  }
}

export const storage = new StorageAdapter();
