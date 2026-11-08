import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { loadResult, saveResult } from '@/lib/storage';
import type { AnalysisResult } from '@/types';

export function useAnalysisResult() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setResult(await loadResult());
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const removeProfile = useCallback(
    async (username: string) => {
      const current = await loadResult();
      if (!current) return;
      const keep = (p: string) => p.toLowerCase() !== username.toLowerCase();
      const next: AnalysisResult = {
        ...current,
        profiles: current.profiles.filter(keep),
        newProfiles: (current.newProfiles ?? []).filter(keep),
      };
      await saveResult(next);
      setResult(next);
    },
    [],
  );

  return { result, loading, reload, removeProfile };
}