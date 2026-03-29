import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";

import AppHeader from "../../components/AppHeader";
import commanServices from "../../redux/services/commanServices";

import {
  useTheme,
  Spacing,
  BorderRadius,
  TextStyles,
  ThemeUtils,
  Fonts,
} from "../../theme/theme";

const GetAllAttendance = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { class_mapping_id } = route.params || {};

  const { colors } = useTheme();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAttendance();
  }, []);

  /* ================= FETCH ================= */

  const fetchAttendance = async () => {
    console.log("📌 CLASS ID:", class_mapping_id);

    if (!class_mapping_id) {
      setError("Class ID missing");
      setLoading(false);
      return;
    }

    try {
      const res = await commanServices.getAttendanceList(class_mapping_id);

      console.log("📌 API RESPONSE:", res);

      if (res?.success && Array.isArray(res.attendanceList)) {
        setAttendanceList(res.attendanceList);
      } else {
        setAttendanceList([]);
        setError("No attendance data found");
      }
    } catch (err) {
      console.log("❌ ERROR:", err);
      setError("Something went wrong");
    }

    setLoading(false);
  };

  /* ================= REFRESH ================= */

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    const res = await commanServices.getAttendanceList(class_mapping_id);

    if (res?.success) {
      setAttendanceList(res.attendanceList || []);
    }

    setRefreshing(false);
  }, [class_mapping_id]);

  /* ================= NAVIGATION ================= */

  const goToDetail = (id) => {
    navigation.navigate("GetFullAttendanceDetails", {
      attendanceId: id, // ✅ IMPORTANT
    });
  };

  /* ================= RENDER ITEM ================= */

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          },
        ]}
        onPress={() => goToDetail(item.id)}
      >
        {/* LEFT */}
        <View style={{ flex: 1 }}>
          <Text
            style={[
              TextStyles.title,
              { color: colors.textPrimary },
            ]}
          >
            {item.class_name}
          </Text>

          <Text
            style={[
              TextStyles.caption,
              { color: colors.textSecondary },
            ]}
          >
            Date: {item.date}
          </Text>
        </View>

        {/* RIGHT */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View
            style={[
              styles.badge,

            ]}
          >
            <Text style={[styles.apText, { color: colors.success }]}>
              P: {item.present}
            </Text>
          </View>

          <View
            style={[
              styles.badge,

            ]}
          >
            <Text style={[styles.apText, { color: colors.error }]}>
              A: {item.absent}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <AppHeader title="Attendance List" />
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  /* ================= MAIN ================= */

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* <AppHeader title="Attendance List" /> */}

      {/* ERROR */}
      {error && (
        <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
          {error}
        </Text>
      )}

      {/* DEBUG COUNT */}
      <Text style={{ textAlign: "center", color: colors.textSecondary, marginTop: 10,fontFamily: Fonts.quicksand.bold,  }}>
        Total Records: {attendanceList.length}
      </Text>

      <FlatList
        data={attendanceList}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : index.toString()
        }
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={{ padding: Spacing.md }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40 }}>
            No attendance found
          </Text>
        }
      />
    </View>
  );
};

export default GetAllAttendance;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  apText:{
    fontFamily: Fonts.quicksand.bold,

  },
});