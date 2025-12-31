// Theme definitions
export const THEMES = {
  indigo: { name: 'Royal Blue', colors: { 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 900: '#1e3a8a' } },
  emerald: { name: 'Emerald', colors: { 400: '#34d399', 500: '#10b981', 600: '#059669', 900: '#064e3b' } },
  rose: { name: 'Rose', colors: { 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 900: '#881337' } },
  orange: { name: 'Orange', colors: { 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 900: '#7c2d12' } },
  cyan: { name: 'Cyan', colors: { 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 900: '#164e63' } },
  violet: { name: 'Violet', colors: { 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 900: '#4c1d95' } },
};

export const applyTheme = (themeName) => {
  const theme = THEMES[themeName] || THEMES.indigo;
  const root = document.documentElement;
  
  Object.entries(theme.colors).forEach(([shade, value]) => {
    root.style.setProperty(`--color-primary-${shade}`, value);
  });
};

export const applyMode = (mode) => {
  const root = document.documentElement;
  if (mode === 'light') {
    root.setAttribute('data-mode', 'light');
  } else {
    root.removeAttribute('data-mode');
  }
};
