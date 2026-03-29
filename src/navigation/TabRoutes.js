import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { DeviceSize } from '../theme/theme'; // ✅ only what is needed
import CustomBottomTabBar from '../components/CustomBottomTabBar';

import {
  HomeScreen,
  HomeWorkScreen,
  ProfileScreen,
  TeacherHomeScreen,
} from '../screens/index';

const Tab = createBottomTabNavigator();

// -------------------- Bottom Tabs --------------------
export default function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomBottomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/tab/hometab1.png')}
              style={[styles.icon, { tintColor: color }]}
            />
          ),
        }}
      />

      {/* <Tab.Screen
        name="Teacher"
        component={TeacherHomeScreen}
        options={{
          tabBarLabel: 'Home2',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/tab/hometab1.png')}
              style={[styles.icon, { tintColor: color }]}
            />
          ),
        }}
      /> */}

      
   

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/tab/profiletab.png')}
              style={[styles.icon, { tintColor: color }]}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  icon: {
    width: DeviceSize.wp(4),
    height: DeviceSize.wp(4),
    resizeMode: 'contain',
  },
});
