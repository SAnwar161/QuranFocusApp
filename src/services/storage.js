
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    SETTINGS: '@quranfocus_settings',
    STATS: '@quranfocus_stats',
};

export const saveSettings = async (settings) => {
    try {
        await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
        console.error('Failed to save settings', e);
    }
};

export const getSettings = async () => {
    try {
        const json = await AsyncStorage.getItem(KEYS.SETTINGS);
        return json ? JSON.parse(json) : null;
    } catch (e) {
        return null;
    }
};

export const saveStats = async (stats) => {
    try {
        await AsyncStorage.setItem(KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
        console.error('Failed to save stats', e);
    }
}

export const getStats = async () => {
    try {
        const json = await AsyncStorage.getItem(KEYS.STATS);
        return json ? JSON.parse(json) : { ayatsSeen: 0, ayatsListened: 0, focusMinutes: 0 };
    } catch (e) {
        return { ayatsSeen: 0, ayatsListened: 0, focusMinutes: 0 };
    }
}
