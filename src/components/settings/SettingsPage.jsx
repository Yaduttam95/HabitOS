import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { User, Palette, Save, Check, Sun, Moon } from 'lucide-react';
import clsx from 'clsx';

const THEMES = [
  { id: 'indigo', name: 'Indigo', class: 'bg-indigo-600' },
  { id: 'emerald', name: 'Emerald', class: 'bg-emerald-600' },
  { id: 'rose', name: 'Rose', class: 'bg-rose-600' },
  { id: 'orange', name: 'Orange', class: 'bg-orange-600' },
  { id: 'cyan', name: 'Cyan', class: 'bg-cyan-600' },
  { id: 'violet', name: 'Violet', class: 'bg-violet-600' },
];

export const SettingsPage = () => {
  const { settings, updateSettings } = useData();
  const [username, setUsername] = useState(settings.username);
  const [selectedTheme, setSelectedTheme] = useState(settings.theme);
  const [selectedMode, setSelectedMode] = useState(settings.mode || 'dark');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setUsername(settings.username);
    setSelectedTheme(settings.theme);
    setSelectedMode(settings.mode || 'dark');
  }, [settings]);

  const handleSave = () => {
    updateSettings({ username, theme: selectedTheme, mode: selectedMode });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-[var(--text-muted)]">Customize your experience.</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Profile Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-[var(--bg-hover)]">
              <User className="w-6 h-6 text-[var(--text-muted)]" />
            </div>
            <h2 className="text-xl font-semibold">Profile</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">
                Display Name
              </label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[var(--bg-app)] border border-[var(--border-base)] rounded-xl px-4 py-3 text-[var(--text-base)] focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="Enter your name"
              />
            </div>
          </div>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-[var(--bg-hover)]">
              <Sun className="w-6 h-6 text-[var(--text-muted)]" />
            </div>
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>

          <div className="flex bg-[var(--bg-app)] border border-[var(--border-base)] p-1 rounded-xl">
             <button
               onClick={() => setSelectedMode('light')}
               className={clsx(
                 'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all',
                 selectedMode === 'light' ? 'bg-[var(--bg-card)] text-[var(--text-base)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-base)]'
               )}
             >
               <Sun className="w-4 h-4" /> Light
             </button>
             <button
               onClick={() => setSelectedMode('dark')}
               className={clsx(
                 'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all',
                 selectedMode === 'dark' ? 'bg-[var(--bg-card)] text-[var(--text-base)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-base)]'
               )}
             >
               <Moon className="w-4 h-4" /> Dark
             </button>
          </div>
        </Card>

        {/* Theme Settings */}
        <Card>
           <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-[var(--bg-hover)]">
              <Palette className="w-6 h-6 text-[var(--text-muted)]" />
            </div>
            <h2 className="text-xl font-semibold">Theme</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={clsx(
                  'flex items-center gap-3 p-3 rounded-xl border transition-all',
                  selectedTheme === theme.id 
                    ? 'bg-[var(--bg-hover)] border-[var(--border-base)]' 
                    : 'bg-[var(--bg-app)] border-[var(--border-base)] hover:bg-[var(--bg-hover)]'
                )}
              >
                <div className={`w-6 h-6 rounded-full ${theme.class} flex items-center justify-center`}>
                  {selectedTheme === theme.id && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="text-sm font-medium">{theme.name}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            {saved ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
