import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import HomeNavigator from './src/navigator/HomeNavigator';
import SplashScreen from 'react-native-splash-screen';

export default function App() {
  useEffect(() => {
    SplashScreen.hide()
  })

  return (
    <NavigationContainer>
      <HomeNavigator/>
    </NavigationContainer>
  );
}
