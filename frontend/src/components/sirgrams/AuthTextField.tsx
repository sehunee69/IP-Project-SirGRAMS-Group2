import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Platform,
  type TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const MONO_FONT = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
});

interface AuthTextFieldProps extends TextInputProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  /** Optional element rendered on the right side of the label row (e.g. "Forgot Password?"). */
  labelAccessory?: React.ReactNode;
  helperText?: string;
  errorText?: string;
  /** Renders the label in uppercase with letter spacing, as on the login screen. */
  uppercaseLabel?: boolean;
  /** Uses a monospace font for the input value and placeholder. */
  mono?: boolean;
  /** Masks the value and shows a show/hide toggle. */
  isPassword?: boolean;
}

export function AuthTextField({
  label,
  icon,
  labelAccessory,
  helperText,
  errorText,
  uppercaseLabel = false,
  mono = false,
  isPassword = false,
  style,
  onFocus,
  onBlur,
  ...inputProps
}: AuthTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, uppercaseLabel && styles.labelUppercase]}>
          {uppercaseLabel ? label.toUpperCase() : label}
        </Text>
        {labelAccessory}
      </View>

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          !!errorText && styles.inputWrapperError,
        ]}>
        <Ionicons
          name={icon}
          size={18}
          color={isFocused ? '#0F172A' : '#94A3B8'}
          style={styles.leadingIcon}
        />
        <TextInput
          placeholderTextColor="#94A3B8"
          secureTextEntry={isPassword && isHidden}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, mono && styles.inputMono, style]}
          {...inputProps}
        />
        {isPassword && (
          <Pressable
            hitSlop={8}
            onPress={() => setIsHidden((hidden) => !hidden)}
            accessibilityRole="button"
            accessibilityLabel={isHidden ? 'Show password' : 'Hide password'}
            style={({ pressed }) => [styles.trailingButton, pressed && styles.pressed]}>
            <Ionicons
              name={isHidden ? 'eye-outline' : 'eye-off-outline'}
              size={18}
              color="#64748B"
            />
          </Pressable>
        )}
      </View>

      {errorText ? (
        <Text style={styles.errorText}>{errorText}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  labelUppercase: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputWrapperFocused: {
    borderColor: '#0F172A',
  },
  inputWrapperError: {
    borderColor: '#DC2626',
  },
  leadingIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#0F172A',
  },
  inputMono: {
    fontFamily: MONO_FONT,
    fontSize: 14,
  },
  trailingButton: {
    marginLeft: 8,
    padding: 2,
  },
  pressed: {
    opacity: 0.6,
  },
  helperText: {
    fontFamily: MONO_FONT,
    fontSize: 11,
    color: '#64748B',
    marginTop: 8,
    lineHeight: 16,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
    marginTop: 6,
  },
});
