const modules = import.meta.glob('../data/*.yml', { eager: true });

export const getAllKeys = () => {
    const keys = [];
    for (const path in modules) {
        const data = modules[path].default;
        // Add an ID based on the filename for routing
        const id = path.split('/').pop().replace('.yml', '');
        keys.push({ ...data, id });
    }
    return keys;
};

export const getKeyById = (id) => {
    const keys = getAllKeys();
    return keys.find((k) => k.id === id);
};

// Normalize registry path casing for consistency
const normalizeRegistryPath = (path) => {
    const parts = path.split('\\');
    // Normalize hive (always uppercase)
    parts[0] = parts[0].toUpperCase();
    // Normalize common segments
    return parts.map((part, index) => {
        if (index === 0) return part; // hive already uppercase
        const lower = part.toLowerCase();
        // Standard casing for well-known segments
        if (lower === 'software') return 'SOFTWARE';
        if (lower === 'system') return 'SYSTEM';
        if (lower === 'classes') return 'Classes';
        if (lower === 'microsoft') return 'Microsoft';
        if (lower === 'windows') return 'Windows';
        if (lower === 'currentversion') return 'CurrentVersion';
        if (lower === 'currentcontrolset') return 'CurrentControlSet';
        if (lower === 'explorer') return 'Explorer';
        if (lower === 'shell') return 'Shell';
        if (lower === 'services') return 'Services';
        if (lower === 'control') return 'Control';
        if (lower === 'enum') return 'Enum';
        if (lower === 'parameters') return 'Parameters';
        return part;
    }).join('\\');
};

export const getAllRegistryPaths = () => {
    const allKeys = getAllKeys();
    const pathMap = new Map(); // Use Map to dedupe by normalized path

    for (const entry of allKeys) {
        if (entry.keys && Array.isArray(entry.keys)) {
            for (const keyPath of entry.keys) {
                const normalizedPath = normalizeRegistryPath(keyPath);
                const normalizedKey = normalizedPath.toLowerCase();

                // If path already exists, add this entry to its list
                if (pathMap.has(normalizedKey)) {
                    const existing = pathMap.get(normalizedKey);
                    // Only add if this entry isn't already linked
                    if (!existing.entries.some(e => e.id === entry.id)) {
                        existing.entries.push({ id: entry.id, name: entry.name });
                    }
                } else {
                    pathMap.set(normalizedKey, {
                        path: normalizedPath,
                        hive: normalizedPath.split('\\')[0],
                        entries: [{ id: entry.id, name: entry.name }]
                    });
                }
            }
        }
    }

    return Array.from(pathMap.values()).sort((a, b) => a.path.localeCompare(b.path));
};
