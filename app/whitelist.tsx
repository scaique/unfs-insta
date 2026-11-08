import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ProfileCard } from '@/components/ProfileCard';
import { useWhitelist } from '@/hooks/useWhitelist';

export default function WhitelistScreen() {
  const { whitelist, remove } = useWhitelist();

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={whitelist}
      keyExtractor={(item) => item}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.count}>{whitelist.length} perfis na whitelist</Text>
          <Text style={styles.hint}>Esses perfis não aparecem nas próximas análises.</Text>
        </View>
      }
      ListEmptyComponent={<Text style={styles.empty}>Whitelist vazia.</Text>}
      renderItem={({ item }) => <ProfileCard username={item} actionLabel="Remover" onAction={remove} />}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  header: { alignItems: 'center', marginBottom: 16 },
  count: { fontSize: 18, fontWeight: 'bold' },
  hint: { fontSize: 12, color: '#666', marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 24 },
});
