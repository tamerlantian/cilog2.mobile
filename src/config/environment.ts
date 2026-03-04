import Config from 'react-native-config';

let apiBase = 'https://your-api.example.com';
try {
  apiBase = Config.API_BASE_URL ?? apiBase;
} catch {
  // react-native-config native module not available (native rebuild required)
}

export const environment = {
  production: false,
  apiBase,
  timeout: 30000,
};
