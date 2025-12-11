# App Updates & Maintenance Guide

Congratulations on reaching the deployment phase! Here is how you handle updates in the future.

## 1. Types of Updates
There are two ways to update your app:

### A. Store Update (Native Update)
**Use when:** You change `app.json`, add new libraries (native modules), allow new permissions, or make major changes.
1.  **Update Version**: Open `app.json`.
    *   Increment `version`: e.g., `"1.0.0"` -> `"1.0.1"`.
    *   Increment `android.versionCode`: e.g., `1` -> `2`.
2.  **Build**: Run `eas build --platform android`.
3.  **Upload**: Upload the new `.aab` file to Google Play Console.
4.  **User Experience**: 
    *   Google Play typically **auto-updates** apps over Wi-Fi.
    *   Users will see an "Update" button in the Play Store if they haven't auto-updated.

### B. Over-The-Air (OTA) Update (Expo Updates)
**Use when:** You strictly changed **JavaScript/UI code only** (e.g., fixed a typo, changed a color, fixed a logic bug in React).
1.  **Command**: Run `eas update --branch production`.
2.  **User Experience**: 
    *   Users download the new code automatically in the background when they open the app.
    *   The *next* time they open the app, they see the new version.
    *   **Benefit**: No waiting for Google Play review!

---

## 2. How to Inform Users of Updates

### Method 1: The "Passive" Way (Standard)
Most apps rely on the App Store / Play Store settings.
*   **Google Play**: Sends a notification "X apps were updated" if auto-update is on.
*   **What you do**: Nothing. Just upload to the store.

### Method 2: In-App "Update Available" Check
Since you are using Expo, `eas update` is very powerful. You can add code to your app to check for updates on startup.

**Code Snippet (Future Implementation):**
```javascript
import * as Updates from 'expo-updates';

async function onFetchUpdateAsync() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync(); // Restarts app with new version
    }
  } catch (error) {
    // Handle error
  }
}
```

### Method 3: Social Media (Your Facebook Page)
Since you have linked your Facebook page in the app, this is your direct line to users.
*   **Post**: "Salam everyone! QuranFocus v1.1 is out with a new Tafsir feature. Please update your app!"
*   **Benefit**: It engages your community and reminds them the app is active.

---

## 3. Checklist for Next Update
[] Change `version` in `app.json`
[] Change `versionCode` in `app.json`
[] Run `eas build --platform android`
[] Download `.aab`
[] Upload to Google Play Console -> Production -> Create New Release
