import 'dotenv/config'

const config = () => ({
  expo: {
    icon: './assets/images/icon.png',
    name: process.env.EXPO_APP_NAME || 'Film Tracker',
    slug: 'film-tracker',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'filmtracker',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#3A4D53',
    },
    ios: {
      bundleIdentifier:
        process.env.EXPO_BUNDLE_IDENTIFIER ||
        'com.sillysideprojects.filmtracker.prod',
      supportsTablet: true,
      entitlements: {},
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSCameraUsageDescription:
          'This app uses the camera to take photos of your film rolls.',
        NSPhotoLibraryUsageDescription:
          'This app accesses your photo library to attach photos to film rolls.',
      },
    },
    android: {
      package:
        process.env.EXPO_BUNDLE_IDENTIFIER ||
        'com.sillysideprojects.filmtracker.prod',
      permissions: [
        'android.permission.CAMERA',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
      ],
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: ['expo-router', 'expo-font', 'expo-sqlite', 'expo-image-picker'],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: '',
      },
    },
  },
})

export default config()
