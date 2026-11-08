import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Não seguem de volta' }} />
      <Stack.Screen name="unfollowers" options={{ title: 'Não te seguem' }} />
      <Stack.Screen name="novos" options={{ title: 'Novos' }} />
      <Stack.Screen name="whitelist" options={{ title: 'Whitelist' }} />
    </Stack>
  );
}