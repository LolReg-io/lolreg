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
