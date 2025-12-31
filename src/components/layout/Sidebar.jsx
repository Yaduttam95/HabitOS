import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Target, Moon, TrendingUp, BookOpen, Settings, Calendar } from 'lucide-react';
import clsx from 'clsx';

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
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

export const Sidebar = () => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/habits', label: 'Habits', icon: Target },
    { path: '/sleep', label: 'Sleep', icon: Moon },
    { path: '/reports', label: 'Reports', icon: TrendingUp },
    { path: '/journal', label: 'Journal', icon: BookOpen },
  ];

  return (
    <aside className="w-64 h-screen bg-[var(--bg-card)] border-r border-[var(--border-base)] flex flex-col p-6 fixed left-0 top-0">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-[var(--text-base)] to-[var(--text-muted)] bg-clip-text text-transparent">
          HabitOS
        </h1>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <NavItem key={item.path} to={item.path} icon={item.icon} label={item.label} />
        ))}
      </nav>

      <div className="mt-auto">
        <NavItem to="/settings" icon={Settings} label="Settings" />
      </div>
    </aside>
  );
};
