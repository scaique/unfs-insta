import type { FollowersFile, FollowingFile } from '@/types';

type Validation<T> = { ok: true; data: T } | { ok: false; error: string };

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

function isStringListItem(v: unknown, requireValue: boolean): boolean {
  if (!isObject(v)) return false;
  if (typeof v.href !== 'string' || !v.href.includes('instagram.com/')) return false;
  if (typeof v.timestamp !== 'number') return false;
  if (requireValue && typeof v.value !== 'string') return false;
  return true;
}

/**
 * Estrutura oficial do "following.json":
 * { relationships_following: [{ title, string_list_data: [{ href, timestamp }] }] }
 */
export function validateFollowing(raw: unknown): Validation<FollowingFile> {
  if (!isObject(raw) || !Array.isArray(raw.relationships_following)) {
    return {
      ok: false,
      error: 'Estrutura inválida: não encontrei "relationships_following". Esse não parece o arquivo following.json do Instagram.',
    };
  }

  for (const entry of raw.relationships_following) {
    if (
      !isObject(entry) ||
      typeof entry.title !== 'string' ||
      !Array.isArray(entry.string_list_data) ||
      entry.string_list_data.length === 0 ||
      !entry.string_list_data.every((i) => isStringListItem(i, false))
    ) {
      return {
        ok: false,
        error: 'Estrutura inválida: itens de "relationships_following" fora do padrão oficial do Instagram.',
      };
    }
  }

  return { ok: true, data: raw as unknown as FollowingFile };
}

/**
 * Estrutura oficial do "followers_1.json":
 * [{ title, media_list_data: [], string_list_data: [{ href, value, timestamp }] }]
 */
export function validateFollowers(raw: unknown): Validation<FollowersFile> {
  if (!Array.isArray(raw)) {
    return {
      ok: false,
      error: 'Estrutura inválida: o arquivo de seguidores deve ser uma lista. Esse não parece o followers_1.json do Instagram.',
    };
  }

  for (const entry of raw) {
    if (
      !isObject(entry) ||
      !Array.isArray(entry.string_list_data) ||
      entry.string_list_data.length === 0 ||
      !entry.string_list_data.every((i) => isStringListItem(i, true))
    ) {
      return {
        ok: false,
        error: 'Estrutura inválida: itens fora do padrão oficial do Instagram (string_list_data com href, value e timestamp).',
      };
    }
  }

  return { ok: true, data: raw as unknown as FollowersFile };
}
