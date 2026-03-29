import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  FlatList
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Share2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import {
  useTheme,
  TextStyles,
  DeviceSize,
  Spacing,
  BorderRadius,
} from '../../theme/theme';

import ScreenWrapper from '../../components/ScreenWrapper';

/* =====================================================
   HOME CATEGORIES
===================================================== */

const categories = [
  { title: 'Attendance', image: require('../../../assets/homeicon/attendancescreen.png'), screen: 'AttendanceScreen' },
  // { title: 'Get All Attendance', image: require('../../../assets/homeicon/attendancescreen.png'), screen: 'GetAllAttendance' },
  { title: 'Classes', image: require('../../../assets/homeicon/feescreen.png'), screen: 'ClassScreen' },
  // { title: 'Marks Entry', image: require('../../../assets/homeicon/notice.png'), screen: 'MarksEntryScreen' },
  { title: 'HomeWork', image: require('../../../assets/homeicon/notice.png'), screen: 'HomeWorkScreen' },
  { title: 'All HomeWork', image: require('../../../assets/homeicon/notice.png'), screen: 'GetHomeWorks' },
];

const CATEGORY_COLORS = [
  '#4F46E5',
  '#16A34A',
  '#EA580C',
  '#0891B2',
  '#9333EA',
];

/* =====================================================
   HOME SCREEN
===================================================== */

const HomeScreen = () => {

  const { colors, isDarkMode } = useTheme();
  const navigation = useNavigation();

  const { name, school_name, image, assigned_classes } = useSelector(
    state => state.auth
  );

  /* ================= CLASS TEACHER CHECK ================= */

  const isClassTeacher = assigned_classes?.some(
    (cls) => cls.is_class_teacher === true
  );

  /* ================= FILTER CATEGORIES ================= */

  const filteredCategories = categories.filter((item) => {

    if (item.screen === 'AttendanceScreen' && !isClassTeacher) {
      return false;
    }

    return true;
  });

  return (

    <ScreenWrapper style={[styles.container, { backgroundColor: colors.background }]}>

      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* =====================================================
           TOP HEADER
      ===================================================== */}

      <View style={[styles.topHeader, { backgroundColor: colors.textPrimary }]}>

        <Text style={[styles.classText, { color: colors.background }]}>
          Class 7th A
        </Text>

        <View style={styles.rightIcons}>

          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate("NotificationScreen")}>
            <Bell size={20} color={colors.background} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn}>
            <Share2 size={20} color={colors.background} />
          </TouchableOpacity>

        </View>

      </View>

      {/* =====================================================
           WELCOME SECTION
      ===================================================== */}

      <View style={styles.headerContent}>

        <Image
          source={{ uri: image }}
          style={styles.profileImg}
        />

        <View>

          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
            Welcomes
          </Text>

          <Text
            style={[
              styles.teacherName,
              {
                color: colors.textPrimary,
                borderBottomColor: colors.divider,
              },
            ]}
          >
            {name}
          </Text>

          <Text style={[styles.subjectText, { color: colors.textSecondary }]}>
            {school_name}
          </Text>

        </View>

      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ================= QUICK ACTION GRID ================= */}

        <View style={styles.quickGrid}>

          {filteredCategories.map((item, index) => (

            <TouchableOpacity
              key={index}
              activeOpacity={0.85}
              style={[
                styles.quickItem,
                { backgroundColor: colors.cardBackground },
              ]}
              onPress={() => {

                if (item.screen === 'AttendanceScreen') {

                  const classTeacherClass = assigned_classes?.find(
                    (c) => c.is_class_teacher === true
                  );

                  navigation.navigate('AttendanceScreen', {
                    class_mapping_id: classTeacherClass?.class_mapping_id
                  });

                } else {

                  navigation.navigate(item.screen);

                }

              }}
            >

              <View
                style={[
                  styles.quickIcon,
                  { backgroundColor: colors.surface },
                ]}
              >

                <Image
                  source={item.image}
                  style={styles.quickIconImg}
                  resizeMode="contain"
                />

              </View>

              <Text
                style={[
                  styles.quickText,
                  { color: colors.textPrimary },
                ]}
                numberOfLines={2}
              >
                {item.title}
              </Text>

            </TouchableOpacity>

          ))}

        </View>

      </ScrollView>

    </ScreenWrapper>

  );

};

export default HomeScreen;

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    
  },

  /* 🔹 TOP HEADER */

  topHeader: {
    height: DeviceSize.hp(7),
    paddingHorizontal: DeviceSize.wp(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  classText: {
    ...TextStyles.title,
  },

  rightIcons: {
    flexDirection: 'row',
  },

  iconBtn: {
    marginLeft: DeviceSize.wp(4),
  },

  /* 🔹 WELCOME */

  headerContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },

  welcomeText: {
    ...TextStyles.caption,
  },

  teacherName: {
    ...TextStyles.heading,
    borderBottomWidth: 1,
    paddingBottom: 2,
  },

  subjectText: {
    ...TextStyles.body,
    marginTop: 2,
  },

  profileImg: {
    width: DeviceSize.wp(14),
    height: DeviceSize.wp(14),
    borderRadius: 30,
    marginRight: 15,
  },

  /* QUICK GRID */

  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },

  quickItem: {
    width: DeviceSize.wp(44),
    padding: Spacing.md,
    borderRadius: BorderRadius.large,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  quickIcon: {
    width: DeviceSize.wp(10),
    height: DeviceSize.wp(10),
    borderRadius: BorderRadius.pill,
    marginBottom: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },

  quickIconImg: {
    width: DeviceSize.wp(5),
    height: DeviceSize.wp(5),
  },

  quickText: {
    ...TextStyles.caption,
  },

});