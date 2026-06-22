export const getImageUrl = (path?: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};
