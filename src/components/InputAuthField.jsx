import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';

import {
  useTheme,
  FontSizes,
  BorderRadius,
  Spacing,
  Fonts,
} from '../theme/theme';

const InputAuthField = ({
  label,
  keyboardType,
  firstLabelText,
  onChangeText,
  isSecure,
  value,
  leftIcon,
  rightIcon,          // 👈 NEW
  onRightIconPress,   // 👈 NEW
  maxLength,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.divider,
        },
      ]}
    >
       {/* LEFT ICON */}
      {leftIcon && (
        <View style={styles.leftIconWrapper}>
          {leftIcon}
        </View>
      )}
      {firstLabelText && (
        <Text
          style={[
            styles.prefixText,
            {
              color: colors.textSecondary,
              marginRight: firstLabelText ? 6 : 0, // ✅ CONDITIONAL
            },
          ]}
        >
          {firstLabelText}
        </Text>
      )}

      <TextInput
        placeholder={label}
        placeholderTextColor={colors.textTertiary}
        keyboardType={keyboardType}
        secureTextEntry={isSecure}
        onChangeText={onChangeText}
        maxLength={maxLength}
        value={value}
        style={[
          styles.input,
          { color: colors.textPrimary },
        ]}
      />

      {rightIcon && (
        <TouchableOpacity
          onPress={onRightIconPress}
          style={styles.iconWrapper}
          activeOpacity={0.7}
        >
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputAuthField;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.small,
    paddingHorizontal: Spacing.brh,
    paddingVertical: Spacing.brh,
    marginBottom: Spacing.sm,
  },

  prefixText: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.normal,

  },

  input: {
    flex: 1,
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.small,
    paddingVertical: 0,
  },
 leftIconWrapper: {
    marginRight: 5,
  },
  iconWrapper: {
    paddingLeft: 10,
  },
});
