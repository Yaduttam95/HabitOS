import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export const JournalEditor = ({ date, initialContent, onSave, onClose }) => {
  const [content, setContent] = useState(initialContent || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="flex flex-col h-[600px] bg-[var(--bg-card)] border-[var(--border-base)]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-base)]">
            <div>
              <h2 className="text-xl font-bold">Journal Entry</h2>
              <p className="text-[var(--text-muted)]">{format(date, 'MMMM do, yyyy')}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-[var(--bg-hover)] rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-[var(--text-muted)]" />
            </button>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write about your day..."
            className="flex-1 bg-transparent resize-none outline-none text-[var(--text-base)] placeholder:text-[var(--text-muted)] leading-relaxed text-lg"
            autoFocus
          />

          <div className="flex justify-end pt-4 mt-4 border-t border-[var(--border-base)]">
            <Button onClick={() => onSave(content)}>
              <Save className="w-4 h-4 mr-2" /> Save Entry
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
