import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { HabitsPage } from './components/habits/HabitsPage';
import { SleepPage } from './components/sleep/SleepPage';
import { ScreenTimePage } from './components/screenTime/ScreenTimePage';
import { ReportsPage } from './components/reports/ReportsPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { JournalPage } from './components/journal/JournalPage';


function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/habits" element={<HabitsPage />} />
            <Route path="/sleep" element={<SleepPage />} />
            <Route path="/screentime" element={<ScreenTimePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
