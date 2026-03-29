import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { AlertCircle, BookOpen } from "lucide-react-native";
import { FontSizes, DeviceSize } from "../theme/theme";

const EmptyState = ({
  icon: Icon = AlertCircle,
  image = null,
  title = "No Data Found",
  iconColor = "#000",
  animationType = "pulse", // "pulse" | "bounce" | "none"
  style,
}) => {
  const ICON_SIZE = DeviceSize.wp(18);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 🔹 Entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // 🔁 Loop animations
    if (animationType === "pulse") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    if (animationType === "bounce") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: -8,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: translateY },
          ],
        },
      ]}
    >
      {image ? (
        <Image
          source={image}
          style={styles.emptyImage}
          resizeMode="contain"
        />
      ) : (
        <Icon size={ICON_SIZE} color={iconColor} />
      )}

      <Text style={styles.text}>{title}</Text>
    </Animated.View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: DeviceSize.hp(15),
  },

  emptyImage: {
    width: DeviceSize.wp(20),
    height: DeviceSize.wp(20),
    marginBottom: DeviceSize.hp(1),
  },

  text: {
    marginTop: DeviceSize.hp(1.5),
    fontSize: FontSizes.small,
    color: "#999",
    fontFamily: "Quicksand-Bold",
    textAlign: "center",
  },
});

