# Local Development Notes

## .env

The env is just for EXPO to load in env variables currently.

## Prettier / eslint

I am writing this as a note to myself when Prettier / eslint eventually stop working. 
All settings should be in `settings.json`. 
The installed VS Code extensions are 
- Enabled
  - Related - `ESLint`
  - Unrelated - `Black Formatter`, `Flake 8`
- Disabled
  - Related - `Prettier - Code formatter`, `Prettier ESLint` (It appears I don't need either of these plugins to lint with the NPM packages I've installed. )

# Development Build for iOS

[Tutorial](https://docs.expo.dev/develop/development-builds/create-a-build/)

This still requires a connection to the macbook and local dev running in VS COde

1. `yarn run register:ios
  1. Select Website
  2. Scan QR Code on phone and goto Settings -> General ->VPN & Device Management -> Register for Development
  3. Install
2. `yarn run build:ios:local:development`

# Distribution for Internal Use

[Tutorial](https://docs.expo.dev/build/internal-distribution/)

- TestFlight share app with up to 100 internal testers
- Internal distribution - EAS feature that allows developers to share a URL to install app

Add new devices
1. `yarn run register:ios`
  1. Select Website
  2. Scan QR Code on phone and goto Settings -> General ->VPN & Device Management -> Register for Development
  3. Install

Build on Server
1. `yarn run build:ios:cloud:internal`

Build Locally
1. `yarn run build:ios:local:internal`
2. Open XCode -> Window -> Devices & Simulators -> Select phone -> Drag IPA onto phone. 

# Deploy to iOS Store

https://docs.expo.dev/submit/ios/

1. `yarn build:ios:cloud:production`
2. 

# SQLite

cd /Users/travisbumgarner/Library/Developer/CoreSimulator/Devices
find . -name database.db
open [pathname]
Should open in SQLite Browser

# Backups & Restores of Data

/Users/travisbumgarner/Library/Developer/CoreSimulator/Devices/DFE1B4C3-9F2D-4065-A6BE-1AB1C05CAA8B/data/Containers/Shared/AppGroup/DB6DA1EA-49D5-49AE-BB6C-73CA7FC86BB6/File Provider Storage

Where the first ID is the device and the second ID is the app. 