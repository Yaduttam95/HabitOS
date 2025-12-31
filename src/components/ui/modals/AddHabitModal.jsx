import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '../../ui/Button';
import { Plus } from 'lucide-react';

export const AddHabitModal = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('⚡️');
  const [color, setColor] = useState('indigo');

  const colors = [
    { value: 'indigo', label: 'Indigo' },
    { value: 'emerald', label: 'Emerald' },
    { value: 'rose', label: 'Rose' },
    { value: 'amber', label: 'Amber' },
    { value: 'cyan', label: 'Cyan' },
    { value: 'violet', label: 'Violet' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), color, icon);
      setName('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Habit">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-muted)]">Habit Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Morning Meditation"
            className="w-full bg-[var(--bg-app)] border border-[var(--border-base)] rounded-xl px-4 py-3 text-[var(--text-base)] focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            autoFocus
          />
        </div>

        {/* Color Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-muted)]">Color Theme</label>
          <div className="flex gap-3 flex-wrap">
            {colors.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  color === c.value ? 'border-[var(--text-base)] scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: `var(--color-${c.value}-500)` }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl font-medium text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            Cancel
          </button>
          <Button type="submit" className="flex-1 justify-center" disabled={!name.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Create Habit
          </Button>
        </div>
      </form>
    </Modal>
  );
};
