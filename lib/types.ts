export interface Account {
  id: string;
  number: number;
  price: number;
  rank: string;
  description: string;
  imageUrl: string;
  sold: boolean;
  createdAt: string;
}

export interface Rank {
  id: string;
  name: string;
  tier: string;
  imageUrl: string;
}

export interface SiteSettings {
  siteName: string;
  logoText: string;
  logoSubtext: string;
  heroTitle: string;
  heroSubtitle: string;
  contactLine: string;
  contactDiscord: string;
}

export interface Database {
  accounts: Account[];
  settings: SiteSettings;
  ranks: Rank[];
}

export const RANK_COLORS: Record<string, string> = {
  iron: "#8D9399",
  bronze: "#C9874B",
  silver: "#B0BEC5",
  gold: "#E8B84B",
  platinum: "#4FC3C3",
  diamond: "#A78BFA",
  ascendant: "#4ADE80",
  immortal: "#F87171",
  radiant: "#FFD700",
  unranked: "#555555",
};
