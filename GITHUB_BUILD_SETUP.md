# GitHub Actions Build Setup Guide

This guide explains how to set up automated builds for QuranFocusApp using GitHub Actions.

## Prerequisites

1. **Expo Account**: Make sure you have an Expo account
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **EAS CLI**: Ensure you're logged into EAS CLI locally

## Setup Steps

### 1. Get Your Expo Token

Run this command locally to get your Expo token:

```bash
npx expo login
npx eas whoami
npx eas token create
```

Copy the token that's generated. You'll need it for the next step.

### 2. Add GitHub Secrets

Go to your GitHub repository and add the following secret:

1. Navigate to: `Settings` → `Secrets and variables` → `Actions`
2. Click `New repository secret`
3. Add:
   - **Name**: `EXPO_TOKEN`
   - **Value**: [Paste the token from step 1]

### 3. Push Your Code

Commit and push your code to trigger the build:

```bash
git add .
git commit -m "Add GitHub Actions workflow for Android build"
git push origin main
```

### 4. Monitor the Build

1. Go to your repository on GitHub
2. Click the `Actions` tab
3. You'll see your build in progress
4. Wait for it to complete (usually takes 10-15 minutes)

### 5. Download the AAB

Once the build completes:

1. Click on the completed workflow run
2. Scroll down to `Artifacts`
3. Download the `android-aab` file
4. Extract the AAB file and upload it to Google Play Console

## Manual Build Trigger

You can also trigger builds manually:

1. Go to `Actions` tab on GitHub
2. Click `Build Android AAB` workflow
3. Click `Run workflow`
4. Select the branch (usually `main`)
5. Click the green `Run workflow` button

## Build Profiles

The workflow uses the `production` profile from `eas.json`, which:
- Auto-increments the version code
- Creates a production-ready AAB
- Signs the app with your Expo credentials

## Troubleshooting

### Build Fails with "Invalid credentials"
- Make sure your `EXPO_TOKEN` secret is set correctly
- Try regenerating the token: `npx eas token create`

### Build Fails with "Package not found"
- Ensure `package.json` has all dependencies listed
- Try running `npm install` locally first

### Build Takes Too Long
- Builds typically take 10-15 minutes
- Check the Actions logs for any stuck processes

### AAB Not Found in Artifacts
- The build might have failed - check the logs
- EAS Build stores the AAB remotely - you can also find it at: https://expo.dev/accounts/sadat161/projects/QuranFocusApp/builds

## Next Steps

After downloading your AAB:
1. Upload to Google Play Console
2. Create a new release or update existing one
3. Submit for review

## Notes

- The workflow is triggered on every push to `main` branch
- You can also trigger it manually anytime
- Built AABs are stored for 30 days in GitHub artifacts
- Your EAS dashboard also keeps a record of all builds
