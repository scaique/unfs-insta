import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { loadWhitelist, saveWhitelist } from '@/lib/storage';

export function useWhitelist() {
  const [whitelist, setWhitelist] = useState<string[]>([]);

  const reload = useCallback(async () => {
    setWhitelist(await loadWhitelist());
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const add = useCallback(async (username: string) => {
    const current = await loadWhitelist();
    const lower = username.toLowerCase();
    if (current.some((u) => u.toLowerCase() === lower)) return;
    const next = [...current, username].sort((a, b) => a.localeCompare(b));
    await saveWhitelist(next);
    setWhitelist(next);
  }, []);

  const remove = useCallback(async (username: string) => {
    const current = await loadWhitelist();
    const next = current.filter((u) => u.toLowerCase() !== username.toLowerCase());
    await saveWhitelist(next);
    setWhitelist(next);
  }, []);

  return { whitelist, add, remove };
}
