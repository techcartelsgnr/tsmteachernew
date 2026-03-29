import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Users } from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';

import AppHeader from '../../components/AppHeader';
import {
  useTheme,
  FontSizes,
  TextStyles,
  Spacing,
  BorderRadius,
} from '../../theme/theme';

import { chkLogin } from '../../redux/slices/authSlice';

const ClassScreen = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);

  // 🔥 GET DATA FROM REDUX
  const { assigned_classes, name } = useSelector(state => state.auth);

  /* =====================================================
     PREPARE FLAT DATA (CLASS + SUBJECT)
  ===================================================== */

  const classesData = assigned_classes?.flatMap(item =>
    item.subjects?.map(sub => ({
      id: `${item.class_mapping_id}-${sub.subject_id}`,
      subject: sub.subject_name,
      className: `${item.class_name} ${item.section}`,
      teacher: name,
      students: item.total_students || 0, // if API gives
      time: item.time || '09:00 - 10:00 AM', // fallback
    }))
  );

  /* =====================================================
     REFRESH
  ===================================================== */

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(chkLogin()); // reload from storage
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* HEADER */}
      <AppHeader title={`Hi, ${name}`} />

      {/* TITLE */}
      <View style={styles.sectionHeader}>
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textPrimary },
          ]}
        >
          Today Classes ({classesData?.length || 0})
        </Text>
      </View>

      {/* LIST */}
      <FlatList
        data={classesData}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={{
          paddingBottom: Spacing.xl,
        }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.classCard,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.divider,
              },
            ]}
          >
            {/* TIME */}
            <View
              style={[
                styles.timeBadge,
                { backgroundColor: colors.accent },
              ]}
            >
              <Text style={styles.timeText}>
                {item.time}
              </Text>
            </View>

            {/* SUBJECT */}
            <Text
              style={[
                styles.subject,
                { color: colors.textPrimary },
              ]}
            >
              {item.subject}
            </Text>

            {/* META */}
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Users size={14} color={colors.textSecondary} />
                <Text
                  style={[
                    styles.metaText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Students - {item.students}
                </Text>
              </View>

              <View style={styles.metaItem}>
                <BookOpen size={14} color={colors.textSecondary} />
                <Text
                  style={[
                    styles.metaText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Class - {item.className}
                </Text>
              </View>
            </View>

            {/* TEACHER */}
            {/* <Text
              style={{
                marginTop: 6,
                fontSize: FontSizes.xsmall,
                color: colors.textSecondary,
                fontFamily: 'Quicksand-Medium',
              }}
            >
              Teacher: {item.teacher}
            </Text> */}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ClassScreen;

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: { flex: 1 },

  sectionHeader: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },

  sectionTitle: {
    ...TextStyles.title,
  },

  classCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
  },

  timeBadge: {
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    marginBottom: 6,
  },

  timeText: {
    color: '#fff',
    fontSize: FontSizes.xsmall,
    fontFamily: 'Quicksand-Bold',
  },

  subject: {
    fontSize: FontSizes.medium,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 6,
  },

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  metaText: {
    fontSize: FontSizes.xsmall,
    fontFamily: 'Quicksand-Regular',
  },
});