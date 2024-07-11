import 'dotenv/config'

const config = () => ({
  expo: {
    name: process.env.APP_NAME || 'Film',
    slug: 'film-tracker-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#ffffff',
    },
    ios: {
      bundleIdentifier: process.env.EXPO_BUNDLE_IDENTIFIER || 'com.sillysideprojects.film.prod',
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: ['expo-router', 'expo-font'],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: '5a7a8c6a-cd24-4ec0-8504-37c853285037',
      },
    },
  },
})

export default config()
