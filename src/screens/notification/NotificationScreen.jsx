import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from "react-native";

import AppHeader from "../../components/AppHeader";
import { useTheme, FontSizes, TextStyles } from "../../theme/theme";

const NotificationScreen = () => {
  const { colors } = useTheme();

  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "New Homework Assigned",
      message: "Math homework has been assigned for Class 10.",
      time: "2 min ago",
    },
    {
      id: "2",
      title: "Fee Reminder",
      message: "Your fee payment is pending. Please pay before due date.",
      time: "1 hour ago",
    },
    {
      id: "3",
      title: "Holiday Notice",
      message: "School will remain closed tomorrow due to festival.",
      time: "Yesterday",
    },
  ]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);

    // 🔄 simulate API
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.divider,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {item.title}
      </Text>

      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {item.message}
      </Text>

      <Text style={[styles.time, { color: colors.textTertiary }]}>
        {item.time}
      </Text>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <AppHeader title="Notifications" />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <Text
            style={[
              styles.emptyText,
              { color: colors.textSecondary },
            ]}
          >
            No Notifications Found
          </Text>
        }
      />
    </View>
  );
};

export default NotificationScreen;

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },

  title: {
    ...TextStyles.title,
    marginBottom: 4,
  },

  message: {
    ...TextStyles.body,
    marginBottom: 6,
  },

  time: {
    fontSize: FontSizes.small,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: FontSizes.normal,
  },
});