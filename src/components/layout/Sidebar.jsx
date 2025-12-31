import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Target, Moon, TrendingUp, BookOpen, Settings, Calendar, X, Smartphone } from 'lucide-react';
import clsx from 'clsx';

const NavItem = ({ to, icon: Icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      clsx(
        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
        isActive
          ? 'bg-[var(--bg-hover)] text-[var(--text-base)] font-medium shadow-sm'
          : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-base)]'
      )
    }
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium text-sm">{label}</span>
  </NavLink>
);

export const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/habits', label: 'Habits', icon: Target },
    { path: '/sleep', label: 'Sleep', icon: Moon },
    { path: '/screentime', label: 'Screen Time', icon: Smartphone },
    { path: '/reports', label: 'Reports', icon: TrendingUp },
    { path: '/journal', label: 'Journal', icon: BookOpen },
  ];

  return (
    <aside 
      className={clsx(
        "fixed left-0 top-0 h-screen w-64 bg-[var(--bg-card)] border-r border-[var(--border-base)] flex flex-col p-6 transition-transform duration-300 z-50",
        // Mobile: translate based on isOpen state
        "md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between mb-10 px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-[var(--text-base)] to-[var(--text-muted)] bg-clip-text text-transparent">
            Habit OS
          </h1>
        </div>
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="md:hidden p-1 text-[var(--text-muted)] hover:text-[var(--text-base)] rounded-lg hover:bg-[var(--bg-hover)]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <NavItem 
            key={item.path} 
            to={item.path} 
            icon={item.icon} 
            label={item.label} 
            onClick={() => onClose?.()} // Close sidebar on navigation on mobile
          />
        ))}
      </nav>

      <div className="mt-auto">
        <NavItem 
          to="/settings" 
          icon={Settings} 
          label="Settings" 
          onClick={() => onClose?.()}
        />
      </div>
    </aside>
  );
};
