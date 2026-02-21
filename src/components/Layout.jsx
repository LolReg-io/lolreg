import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sun, Moon } from 'lucide-react';

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : '');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] sticky top-0 z-10 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <Shield className="w-8 h-8 text-[var(--accent-primary)] group-hover:text-[var(--accent-secondary)] transition-colors" />
            <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
              LOL<span className="text-[var(--accent-primary)]">Reg</span>
            </span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link
              to="/tree"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Tree
            </Link>
            <Link
              to="/index"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Index
            </Link>
            <Link
              to="/contribute"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Contribute
            </Link>
            <label htmlFor="dark-mode-toggle" className="flex items-center cursor-pointer select-none space-x-3">
              <span className="emoji-toggle-icon select-none">
                <Sun size={18} color="var(--text-primary)" />
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  id="dark-mode-toggle"
                  className="sr-only"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  aria-label="Toggle dark mode"
                />
                <div className="w-12 h-6 bg-[var(--border-color)] rounded-full shadow-inner"></div>
                <div
                  className={`dot absolute left-1 top-1 bg-[var(--accent-primary)] w-4 h-4 rounded-full transition-transform ${darkMode ? 'translate-x-6' : ''
                    }`}
                />
              </div>
              <span className="emoji-toggle-icon select-none">
                <Moon size={18} color="var(--text-primary)" />
              </span>
            </label>
          </nav>
        </div>
      </header>
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">{children}</main>
      <footer className="border-t border-[var(--border-color)] py-8 mt-auto bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-[var(--text-secondary)] space-y-2">
          <p>Inspired by the following projects:</p>
          <p>
            <a href="https://lolbas-project.github.io/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--text-primary)] transition-colors mx-2">LOLBAS</a>
            <a href="https://gtfobins.github.io/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--text-primary)] transition-colors mx-2">GTFOBins</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
