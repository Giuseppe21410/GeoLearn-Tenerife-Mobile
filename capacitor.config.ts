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
      launchFadeOutDuration: 300
    },
    StatusBar: {
      overlaysWebView: true,
      style: "LIGHT"
    }
  },
  ios: {
    scrollEnabled: false,
    contentInset: 'never'
  }
};

export default config;