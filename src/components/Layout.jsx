import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Layout = ({ children }) => {
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
                            to="/contribute"
                            className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            Contribute
                        </Link>
                        <a
                            href="https://github.com/gtfobins/gtfobins.github.io"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            Inspired by GTFOBins
                        </a>
                    </nav>
                </div>
            </header>
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children}
            </main>
            <footer className="border-t border-[var(--border-color)] py-8 mt-auto bg-[var(--bg-secondary)]">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm text-[var(--text-secondary)]">
                    <p>Living Off The Land Registry</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
