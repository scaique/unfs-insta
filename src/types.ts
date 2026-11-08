export type StringListItem = {
  href: string;
  value?: string;
  timestamp: number;
};

export type FollowingEntry = {
  title: string;
  string_list_data: StringListItem[];
};

export type FollowingFile = {
  relationships_following: FollowingEntry[];
};

export type FollowerEntry = {
  title?: string;
  media_list_data?: unknown[];
  string_list_data: StringListItem[];
};

export type FollowersFile = FollowerEntry[];

export type AnalysisResult = {
  /** usernames (sem @) que você segue mas não te seguem de volta */
  profiles: string[];
  /** quantidade de perfis deletados encontrados (ignorados da lista) */
  deletedCount: number;
  /** ISO string de quando a análise foi feita */
  analyzedAt: string;
  /** perfis que não estavam na análise anterior (vazio na primeira análise) */
  newProfiles?: string[];
  /** ISO da análise usada como base de comparação (ausente na primeira análise) */
  comparedWith?: string | null;
};

export type FileKind = 'following' | 'followers';