import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Terminal, AlertTriangle } from 'lucide-react';
import { getKeyById } from '../utils/dataLoader';

const Detail = () => {
    const { id } = useParams();
    const [keyData, setKeyData] = useState(null);
    const [copiedIndex, setCopiedIndex] = useState(null);

    useEffect(() => {
        const data = getKeyById(id);
        setKeyData(data);
    }, [id]);

    if (!keyData) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-[var(--text-secondary)]">Loading or Key not found...</div>
            </div>
        );
    }

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Link to="/" className="inline-flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Registry Keys
            </Link>

            <div className="space-y-4">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">{keyData.name}</h1>
                <p className="text-lg text-[var(--text-secondary)]">{keyData.description}</p>

                <div className="flex flex-wrap gap-3">
                    {keyData.tags && keyData.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full text-sm font-medium bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)]">
                            {tag}
                        </span>
                    ))}
                    {keyData.mitre_ids && keyData.mitre_ids.map(mid => (
                        <span key={mid} className="px-3 py-1 rounded-full text-sm font-medium bg-red-900/20 text-red-400 border border-red-900/30">
                            {mid}
                        </span>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] flex items-center">
                    <Terminal className="w-5 h-5 mr-2 text-[var(--accent-primary)]" />
                    Registry Paths
                </h2>
                <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] overflow-hidden">
                    {keyData.keys && keyData.keys.map((k, idx) => (
                        <div key={idx} className="p-4 font-mono text-sm text-[var(--text-secondary)] border-b border-[var(--border-color)] last:border-0 flex items-center justify-between group">
                            <span>{k}</span>
                            <button
                                onClick={() => handleCopy(k, `path-${idx}`)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-all"
                                title="Copy path"
                            >
                                {copiedIndex === `path-${idx}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-[var(--danger)]" />
                    Malicious Use Cases
                </h2>
                <div className="grid gap-6">
                    {keyData.use_cases && keyData.use_cases.map((useCase, idx) => (
                        <div key={idx} className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] overflow-hidden">
                            <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]/50">
                                <h3 className="font-medium text-[var(--text-primary)]">{useCase.title}</h3>
                                <p className="text-sm text-[var(--text-secondary)] mt-1">{useCase.description}</p>
                            </div>
                            <div className="p-4 bg-[var(--code-bg)] relative group">
                                <pre className="text-sm font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap break-all p-2">
                                    {useCase.code}
                                </pre>
                                <button
                                    onClick={() => handleCopy(useCase.code, `code-${idx}`)}
                                    className="absolute top-2 right-2 p-2 rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[var(--text-primary)]"
                                >
                                    {copiedIndex === `code-${idx}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Detail;
