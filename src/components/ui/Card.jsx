import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export const Card = ({ children, className, ...props }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-base)] shadow-sm hover:shadow-md transition-shadow duration-300',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
