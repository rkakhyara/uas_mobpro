import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, Redirect, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/context/AuthContext';

export const unstable_settings = {
  anchor: '/',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inAdminGroup = segments[0] === 'admin';
    const inUserGroup = segments[0] === 'user';

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/auth/login');
    } else if (user) {
      // Redirect based on role
      if (user.role === 'admin' && !inAdminGroup) {
        router.replace('/admin/surveys');
      } else if (user.role === 'responden' && !inUserGroup) {
        router.replace('/user/surveys');
      }
    }
  }, [user, loading, segments]);

  if (loading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        <Stack.Screen name="admin/surveys/index" options={{ headerShown: false }} />
        <Stack.Screen name="admin/surveys/create" options={{ title: 'Create Survey' }} />
        <Stack.Screen name="admin/surveys/[id]" options={{ title: 'Survey Details' }} />
        <Stack.Screen name="user/surveys/index" options={{ headerShown: false }} />
        <Stack.Screen name="user/surveys/[id]" options={{ title: 'Take Survey' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
