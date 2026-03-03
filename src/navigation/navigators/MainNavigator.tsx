import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeTabsNavigator } from '../../modules/home/navigation/home-tabs.navigator';
import { ProfileScreen } from '../../modules/settings/screens/profile.screen';
import { AboutScreen } from '../../modules/settings/screens/about.screen';
import { MainStackParamList } from '../types';

const MainStack = createNativeStackNavigator<MainStackParamList>();

/**
 * Navegador principal de la aplicación autenticada
 */
export const MainNavigator: React.FC = () => {
  return (
    <MainStack.Navigator
      initialRouteName="HomeTabs"
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen
        name="HomeTabs"
        component={HomeTabsNavigator}
        options={{ title: 'Inicio' }}
      />
      <MainStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          headerShown: true,
          headerBackTitle: 'Ajustes',
        }}
      />
      <MainStack.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'Acerca de',
          headerShown: true,
          headerBackTitle: 'Ajustes',
        }}
      />
    </MainStack.Navigator>
  );
};
