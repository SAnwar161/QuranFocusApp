// Islamic/Hijri Date Service using Aladhan.com API
// API is free, no key required

const BASE_URL = 'https://api.aladhan.com/v1';

// Get user's location from IP address (free, no key needed)
export const getLocationFromIP = async () => {
    try {
        const response = await fetch('http://ip-api.com/json/?fields=status,country,countryCode,city');
        const data = await response.json();

        if (data.status === 'success') {
            return {
                city: data.city,
                country: data.country,
                countryCode: data.countryCode,
            };
        }
        return null;
    } catch (error) {
        console.error('IP Location Error:', error);
        return null;
    }
};

// Convert country code to flag emoji
export const countryCodeToFlag = (countryCode) => {
    if (!countryCode) return '🌍';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
};

// Get today's Hijri date (simple, no location)
export const getHijriDate = async () => {
    try {
        const today = new Date();
        const day = today.getDate().toString().padStart(2, '0');
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const year = today.getFullYear();

        const dateString = `${day}-${month}-${year}`;

        const response = await fetch(`${BASE_URL}/gToH/${dateString}`);
        const data = await response.json();

        if (data.code === 200 && data.data) {
            const hijri = data.data.hijri;
            return {
                day: hijri.day,
                month: hijri.month.en,
                monthArabic: hijri.month.ar,
                monthNumber: hijri.month.number,
                year: hijri.year,
                weekday: hijri.weekday.en,
                weekdayArabic: hijri.weekday.ar,
                fullDate: `${hijri.day} ${hijri.month.en} ${hijri.year} AH`,
                fullDateArabic: `${hijri.day} ${hijri.month.ar} ${hijri.year}`,
            };
        }
        return null;
    } catch (error) {
        console.error('Hijri Date API Error:', error);
        return null;
    }
};

// Get Hijri date based on user's IP location (with country flag)
export const getHijriDateWithLocation = async () => {
    try {
        // First get location from IP
        const location = await getLocationFromIP();

        if (location) {
            // Use location-based API
            const response = await fetch(
                `${BASE_URL}/timingsByCity?city=${encodeURIComponent(location.city)}&country=${encodeURIComponent(location.country)}`
            );
            const data = await response.json();

            if (data.code === 200 && data.data) {
                const hijri = data.data.date.hijri;
                return {
                    day: hijri.day,
                    month: hijri.month.en,
                    monthArabic: hijri.month.ar,
                    monthNumber: hijri.month.number,
                    year: hijri.year,
                    weekday: hijri.weekday.en,
                    weekdayArabic: hijri.weekday.ar,
                    fullDate: `${hijri.day} ${hijri.month.en} ${hijri.year} AH`,
                    fullDateArabic: `${hijri.day} ${hijri.month.ar} ${hijri.year}`,
                    location: location,
                    flag: countryCodeToFlag(location.countryCode),
                    city: location.city,
                    country: location.country,
                };
            }
        }

        // Fallback to simple date without location
        const simpleDate = await getHijriDate();
        if (simpleDate) {
            return {
                ...simpleDate,
                flag: '🌍',
            };
        }
        return null;
    } catch (error) {
        console.error('Hijri Date with Location Error:', error);
        // Fallback
        const fallback = await getHijriDate();
        return fallback ? { ...fallback, flag: '🌍' } : null;
    }
};
