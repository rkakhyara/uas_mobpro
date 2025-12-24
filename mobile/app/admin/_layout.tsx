import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="surveys/index" />
      <Stack.Screen name="surveys/create" options={{ headerShown: true, title: 'Create Survey' }} />
      <Stack.Screen name="surveys/[id]" options={{ headerShown: true, title: 'Survey Details' }} />
    </Stack>
  );
}
