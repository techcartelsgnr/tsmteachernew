import messaging from '@react-native-firebase/messaging';
import notifee, { EventType, AndroidImportance } from '@notifee/react-native';

/* --------------------------------------------------------
   🔔 Handle Background / Killed App Notification Tap
--------------------------------------------------------- */
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    console.log('📲 Notification Tap (BG/KILLED):', detail.notification);

    // Save for App.jsx to handle navigation
    global.notificationData = detail?.notification?.data || null;
  }
});

/* --------------------------------------------------------
   🔔 Handle Background Message
--------------------------------------------------------- */
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 Background Message:', remoteMessage);

  // ❌ Prevent duplicate (FCM auto shows notification)
  if (remoteMessage.notification) {
    return;
  }

  // 🔔 Create Channel
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });

  // 🔔 Show Notification
  await notifee.displayNotification({
    title: remoteMessage.data?.title || '',
    body: remoteMessage.data?.body || '',
    android: {
      channelId,
      smallIcon: 'ic_launcher', // make sure exists
      pressAction: { id: 'default' },
    },
    data: remoteMessage.data || {},
  });
});