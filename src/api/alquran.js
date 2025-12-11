const BASE_URL = 'https://api.alquran.cloud/v1';

const normalizeAyahData = (data) => {
    // We expect an array if multiple editions were requested
    if (Array.isArray(data)) {
        const arabic = data.find(item => item.edition.type === 'quran') || data[0];
        const translation = data.find(item => item.edition.type === 'translation') || data[1];
        const audio = data.find(item => item.edition.type === 'versebyverse') || data[2];

        return {
            ...arabic, // Base properties (number, surah, etc) from arabic
            text: arabic.text,
            translation: translation ? { text: translation.text, edition: translation.edition } : null,
            audio: audio ? audio.audio : null,
            secondaryAudio: audio ? audio.audioSecondary : null // Sometimes useful
        };
    }
    return data;
};

// Simple in-memory cache
const ayahCache = new Map();

export const getAyah = async (number, editions = ['quran-uthmani', 'en.asad', 'ar.alafasy']) => {
    const cacheKey = `${number}-${editions.join(',')}`;

    if (ayahCache.has(cacheKey)) {
        console.log('Serving from cache:', number);
        return ayahCache.get(cacheKey);
    }

    try {
        const response = await fetch(`${BASE_URL}/ayah/${number}/editions/${editions.join(',')}`);
        const data = await response.json();
        if (data.code === 200) {
            const result = normalizeAyahData(data.data);
            ayahCache.set(cacheKey, result);
            return result;
        }
        throw new Error('Failed to fetch Ayah');
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};

export const getRandomAyah = async (translateTo = 'en.asad') => {
    // Total Ayahs in Quran is 6236
    const randomNum = Math.floor(Math.random() * 6236) + 1;
    return getAyah(randomNum, ['quran-uthmani', translateTo, 'ar.alafasy']);
};

export const getEditionList = async () => {
    try {
        const response = await fetch(`${BASE_URL}/edition?format=text&language=en,ur,fr,es,id,ru,tr`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        return [];
    }
}
export const getTafsir = async (number, edition = 'en.ibnkathir') => {
    try {
        const response = await fetch(`${BASE_URL}/ayah/${number}/${edition}`);
        const data = await response.json();
        if (data.code === 200) {
            return data.data;
        }
        return null;
    } catch (error) {
        return null;
    }
};
