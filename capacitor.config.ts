import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kheemwel.mathchain',
  appName: 'Math Chain',
  webDir: 'build',
  backgroundColor: '#14161f',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: 'DARK',
      backgroundColor: '#14161f'
    }
  }
};

export default config;
