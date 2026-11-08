import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAnalysisResult } from '@/hooks/useAnalysisResult';
import { useJsonPicker } from '@/hooks/useJsonPicker';
import { analyze } from '@/lib/analyzer';
import { loadResult, loadWhitelist, saveResult } from '@/lib/storage';
import { validateFollowers, validateFollowing } from '@/lib/validators';

export default function HomeScreen() {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const { result: saved } = useAnalysisResult();

  const following = useJsonPicker(validateFollowing);
  const followers = useJsonPicker(validateFollowers, { multiple: true });

  const canAnalyze = following.isValid && followers.isValid && !running;

  async function handleAnalyze() {
    setRunning(true);
    try {
      const whitelist = await loadWhitelist();
      const previous = await loadResult();
      const result = analyze(
        following.files[0].data,
        followers.files.map((f) => f.data),
        whitelist,
        previous,
      );
      await saveResult(result);
      // Da segunda análise em diante, o que interessa primeiro são os novos.
      router.push(previous ? '/novos' : '/unfollowers');
    } finally {
      setRunning(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Quem não me segue de volta</Text>

      <View style={styles.block}>
        <Text style={styles.label}>1. Arquivo following.json</Text>
        <Button title="Escolher arquivo" onPress={following.pick} />
        {following.isValid && <Text style={styles.ok}>✔ {following.files[0].name} (estrutura válida)</Text>}
        {following.error && <Text style={styles.error}>{following.error}</Text>}
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>2. Arquivo followers_1.json</Text>
        <Button title="Escolher arquivo" onPress={followers.pick} />
        {followers.isValid && (
          <Text style={styles.ok}>✔ {followers.files.map((f) => f.name).join(', ')} (estrutura válida)</Text>
        )}
        {followers.error && <Text style={styles.error}>{followers.error}</Text>}
        <Text style={styles.hint}>Se o Instagram gerou followers_2.json etc., selecione todos juntos.</Text>
      </View>

      <View style={styles.block}>
        <Button title={running ? 'Analisando...' : 'Começar análise'} onPress={handleAnalyze} disabled={!canAnalyze} />
      </View>

      <View style={styles.block}>
        <Button
          title={saved ? `Quem não me segue (${saved.profiles.length})` : 'Quem não me segue'}
          onPress={() => router.push('/unfollowers')}
        />
      </View>
      <View style={styles.block}>
        <Button
          title={saved?.comparedWith ? `Novos que não me seguem (${(saved.newProfiles ?? []).length})` : 'Novos que não me seguem'}
          onPress={() => router.push('/novos')}
        />
      </View>
      <View style={styles.block}>
        <Button title="Whitelist" onPress={() => router.push('/whitelist')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  block: { width: '100%', maxWidth: 360, marginBottom: 20 },
  label: { marginBottom: 6, fontSize: 15 },
  ok: { marginTop: 6, color: 'green' },
  error: { marginTop: 6, color: 'crimson' },
  hint: { marginTop: 6, fontSize: 12, color: '#666' },
});