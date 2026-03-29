import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@react-native-firebase/messaging';

import notifee, { EventType, AndroidImportance } from '@notifee/react-native';
import { navigate } from './NavigationService';

export const registerNotificationListeners = () => {
  const messagingInstance = getMessaging(getApp());

  /* 🔔 Foreground */
  onMessage(messagingInstance, async remoteMessage => {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        pressAction: { id: 'default' },
      },
      data: remoteMessage.data || {},
    });
  });

  /* 🔔 Foreground Tap */
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      navigate("NotificationScreen", detail?.notification?.data);
    }
  });

  /* 🔔 Background Tap */
  onNotificationOpenedApp(messagingInstance, remoteMessage => {
    if (remoteMessage) {
      navigate("NotificationScreen", remoteMessage.data);
    }
  });

  /* 🔔 Killed App */
  getInitialNotification(messagingInstance).then(remoteMessage => {
    if (remoteMessage) {
      navigate("NotificationScreen", remoteMessage.data);
    }
  });
};