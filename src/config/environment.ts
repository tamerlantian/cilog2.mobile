/**
 * Environment configuration for the application
 * TODO: Replace with your project's API URLs
 */

export const API_URLS = {
  PRODUCTION: 'https://your-api.example.com',
  DEVELOPMENT: 'http://your-api-dev.example.com',
};

export const environment = {
  production: false,
  apiBase: API_URLS.DEVELOPMENT,
  timeout: 30000,
};

export const updateApiBaseUrl = (isDeveloperMode: boolean): void => {
  environment.apiBase = isDeveloperMode ? API_URLS.DEVELOPMENT : API_URLS.PRODUCTION;
};
