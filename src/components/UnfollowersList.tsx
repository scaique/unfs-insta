import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ProfileCard } from '@/components/ProfileCard';
import { useAnalysisResult } from '@/hooks/useAnalysisResult';
import { useWhitelist } from '@/hooks/useWhitelist';

type Props = {
  /** "all" = todos que não seguem de volta; "new" = só os novos desde a análise anterior */
  mode: 'all' | 'new';
};

const formatDate = (iso: string) => new Date(iso).toLocaleString('pt-BR');

export function UnfollowersList({ mode }: Props) {
  const { result, loading, removeProfile } = useAnalysisResult();
  const { add } = useWhitelist();

  async function handleWhitelist(username: string) {
    await add(username);
    await removeProfile(username);
  }

  if (loading) return null;

  if (!result) {
    return (
      <View style={styles.center}>
        <Text>Nenhuma análise salva ainda. Volte e envie os dois arquivos.</Text>
      </View>
    );
  }

  const isNew = mode === 'new';
  const data = isNew ? (result.newProfiles ?? []) : result.profiles;
  const hasComparison = Boolean(result.comparedWith);

  // Na página de novos, sem análise anterior não há o que comparar.
  if (isNew && !hasComparison) {
    return (
      <View style={styles.center}>
        <Text style={styles.count}>Ainda não há comparação</Text>
        <Text style={styles.hint}>
          Esta foi a primeira análise. Faça outra análise depois, com arquivos mais recentes, para ver os
          novos perfis que não te seguem de volta.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={data}
      keyExtractor={(item) => item}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.count}>
            {isNew
              ? `${data.length} novos perfis não te seguem de volta`
              : `${data.length} perfis não te seguem de volta`}
          </Text>
          {isNew && result.comparedWith && (
            <Text style={styles.date}>Novos desde a análise de {formatDate(result.comparedWith)}</Text>
          )}
          <Text style={styles.date}>Última análise: {formatDate(result.analyzedAt)}</Text>
          {!isNew && result.deletedCount > 0 && (
            <Text style={styles.warning}>
              Foram encontrados {result.deletedCount} perfis deletados (não aparecem na lista).
            </Text>
          )}
        </View>
      }
      ListEmptyComponent={
        <Text style={styles.empty}>
          {isNew ? 'Nenhum perfil novo desde a análise anterior.' : 'Todo mundo que você segue te segue de volta. 🎉'}
        </Text>
      }
      renderItem={({ item }) => <ProfileCard username={item} actionLabel="Whitelist" onAction={handleWhitelist} />}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  list: { padding: 16 },
  header: { alignItems: 'center', marginBottom: 16 },
  count: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  date: { fontSize: 12, color: '#666', marginTop: 4, textAlign: 'center' },
  hint: { marginTop: 8, textAlign: 'center', color: '#444' },
  warning: { marginTop: 10, color: '#a05a00', textAlign: 'center' },
  empty: { textAlign: 'center', marginTop: 24 },
});