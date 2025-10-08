
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chravel.app',
  appName: 'chravel',
  webDir: 'dist',
  server: {
    url: 'https://20feaa04-0946-4c68-a68d-0eb88cc1b9c4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav"
    }
  },
  ios: {
    scheme: "Chravel"
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
