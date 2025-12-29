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

export const getAyah = async (number, editions = ['quran-simple', 'en.sahih', 'ar.alafasy']) => {
    const cacheKey = `${number}-${editions.join(',')}`;

    if (ayahCache.has(cacheKey)) {
        console.log('Serving from cache:', number);
        return ayahCache.get(cacheKey);
    }

    try {
        console.log(`Fetching ayah: ${number} with editions: ${editions.join(',')}`);
        const response = await fetch(`${BASE_URL}/ayah/${number}/editions/${editions.join(',')}`);
        const data = await response.json();
        console.log('API Response code:', data.code);
        if (data.code === 200) {
            const result = normalizeAyahData(data.data);
            ayahCache.set(cacheKey, result);
            return result;
        }
        console.error('API returned error:', data.code, data.status);
        throw new Error('Failed to fetch Ayah');
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};

export const getRandomAyah = async (translateTo = 'en.sahih', reciter = 'ar.alafasy') => {
    // Total Ayahs in Quran is 6236
    const randomNum = Math.floor(Math.random() * 6236) + 1;
    return getAyah(randomNum, ['quran-simple', translateTo, reciter]);
};

export const getSurah = async (surahNumber, translateTo = 'en.sahih', reciter = 'ar.alafasy') => {
    try {
        // Include reciter edition for audio recitation
        const response = await fetch(`${BASE_URL}/surah/${surahNumber}/editions/quran-simple,${translateTo},${reciter}`);
        const data = await response.json();

        if (data.code === 200 && Array.isArray(data.data)) {
            const arabic = data.data[0];
            const translation = data.data[1];
            const audio = data.data[2]; // ar.alafasy edition for audio

            // Combine arabic, translation, and audio
            const ayahs = arabic.ayahs.map((ayah, index) => ({
                ...ayah,
                translation: translation.ayahs[index] ? {
                    text: translation.ayahs[index].text,
                    edition: translation.edition
                } : null,
                audio: audio && audio.ayahs[index] ? audio.ayahs[index].audio : null
            }));

            return {
                number: arabic.number,
                name: arabic.name,
                englishName: arabic.englishName,
                englishNameTranslation: arabic.englishNameTranslation,
                revelationType: arabic.revelationType,
                numberOfAyahs: arabic.numberOfAyahs,
                ayahs: ayahs
            };
        }
        throw new Error('Failed to fetch Surah');
    } catch (error) {
        console.error('API Error fetching Surah:', error);
        return null;
    }
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

// New Tafsir API using spa5k/tafsir_api for comprehensive tafsirs
// Using raw GitHub URL (jsdelivr CDN blocks mobile apps)
const TAFSIR_API_BASE = 'https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir';

export const getTafsirV2 = async (surahNumber, ayahNumber, tafsirSlug = 'ur-tafsir-bayan-ul-quran') => {
    try {
        // Ensure numbers are integers
        const surah = parseInt(surahNumber, 10);
        const ayah = parseInt(ayahNumber, 10);

        console.log(`Fetching tafsir: ${tafsirSlug}/${surah}.json for ayah ${ayah}`);

        const response = await fetch(`${TAFSIR_API_BASE}/${tafsirSlug}/${surah}.json`);

        // Check if response is OK before parsing
        if (!response.ok) {
            console.log('Tafsir API returned:', response.status);
            return null;
        }

        const data = await response.json();

        if (data && data.ayahs && data.ayahs.length > 0) {
            // Find the specific ayah tafsir
            let ayahTafsir = data.ayahs.find(a => parseInt(a.ayah, 10) === ayah);

            // If not found, some tafsirs combine all - try first entry
            if (!ayahTafsir) {
                console.log('Specific ayah not found, using first entry');
                ayahTafsir = data.ayahs[0];
            }

            if (ayahTafsir && ayahTafsir.text) {
                return {
                    text: ayahTafsir.text,
                    surah: surah,
                    ayah: ayah,
                };
            }
        }
        return null;
    } catch (error) {
        console.error('Tafsir API Error:', error);
        return null;
    }
};
