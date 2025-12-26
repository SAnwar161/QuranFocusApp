# Google Play Console Upload Guide - Step by Step

## Prerequisites
✅ You have downloaded the new `.aab` file (version code 3)
✅ You have access to Google Play Console

---

## Step 1: Log into Google Play Console

1. Go to [https://play.google.com/console](https://play.google.com/console)
2. Sign in with your developer account
3. Click on **QuranFocus** (or your app name) from the list

---

## Step 2: Navigate to Closed Testing

1. In the left sidebar, click **Testing**
2. Click **Closed testing**
3. You should see your existing test track (e.g., "Alpha" or "Beta")

---

## Step 3: Create a New Release

1. Click **Create new release** (or **Manage track** → **Create new release**)
2. You'll see a page titled "Create closed testing release"

---

## Step 4: Upload the App Bundle

1. Under "App bundles", click **Upload**
2. Select your downloaded `.aab` file from your computer
3. Wait for the upload to complete (you'll see a green checkmark)
4. The system will show:
   - Version code: **3**
   - Version name: **1.0.0**

---

## Step 5: Add Release Notes

In the "Release notes" section:

1. Select **English (United States)** from the language dropdown
2. In the text box, paste:

```
Fixed app icon display issue. The icon now shows correctly on all Android home screens with proper black background.
```

3. If you have other languages configured, add similar notes for each

---

## Step 6: Review and Save

1. Scroll down to review:
   - App bundle uploaded ✓
   - Release notes added ✓
2. Click **Save** (bottom right)
3. Click **Review release**

---

## Step 7: Start Rollout

1. Review the release summary page
2. If everything looks correct, click **Start rollout to Closed testing**
3. Confirm by clicking **Rollout** in the popup

---

## Step 8: Notify Your Testers

### Option A: Through Google Play Console
1. After rollout, you'll see an option to "Send email to testers"
2. Click it to notify them automatically

### Option B: Manual Notification
Send a message to your testing group:

```
Hi testers,

A new update (v1.0.0 - build 3) is now available that fixes the blank app icon issue.

Please update the app from the Play Store and verify that the icon now displays correctly on your home screen.

Thank you for your feedback!
```

---

## Step 9: Monitor the Rollout

1. Go to **Testing → Closed testing**
2. You'll see the status change from "Preparing release" → "Available to testers"
3. This usually takes **15-30 minutes**

---

## Step 10: Verify with Testers

Ask your testers to:
1. Open Google Play Store
2. Search for "QuranFocus" or check "My apps"
3. Click **Update**
4. After installation, check if the icon displays correctly on the home screen

---

## Troubleshooting

**Q: Upload fails with "Version code already exists"**
- Make sure you're uploading the NEW build (version code 3), not the old one

**Q: Can't find "Create new release" button**
- Make sure you're in **Closed testing**, not Production
- Check that you have the correct permissions

**Q: Testers don't see the update**
- Wait 30 minutes after rollout
- Ask them to manually check for updates in Play Store
- Verify they're on the tester list

---

## Expected Timeline

- Upload: **2-5 minutes**
- Processing: **5-10 minutes**
- Available to testers: **15-30 minutes total**

Your testers should be able to update within **30 minutes** of starting the rollout.
