import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sigsa.app',
  appName: 'Sigsa',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: 'sigsa_logo',
      iconColor: '#9c59e8',
      sound: 'alert.wav',
    },
  },
};

export default config;
