import type { CapacitorConfig } from '@capacitor/cli';

const serverUrl = process.env.CAPACITOR_SERVER_URL;

const config: CapacitorConfig = {
  appId: 'com.deliveryhelper.rider',
  appName: '骑手权益助手',
  webDir: process.env.BUILD_MODE === 'static' ? 'out' : 'native-shell',
  android: {
    path: 'android',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: false,
      backgroundColor: '#2563eb',
      androidSplashResourceName: 'splash',
      launchFadeOutDuration: 300,
    },
  },
  server: serverUrl
    ? {
        url: serverUrl,
        cleartext:
          serverUrl.startsWith('http://localhost') ||
          serverUrl.startsWith('http://127.0.0.1') ||
          serverUrl.startsWith('http://10.0.2.2') ||
          serverUrl.startsWith('http://192.168.'),
      }
    : undefined,
};

export default config;
