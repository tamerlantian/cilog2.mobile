/**
 * Boilerplate App — arquitectura modular React Native
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DevModeProvider } from './src/shared/context/dev-mode-context';
import { ToastProvider } from './src/shared/context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { AuthProvider } from './src/modules/auth/context/auth.context';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { initializeServices } from './src/core/services/init-services';
import Toast from 'react-native-toast-message';
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ErrorBoundary } from './src/shared/components/error-boundary';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  // TODO: Replace with your project's Sentry DSN
  dsn: '',

  environment: __DEV__ ? 'development' : 'production',
  enabled: !__DEV__,
  tracesSampleRate: 0.2,
  attachStacktrace: true,
  normalizeDepth: 10,
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 30000,
  sendDefaultPii: true,
  enableNativeCrashHandling: true,

  beforeSend(event) {
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.filter(breadcrumb => {
        const data = JSON.stringify(breadcrumb.data || {}).toLowerCase();
        return !data.includes('password') && !data.includes('token');
      });
    }
    return event;
  },
});


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

initializeServices().catch(error => {
  console.error('🚀 [App] Error inicializando servicios:', error);

  Sentry.captureException(error, {
    level: 'error',
    tags: {
      location: 'app_initialization',
      service: 'init_services',
    },
  });
});

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const handleRootError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('🚨 [Root Error Boundary] Critical error:', error);

    Sentry.captureException(error, {
      level: 'fatal',
      tags: {
        error_boundary: 'root',
        location: 'app_root',
      },
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  };

  return (
    <ErrorBoundary level="root" onError={handleRootError}>
      <Provider store={store}>
        <GestureHandlerRootView style={styles.gestureHandler}>
          <QueryClientProvider client={queryClient}>
            <KeyboardProvider>
            <BottomSheetModalProvider>
              <ToastProvider>
                <DevModeProvider>
                  <AuthProvider>
                    <SafeAreaProvider>
                      <StatusBar
                        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                      />
                      <AppContent />
                    </SafeAreaProvider>
                  </AuthProvider>
                </DevModeProvider>
              </ToastProvider>
            </BottomSheetModalProvider>
            </KeyboardProvider>
          </QueryClientProvider>
        </GestureHandlerRootView>
        <Toast visibilityTime={2000} />
      </Provider>
    </ErrorBoundary>
  );
}

function AppContent() {
  return (
    <View style={styles.container}>
      <AppNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

export default Sentry.wrap(App);
