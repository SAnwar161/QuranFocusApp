# Changelog

All notable changes to QuranFocus are documented here.

---

## [1.3.0] - 2024-12-22 (Final Release)

### ✨ New Features
- **Tilawat in Read Mode**: Play audio recitation for each ayat while reading Surahs
- **Continuous Playback**: Auto-plays next ayat with 2-second gap for seamless listening
- **Auto-Scroll**: Screen follows along during continuous playback
- **Playing Indicator**: Currently playing ayat highlighted with golden border
- **Stop Button**: Quick stop control appears in header during playback

### 🔧 Improvements
- **Vertical Scroll All Screens**: HomeScreen and OnboardingScreen now scroll on smaller devices
- **Stats Tracking**: Tilawat now counts in "Listened" statistics
- **Audio Button States**: Clear visual feedback for loading/playing states

### 🛠️ Technical
- Audio state managed at parent level for continuous playback
- API now fetches ar.alafasy audio edition for Surah reading
- Improved audio cleanup and memory management

---

## [1.2.0] - 2024-12-20

### ✨ New Features
- **Onboarding Experience**: Beautiful 8-slide welcome walkthrough with illustrations
- **Scheduled Reminders**: Set up to 10 daily reminders with custom labels
- **Focus Mode Bookmarking**: Save ayats directly from Focus Mode with one tap
- **Simple Time Picker**: Manual hour/minute input for scheduling reminders
- **Vibration Notifications**: Gentle vibration alerts without sound

### 🔧 Improvements
- **Focus Mode Layout**: Maximized Arabic card display to 97% screen height
- **Share Feature Fix**: Long ayats now captured completely in shared images
- **Home Screen Layout**: "Idle for 30s" hint moved under Focus button
- **Read Tab Protection**: No auto-Focus Mode when reading Quran
- **Compact Controls**: Play, Tafsir, and Bookmark buttons in tidy row

### 🛠️ Technical
- Added `expo-notifications` for scheduled reminders
- Added `expo-haptics` for reliable vibration feedback
- Version-based onboarding to show after major updates
- Fixed hidden ViewShot for full content capture

---

## [1.1.0] - 2024-12-15

### ✨ Features
- **Bookmark System**: Save and manage favorite ayats
- **Read Al-Quran**: Browse all 114 Surahs with Arabic + translation
- **Weekly Stats**: Track reading progress with visual charts
- **Translation Selection**: Multiple Urdu and English translations

### 🔧 Improvements
- Enhanced Focus Mode UI
- Better audio controls layout
- Improved typography for Arabic text

---

## [1.0.0] - 2024-12-01 (Initial Release)

### ✨ Features
- **Focus Mode**: Random ayat display with auto-rotation
- **Search Ayat**: Jump to any verse (e.g., "2:255")
- **Audio Playback**: Listen to Sheikh Alafasy recitation
- **Tafsir Integration**: Ibn Kathir explanations
- **Share Feature**: Generate beautiful ayat cards
- **Settings**: Translation language, rotation timer
- **"Midnight & Gold" Theme**: Elegant dark mode design

### 🛠️ Technical
- React Native + Expo SDK 54
- AlQuran Cloud API integration
- AsyncStorage for local data
- React Navigation 7

---

## Complete Feature Summary

| Feature | Version Added |
|---------|---------------|
| Focus Mode | 1.0.0 |
| Search Ayat | 1.0.0 |
| Audio Recitation | 1.0.0 |
| Tafsir | 1.0.0 |
| Share Cards | 1.0.0 |
| Dark Theme | 1.0.0 |
| Bookmark System | 1.1.0 |
| Read Al-Quran | 1.1.0 |
| Weekly Stats | 1.1.0 |
| Multiple Translations | 1.1.0 |
| Onboarding | 1.2.0 |
| Scheduled Reminders | 1.2.0 |
| Focus Mode Bookmarking | 1.2.0 |
| Tilawat in Read Mode | 1.3.0 |
| Continuous Playback | 1.3.0 |
| Auto-Scroll | 1.3.0 |

---

**Made with ❤️ for Muslims worldwide**

