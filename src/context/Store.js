
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { saveSettings, getSettings, saveStats, getStats } from '../services/storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        theme: 'dark',
        translation: 'en.sahih',
        notifications: true,
        rotationInterval: 60, // seconds - default 60s for better reflection time
    });

    const [stats, setStats] = useState({
        ayatsSeen: 0,
        ayatsListened: 0,
        ayatsShared: 0,
        focusMinutes: 0,
    });

    const [loading, setLoading] = useState(true);

    // Load Fonts (Mock/System for now)
    const [fontsLoaded] = useFonts({
        // 'Amiri': require('./assets/fonts/Amiri-Regular.ttf'), 
    });

    useEffect(() => {
        const init = async () => {
            try {
                const savedSettings = await getSettings();
                if (savedSettings) {
                    // Migration: Update old 30s default to new 60s default
                    if (savedSettings.rotationInterval === 30) {
                        savedSettings.rotationInterval = 60;
                        await saveSettings(savedSettings);
                    }
                    setSettings(savedSettings);
                }

                const savedStats = await getStats();
                if (savedStats) setStats(savedStats);
            } catch (e) {
                console.warn(e);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    useEffect(() => {
        if (!loading) saveSettings(settings);
    }, [settings, loading]);

    useEffect(() => {
        if (!loading) saveStats(stats);
    }, [stats, loading]);

    const updateStats = (type, value = 1) => {
        setStats(prev => {
            const newStats = { ...prev };
            if (type === 'seen') newStats.ayatsSeen += value;
            if (type === 'listened') newStats.ayatsListened += value;
            if (type === 'shared') newStats.ayatsShared = (newStats.ayatsShared || 0) + value;
            if (type === 'focus') newStats.focusMinutes += value;
            return newStats;
        });
    };

    return (
        <AppContext.Provider value={{ settings, setSettings, stats, updateStats, loading }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
