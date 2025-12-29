// Tafsir editions from spa5k/tafsir_api
// API URL format: https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/{slug}/{surah}.json

export const TAFSIR_EDITIONS = [
    // Urdu Tafsirs
    {
        id: 'ur-tafsir-bayan-ul-quran',
        name: 'Dr. Israr Ahmed',
        nameUrdu: 'بیان القرآن',
        language: 'Urdu',
        languageCode: 'ur',
        apiId: 159,
    },
    {
        id: 'ur-tafseer-ibn-e-kaseer',
        name: 'Ibn Kathir (Urdu)',
        nameUrdu: 'تفسیر ابن کثیر',
        language: 'Urdu',
        languageCode: 'ur',
        apiId: 160,
    },
    // English Tafsirs
    {
        id: 'en-tafsir-maarif-ul-quran',
        name: 'Maarif ul Quran',
        nameUrdu: 'معارف القرآن',
        language: 'English',
        languageCode: 'en',
        apiId: 168,
    },
    {
        id: 'en-tafisr-ibn-kathir',
        name: 'Ibn Kathir (English)',
        language: 'English',
        languageCode: 'en',
        apiId: 169,
    },
    {
        id: 'en-al-jalalayn',
        name: 'Al-Jalalayn',
        language: 'English',
        languageCode: 'en',
        apiId: 74,
    },
    // Arabic Tafsirs
    {
        id: 'ar-tafsir-ibn-kathir',
        name: 'Ibn Kathir (Arabic)',
        nameArabic: 'تفسير ابن كثير',
        language: 'Arabic',
        languageCode: 'ar',
        apiId: 14,
    },
    {
        id: 'ar-tafseer-al-qurtubi',
        name: 'Al-Qurtubi',
        nameArabic: 'تفسير القرطبي',
        language: 'Arabic',
        languageCode: 'ar',
        apiId: 90,
    },
];

export const DEFAULT_TAFSIR = 'ur-tafsir-bayan-ul-quran';
