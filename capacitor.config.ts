import type { CapacitorConfig } from '@capacitor/cli';

const serverUrl = process.env.CAPACITOR_SERVER_URL;

const config: CapacitorConfig = {
  appId: 'com.deliveryhelper.rider',
  appName: '骑手权益助手',
  webDir: 'native-shell',
  android: {
    path: 'android',
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
