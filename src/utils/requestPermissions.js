import { Platform, PermissionsAndroid } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  requestPermission,
  getToken,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';

export const requestNotificationPermission = async () => {
  try {
    const messagingInstance = getMessaging(getApp());

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (result !== PermissionsAndroid.RESULTS.GRANTED) return;
    }

    const status = await requestPermission(messagingInstance);

    const enabled =
      status === AuthorizationStatus.AUTHORIZED ||
      status === AuthorizationStatus.PROVISIONAL;

    if (!enabled) return;

    const token = await getToken(messagingInstance);
    console.log("🎯 FCM TOKEN:", token);

    return token;
  } catch (err) {
    console.log(err);
  }
};