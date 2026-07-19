const normalizeBaseUrl = (value?: string) => {
  if (!value) return '';
  return value.trim().replace(/\/$/, '');
};

export const getApiBaseUrl = () => {
  const configuredUrl = normalizeBaseUrl(import.meta.env.VITE_API_URL);
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

  if (configuredUrl) {
    return configuredUrl.endsWith('/api') ? configuredUrl : `${configuredUrl}/api`;
  }

  if (currentOrigin) {
    const isLocalHost = /localhost|127\.0\.0\.1/.test(currentOrigin);
    if (isLocalHost) {
      return 'http://localhost:5000/api';
    }
    return '/api';
  }

  return 'http://localhost:5000/api';
};

export const getApiUrl = (path: string) => {
  const baseUrl = getApiBaseUrl();
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const normalizedPath = path ? `/${path.replace(/^\/+/, '')}` : '';
  return `${normalizedBase}${normalizedPath}`;
};
