import { View, StyleSheet } from 'react-native';
import { Text } from '@repo/ui';

export default function EmployeesScreen() {
  return (
    <View style={styles.container}>
      <Text fontSize="$6" fontWeight="bold">Employees</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
