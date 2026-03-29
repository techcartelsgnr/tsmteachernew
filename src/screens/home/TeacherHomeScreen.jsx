import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell } from 'lucide-react-native';

import {
  useTheme,
  TextStyles,
  Spacing,
  BorderRadius,
  DeviceSize,
} from '../../theme/theme';

const TeacherHomeScreen = () => {
  const { colors, isDarkMode } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* ===================== TOP HEADER (FIXED) ===================== */}
      <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            Good Morning
          </Text>
          <Text style={[styles.teacherName, { color: colors.textPrimary }]}>
            Mrs. Stephania
          </Text>
        </View>

        <TouchableOpacity>
          <Bell size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* ===================== SCROLLABLE CONTENT ===================== */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Spacing.xl }}
      >
        {/* ===================== TODAY CLASSES ===================== */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Today’s Classes
          </Text>

          <FlatList
            data={[1, 2, 3]}
            keyExtractor={(_, i) => i.toString()}
            scrollEnabled={false}
            renderItem={() => (
              <View
                style={[
                  styles.classCard,
                  { backgroundColor: colors.cardBackground },
                ]}
              >
                <Text style={[styles.subject, { color: colors.textPrimary }]}>
                  English
                </Text>

                <Text style={[styles.time, { color: colors.textSecondary }]}>
                  09:35 AM – 10:30 AM
                </Text>

                <View style={styles.metaRow}>
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                    Class: 7th A
                  </Text>
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                    Students: 32
                  </Text>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[
                      styles.primaryBtn,
                      { backgroundColor: colors.accent },
                    ]}
                  >
                    <Text style={styles.primaryBtnText}>
                      Take Attendance
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.secondaryBtn,
                      { borderColor: colors.accent },
                    ]}
                  >
                    <Text
                      style={[
                        styles.secondaryBtnText,
                        { color: colors.accent },
                      ]}
                    >
                      Enter Marks
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>

        {/* ===================== QUICK ACTIONS ===================== */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Quick Actions
          </Text>

          <View style={styles.quickGrid}>
            {['Attendance', 'Marks', 'Notify', 'Birthdays'].map(item => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.quickItem,
                  { backgroundColor: colors.cardBackground },
                ]}
              >
                <View
                  style={[
                    styles.quickIcon,
                    { backgroundColor: colors.surface },
                  ]}
                />
                <Text
                  style={[
                    styles.quickText,
                    { color: colors.textPrimary },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ===================== TODAY SUMMARY ===================== */}
        <View style={styles.section}>
          <View
            style={[
              styles.summaryCard,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Text style={[styles.summaryText, { color: colors.textPrimary }]}>
              ✔ Attendance Taken: 2 / 4
            </Text>
            <Text style={[styles.summaryText, { color: colors.textPrimary }]}>
              ✍ Marks Pending: 1 Class
            </Text>
            <Text style={[styles.summaryText, { color: colors.textPrimary }]}>
              🎂 Birthdays Today: 3
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TeacherHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60,
  },

  header: {
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  greeting: {
    ...TextStyles.caption,
  },

  teacherName: {
    ...TextStyles.subHeading,
  },

  section: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
  },

  sectionTitle: {
    ...TextStyles.subHeading,
    marginBottom: Spacing.sm,
  },

  classCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
  },

  subject: {
    ...TextStyles.title,
  },

  time: {
    ...TextStyles.caption,
    marginTop: 2,
  },

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },

  metaText: {
    ...TextStyles.caption,
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
  },

  primaryBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
    marginRight: Spacing.sm,
  },

  primaryBtnText: {
    color: '#fff',
    fontWeight: '600',
  },

  secondaryBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    alignItems: 'center',
  },

  secondaryBtnText: {
    fontWeight: '600',
  },

  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  quickItem: {
    width: DeviceSize.wp(42),
    padding: Spacing.md,
    borderRadius: BorderRadius.large,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: Spacing.sm,
  },

  quickText: {
    ...TextStyles.caption,
  },

  summaryCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.large,
  },

  summaryText: {
    ...TextStyles.body,
    marginBottom: 4,
  },
});
