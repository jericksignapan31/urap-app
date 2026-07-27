import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />

        <Text style={styles.title}>URAP</Text>
        <Text style={styles.subtitle}>
          University Research Announcement Platform
        </Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.registerText}>
            Don't have an account?{' '}
            <Text style={styles.registerLink}>Register</Text>
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
  },

  content: {
    paddingHorizontal: 30,
  },

  logo: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    marginBottom: 15,
    resizeMode: 'contain',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0B5ED7',
    textAlign: 'center',
  },

  subtitle: {
    textAlign: 'center',
    color: '#666',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 35,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },

  loginButton: {
    backgroundColor: '#0B5ED7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 5,
    elevation: 2,
  },

  loginText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 17,
  },

  registerText: {
    textAlign: 'center',
    marginTop: 25,
    color: '#666',
    fontSize: 15,
  },

  registerLink: {
    color: '#0B5ED7',
    fontWeight: 'bold',
  },
});