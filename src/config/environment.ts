import Config from 'react-native-config';

export const environment = {
  production: false,
  apiBase: Config.API_BASE_URL ?? 'https://your-api.example.com',
  timeout: 30000,
};
