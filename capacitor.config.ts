import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.texin.textilenetwork',
  appName: 'Texin',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
