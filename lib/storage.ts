import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AnalysisResult } from '@/types';

const RESULT_KEY = 'analysis_result';
const WHITELIST_KEY = 'whitelist';

export async function loadResult(): Promise<AnalysisResult | null> {
  const raw = await AsyncStorage.getItem(RESULT_KEY);
  return raw ? (JSON.parse(raw) as AnalysisResult) : null;
}

export async function saveResult(result: AnalysisResult): Promise<void> {
  await AsyncStorage.setItem(RESULT_KEY, JSON.stringify(result));
}

export async function loadWhitelist(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(WHITELIST_KEY);
  return raw ? (JSON.parse(raw) as string[]) : [];
}

export async function saveWhitelist(list: string[]): Promise<void> {
  await AsyncStorage.setItem(WHITELIST_KEY, JSON.stringify(list));
}
