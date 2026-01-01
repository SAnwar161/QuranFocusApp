# QuranFocusApp v1.4.0 - Google Play Store Update Guide

## 📅 Timeline
- **Build Date**: January 1st, 2026 (EAS Quota Resets)
- **Status**: Ready for Build ✅

---

## 🚀 STEP-BY-STEP GUIDE (EAS Method)

### Step 1: Update Version Number
Before building, ensure `app.json` is at **1.4.0**:

```json
{
  "expo": {
    "version": "1.4.0",
    ...
  }
}
```

### Step 2: Build with EAS
Run this command in your terminal:

```bash
cd c:/Users/sadat/GAG/QuranFocusApp
eas build --platform android --profile production
```

> ⏳ **Wait time**: ~10-20 minutes
> You can monitor progress in the terminal or on expo.dev

### Step 3: Download AAB File
1. Go to: https://expo.dev/accounts/sadat161/projects/quranfocus/builds
2. Click the completed build
3. Click **Download** to get the `.aab` file

### Step 4: Upload to Google Play Console
1. Go to: https://play.google.com/console
2. Select **QuranFocus**
3. Click **Production** (left sidebar)
4. Click **Create new release** (blue button)
5. Upload your new `.aab` file

### Step 5: Update Store Listing
Copy the content from `STORE_LISTING.md` to the Play Console:
- **Available Reciters**: Mention the 5 new Qaris
- **Tafsir**: Mention 7 editions
- **New Features**: Islamic Date, Stats Enhancements

### Step 6: Release Notes
Paste this into the "Release Notes" section:

```
🚀 v1.4.0 Major Update:
🌍 19+ Languages: Added Bengali, Hindi, Malay, Japanese & more!
🎙️ Multiple Reciters: Choose from 5 Qaris (Sudais, Husary, etc.)
📖 In-App Tafsir: 7 editions (Urdu, English, Arabic)
🌙 Islamic Date: Hijri calendar on home screen
stats Enhanced Stats: Streak, Weekly Progress, Most Read Surah
🇵🇰 Country Flag display
```

---

## ✅ CHECKLIST BEFORE SUBMITTING

- [ ] Version is 1.4.0 in app.json
- [ ] EAS Secrets set (Groq, HF keys)
- [ ] Build successful (AES)
- [ ] AAB uploaded to Play Console
- [ ] Store Listing updated (Description & Screenshots)
- [ ] Release Notes added

---

## 🆘 Troubleshooting

**Build Failed?**
- Run `npx expo start --clear` locally to check for errors
- Ensure EAS secrets are set: `eas secret:list`

**Upload Failed?**
- Check if Version Code matches (EAS manages this automatically usually)
- Ensure you signed the AAB with the correct keystore (EAS handles this)

**Good luck with the release! 🎉**
