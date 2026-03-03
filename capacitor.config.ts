import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.geolearn.tenerife',
  appName: 'GeoLearn Tenerife',
  webDir: 'dist',
  backgroundColor: '#000000',
  plugins: {
    SplashScreen: {
      launchShowDuration: 10000,
      launchAutoHide: false,
      backgroundColor: "#000000",
      showSpinner: false,
      fadeDuration: 300,
    },
  },
};

export default config;