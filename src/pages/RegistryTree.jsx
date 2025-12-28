import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, Folder, FolderOpen, Key, Expand, Shrink } from 'lucide-react';
import { getAllKeys } from '../utils/dataLoader';

// Build tree structure from all registry keys
function buildTree(allEntries) {
    const root = { children: {}, entries: [], childrenLowerMap: {} };

    allEntries.forEach(entry => {
        if (!entry.keys) return;

        entry.keys.forEach(keyPath => {
            // Normalize key path (hive names)
            const normalized = keyPath
                .replace('HKEY_LOCAL_MACHINE', 'HKLM')
                .replace('HKEY_CURRENT_USER', 'HKCU')
                .replace('HKEY_CLASSES_ROOT', 'HKCR')
                .replace('HKEY_USERS', 'HKU');

            const parts = normalized.split('\\');
            let current = root;

            parts.forEach((part, i) => {
                if (!part) return; // Skip empty parts

                const partLower = part.toLowerCase();

                // Check if we already have this part (case-insensitive)
                if (!current.childrenLowerMap[partLower]) {
                    // Use canonical casing for common registry paths
                    const canonicalPart = getCanonicalCase(part);
                    current.children[canonicalPart] = { children: {}, entries: [], childrenLowerMap: {} };
                    current.childrenLowerMap[partLower] = canonicalPart;
                }

                const actualKey = current.childrenLowerMap[partLower];

                // Add entry to the last level
                if (i === parts.length - 1) {
                    // Avoid duplicates
                    if (!current.children[actualKey].entries.find(e => e.id === entry.id)) {
                        current.children[actualKey].entries.push(entry);
                    }
                }
                current = current.children[actualKey];
            });
        });
    });

    return root;
}

// Get canonical casing for registry path components
function getCanonicalCase(part) {
    const canonicalMap = {
        'hklm': 'HKLM',
        'hkcu': 'HKCU',
        'hkcr': 'HKCR',
        'hku': 'HKU',
        'software': 'SOFTWARE',
        'system': 'SYSTEM',
        'sam': 'SAM',
        'security': 'SECURITY',
        'microsoft': 'Microsoft',
        'windows': 'Windows',
        'currentversion': 'CurrentVersion',
        'currentcontrolset': 'CurrentControlSet',
        'run': 'Run',
        'runonce': 'RunOnce',
        'services': 'Services',
        'explorer': 'Explorer',
        'classes': 'Classes',
        'enum': 'Enum',
        'control': 'Control',
    };
    return canonicalMap[part.toLowerCase()] || part;
}

// Collect all paths in the tree
function getAllPaths(node, currentPath = '') {
    const paths = [];
    Object.entries(node.children).forEach(([name, child]) => {
        const fullPath = currentPath ? `${currentPath}\\${name}` : name;
        paths.push(fullPath);
        paths.push(...getAllPaths(child, fullPath));
    });
    return paths;
}

// Tree node component
function TreeNode({ name, node, path, depth, expandedNodes, toggleNode }) {
    const fullPath = path ? `${path}\\${name}` : name;
    const isExpanded = expandedNodes.has(fullPath);
    const hasChildren = Object.keys(node.children).length > 0;
    const hasEntries = node.entries.length > 0;

    // Sort children alphabetically
    const sortedChildren = Object.entries(node.children).sort(([a], [b]) => a.localeCompare(b));

    return (
        <div>
            <div
                className={`flex items-center py-1 px-2 rounded cursor-pointer transition-colors hover:bg-[var(--bg-tertiary)] group ${hasEntries ? 'text-[var(--success)]' : 'text-[var(--text-primary)]'}`}
                onClick={() => hasChildren && toggleNode(fullPath)}
                style={{ paddingLeft: `${depth * 20 + 8}px` }}
            >
                {/* Expand/Collapse icon */}
                <span className="w-4 h-4 mr-1 flex items-center justify-center">
                    {hasChildren ? (
                        isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
                        )
                    ) : (
                        <span className="w-4" />
                    )}
                </span>

                {/* Folder/Key icon */}
                <span className="mr-2">
                    {hasChildren ? (
                        isExpanded ? (
                            <FolderOpen className="w-4 h-4 text-[var(--accent-primary)]" />
                        ) : (
                            <Folder className="w-4 h-4 text-[var(--accent-primary)]" />
                        )
                    ) : (
                        <Key className="w-4 h-4 text-[var(--text-secondary)]" />
                    )}
                </span>

                {/* Node name */}
                <span className="font-mono text-sm">{name}</span>

                {/* Link to entries */}
                {hasEntries && (
                    <span className="ml-2 flex items-center gap-1">
                        {node.entries.map(entry => (
                            <Link
                                key={entry.id}
                                to={`/key/${entry.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-xs px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-colors"
                                title={entry.name}
                            >
                                {entry.name}
                            </Link>
                        ))}
                    </span>
                )}
            </div>

            {/* Children */}
            {isExpanded && hasChildren && (
                <div>
                    {sortedChildren.map(([childName, childNode]) => (
                        <TreeNode
                            key={childName}
                            name={childName}
                            node={childNode}
                            path={fullPath}
                            depth={depth + 1}
                            expandedNodes={expandedNodes}
                            toggleNode={toggleNode}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

const RegistryTree = () => {
    const allEntries = getAllKeys();
    const tree = useMemo(() => buildTree(allEntries), [allEntries]);
    const allPaths = useMemo(() => getAllPaths(tree), [tree]);

    // Start with root hives expanded
    const [expandedNodes, setExpandedNodes] = useState(new Set(['HKLM', 'HKCU', 'HKCR', 'HKU']));

    useEffect(() => {
        document.title = 'Registry Tree | LOLReg';
    }, []);

    const toggleNode = (path) => {
        setExpandedNodes(prev => {
            const next = new Set(prev);
            if (next.has(path)) {
                next.delete(path);
            } else {
                next.add(path);
            }
            return next;
        });
    };

    const expandAll = () => {
        setExpandedNodes(new Set(allPaths));
    };

    const collapseAll = () => {
        setExpandedNodes(new Set());
    };

    // Sort root nodes (hives)
    const sortedRoots = Object.entries(tree.children).sort(([a], [b]) => {
        // Put HKLM first, then HKCU, then others alphabetically
        const order = ['HKLM', 'HKCU', 'HKCR', 'HKU'];
        const aIndex = order.indexOf(a);
        const bIndex = order.indexOf(b);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return a.localeCompare(b);
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                        Registry <span className="text-[var(--accent-primary)]">Tree</span>
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Explore registry keys in a hierarchical view
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={expandAll}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <Expand className="w-4 h-4" />
                        Expand All
                    </button>
                    <button
                        onClick={collapseAll}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <Shrink className="w-4 h-4" />
                        Collapse All
                    </button>
                </div>
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-4 overflow-x-auto">
                <div className="min-w-fit">
                    {sortedRoots.map(([name, node]) => (
                        <TreeNode
                            key={name}
                            name={name}
                            node={node}
                            path=""
                            depth={0}
                            expandedNodes={expandedNodes}
                            toggleNode={toggleNode}
                        />
                    ))}
                </div>
            </div>

            <div className="text-center text-sm text-[var(--text-secondary)]">
                <p>
                    <span className="text-[var(--success)]">Green nodes</span> have associated registry key documentation.
                    Click the badge to view details.
                </p>
            </div>
        </div>
    );
};

export default RegistryTree;
