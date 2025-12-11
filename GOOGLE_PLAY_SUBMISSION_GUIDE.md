# Google Play Store Submission Guide

Getting your app approved by Google involves several steps. Since November 2023, Google has stricter requirements for **Personal Developer Accounts**, specifically regarding testing.

## Phase 1: Preparation (Do this immediately)

### 1. Google Play Developer Account
*   **Sign up**: Go to [Google Play Console](https://play.google.com/console).
*   **Cost**: One-time fee of **$25 USD**.
*   **Verification**: You will need to verify your identity (ID card/Passport).

### 2. Privacy Policy
*   **Requirement**: Mandatory for all apps.
*   **Action**: Since your app doesn't collect user data (stats are stored locally on the phone), your policy is simple.
*   **Tool**: Use a free generator like [Privacypolicies.com](https://www.privacypolicies.com/) or write a simple page hosted on Google Sites/GitHub Pages stating: *"QuranFocus does not collect, store, or share any personal user data. All usage statistics are stored locally on the device."*

### 3. Graphics & Assets
You need these exact sizes. Use Canva or Photoshop:
*   **App Icon**: 512 x 512 px (PNG, 32-bit).
*   **Feature Graphic**: 1024 x 500 px (This appears at the top of your store listing).
*   **Phone Screenshots**: At least 2 screens (Aspect ratio 9:16, e.g., 1080x1920). *Use the screenshots you took from the app.*
*   *(Optional)* 7-inch and 10-inch tablet screenshots (if you want to support tablets).

---

## Phase 2: Building the App Bundle

You need an `.aab` (Android App Bundle) file, not an `.apk`.

1.  **Configure `eas.json`**: Ensure you have a build profile for production.
2.  **Run Build Command**:
    ```powershell
    eas build --platform android
    ```
3.  **Wait**: Expo will build your app in the cloud.
4.  **Download**: When finished, download the `.aab` file to your computer.

---

## Phase 3: The "Closed Testing" Hurdle (Crucial for Personal Accounts)

**If you created your Google Play account after Nov 2023, you CANNOT release to production immediately.**

### The "20 Testers" Rule
1.  **Requirement**: You must run a **Closed Test** with at least **20 testers** for **14 consecutive days**.
2.  **Who are testers?**: Friends, family, colleagues. You need their Gmail addresses.
3.  **Process**:
    *   Create a "Closed Testing" track in Google Play Console.
    *   Upload your `.aab` file there.
    *   Add 20+ email addresses to the tester list.
    *   Send them the web link to join the test.
    *   **They must opt-in and keep the app installed for 14 days.**
4.  **After 14 Days**: You can apply for "Production Access".

---

## Phase 4: Store Listing & Content Setup

While testing is running, fill out these sections in the Console:

1.  **Main Store Listing**:
    *   **App Name**: QuranFocus: Remembrance & Peace
    *   **Short Description**: Minimalist Quran companion for focus, reflection, and daily stats. (Max 80 chars)
    *   **Full Description**: Detail features (Search, Tafsir, Audio, Stats). Mention it uses data from AlQuran Cloud.
2.  **Content Rating**: Fill out a questionnaire (Frequency of violence, language, etc.). For a Quran app, it's generally "Everyone" or "Teen" depending on region, but usually "Rated for 3+".
3.  **Target Audience**: Select "13+" or "16+". Avoid "Children under 13" to avoid strict family policies unless you specifically target kids.
4.  **Data Safety**:
    *   Question: "Does your app collect or share any of the required user data types?"
    *   Answer: **No**. (Since you use `AsyncStorage` locally and no analytics servers).
5.  **News Apps**: Declare "No, this is not a news app".
6.  **COVID-19**: Declare "My app is not a publicly available COVID-19 contact tracing or status app".

---

## Phase 5: Production Release

Once your 14-day test is done and Google approves your Production Access:

1.  Go to **Production** track.
2.  "Promote release from Closed Testing" -> "To Production".
3.  Add release notes (e.g., "Initial Release v1.0.0").
4.  **Submit for Review**.

**Review Time**:
*   First submission: Can take **3-7 days**.
*    Updates: Usually **24-48 hours**.

---

## Summary Checklist
[] Register Google Play Console Account ($25).
[] Generate Privacy Policy URL.
[] Design Icon (512x512) and Feature Graphic (1024x500).
[] Take 4-5 Screenshots.
[] Run `eas build --platform android`.
[] Start "Closed Testing" with 20 friends.
[] Wait 14 days.
[] Apply for Production.
