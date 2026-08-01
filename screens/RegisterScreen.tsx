import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { createUserInFirestore } from '../services/userService';
import { useAlert } from '../context/AlertContext';
import { useUser } from '../context/UserContext';
import { User } from '../types';
import Colors from '../theme/colors';
import Fonts from '../theme/fonts';
import Spacing from '../theme/spacing';
import Radius from '../theme/radius';
import Shadows from '../theme/shadows';

export default function RegisterScreen({ navigation }: any) {
  const { showAlert } = useAlert();
  const { setAuthListenerPaused } = useUser();
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [clubName, setClubName] = useState('');
  const [urapPosition, setUrapPosition] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !clubName.trim() ||
      !urapPosition.trim() ||
      !password ||
      !confirmPassword
    ) {
      showAlert({ type: 'warning', title: 'Missing Fields', message: 'Please fill in all fields' });
      return;
    }

    if (password !== confirmPassword) {
      showAlert({ type: 'error', title: 'Password Mismatch', message: 'Passwords do not match' });
      return;
    }

    if (password.length < 6) {
      showAlert({
        type: 'error',
        title: 'Weak Password',
        message: 'Password must be at least 6 characters',
      });
      return;
    }

    setLoading(true);

    // While this screen owns the just-created account's auth session
    // (creating it, writing its profile, signing it back out), UserContext's
    // own auth listener must not also react to the same sign-in/out — it was
    // doing a concurrent read of the same not-yet-existing profile doc that
    // this screen was writing, and that race is the leading suspect for the
    // write hanging indefinitely.
    setAuthListenerPaused(true);

    try {
      console.log('[Register] 1/4 creating auth account...', new Date().toISOString());
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      console.log('[Register] 1/4 done, uid:', userCredential.user.uid, new Date().toISOString());

      const newUser: User = {
        id: userCredential.user.uid,
        name: name.trim(),
        nickname: nickname.trim(),
        email: email.trim(),
        role: 'user',
        verified: false,
        clubName: clubName.trim(),
        urapPosition: urapPosition.trim(),
        createdAt: new Date().toISOString(),
      };

      console.log('[Register] 2/4 writing profile to Firestore...', new Date().toISOString());
      await createUserInFirestore(newUser);
      console.log('[Register] 2/4 done', new Date().toISOString());

      console.log('[Register] 3/4 signing out the new (unverified) session...', new Date().toISOString());
      await auth.signOut();
      console.log('[Register] 3/4 done', new Date().toISOString());

      console.log('[Register] 4/4 showing success alert', new Date().toISOString());
      showAlert({
        type: 'success',
        title: 'Account Created',
        message: 'A superadmin needs to verify your account before you can log in.',
        buttons: [{ text: 'OK', onPress: () => navigation.navigate('Login') }],
      });
    } catch (err: any) {
      console.error('[Register] Registration error:', err, new Date().toISOString());
      if (err.code === 'auth/email-already-in-use') {
        showAlert({ type: 'error', title: 'Registration Failed', message: 'An account with this email already exists' });
      } else if (err.code === 'auth/invalid-email') {
        showAlert({ type: 'error', title: 'Registration Failed', message: 'Invalid email format' });
      } else if (err.code === 'auth/weak-password') {
        showAlert({ type: 'error', title: 'Registration Failed', message: 'Password is too weak' });
      } else {
        showAlert({
          type: 'error',
          title: 'Registration Failed',
          message: err.message || 'Please try again.',
        });
      }
    } finally {
      setAuthListenerPaused(false);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>URAP</Text>
            <Text style={styles.subtitle}>United Riders Alliance Philippines</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Create Account</Text>

          {/* Form */}
          <View style={styles.form}>
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.textSecondary}
                value={name}
                onChangeText={setName}
                editable={!loading}
                autoCapitalize="words"
              />
            </View>

            {/* Nickname Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nickname (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your nickname"
                placeholderTextColor={Colors.textSecondary}
                value={nickname}
                onChangeText={setNickname}
                editable={!loading}
                autoCapitalize="words"
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>

            {/* Club Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Club Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your riding club's name"
                placeholderTextColor={Colors.textSecondary}
                value={clubName}
                onChangeText={setClubName}
                editable={!loading}
                autoCapitalize="words"
              />
            </View>

            {/* URAP Position Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>URAP Position</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Admin, Member, President"
                placeholderTextColor={Colors.textSecondary}
                value={urapPosition}
                onChangeText={setUrapPosition}
                editable={!loading}
                autoCapitalize="words"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password (min 6 chars)"
                placeholderTextColor={Colors.textSecondary}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor={Colors.textSecondary}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
              />
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? 'Creating Account...' : 'Register'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View style={styles.loginLink}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logo: {
    ...Fonts.bold,
    fontSize: 36,
    color: Colors.primary,
    letterSpacing: 2,
  },
  subtitle: {
    ...Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  title: {
    ...Fonts.bold,
    fontSize: 24,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  form: {
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Fonts.semibold,
    color: Colors.text,
    fontSize: 13,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Fonts.regular,
    color: Colors.text,
    backgroundColor: Colors.white,
    ...Shadows.md,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
    ...Shadows.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    ...Fonts.bold,
    color: Colors.white,
    fontSize: 16,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    ...Fonts.regular,
    color: Colors.textSecondary,
    fontSize: 13,
  },
  loginButtonText: {
    ...Fonts.semibold,
    color: Colors.primary,
    fontSize: 13,
  },
});
