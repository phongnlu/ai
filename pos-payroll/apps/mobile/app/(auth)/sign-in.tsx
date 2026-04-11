import { View, StyleSheet, Alert } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { Text } from '@repo/ui';
import Constants from 'expo-constants';

GoogleSignin.configure({
  webClientId: Constants.expoConfig?.extra?.['googleWebClientId'],
});

export default function SignInScreen() {
  async function handleSignIn() {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      router.replace('/(tabs)/dashboard');
    } catch {
      Alert.alert('Sign in failed', 'Please try again.');
    }
  }

  return (
    <View style={styles.container}>
      <Text fontSize="$8" fontWeight="bold" marginBottom="$4">
        POS Payroll
      </Text>
      <Text fontSize="$4" color="$gray10" marginBottom="$8">
        California Employee Payroll
      </Text>
      <GoogleSigninButton onPress={handleSignIn} size={GoogleSigninButton.Size.Wide} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
