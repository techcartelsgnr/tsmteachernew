import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabRoutes from '../navigation/TabRoutes';
import {
  AttendanceScreen,
  ClassScreen,
  EditHomeWork,
  GetAllAttendance,
  GetFullAttendanceDetails,
  GetHomeWorks,
  HomeWorkDetail,
  HomeWorkScreen,
  MarksEntryScreen,
  NotificationScreen
} from '../screens/index';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TabRoutes" component={TabRoutes} />
      <Stack.Screen name="AttendanceScreen" component={AttendanceScreen} />
      <Stack.Screen name="ClassScreen" component={ClassScreen} />
      <Stack.Screen name="MarksEntryScreen" component={MarksEntryScreen} />
      <Stack.Screen name="HomeWorkScreen" component={HomeWorkScreen} />
      <Stack.Screen name="GetHomeWorks" component={GetHomeWorks} />
      <Stack.Screen name="EditHomeWork" component={EditHomeWork} />
      <Stack.Screen name="HomeWorkDetail" component={HomeWorkDetail} />
      <Stack.Screen name="GetAllAttendance" component={GetAllAttendance} />
      <Stack.Screen name="GetFullAttendanceDetails" component={GetFullAttendanceDetails} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
