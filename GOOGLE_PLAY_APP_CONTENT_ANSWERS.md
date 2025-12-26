# Google Play Console: App Content Guide

Here are the correct answers for your "App Content" section based on the **QuranFocus** app features.

### 1. App Access
**Question**: Does your app have parts that are restricted (e.g., login, subscriptions, location-based access)?
**Your Answer**: **All functionality is available without special access.**
*   *Reason*: Your app does not require a login, password, or subscription. Anyone who downloads `v1` can see everything immediately.

### 2. Ads
**Question**: Does your app contain ads?
**Your Answer**: **No, my app does not contain ads.**
*   *Reason*: You have not integrated AdMob or any ad network. It is a clean, ad-free app.

### 3. Content Rating
You will fill out a questionnaire. Here are the likely answers:
*   **Category**: "Reference, News, or Educational" (since it's a Quran app).
*   **Violence**: No.
*   **Sexuality**: No.
*   **Language**: No (or "Rarely" if some Tafsir mentions historical context, but generally "No" is safe for Quran).
*   **Controlled Substances**: No.
*   **Result**: You should get a rating of **"Rated for 3+"** (or "Everyone").

### 4. Target Audience
**Question**: Which age groups does your app target?
**Recommendation**: Select **13-15**, **16-17**, and **18+**.
*   **Crucial Step**: **DO NOT** select "5-year-olds" or anything under 13. If you target children, Google imposes extremely strict family policies that are hard to pass.
*   **Appeal to Children**: "Could your store listing unintentionally appeal to children?" -> **No**. (Your minimalist black/gold design is mature and not "cartoonish").

### 5. Data Safety (Important)
This generates the "Data Safety" badge on the store.
*   **Does your app collect or share any of the required user data types?** -> **No**.
    *   *Reason*: You store stats **locally** (`AsyncStorage`). You do NOT send data to a server (like Firebase, Mixpanel, etc.). You simply fetch data (Quran text) from an API, but you don't *send* user data out.
*   Since you answered "No", the rest of the form is skipped.

### 6. Government Apps
**Question**: Is your app developed by or on behalf of a government?
**Your Answer**: **No**.

### 7. Financial Features
**Question**: Does your app provide financial features (banking, loans, crypto)?
**Your Answer**: **No**.
*   Scroll to the bottom and click "Next/Save". You don't have any payments or wallets.

### 8. Health Apps
**Question**: Is your app a health app (medical, fitness tracker, COVID)?
**Your Answer**: **No**.
*   Even though it helps with "mental peace", it is not a *medical* app. It falls under "Lifestyle" or "Books & Reference".
