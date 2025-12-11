
import React, { useRef, useState, useCallback } from 'react';
import { View, PanResponder, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { AppProvider } from './src/context/Store';
import HomeScreen from './src/screens/HomeScreen';
import FocusScreen from './src/screens/FocusScreen';
import StatsScreen from './src/screens/StatsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import FeedbackScreen from './src/screens/FeedbackScreen';
import TafsirScreen from './src/screens/TafsirScreen';
import { COLORS } from './src/constants/theme';

const Stack = createNativeStackNavigator();

const IdleTimerWrapper = ({ children }) => {
  const timerId = useRef(null);
  const navigationRef = useNavigationContainerRef();

  const resetTimer = useCallback(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    // 30 Seconds Idle Timer
    timerId.current = setTimeout(() => {
      if (navigationRef.isReady()) {
        const currentRoute = navigationRef.getCurrentRoute();
        // Don't navigate if already in Focus screen
        if (currentRoute && currentRoute.name !== 'Focus') {
          navigationRef.navigate('Focus');
        }
      }
    }, 30000);
  }, [navigationRef]);

  // Initial timer start
  React.useEffect(() => {
    resetTimer();
    return () => {
      if (timerId.current) clearTimeout(timerId.current);
    }
  }, [resetTimer]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        resetTimer();
        return false; // Let the event bubble to actual components
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <NavigationContainer ref={navigationRef}>
        {children}
      </NavigationContainer>
    </View>
  );
};

export default function App() {
  return (
    <AppProvider>
      <StatusBar style="light" />
      <IdleTimerWrapper>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background }
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Focus" component={FocusScreen} />
          <Stack.Screen name="Stats" component={StatsScreen} />
          <Stack.Screen name="Feedback" component={FeedbackScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Tafsir" component={TafsirScreen} />
        </Stack.Navigator>
      </IdleTimerWrapper>
    </AppProvider>
  );
}
