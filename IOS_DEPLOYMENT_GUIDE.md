# iOS App Store Deployment Guide - QuranFocus

Complete step-by-step guide to publish QuranFocus on the Apple App Store.

---

## 📋 Prerequisites Checklist

Before you start, you need:

| Requirement | Status | Notes |
|-------------|--------|-------|
| Apple Developer Account | ❓ | $99/year - Required for App Store |
| Apple ID | ❓ | Used to create Developer Account |
| Mac Computer | ❓ | OR use EAS Build (cloud) |
| App Icon (1024x1024) | ✅ | Already have in assets |
| Screenshots (iPhone) | ❓ | Need iPhone-sized screenshots |

---

## 💰 STEP 1: Apple Developer Account

### 1.1 Create Account
1. Go to: **https://developer.apple.com/programs/**
2. Click **"Enroll"**
3. Sign in with your Apple ID (or create one)
4. Choose: **Individual** or **Organization**
   - Individual: Personal apps ($99/year)
   - Organization: Company apps ($99/year + D-U-N-S number)
5. Pay the **$99 annual fee**
6. Wait for approval (usually 24-48 hours)

### 1.2 After Approval
- You'll have access to **App Store Connect**
- You can create certificates and provisioning profiles
- EAS Build can handle this automatically!

---

## ⚙️ STEP 2: Configure app.json for iOS

Your current `app.json` needs iOS-specific settings:

```json
{
  "expo": {
    "name": "QuranFocus",
    "slug": "QuranFocusApp",
    "version": "1.3.0",
    "ios": {
      "bundleIdentifier": "com.yourname.quranfocus",
      "buildNumber": "1",
      "supportsTablet": true,
      "infoPlist": {
        "NSMicrophoneUsageDescription": "This app does not use the microphone.",
        "UIBackgroundModes": ["audio"]
      }
    }
  }
}
```

### Key iOS Settings:
- **bundleIdentifier**: Unique ID (like Android package name)
- **buildNumber**: Increment for each App Store upload
- **supportsTablet**: true = universal app
- **UIBackgroundModes**: ["audio"] for background audio playback

---

## 🔐 STEP 3: Configure EAS for iOS

### 3.1 Update eas.json

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "distribution": "store"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "YOUR_APPLE_ID@email.com",
        "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID"
      }
    }
  }
}
```

### 3.2 Link Apple Developer Account to EAS
```bash
eas credentials
```
- Select **iOS**
- Choose **Production**
- Follow prompts to log in with Apple ID
- EAS will create certificates automatically

---

## 🏗️ STEP 4: Build for iOS

### 4.1 Build IPA for App Store
```bash
eas build --platform ios --profile production
```

### 4.2 What Happens:
1. EAS compiles your app in the cloud
2. Creates signing certificates automatically
3. Generates an `.ipa` file
4. Provides download link when done

### 4.3 Build Time:
- Queue: ~10-20 mins (free tier)
- Build: ~15-20 mins
- Total: ~30-40 mins

---

## 📱 STEP 5: Create App in App Store Connect

### 5.1 Open App Store Connect
1. Go to: **https://appstoreconnect.apple.com**
2. Sign in with Apple ID
3. Click **"My Apps"**
4. Click **"+"** → **"New App"**

### 5.2 Fill App Information

| Field | Value |
|-------|-------|
| Platform | iOS |
| Name | QuranFocus: Daily Quran Companion |
| Primary Language | English |
| Bundle ID | com.yourname.quranfocus |
| SKU | quranfocus001 |
| User Access | Full Access |

Click **"Create"**

---

## 📝 STEP 6: App Store Listing

### 6.1 App Information
**Navigate to:** Your App → **App Information**

- **Subtitle**: Your spiritual companion for daily Quran reflection
- **Category**: Reference (Primary), Education (Secondary)
- **Content Rights**: Does NOT contain third-party content OR has rights

### 6.2 Pricing and Availability
- **Price**: Free
- **Availability**: All territories (or select specific countries)

### 6.3 App Privacy
**Navigate to:** **App Privacy**

Answer the privacy questions:
- **Data Collection**: No data collected
- **Data Types**: None
- **Tracking**: App does not track users

### 6.4 Version Information
**Navigate to:** Your App → **iOS App** → **Version 1.3.0**

#### Screenshots (Required)
Upload for each device size:
- **6.7" Display** (iPhone 14 Pro Max): 1290 x 2796 px
- **6.5" Display** (iPhone 11 Pro Max): 1242 x 2688 px
- **5.5" Display** (iPhone 8 Plus): 1242 x 2208 px
- **iPad Pro 12.9"**: 2048 x 2732 px (if supporting iPad)

#### Description
Copy from `STORE_LISTING.md` - Full Description section

#### Keywords
```
Quran,Focus,Islamic,Tilawat,Tafsir,Muslim,Reminder,Arabic,Prayer,Recitation
```

#### Support URL
Your website or Facebook page URL

#### Marketing URL (Optional)
Your app's landing page

---

## 📤 STEP 7: Upload Build

### Option A: Use EAS Submit (Recommended)
```bash
eas submit --platform ios --latest
```
This automatically uploads the latest build to App Store Connect.

### Option B: Manual Upload
1. Download the `.ipa` from EAS dashboard
2. Use **Transporter** app on Mac to upload
3. Or use **Application Loader** (older Macs)

---

## ✅ STEP 8: Submit for Review

### 8.1 Complete All Sections
Make sure all required fields have green checkmarks:
- [ ] App Information
- [ ] Pricing and Availability  
- [ ] App Privacy
- [ ] Version Information
- [ ] Screenshots
- [ ] Build uploaded

### 8.2 Add Review Notes
In the **App Review Information** section:
```
QuranFocus is a Quran reading and reflection app.

To test:
1. Open the app
2. Tap "Start Focus Mode" to see random Quran verses
3. Tap "Read Al-Quran" to browse Surahs
4. Use the play button to hear recitation

No login required. All data stored locally.
```

### 8.3 Submit
1. Click **"Add for Review"**
2. Answer export compliance questions:
   - Uses standard encryption: **Yes**
3. Click **"Submit to App Review"**

---

## ⏱️ STEP 9: Wait for Review

### Review Timeline:
- **Average**: 24-48 hours
- **Can take**: Up to 7 days (especially first submission)

### Possible Outcomes:
- ✅ **Approved** - Goes live on App Store
- ⚠️ **Rejected** - Fix issues and resubmit
- 📝 **Metadata Rejected** - Fix listing info only

### Common Rejection Reasons:
1. Missing privacy policy
2. Incomplete app functionality
3. Bugs or crashes
4. Misleading screenshots

---

## 📊 iOS vs Android Comparison

| Aspect | Android | iOS |
|--------|---------|-----|
| Developer Fee | $25 (one-time) | $99/year |
| Review Time | 1-3 days | 1-2 days |
| Build Tool | EAS Build | EAS Build |
| File Format | .aab | .ipa |
| Store | Play Console | App Store Connect |

---

## 🚀 Quick Start Commands

```bash
# 1. Configure credentials
eas credentials

# 2. Build for iOS
eas build --platform ios --profile production

# 3. Submit to App Store
eas submit --platform ios --latest
```

---

## 🆘 Troubleshooting

### "No bundle identifier"
→ Add `bundleIdentifier` in app.json under `ios`

### "Signing failed"
→ Run `eas credentials` and log in again

### "Build failed"
→ Check EAS dashboard for detailed error logs

### "App rejected for privacy"
→ Add privacy policy URL in App Store Connect

---

## ✅ Final Checklist

- [ ] Apple Developer Account ($99/year)
- [ ] app.json configured with iOS settings
- [ ] EAS credentials linked
- [ ] Build completed successfully
- [ ] App created in App Store Connect
- [ ] Screenshots uploaded
- [ ] Description and keywords added
- [ ] Privacy policy URL added
- [ ] Build uploaded to App Store Connect
- [ ] Submitted for review

---

**JazakAllahu Khairan!** 🤲

Ready to bring QuranFocus to iPhone users worldwide! 📱

