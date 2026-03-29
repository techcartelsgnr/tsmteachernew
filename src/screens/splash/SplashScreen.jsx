import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  StatusBar,
  ImageBackground,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {
  useTheme,
  DeviceSize,
  TextStyles,
  ThemeUtils,
} from '../../theme/theme';



const SplashScreen = () => {
  const { colors, isDarkMode } = useTheme();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 2.2,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <>
      <StatusBar
        hidden
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      <ImageBackground
        source={require('../../../assets/images/splashbg.jpg')}
        style={styles.container}
        resizeMode="cover"
      >
        {/* 🔹 Dark overlay for readability in dark mode */}
        {isDarkMode && (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: ThemeUtils.withOpacity('#000', 0.35) },
            ]}
          />
        )}

        <View style={styles.centerContainer}>
          {/* 🔵 GRADIENT PULSE */}
          <Animated.View
            style={[
              styles.pulseWrapper,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            <LinearGradient
              colors={[
                colors.primaryGradientStart,
                colors.primaryGradientEnd,
              ]}
              style={styles.pulseCircle}
            />
          </Animated.View>

          {/* 🔵 LOGO */}
          <View
            style={[
              styles.logoWrapper,
              {
                backgroundColor: colors.cardBackground,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <Image
              source={require('../../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

         
        </View>
      </ImageBackground>
    </>
  );
};

export default SplashScreen;

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  pulseWrapper: {
    position: 'absolute',
  },

  pulseCircle: {
    width: DeviceSize.wp(45),
    height: DeviceSize.wp(45),
    borderRadius: DeviceSize.wp(22.5),
  },

  logoWrapper: {
    width: DeviceSize.wp(30),
    height: DeviceSize.wp(30),
    borderRadius: DeviceSize.wp(15),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },

  logo: {
    width: DeviceSize.wp(20),
    height: DeviceSize.wp(20),
  },

  appName: {
    ...TextStyles.heading,
    marginTop: DeviceSize.hp(2),
  },
});
