import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sigsa.app',
  appName: 'Sigsa',
  webDir: 'www',
  bundledWebRuntime: false,
  // server: {
  //   url: 'http://10.0.2.2:8100',
  //   cleartext: true,
  // },
  plugins: {
    LocalNotifications: {
      smallIcon: 'sigsa_logo',
      iconColor: '#9c59e8',
      sound: 'alert.wav',
    },
  },
};

export default config;
