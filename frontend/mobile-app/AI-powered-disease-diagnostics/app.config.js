module.exports = {
  expo: {
    name: 'AI-powered-disease-diagnostics',
    slug: 'AI-powered-disease-diagnostics',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/heart-logo.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/heart-logo.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.dauda933.AIpowereddiseasediagnostics'
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/heart-logo.png'
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/heart-logo.png',
          imageWidth: 400,
          resizeMode: 'contain',
          backgroundColor: '#000'
        }
      ],
      [
        '@rnmapbox/maps',
        {
          accessToken: process.env.EXPO_PUBLIC_MAPBOX_TOKEN
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: 'dcc56620-45a9-477d-b038-bf09de08c96f'
      }
    },
    updates: {
      enabled: true,
      fallbackToCacheTimeout: 0,
      url: 'https://u.expo.dev/dcc56620-45a9-477d-b038-bf09de08c96f'
    },
    runtimeVersion: {
      policy: 'appVersion'
    }
  }
};
