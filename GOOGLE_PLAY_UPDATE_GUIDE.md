# QuranFocusApp v1.4.0 - Google Play Store Update Guide

## 📅 Timeline
- **EAS Build Quota Resets**: January 1st, 2026
- **Build the App**: January 1st, 2026
- **Upload to Play Store**: Same day
- **Google Review**: 2-3 days

---

## 🚀 STEP-BY-STEP GUIDE

### Step 1: Update Version Number

Before building, update the version in `app.json`:

```json
{
  "expo": {
    "version": "1.4.0",
    ...
  }
}
```

> ✅ versionCode auto-increments via EAS

---

### Step 2: Push to GitHub (Triggers Build)

```bash
cd c:/Users/sadat/GAG/QuranFocusApp
git add .
git commit -m "v1.4.0: Multiple Reciters + In-App Tafsir"
git push origin main
```

> The build starts automatically! Monitor at:
> https://github.com/SAnwar161/QuranFocusApp/actions

---

### Step 3: Download AAB File (~15 min wait)

1. Go to: https://github.com/SAnwar161/QuranFocusApp/actions
2. Click the completed workflow run
3. Scroll to **Artifacts** section
4. Click **"android-aab"** to download
5. Extract the `.aab` file from the zip

---

### Step 4: Upload to Google Play Console

1. Go to: https://play.google.com/console
2. Select **QuranFocusApp**
3. Click **Production** (left sidebar)
4. Click **Create new release** (blue button)
5. Upload the `.aab` file
6. Wait for it to process

---

### Step 5: Fill Release Information

**Release Name**: `1.4.0`

**What's new (Copy this):**
```
🎙️ Multiple Reciters - Choose from 5 Qaris!
📖 In-App Tafsir - 7 editions in Urdu, English & Arabic
📚 Dr. Israr Ahmed Bayan ul Quran now available!
⚙️ New Settings for reciter and tafsir selection
```

---

### Step 6: Review & Rollout

1. Click **Save** (bottom right)
2. Click **Review release**
3. Check for any warnings
4. Click **Start rollout to Production**
5. Confirm the rollout

---

## ✅ CHECKLIST BEFORE SUBMITTING

- [ ] Version updated to 1.4.0 in app.json
- [ ] All changes committed and pushed
- [ ] AAB downloaded from GitHub Actions
- [ ] AAB uploaded to Play Console
- [ ] Release notes filled in
- [ ] No errors/warnings in Play Console

---

## 🆕 What's New in v1.4.0 (For Your Reference)

### Multiple Reciters
- Mishary Al-Afasy (default)
- Abdul Rahman Al-Sudais
- Mahmoud Khalil Al-Husary
- Mohamed Siddiq Al-Minshawi
- Ahmed Al-Ajmy

### In-App Tafsir (7 Editions)
**Urdu**: Dr. Israr Ahmed, Ibn Kathir
**English**: Maarif ul Quran, Ibn Kathir, Al-Jalalayn
**Arabic**: Ibn Kathir, Al-Qurtubi

---

## 🆘 Troubleshooting

**Build Failed?**
- Check GitHub Actions logs for errors
- Ensure secrets are still valid (QF_Actions, GF_QURANFOCUS, HF_QuranFOCUS)

**AAB Upload Failed?**
- Ensure versionCode is higher than current production
- Check file isn't corrupted

**Review Rejected?**
- Read the rejection email carefully
- Usually minor issues can be fixed quickly

---

**Good luck with your release! 🎉**
