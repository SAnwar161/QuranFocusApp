# QuranFocus 📖✨

> **Your Daily Companion for Quran Reflection, Recitation & Remembrance**

A beautifully designed React Native/Expo app that helps Muslims build a consistent habit of connecting with the Quran through Focus Mode, Tilawat, Tafsir, and more.

![Version](https://img.shields.io/badge/version-1.3.0-gold)
![Platform](https://img.shields.io/badge/platform-Android-green)
![License](https://img.shields.io/badge/license-Private-blue)

---

## 🌟 Features

### 🌙 Focus Mode
- **Random Ayat Display** - Beautiful presentation of Arabic text with translation
- **Auto-Rotation Timer** - Customizable (30/60/90/120 seconds)
- **Search Any Ayat** - Jump to specific verse (e.g., "2:255")
- **Audio Recitation** - Listen to Sheikh Alafasy
- **Bookmark Favorites** - Save with one tap
- **Smart Idle Timer** - Auto-starts after 30s inactivity
- **Share Cards** - Generate beautiful ayat images

### 📖 Read Al-Quran with Tilawat
- **Complete Quran** - All 114 Surahs
- **Multiple Translations** - Urdu, English, and more
- **Tilawat Playback** - Audio for each ayat
- **Continuous Mode** - Auto-plays next ayat with 2s gap
- **Auto-Scroll** - Follows along during playback
- **Bookmark System** - Save per surah

### ⏰ Scheduled Reminders
- **Up to 10 Daily Reminders** 
- **Custom Labels** (Fajr, Dhuhr, After Work, etc.)
- **Gentle Vibration Alerts**
- **Quick Access** - Tap to open Focus Mode

### 📘 Tafsir (Exegesis)
- **Ibn Kathir Tafsir** - Authentic explanations
- **One-Tap Access** - From Focus Mode

### 📊 Weekly Statistics
- **Visual Charts** - Progress tracking
- **Focus Time** - Minutes spent
- **Ayats Read** - Verses discovered
- **Tilawat Count** - Recitations heard
- **Share Count** - Blessings shared

### 🎨 Premium Design
- **"Midnight & Gold" Theme** - Elegant dark mode
- **Beautiful Arabic Typography**
- **Responsive Layout** - All screen sizes
- **Smooth Animations**

---

## 📱 Screenshots

| Home | Focus Mode | Read Quran | Stats |
|------|------------|------------|-------|
| Menu with all features | Arabic + Translation | Surah list + Tilawat | Weekly charts |

---

## 🛠️ Tech Stack

- **Framework**: React Native + Expo SDK 54
- **Navigation**: React Navigation 7
- **State Management**: React Context
- **Storage**: AsyncStorage (local)
- **Audio**: Expo AV
- **Notifications**: Expo Notifications
- **Charts**: react-native-chart-kit
- **Sharing**: react-native-view-shot + Expo Sharing

---

## 📂 Project Structure

```
QuranFocusApp/
├── App.js                    # Entry point with navigation
├── app.json                  # Expo configuration
├── assets/                   # Images, icons, fonts
│   ├── icon.png
│   ├── logo.png
│   └── splash-icon.png
├── src/
│   ├── api/
│   │   └── alquran.js        # AlQuran Cloud API integration
│   ├── components/
│   │   ├── AudioControls.js  # Play/Pause audio
│   │   └── AyatCard.js       # Ayat display component
│   ├── constants/
│   │   ├── languages.js      # Translation options
│   │   └── theme.js          # Colors, spacing, fonts
│   ├── context/
│   │   └── Store.js          # Global state management
│   ├── data/
│   │   └── surahs.json       # 114 Surah metadata
│   ├── screens/
│   │   ├── FocusScreen.js    # Focus Mode
│   │   ├── HomeScreen.js     # Main menu
│   │   ├── OnboardingScreen.js # Welcome tour
│   │   ├── ReadScreen.js     # Quran reading + Tilawat
│   │   ├── ScheduleScreen.js # Reminder management
│   │   ├── SettingsScreen.js # App settings
│   │   ├── StatsScreen.js    # Weekly statistics
│   │   └── TafsirScreen.js   # Tafsir display
│   └── services/
│       ├── geminiService.js  # AI reflection questions
│       ├── notificationService.js # Scheduled reminders
│       └── storage.js        # AsyncStorage helpers
└── docs/
    ├── CHANGELOG.md
    ├── RELEASE_NOTES.md
    └── STORE_LISTING.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for local builds)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/QuranFocusApp.git
cd QuranFocusApp

# Install dependencies
npm install

# Start development server
npx expo start

# Run on Android device/emulator
npx expo run:android
```

### Building for Production

```bash
# Build APK (for testing)
eas build --platform android --profile preview

# Build AAB (for Play Store)
eas build --platform android --profile production
```

---

## 🔌 API Integration

### AlQuran Cloud API
- Base URL: `https://api.alquran.cloud/v1`
- Endpoints used:
  - `/ayah/{number}/editions/{editions}` - Get ayat with translation + audio
  - `/surah/{number}/editions/{editions}` - Get full surah
  - `/edition` - List available translations

### Audio Source
- **Sheikh Mishary Rashid Alafasy** (`ar.alafasy`)
- High-quality verse-by-verse recitation

---

## 🔒 Privacy

**QuranFocus respects your privacy completely:**

- ✅ No sign-up required
- ✅ No data collection
- ✅ No analytics or tracking
- ✅ All data stored locally on device
- ✅ No third-party SDKs for tracking

---

## 📄 Version History

| Version | Date | Highlights |
|---------|------|------------|
| 1.3.0 | Dec 2024 | Tilawat in Read Mode, continuous playback, scroll improvements |
| 1.2.0 | Dec 2024 | Onboarding, scheduled reminders, Focus bookmarking |
| 1.1.0 | Dec 2024 | Bookmark system, Read Quran, Stats |
| 1.0.0 | Dec 2024 | Initial release |

---

## 🤝 Contributing

This is a private project. For feedback and suggestions:
- 📧 Email: support@quranfocus.app
- 📱 Facebook: [QuranFocus Page](https://www.facebook.com/profile.php?id=61584998726486)

---

## 📜 License

Private - All Rights Reserved

---

## 🙏 Acknowledgements

- **AlQuran Cloud** for the Quran API
- **Sheikh Mishary Alafasy** for beautiful recitations
- **Ibn Kathir** for authentic tafsir
- The Ummah for inspiration 💛

---

**JazakAllahu Khairan** 🤲

*Made with ❤️ for Muslims worldwide*

