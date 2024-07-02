# About

This is a brainstorming iOS and Android App. It's minimalistic, just the way I want it to be. 

I develop on Mac/iPhone so no comments on any other variation of computer/phone os.

# Local Development Notes

## Prettier / eslint

I am writing this as a note to myself when Prettier / eslint eventually stop working. 
All settings should be in `settings.json`. 
The installed VS Code extensions are 
- Enabled
  - Related - `ESLint`
  - Unrelated - `Black Formatter`, `Flake 8`
- Disabled
  - Related - `Prettier - Code formatter`, `Prettier ESLint` (It appears I don't need either of these plugins to lint with the NPM packages I've installed. )

# Local Development for iOS

[Tutorial](https://docs.expo.dev/develop/development-builds/create-a-build/)

1. `yarn run build:ios:localdev`


# Development Build for iOS

[Tutorial](https://docs.expo.dev/develop/development-builds/create-a-build/)

This still requires a connection to the macbook and local dev running in VS COde

1. `yarn run build:ios:register`
  1. Select Website
  2. Scan QR Code on phone and goto Settings -> General ->VPN & Device Management -> Register for Development
  3. Install
2. `yarn run build:ios:development`

# Distribution for Review

[Tutorial](https://docs.expo.dev/build/internal-distribution/)

- TestFlight share app with up to 100 internal testers
- Internal distribution - EAS feature that allows developers to share a URL to install app

Add new devices
1. `yarn run build:ios:register`
  1. Select Website
  2. Scan QR Code on phone and goto Settings -> General ->VPN & Device Management -> Register for Development
  3. Install

1. `yarn run build:ios:internal`

# SQLite

cd /Users/travisbumgarner/Library/Developer/CoreSimulator/Devices
find . -name brainstorm.db
open [pathname]
Should open in SQLite Browser