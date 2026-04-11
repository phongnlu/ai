import { View, StyleSheet } from 'react-native';
import { Text } from '@repo/ui';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text fontSize="$6" fontWeight="bold">Dashboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
