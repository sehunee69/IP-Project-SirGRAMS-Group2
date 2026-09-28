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

import { AuthTextField } from '@/components/sirgrams/AuthTextField';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

type FieldErrors = Partial<Record<'fullName' | 'email' | 'password' | 'confirmPassword', string>>;

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const isFilled =
    fullName.trim() !== '' && email.trim() !== '' && password !== '' && confirmPassword !== '';
  const canSubmit = isFilled && agreed;

  const handleSignUp = () => {
    const nextErrors: FieldErrors = {};
    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // TODO: submit to the backend registration endpoint once it exists.
    router.replace('/login');
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
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.brandRow}>
                <MaterialCommunityIcons name="finance" size={24} color="#0F172A" />
                <Text style={styles.brandTitle}>SirGRAMS</Text>
              </View>
              <Text style={styles.pageTitle}>Create Account</Text>
              <Text style={styles.pageSubtitle}>
                Enter your details to access the hazard monitoring platform.
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formBody}>
              <AuthTextField
                label="Full Name"
                icon="person-outline"
                placeholder="Dr. Jane Doe"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                errorText={errors.fullName}
              />

              <AuthTextField
                label="Institutional Email"
                icon="mail-outline"
                placeholder="jane.doe@institution.edu"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                helperText="Academic or professional email required."
                errorText={errors.email}
              />

              <AuthTextField
                label="Password"
                icon="lock-closed-outline"
                placeholder="••••••••"
                isPassword
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
                errorText={errors.password}
              />

              <AuthTextField
                label="Confirm Password"
                icon="lock-closed-outline"
                placeholder="••••••••"
                isPassword
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={canSubmit ? handleSignUp : undefined}
                errorText={errors.confirmPassword}
              />

              {/* Terms Agreement */}
              <Pressable
                onPress={() => setAgreed((value) => !value)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: agreed }}
                style={styles.termsRow}>
                <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                  {agreed && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </View>
                <Text style={styles.termsText}>
                  I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                  <Text style={styles.termsLink}>Data Privacy Policy</Text>.
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSignUp}
                disabled={!canSubmit}
                accessibilityRole="button"
                accessibilityState={{ disabled: !canSubmit }}
                style={({ pressed }) => [
                  styles.primaryButton,
                  !canSubmit && styles.primaryButtonDisabled,
                  pressed && styles.buttonPressed,
                ]}>
                <Text style={styles.primaryButtonText}>Sign Up</Text>
              </Pressable>
            </View>

            {/* Card Footer */}
            <View style={styles.cardFooter}>
              <Text style={styles.switchPrompt}>Already have an account?</Text>
              <Pressable
                hitSlop={8}
                onPress={() => (router.canGoBack() ? router.back() : router.replace('/login'))}>
                {({ pressed }) => (
                  <Text style={[styles.switchLink, pressed && styles.pressed]}>Log In</Text>
                )}
              </Pressable>
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
    paddingVertical: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  pageTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#475569',
    marginTop: 8,
    lineHeight: 19,
  },
  formBody: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 4,
    marginBottom: 24,
  },
  checkbox: {
    width: 18,
    height: 18,
    marginTop: 1,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#475569',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  termsLink: {
    fontWeight: '600',
    color: '#0F172A',
  },
  primaryButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 8,
  },
  primaryButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#F1F5F9',
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
  pressed: {
    opacity: 0.6,
  },
});
