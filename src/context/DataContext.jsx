import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { applyTheme, applyMode } from '../utils/themes';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState({});
  const [settings, setSettings] = useState({ 
    username: 'User', 
    theme: 'indigo', 
    mode: 'dark',
    useGoogleSheets: false 
  });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [loadedHabits, loadedLogs, loadedSettings] = await Promise.all([
        storage.getHabits(),
        storage.getLogs(),
        storage.getSettings()
      ]);
      
      setHabits(loadedHabits);
      setLogs(loadedLogs);
      setSettings(loadedSettings);
      
      // Configure storage adapter
      storage.setUseGoogleSheets(loadedSettings.useGoogleSheets || false);
      
      // Apply initial theme & mode
      applyTheme(loadedSettings.theme || 'indigo');
      applyMode(loadedSettings.mode || 'dark');
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      const [loadedHabits, loadedLogs] = await Promise.all([
        storage.getHabits(),
        storage.getLogs()
      ]);
      
      setHabits(loadedHabits);
      setLogs(loadedLogs);
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  const addHabit = async (name) => {
    try {
      setSyncing(true);
      setError(null);
      
      const newHabit = await storage.addHabit(name);
      
      // Refresh habits list
      const updatedHabits = await storage.getHabits();
      setHabits(updatedHabits);
      
      return newHabit;
    } catch (err) {
      console.error('Error adding habit:', err);
      setError('Failed to add habit');
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  const deleteHabit = async (id) => {
    try {
      setSyncing(true);
      setError(null);
      
      await storage.deleteHabit(id);
      
      // Refresh habits list
      const updatedHabits = await storage.getHabits();
      setHabits(updatedHabits);
    } catch (err) {
      console.error('Error deleting habit:', err);
      setError('Failed to delete habit');
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  const toggleHabit = async (date, habitId) => {
    try {
      setSyncing(true);
      setError(null);
      
      await storage.toggleHabit(date, habitId);
      
      // Refresh logs
      const updatedLogs = await storage.getLogs();
      setLogs(updatedLogs);
    } catch (err) {
      console.error('Error toggling habit:', err);
      setError('Failed to update habit');
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  const updateSleep = async (date, hours) => {
    try {
      setSyncing(true);
      setError(null);
      
      await storage.updateSleep(date, hours);
      
      // Refresh logs
      const updatedLogs = await storage.getLogs();
      setLogs(updatedLogs);
    } catch (err) {
      console.error('Error updating sleep:', err);
      setError('Failed to update sleep');
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  const updateJournal = async (date, text) => {
    try {
      setSyncing(true);
      setError(null);
      
      await storage.updateJournal(date, text);
      
      // Refresh logs
      const updatedLogs = await storage.getLogs();
      setLogs(updatedLogs);
    } catch (err) {
      console.error('Error updating journal:', err);
      setError('Failed to update journal');
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      setSyncing(true);
      setError(null);
      
      const updated = { ...settings, ...newSettings };
      
      await storage.saveSettings(updated);
      setSettings(updated);
      
      // Update storage adapter if Google Sheets toggle changed
      if (newSettings.useGoogleSheets !== undefined) {
        storage.setUseGoogleSheets(newSettings.useGoogleSheets);
        // Reload data from new source
        await loadData();
      }
      
      if (newSettings.theme) {
        applyTheme(newSettings.theme);
      }
      if (newSettings.mode) {
        applyMode(newSettings.mode);
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update settings');
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  const migrateToGoogleSheets = async () => {
    try {
      setSyncing(true);
      setError(null);
      
      const result = await storage.migrateToGoogleSheets();
      
      // Enable Google Sheets
      await updateSettings({ useGoogleSheets: true });
      
      return result;
    } catch (err) {
      console.error('Error migrating to Google Sheets:', err);
      setError('Failed to migrate data');
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  return (
    <DataContext.Provider value={{ 
      habits, 
      logs, 
      settings,
      loading,
      syncing,
      error,
      addHabit, 
      deleteHabit, 
      toggleHabit, 
      updateSleep,
      updateJournal,
      updateSettings,
      migrateToGoogleSheets,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};
