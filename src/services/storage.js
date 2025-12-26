
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

export const saveReflection = async (ayatNumber, question) => {
    try {
        await AsyncStorage.setItem(`@reflection_${ayatNumber}`, question);
    } catch (e) {
        console.error('Failed to save reflection', e);
    }
};

export const getReflection = async (ayatNumber) => {
    try {
        return await AsyncStorage.getItem(`@reflection_${ayatNumber}`);
    } catch (e) {
        return null;
    }
};

// Reading position and bookmarks
export const saveLastRead = async (surahNumber, ayatNumber) => {
    try {
        const position = { surah: surahNumber, ayat: ayatNumber, timestamp: Date.now() };
        await AsyncStorage.setItem('@last_read', JSON.stringify(position));
    } catch (e) {
        console.error('Failed to save last read', e);
    }
};

export const getLastRead = async () => {
    try {
        const json = await AsyncStorage.getItem('@last_read');
        return json ? JSON.parse(json) : null;
    } catch (e) {
        return null;
    }
};

export const saveBookmark = async (surahNumber, ayatNumber) => {
    try {
        const bookmarks = await getBookmarks();
        const newBookmark = { surah: surahNumber, ayat: ayatNumber, timestamp: Date.now() };
        const updated = [...bookmarks, newBookmark];
        await AsyncStorage.setItem('@bookmarks', JSON.stringify(updated));
        return updated;
    } catch (e) {
        console.error('Failed to save bookmark', e);
        return [];
    }
};

export const getBookmarks = async () => {
    try {
        const json = await AsyncStorage.getItem('@bookmarks');
        return json ? JSON.parse(json) : [];
    } catch (e) {
        return [];
    }
};

export const removeBookmark = async (surahNumber, ayatNumber) => {
    try {
        const bookmarks = await getBookmarks();
        const updated = bookmarks.filter(b => !(b.surah === surahNumber && b.ayat === ayatNumber));
        await AsyncStorage.setItem('@bookmarks', JSON.stringify(updated));
        return updated;
    } catch (e) {
        console.error('Failed to remove bookmark', e);
        return [];
    }
};

export const isBookmarked = async (surahNumber, ayatNumber) => {
    try {
        const bookmarks = await getBookmarks();
        return bookmarks.some(b => b.surah === surahNumber && b.ayat === ayatNumber);
    } catch (e) {
        return false;
    }
};

// Onboarding - Version-based so it shows after major updates
const ONBOARDING_VERSION = 'v2'; // Increment to show onboarding again
const ONBOARDING_KEY = `@quranfocus_onboarding_${ONBOARDING_VERSION}`;

export const hasSeenOnboarding = async () => {
    try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        return value === 'true';
    } catch (e) {
        return false;
    }
};

export const setOnboardingComplete = async () => {
    try {
        await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (e) {
        console.error('Failed to save onboarding status', e);
    }
};
