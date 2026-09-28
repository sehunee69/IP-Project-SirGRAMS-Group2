import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AuthTextField, MONO_FONT } from '@/components/sirgrams/AuthTextField';

export default function LoginScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    if (!identifier.trim() || !password) {
      setError('Enter your email or username and password.');
      return;
    }
    setError(null);
    // TODO: authenticate against the backend once the auth endpoint exists.
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            {/* Decorative corner accent */}
            <View style={styles.cornerAccent} />

            {/* Brand Block */}
            <View style={styles.brandBlock}>
              <View style={styles.logoTile}>
                <MaterialCommunityIcons name="finance" size={26} color="#FFFFFF" />
              </View>
              <Text style={styles.brandTitle}>SirGRAMS</Text>
              <Text style={styles.brandSubtitle}>Geospatial Risk Assessment System</Text>
            </View>

            {/* Form */}
            <AuthTextField
              label="Email Address or Username"
              uppercaseLabel
              icon="person-outline"
              placeholder="operator@sirgrams.gov"
              mono
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              autoComplete="username"
              textContentType="username"
              returnKeyType="next"
            />

            <AuthTextField
              label="Password"
              uppercaseLabel
              icon="lock-closed-outline"
              placeholder="••••••••"
              isPassword
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={handleLogin}
              labelAccessory={
                <Pressable hitSlop={8}>
                  {({ pressed }) => (
                    <Text style={[styles.forgotText, pressed && styles.pressed]}>
                      Forgot Password?
                    </Text>
                  )}
                </Pressable>
              }
            />

            {error && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color="#DC2626" />
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            )}

            <Pressable
              onPress={handleLogin}
              accessibilityRole="button"
              style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
              <Text style={styles.primaryButtonText}>Log In</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </Pressable>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <Text style={styles.switchPrompt}>Don&apos;t have an account?</Text>
              <Pressable hitSlop={8} onPress={() => router.push('/register')}>
                {({ pressed }) => (
                  <Text style={[styles.switchLink, pressed && styles.pressed]}>
                    Create an Account
                  </Text>
                )}
              </Pressable>
            </View>

            <View style={styles.secureRow}>
              <Ionicons name="shield-checkmark-outline" size={13} color="#64748B" />
              <Text style={styles.secureText}>END-TO-END ENCRYPTED CONNECTION</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cornerAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 64,
    height: 64,
    backgroundColor: '#E0E7FF',
    opacity: 0.6,
    borderBottomLeftRadius: 12,
  },
  brandBlock: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoTile: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#475569',
    marginTop: 6,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  pressed: {
    opacity: 0.6,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#991B1B',
  },
  primaryButton: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    marginTop: 4,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#CBD5E1',
    marginVertical: 24,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  switchPrompt: {
    fontSize: 13,
    color: '#475569',
  },
  switchLink: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
  },
  secureText: {
    fontFamily: MONO_FONT,
    fontSize: 11,
    color: '#64748B',
    letterSpacing: 0.4,
  },
});
