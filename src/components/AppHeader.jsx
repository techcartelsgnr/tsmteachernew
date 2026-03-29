import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

import {
  useTheme,
  FontSizes,
} from "../theme/theme";

const AppHeader = ({ title }) => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.cardBackground,
          borderBottomColor: colors.divider,
        },
      ]}
    >
      {/* BACK BUTTON */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <ArrowLeft
          size={22}
          color={colors.textPrimary}
        />
      </TouchableOpacity>

      {/* TITLE */}
      <Text
        style={[
          styles.headerTitle,
          { color: colors.textPrimary },
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  );
};

export default AppHeader;

/* =====================================================
   STYLES (THEME-SAFE)
===================================================== */

const styles = StyleSheet.create({
  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },

  backButton: {
    position: "absolute",
    left: 15,
    zIndex: 10,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: FontSizes.small,
    fontFamily: "Quicksand-Bold",
  },
});
