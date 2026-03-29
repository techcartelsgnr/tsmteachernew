// MUST BE FIRST – registers FCM background handlers
import './firebase-messaging';
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider, useDispatch, useSelector } from "react-redux";

import { store } from "./src/redux/store";
import { ThemeProvider } from "./src/theme/ThemeContext";

import MainStack from "./src/navigation/MainStack";
import AuthStack from "./src/navigation/AuthStack";

import { chkLogin } from "./src/redux/slices/authSlice";

import SplashScreen from "./src/screens/splash/SplashScreen";
import Toast from "react-native-toast-message";

/* 🔔 Notification Imports */
import { requestNotificationPermission } from "./src/utils/requestPermissions";
import { registerNotificationListeners } from "./src/utils/notificationService";
import {
  navigationRef,
  processPendingNavigation,
  navigate,
} from "./src/utils/NavigationService";

/* =====================================================
   APP ROOT
===================================================== */

const TeacherAppRoot = () => {
  const dispatch = useDispatch();
  const { token, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(chkLogin());
    initNotifications();
  }, [dispatch]);

  /* ================= NOTIFICATION INIT ================= */

  const initNotifications = async () => {
    try {
      // 🔐 Request Permission + Get Token
      await requestNotificationPermission();

      // 🔔 Register all listeners (foreground + background tap)
      registerNotificationListeners();

      // 🔥 Handle notification tap when app was KILLED
      if (global.notificationData) {
        console.log("🚀 Killed App Tap Data:", global.notificationData);

        navigate("NotificationScreen", global.notificationData);

        // Clear after use
        global.notificationData = null;
      }
    } catch (error) {
      console.log("❌ Notification Init Error:", error);
    }
  };

  /* ================= SPLASH ================= */

  if (isLoading) {
    return <SplashScreen />;
  }

  /* ================= MAIN APP ================= */

  return (
    <>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          // 🔥 Execute queued navigation (very important)
          processPendingNavigation();
        }}
      >
        {token ? <MainStack /> : <AuthStack />}
      </NavigationContainer>

      {/* Global Toast */}
      <Toast />
    </>
  );
};

/* =====================================================
   MAIN APP
===================================================== */

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <TeacherAppRoot />
      </ThemeProvider>
    </Provider>
  );
}