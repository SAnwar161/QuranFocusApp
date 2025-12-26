# Google Play Console - Step by Step Update Guide

Complete guide to update your QuranFocus app on Google Play Store.

---

## 📋 Before You Start

Make sure you have:
- [ ] Google Play Console account access
- [ ] New AAB file (we'll build this)
- [ ] 7 screenshots ready in `screenshots/` folder
- [ ] Updated `STORE_LISTING.md` content

---

## 🚀 PART 1: Build the AAB File

### Step 1: Stop the development server
Press `Ctrl+C` in the terminal running Expo

### Step 2: Build the AAB for Play Store
```bash
cd c:\Users\sadat\GAG\QuranFocusApp
eas build --platform android --profile production
```

### Step 3: Wait for build to complete
- Build takes 10-15 minutes
- You'll get a download link when done
- Download the `.aab` file

---

## 🏪 PART 2: Update Play Store Listing

### Step 1: Open Google Play Console
1. Go to: **https://play.google.com/console**
2. Sign in with your Google account
3. Click on **"QuranFocus"** app

### Step 2: Update Store Listing Content

**Navigate to:** `Store presence` → `Main store listing`

#### 2.1 App Name
- Field: **App name**
- Paste: `QuranFocus: Daily Quran Companion`

#### 2.2 Short Description
- Field: **Short description**
- Paste: `Daily Quran focus, tilawat, reminders, tafsir & stats. Your spiritual companion.`

#### 2.3 Full Description
- Field: **Full description**
- Copy EVERYTHING from `STORE_LISTING.md` under "Full Description" section
- Paste into the text box

### Step 3: Update Screenshots

**Scroll down to:** `Graphics` → `Phone screenshots`

1. Click **"Delete all"** to remove old screenshots
2. Click **"Upload"**
3. Navigate to `QuranFocusApp/screenshots/`
4. Select all 7 files in order:
   - `01_home_screen.jpg`
   - `02_focus_mode.jpg`
   - `03_read_tilawat.jpg`
   - `04_surah_list.jpg`
   - `05_reminders.jpg`
   - `06_stats.jpg`
   - `07_settings.jpg`

5. **Add captions** (click on each screenshot):

| Screenshot | Caption |
|------------|---------|
| 1 | Your Daily Quran Companion |
| 2 | Focus Mode - Arabic + Urdu + Audio |
| 3 | Read Al-Quran with Audio Tilawat |
| 4 | Browse All 114 Surahs |
| 5 | Set Up to 10 Daily Reminders |
| 6 | Track Your Spiritual Journey |
| 7 | Customize Your Experience |

### Step 4: Save Changes
Click **"Save"** at bottom right

---

## 📦 PART 3: Upload New Version (AAB)

### Step 1: Go to Release Section
**Navigate to:** `Release` → `Production`

### Step 2: Create New Release
1. Click **"Create new release"**
2. If prompted about signing, click **"Continue"**

### Step 3: Upload AAB
1. Click **"Upload"** in the "App bundles" section
2. Select the `.aab` file you downloaded from EAS
3. Wait for upload to complete (shows green checkmark)

### Step 4: Add Release Notes
In the **"Release notes"** section, paste:

```
🎧 NEW: Tilawat in Read Mode - Listen while reading Surahs
🔄 NEW: Continuous playback with auto-scroll
📱 Improved: All screens scroll on smaller devices
📊 Updated: Tilawat now counts in listened stats
⏹️ Added: Stop button for quick audio control
🎨 Enhanced: Playing ayat highlighted with golden border
```

### Step 5: Review Release
1. Click **"Review release"**
2. Check for any warnings or errors
3. Fix any issues if shown

### Step 6: Start Rollout
1. Click **"Start rollout to Production"**
2. Confirm by clicking **"Rollout"**

---

## ⏱️ PART 4: Wait for Review

- **Review time**: Usually 1-3 days (can be up to 7 days for new apps)
- **Status**: Shows "In review" then "Available on Google Play"
- **Email**: Google will email you when approved

---

## ✅ Checklist Summary

### Store Listing
- [ ] App name updated
- [ ] Short description updated
- [ ] Full description updated
- [ ] 7 screenshots uploaded
- [ ] Screenshot captions added
- [ ] Changes saved

### Release
- [ ] AAB file built
- [ ] AAB uploaded
- [ ] Release notes added
- [ ] Release reviewed
- [ ] Rollout started

---

## 🆘 Troubleshooting

### "App signing not configured"
→ Go to `Setup` → `App signing` → Follow the wizard

### "Screenshots rejected"
→ Make sure dimensions are correct (min 320px, max 3840px)
→ Remove any device frames if present

### "Version code already exists"
→ The app.json version needs to be higher than the previous release
→ Check `versionCode` in eas.json

### "Content rating missing"
→ Go to `Policy` → `App content` → Complete questionnaire

---

## 📞 Need Help?

- **Google Play Help**: https://support.google.com/googleplay/android-developer
- **Expo EAS Docs**: https://docs.expo.dev/build/introduction/

---

**Good luck with your release!** 🚀🤲

