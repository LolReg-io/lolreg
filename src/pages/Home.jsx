import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Tag, ChevronRight } from 'lucide-react';
import { getAllKeys } from '../utils/dataLoader';

const Home = () => {
    const [keys, setKeys] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);

    useEffect(() => {
        const data = getAllKeys();
        setKeys(data);
        document.title = 'LOLReg - Living Off The Land Registry';

        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('search-input')?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const allTags = [...new Set(keys.flatMap(k => k.tags || []))];

    const filteredKeys = keys.filter(key => {
        const matchesSearch =
            key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            key.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (key.keys && key.keys.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())));

        const matchesTag = selectedTag ? key.tags && key.tags.includes(selectedTag) : true;

        return matchesSearch && matchesTag;
    });

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)]">
                    Registry Keys for <span className="text-[var(--accent-primary)]">Living Off The Land</span>
                </h1>
                <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                    A curated collection of Windows Registry keys used for persistence, privilege escalation, and defense evasion.
                </p>
            </div>

            <div className="max-w-2xl mx-auto relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-[var(--text-secondary)]" />
                </div>
                <input
                    id="search-input"
                    type="text"
                    className="block w-full pl-10 pr-24 py-3 border border-[var(--border-color)] rounded-lg leading-5 bg-[var(--bg-tertiary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] sm:text-sm transition-colors"
                    placeholder="Search by key path, name, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-xs text-[var(--text-secondary)] border border-[var(--border-color)] rounded px-1.5 py-0.5">
                        ⌘K
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
                <button
                    onClick={() => setSelectedTag(null)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${!selectedTag
                        ? 'bg-[var(--accent-primary)] text-white'
                        : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]'
                        }`}
                >
                    All
                </button>
                {allTags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center space-x-1 ${selectedTag === tag
                            ? 'bg-[var(--accent-primary)] text-white'
                            : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]'
                            }`}
                    >
                        <Tag className="w-3 h-3" />
                        <span>{tag}</span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredKeys.map((key) => (
                    <Link
                        key={key.id}
                        to={`/key/${key.id}`}
                        className="group bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg overflow-hidden hover:border-[var(--accent-primary)] transition-all duration-200 hover:shadow-lg hover:shadow-[var(--accent-primary)]/10 flex flex-col"
                    >
                        <div className="p-6 flex-grow">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                                    {key.name}
                                </h3>
                                <ChevronRight className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors" />
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-4">
                                {key.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                {key.tags && key.tags.map(tag => (
                                    <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {key.mitre_ids && (
                            <div className="bg-[var(--bg-tertiary)] px-6 py-2 border-t border-[var(--border-color)]">
                                <span className="text-xs font-mono text-[var(--text-secondary)]">
                                    MITRE: {key.mitre_ids.join(', ')}
                                </span>
                            </div>
                        )}
                    </Link>
                ))}
            </div>

            {filteredKeys.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-[var(--text-secondary)]">No keys found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default Home;
