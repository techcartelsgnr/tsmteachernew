import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { Eye, EyeOff, Mail, Phone } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';

import InputAuthField from '../../components/InputAuthField';
import ButtonWithLoader from '../../components/ButtonWithLoader';

import { fetchTeacherLogin } from '../../redux/slices/authSlice';

import {
  useTheme,
  TextStyles,
  FontSizes,
  BorderRadius,
  DeviceSize,
  ThemeUtils,
} from '../../theme/theme';

const LoginScreen = () => {

  const dispatch = useDispatch();
  const { colors } = useTheme();

  const { pending, error, message } = useSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');

  /* ================= HANDLE BACKEND ERROR ================= */

  useEffect(() => {
    if (error && message) {
      setApiError(
        message || "Teacher not associated with us. Contact school admin."
      );
    }
  }, [error, message]);

  /* ================= LOGIN HANDLER ================= */

  const onLogin = () => {

    setEmailError('');
    setPasswordError('');
    setApiError('');

    let valid = true;

    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      valid = false;
    }

    if (!valid) return;

    dispatch(
      fetchTeacherLogin({
        email: email.trim(),
        password,
        fcmToken: 'fcm',
      })
    );

  };

  return (
    <View style={styles.container}>

      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* BACKGROUND */}
      <Image
        source={require('../../../assets/images/splashbg.jpg')}
        style={styles.bg}
      />

      <BlurView style={styles.blur} blurType="dark" blurAmount={20} />

      {/* CARD */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: ThemeUtils.withOpacity(
              colors.cardBackground,
              0.92
            ),
          },
        ]}
      >

        {/* LOGO */}
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
          />
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Teacher Login
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Login to manage classes & attendance
        </Text>

        {/* EMAIL */}
        <InputAuthField
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          leftIcon={<Mail size={18} color={colors.textSecondary} />}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError('');
          }}
        />

        {emailError ? (
          <Text style={styles.errorText}>{emailError}</Text>
        ) : null}

        {/* PASSWORD */}
        <InputAuthField
          label="Password"
          isSecure={secure}
          value={password}
          leftIcon={<Phone size={18} color={colors.textSecondary} />}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError('');
          }}
          rightIcon={
            secure ? (
              <EyeOff size={18} color={colors.textSecondary} />
            ) : (
              <Eye size={18} color={colors.textSecondary} />
            )
          }
          onRightIconPress={() => setSecure(!secure)}
        />

        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : apiError ? (
          <Text style={styles.errorText}>{apiError}</Text>
        ) : null}



        {/* LOGIN BUTTON */}
        <View style={{marginTop: 10,}}>
          <ButtonWithLoader
            text="LOGIN"
            isLoading={pending}
            onPress={onLogin}
            bgColor={colors.primary}
          />
        </View>


        {/* FOOTER */}
        <Text
          style={[
            styles.footerText,
            { color: colors.textTertiary },
          ]}
        >
          Powered by TheSchoolMate
        </Text>

      </View>
    </View>
  );
};

export default LoginScreen;

/* =====================================================
   STYLES (UNCHANGED)
===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  bg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  blur: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  card: {
    marginHorizontal: 24,
    padding: 22,
    borderRadius: BorderRadius.xl,
  },

  logoWrapper: {
    width: DeviceSize.wp(28),
    height: DeviceSize.wp(28),
    borderRadius: DeviceSize.wp(14),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 14,
  },

  logo: {
    width: DeviceSize.wp(20),
    height: DeviceSize.wp(20),
    resizeMode: 'contain',
  },

  title: {
    ...TextStyles.heading,
    textAlign: 'center',
  },

  subtitle: {
    ...TextStyles.caption,
    textAlign: 'center',
    marginBottom: 20,
  },

  footerText: {
    marginTop: 18,
    textAlign: 'center',
    fontSize: FontSizes.small,
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 10,
  },
});
