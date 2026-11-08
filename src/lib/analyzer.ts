import type { AnalysisResult, FollowersFile, FollowingFile } from '@/types';

/**
 * Contas deletadas aparecem no export do Instagram com usuário no formato "__deleted__<id>".
 */
const DELETED_PATTERN = /^__deleted__/i;

export const isDeletedUsername = (username: string) => DELETED_PATTERN.test(username);

function usernameFromHref(href: string): string {
  return href.replace(/\/+$/, '').split('/').pop() ?? '';
}

export function extractFollowing(file: FollowingFile): string[] {
  const users = new Set<string>();
  for (const entry of file.relationships_following) {
    const name = entry.title.trim() || usernameFromHref(entry.string_list_data[0].href);
    if (name) users.add(name);
  }
  return [...users];
}

export function extractFollowers(files: FollowersFile[]): Set<string> {
  const users = new Set<string>();
  for (const file of files) {
    for (const entry of file) {
      for (const item of entry.string_list_data) {
        const name = item.value || usernameFromHref(item.href);
        if (name) users.add(name.toLowerCase());
      }
    }
  }
  return users;
}

/**
 * Calcula quais perfis são "novos" em relação à análise anterior.
 * - Sem análise anterior: não há comparação (lista vazia).
 * - Se nada mudou entre as duas análises (ex.: mesmos arquivos reenviados), mantém
 *   a lista de novos anterior, para você não perdê-la por reanalisar.
 */
function computeNew(
  profiles: string[],
  previous: AnalysisResult | null,
): { newProfiles: string[]; comparedWith: string | null } {
  if (!previous) return { newProfiles: [], comparedWith: null };

  const prevSet = new Set(previous.profiles.map((p) => p.toLowerCase()));
  const currSet = new Set(profiles.map((p) => p.toLowerCase()));

  const added = profiles.filter((p) => !prevSet.has(p.toLowerCase()));
  const someRemoved = previous.profiles.some((p) => !currSet.has(p.toLowerCase()));

  if (added.length === 0 && !someRemoved) {
    const keep = new Set((previous.newProfiles ?? []).map((p) => p.toLowerCase()));
    return {
      newProfiles: profiles.filter((p) => keep.has(p.toLowerCase())),
      comparedWith: previous.comparedWith ?? null,
    };
  }

  return { newProfiles: added, comparedWith: previous.analyzedAt };
}

export function analyze(
  following: FollowingFile,
  followers: FollowersFile[],
  whitelist: string[],
  previous: AnalysisResult | null = null,
): AnalysisResult {
  const followingUsers = extractFollowing(following);
  const followerSet = extractFollowers(followers);
  const whitelistSet = new Set(whitelist.map((u) => u.toLowerCase()));

  let deletedCount = 0;
  const profiles: string[] = [];

  for (const user of followingUsers) {
    const lower = user.toLowerCase();
    if (followerSet.has(lower)) continue;

    if (isDeletedUsername(user)) {
      deletedCount += 1;
      continue;
    }
    if (whitelistSet.has(lower)) continue;

    profiles.push(user);
  }

  profiles.sort((a, b) => a.localeCompare(b));

  const { newProfiles, comparedWith } = computeNew(profiles, previous);

  return { profiles, deletedCount, analyzedAt: new Date().toISOString(), newProfiles, comparedWith };
}

export const profileUrl = (username: string) => `https://www.instagram.com/${username}`;