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
        'relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group',
        isActive
          ? 'bg-primary-500/10 text-primary-500 font-semibold shadow-sm'
          : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-base)]'
      )
    }
  >
    {({ isActive }) => (
      <>
        <Icon className={clsx(
          "w-[22px] h-[22px] transition-transform duration-300 group-hover:scale-110",
          isActive ? "text-primary-500" : "text-current"
        )} />
        <span className="text-sm tracking-wide">{label}</span>
        {isActive && (
          <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary-500 blur-[1px]" />
        )}
      </>
    )}
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
        "fixed left-0 top-0 h-screen w-72 bg-[var(--bg-card)]/90 backdrop-blur-xl border-r border-[var(--border-base)] flex flex-col p-6 transition-transform duration-300 z-50",
        // Mobile: translate based on isOpen state
        "md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between mb-12 px-2">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-white/5 border border-white/10 p-1.5 shadow-lg">
            <img src="/logo.png" alt="Habit OS Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 drop-shadow-sm">
            Habit OS
          </h1>
        </div>
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="md:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text-base)] rounded-xl hover:bg-[var(--bg-hover)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-2.5 flex-1">
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

      <div className="mt-auto pt-6 border-t border-[var(--border-base)]">
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
