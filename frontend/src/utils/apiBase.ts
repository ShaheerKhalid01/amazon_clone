const normalizeBaseUrl = (value?: string) => {
  if (!value) return '';
  return value.trim().replace(/\/$/, '');
};

export const getApiBaseUrl = () => {
  const configuredUrl = normalizeBaseUrl(import.meta.env.VITE_API_URL);
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

  if (configuredUrl) {
    const isLocalFallback = /localhost|127\.0\.0\.1/.test(configuredUrl);
    if (isLocalFallback && currentOrigin && !/localhost|127\.0\.0\.1/.test(currentOrigin)) {
      return `${currentOrigin}/api`;
    }
    return configuredUrl.endsWith('/api') ? configuredUrl : `${configuredUrl}/api`;
  }

  if (currentOrigin) {
    return `${currentOrigin}/api`;
  }

  return 'http://localhost:5000/api';
};

export const getApiUrl = (path: string) => {
  const baseUrl = getApiBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};
