import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  Switch,
  Modal,
  TouchableOpacity,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import AppHeader from "../../components/AppHeader";
import ButtonWithLoader from "../../components/ButtonWithLoader";

import {
  useTheme,
  TextStyles,
  Spacing,
  BorderRadius,
} from "../../theme/theme";

import { logout } from "../../redux/slices/authSlice";

import ScreenWrapper from '../../components/ScreenWrapper';

/* =====================================================
   PROFILE SCREEN
===================================================== */

const ProfileScreen = () => {

  const dispatch = useDispatch();

  const { colors, isDarkMode, toggleTheme } = useTheme();

  const {
    pending,
    teacher_id,
    user_id,
    name,
    email,
    mobile,
    image,
  } = useSelector((state) => state.auth);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  /* ================= PROFILE ROWS ================= */

  const profileRows = [
    {
      label: "Teacher ID",
      value: teacher_id ? `TCH-${teacher_id}` : "-",
    },
    {
      label: "User ID",
      value: user_id ?? "-",
    },
    {
      label: "Name",
      value: name ?? "-",
    },
    {
      label: "Email",
      value: email ?? "-",
    },
    {
      label: "Mobile",
      value: mobile ?? "-",
    },
  ];

  /* ================= LOGOUT ================= */

  const onConfirmLogout = () => {

    setShowLogoutModal(false);

    dispatch(logout());

  };

  /* ================= PROFILE IMAGE ================= */

  const profileImage =
    image && image.length > 0
      ? { uri: image }
      : require("../../../assets/images/user.png");

  return (
    <ScreenWrapper
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >

      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* HEADER */}

      <AppHeader title="My Profile" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* PROFILE CARD */}

        <View style={styles.profileCard}>

          <Image source={profileImage} style={styles.profileImg} />

          <Text style={[styles.name, { color: colors.textPrimary }]}>
            {name || "Teacher"}
          </Text>

          <Text style={[styles.role, { color: colors.textSecondary }]}>
            Teacher
          </Text>

        </View>

        {/* PROFILE DETAILS */}

        <View
          style={[
            styles.detailsCard,
            { backgroundColor: colors.cardBackground },
          ]}
        >

          {profileRows.map((item, index) => (

            <ProfileRow
              key={item.label}
              label={item.label}
              value={item.value}
              colors={colors}
              isLast={index === profileRows.length - 1}
            />

          ))}

        </View>

        {/* THEME TOGGLE */}

        <View
          style={[
            styles.themeCard,
            { backgroundColor: colors.cardBackground },
          ]}
        >

          <View style={styles.toggleRow}>

            <Text
              style={[
                styles.toggleText,
                { color: colors.textSecondary },
              ]}
            >
              {isDarkMode ? "Dark Mode" : "Light Mode"}
            </Text>

            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{
                false: "#d1d5db",
                true: colors.accent,
              }}
              thumbColor="#ffffff"
            />

          </View>

        </View>

        {/* LOGOUT BUTTON */}

        <ButtonWithLoader
          text="Logout"
          isLoading={pending}
          onPress={() => setShowLogoutModal(true)}
          bgColor={colors.error}
        />

      </ScrollView>

      {/* ================= LOGOUT MODAL ================= */}

      <Modal
        transparent
        animationType="fade"
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >

        <View style={styles.modalOverlay}>

          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.cardBackground },
            ]}
          >

            <Text
              style={[
                styles.modalTitle,
                { color: colors.textPrimary },
              ]}
            >
              Logout
            </Text>

            <Text
              style={[
                styles.modalText,
                { color: colors.textSecondary },
              ]}
            >
              Are you sure you want to logout?
            </Text>

            <View style={styles.modalActions}>

              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  { backgroundColor: colors.surface },
                ]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={{ color: colors.textPrimary }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={pending}
                style={[
                  styles.modalBtn,
                  { backgroundColor: colors.error },
                ]}
                onPress={onConfirmLogout}
              >
                <Text style={{ color: "#fff" }}>
                  Logout
                </Text>
              </TouchableOpacity>

            </View>

          </View>

        </View>

      </Modal>

    </ScreenWrapper>
  );
};

export default ProfileScreen;

/* =====================================================
   PROFILE ROW
===================================================== */

const ProfileRow = ({ label, value, colors, isLast }) => {

  return (
    <View
      style={[
        styles.row,
        {
          borderBottomColor: colors.divider,
          borderBottomWidth: isLast ? 0 : 1,
          paddingBottom: isLast ? 0 : Spacing.md,
        },
      ]}
    >

      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {label}
      </Text>

      <Text style={[styles.value, { color: colors.textPrimary }]}>
        {value}
      </Text>

    </View>
  );

};

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  scrollContent: {
    padding: Spacing.md,
  },

  profileCard: {
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.sm,
  },

  profileImg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: Spacing.sm,
  },

  name: {
    ...TextStyles.heading,
    marginTop: Spacing.xs,
  },

  role: {
    ...TextStyles.body,
    marginTop: 4,
  },

  detailsCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
  },

  row: {
    marginBottom: Spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  label: {
    ...TextStyles.caption,
  },

  value: {
    ...TextStyles.body,
  },

  themeCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
  },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  toggleText: {
    ...TextStyles.caption,
  },

  /* MODAL */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: "85%",
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
  },

  modalTitle: {
    ...TextStyles.title,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },

  modalText: {
    ...TextStyles.body,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  modalBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    marginHorizontal: 6,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
  },

});