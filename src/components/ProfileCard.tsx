import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { profileUrl } from '@/lib/analyzer';

type Props = {
  username: string;
  actionLabel: string;
  onAction: (username: string) => void;
};

/** Card inteiro é um link para o perfil; o botão da direita faz a ação (whitelist/remover). */
export function ProfileCard({ username, actionLabel, onAction }: Props) {
  return (
    <Pressable style={styles.card} onPress={() => Linking.openURL(profileUrl(username))}>
      <Text style={styles.username} numberOfLines={1}>
        @{username}
      </Text>
      <Pressable style={styles.action} onPress={() => onAction(username)} hitSlop={8}>
        <Text style={styles.actionText}>{actionLabel}</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  username: { flex: 1, fontSize: 16, color: '#0645ad' },
  action: { marginLeft: 12, paddingVertical: 4, paddingHorizontal: 8, borderWidth: 1, borderColor: '#888', borderRadius: 4 },
  actionText: { fontSize: 13 },
});
