
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { saveSettings, getSettings, saveStats, getStats } from '../services/storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        theme: 'dark',
        translation: 'en.sahih',
        reciter: 'ar.alafasy',
        tafsir: 'ur-tafsir-bayan-ul-quran',
        notifications: true,
        rotationInterval: 60, // seconds - default 60s for better reflection time
    });

    const [stats, setStats] = useState({
        ayatsSeen: 0,
        ayatsListened: 0,
        ayatsShared: 0,
        focusMinutes: 0,
        tafsirRead: 0,           // NEW: Tafsir views
        currentStreak: 0,        // NEW: Consecutive days
        lastActiveDate: null,    // NEW: For streak calculation
        surahReadCounts: {},     // NEW: { surahNumber: count } for most read
        weeklyStats: {           // NEW: For weekly comparison
            thisWeek: { seen: 0, listened: 0, focus: 0 },
            lastWeek: { seen: 0, listened: 0, focus: 0 },
            weekStartDate: null,
        },
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
                if (savedStats) {
                    // Merge with defaults to handle new fields
                    setStats(prev => ({ ...prev, ...savedStats }));
                }
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

    // Check and update streak on app load
    useEffect(() => {
        if (!loading) {
            updateStreak();
        }
    }, [loading]);

    const updateStreak = () => {
        const today = new Date().toDateString();

        setStats(prev => {
            const lastActive = prev.lastActiveDate;
            let newStreak = prev.currentStreak || 0;

            if (lastActive === today) {
                // Already updated today
                return prev;
            }

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();

            if (lastActive === yesterdayStr) {
                // Consecutive day - increase streak
                newStreak += 1;
            } else if (lastActive !== today) {
                // Streak broken - reset to 1
                newStreak = 1;
            }

            return {
                ...prev,
                currentStreak: newStreak,
                lastActiveDate: today,
            };
        });
    };

    // Check if we need to rotate weekly stats
    const checkWeeklyRotation = () => {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 = Sunday
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);
        const weekStartStr = startOfWeek.toDateString();

        setStats(prev => {
            if (prev.weeklyStats?.weekStartDate !== weekStartStr) {
                // New week - rotate stats
                return {
                    ...prev,
                    weeklyStats: {
                        lastWeek: { ...prev.weeklyStats?.thisWeek } || { seen: 0, listened: 0, focus: 0 },
                        thisWeek: { seen: 0, listened: 0, focus: 0 },
                        weekStartDate: weekStartStr,
                    },
                };
            }
            return prev;
        });
    };

    const updateStats = (type, value = 1) => {
        checkWeeklyRotation(); // Check if week changed

        setStats(prev => {
            const newStats = { ...prev };

            if (type === 'seen') {
                newStats.ayatsSeen += value;
                if (newStats.weeklyStats) {
                    newStats.weeklyStats.thisWeek.seen += value;
                }
            }
            if (type === 'listened') {
                newStats.ayatsListened += value;
                if (newStats.weeklyStats) {
                    newStats.weeklyStats.thisWeek.listened += value;
                }
            }
            if (type === 'shared') {
                newStats.ayatsShared = (newStats.ayatsShared || 0) + value;
            }
            if (type === 'focus') {
                newStats.focusMinutes += value;
                if (newStats.weeklyStats) {
                    newStats.weeklyStats.thisWeek.focus += value;
                }
            }
            if (type === 'tafsir') {
                newStats.tafsirRead = (newStats.tafsirRead || 0) + value;
            }

            return newStats;
        });
    };

    // Track surah reads for "Most Read Surah"
    const trackSurahRead = (surahNumber) => {
        setStats(prev => {
            const counts = { ...prev.surahReadCounts };
            counts[surahNumber] = (counts[surahNumber] || 0) + 1;
            return { ...prev, surahReadCounts: counts };
        });
    };

    // Reset all stats
    const resetStats = () => {
        setStats({
            ayatsSeen: 0,
            ayatsListened: 0,
            ayatsShared: 0,
            focusMinutes: 0,
            tafsirRead: 0,
            currentStreak: 0,
            lastActiveDate: null,
            surahReadCounts: {},
            weeklyStats: {
                thisWeek: { seen: 0, listened: 0, focus: 0 },
                lastWeek: { seen: 0, listened: 0, focus: 0 },
                weekStartDate: null,
            },
        });
    };

    return (
        <AppContext.Provider value={{
            settings,
            setSettings,
            stats,
            updateStats,
            trackSurahRead,
            resetStats,
            loading
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
