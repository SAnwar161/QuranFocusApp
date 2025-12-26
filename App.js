
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, PanResponder, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';

import { AppProvider } from './src/context/Store';
import HomeScreen from './src/screens/HomeScreen';
import FocusScreen from './src/screens/FocusScreen';
import ReadScreen from './src/screens/ReadScreen';
import StatsScreen from './src/screens/StatsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import FeedbackScreen from './src/screens/FeedbackScreen';
import TafsirScreen from './src/screens/TafsirScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { restoreReminders } from './src/services/notificationService';
import { hasSeenOnboarding, setOnboardingComplete } from './src/services/storage';
import { COLORS } from './src/constants/theme';

const Stack = createNativeStackNavigator();

const IdleTimerWrapper = ({ children }) => {
  const timerId = useRef(null);
  const navigationRef = useNavigationContainerRef();

  const resetTimer = useCallback(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    // Check current screen before setting timer
    if (navigationRef.isReady()) {
      const currentRoute = navigationRef.getCurrentRoute();
      // Don't set timer if on Focus or Read screens
      if (currentRoute && (currentRoute.name === 'Focus' || currentRoute.name === 'Read')) {
        return; // Exit early, don't set timer
      }
    }

    // 30 Seconds Idle Timer - only for other screens
    timerId.current = setTimeout(() => {
      if (navigationRef.isReady()) {
        const currentRoute = navigationRef.getCurrentRoute();
        // Double-check: Don't navigate if in Focus or Read screen
        if (currentRoute && currentRoute.name !== 'Focus' && currentRoute.name !== 'Read') {
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

  // Restore scheduled reminders on app start
  React.useEffect(() => {
    restoreReminders();
  }, []);

  // Handle notification tap - navigate to Focus
  React.useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      if (navigationRef.isReady()) {
        navigationRef.navigate('Focus');
      }
    });

    return () => subscription.remove();
  }, [navigationRef]);

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
  const [showOnboarding, setShowOnboarding] = useState(null); // null = loading

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    const seen = await hasSeenOnboarding();
    setShowOnboarding(!seen);
  };

  const handleOnboardingComplete = async () => {
    await setOnboardingComplete();
    setShowOnboarding(false);
  };

  // Show loading while checking
  if (showOnboarding === null) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Show onboarding for first-time users
  if (showOnboarding) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar style="light" />
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </View>
    );
  }

  // Normal app flow
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
          <Stack.Screen name="Read" component={ReadScreen} />
          <Stack.Screen name="Stats" component={StatsScreen} />
          <Stack.Screen name="Feedback" component={FeedbackScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Tafsir" component={TafsirScreen} />
          <Stack.Screen name="Schedule" component={ScheduleScreen} />
        </Stack.Navigator>
      </IdleTimerWrapper>
    </AppProvider>
  );
}

