import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, List, FolderTree, ChevronDown, ChevronRight } from 'lucide-react';
import { getAllRegistryPaths } from '../utils/dataLoader';

const KeyIndex = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('hive'); // 'hive' or 'alphabetical'
    const [expandedHives, setExpandedHives] = useState({});
    const [registryPaths, setRegistryPaths] = useState([]);

    useEffect(() => {
        const paths = getAllRegistryPaths();
        setRegistryPaths(paths);
        document.title = 'Key Index - LOLReg';

        // Expand all hives by default
        const hives = [...new Set(paths.map(p => p.hive))];
        const expanded = {};
        hives.forEach(h => expanded[h] = true);
        setExpandedHives(expanded);
    }, []);

    const filteredPaths = useMemo(() => {
        if (!searchTerm) return registryPaths;
        const term = searchTerm.toLowerCase();
        return registryPaths.filter(p =>
            p.path.toLowerCase().includes(term) ||
            p.entries.some(e => e.name.toLowerCase().includes(term))
        );
    }, [registryPaths, searchTerm]);

    const groupedByHive = useMemo(() => {
        const groups = {};
        filteredPaths.forEach(p => {
            if (!groups[p.hive]) {
                groups[p.hive] = [];
            }
            groups[p.hive].push(p);
        });
        return groups;
    }, [filteredPaths]);

    const toggleHive = (hive) => {
        setExpandedHives(prev => ({
            ...prev,
            [hive]: !prev[hive]
        }));
    };

    const renderKeyPath = (item) => (
        <div
            key={item.path}
            className="flex items-center justify-between py-2 px-3 hover:bg-[var(--bg-tertiary)] rounded-md transition-colors group"
        >
            <code className="text-sm text-[var(--text-primary)] font-mono break-all">
                {item.path}
            </code>
            <div className="ml-4 flex flex-wrap gap-2 justify-end">
                {item.entries.map(entry => (
                    <Link
                        key={entry.id}
                        to={`/key/${entry.id}`}
                        className="text-xs text-[var(--accent-primary)] hover:underline whitespace-nowrap opacity-70 group-hover:opacity-100 transition-opacity"
                    >
                        {entry.name}
                    </Link>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                    Registry Key <span className="text-[var(--accent-primary)]">Index</span>
                </h1>
                <p className="text-[var(--text-secondary)]">
                    {registryPaths.length} registry keys across all entries
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between max-w-4xl mx-auto">
                <div className="relative flex-1 w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-[var(--text-secondary)]" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] text-sm transition-colors"
                        placeholder="Search registry keys..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex rounded-lg border border-[var(--border-color)] overflow-hidden">
                    <button
                        onClick={() => setViewMode('hive')}
                        className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${
                            viewMode === 'hive'
                                ? 'bg-[var(--accent-primary)] text-white'
                                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]'
                        }`}
                    >
                        <FolderTree className="w-4 h-4" />
                        Par Hive
                    </button>
                    <button
                        onClick={() => setViewMode('alphabetical')}
                        className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${
                            viewMode === 'alphabetical'
                                ? 'bg-[var(--accent-primary)] text-white'
                                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]'
                        }`}
                    >
                        <List className="w-4 h-4" />
                        Alphabétique
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                {viewMode === 'hive' ? (
                    <div className="space-y-4">
                        {Object.keys(groupedByHive).sort().map(hive => (
                            <div
                                key={hive}
                                className="border border-[var(--border-color)] rounded-lg overflow-hidden bg-[var(--bg-secondary)]"
                            >
                                <button
                                    onClick={() => toggleHive(hive)}
                                    className="w-full flex items-center justify-between px-4 py-3 bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        {expandedHives[hive] ? (
                                            <ChevronDown className="w-5 h-5 text-[var(--accent-primary)]" />
                                        ) : (
                                            <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
                                        )}
                                        <span className="font-mono font-semibold text-[var(--text-primary)]">
                                            {hive}
                                        </span>
                                    </div>
                                    <span className="text-sm text-[var(--text-secondary)]">
                                        {groupedByHive[hive].length} keys
                                    </span>
                                </button>
                                {expandedHives[hive] && (
                                    <div className="divide-y divide-[var(--border-color)]">
                                        {groupedByHive[hive].map(item => renderKeyPath(item))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="border border-[var(--border-color)] rounded-lg overflow-hidden bg-[var(--bg-secondary)]">
                        <div className="divide-y divide-[var(--border-color)]">
                            {filteredPaths.map(item => renderKeyPath(item))}
                        </div>
                    </div>
                )}

                {filteredPaths.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-[var(--text-secondary)]">No keys found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KeyIndex;
