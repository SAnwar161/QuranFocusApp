# Google Play Store Deployment Guide for Quran Focus

This guide outlines the steps to build your Expo app and publish it to the Google Play Store.

## 1. Configure Project (`app.json`)
Before building, ensure your `app.json` has the correct unique identifiers.

- **package**: This must be unique globally (e.g., `com.yourcompany.quranfocus`).
- **version**: Your visible app version (e.g., "1.0.0").
- **versionCode**: An integer that must increase with every update (e.g., 1, 2, 3).

## 2. Install EAS CLI
Expo Application Services (EAS) is the standard tool for building binary apps.

```powershell
npm install -g eas-cli
eas login
```

## 3. Configure Build Profile
Run the configuration command:
```powershell
eas build:configure
```

## 4. Create the Production Build (AAB)
Google Play requires an **Android App Bundle (.aab)**.
```powershell
eas build --platform android --profile production
```
- EAS will ask to generate a **Keystore**. Say **YES**.

## 5. Google Play Console Setup
1.  Go to [Google Play Console](https://play.google.com/console) ($25 fee).
2.  **Create App**:
    - App Name: "Quran Focus".
    - Privacy Policy URL.
3.  **Upload Build**:
    - Go to **Testing > Internal testing**.
    - Upload the `.aab` file from EAS.

## 6. Store Listing
- **App Icon**: 512x512 PNG.
- **Feature Graphic**: 1024x500 PNG.
- **Screenshots**: Use the mockups provided.
