import { Redis } from "@upstash/redis";
import { Database } from "./types";

const DB_KEY = "valoshop:db";

const DEFAULT_DB: Database = {
  accounts: [],
  settings: {
    siteName: "VALO STORE",
    logoText: "VALO",
    logoSubtext: "STORE",
    heroTitle: "VALORANT ACCOUNT SHOP",
    heroSubtitle: "บัญชีคุณภาพ ราคาสมเหตุสมผล รับประกันทุกออเดอร์",
    contactLine: "@valoshop",
    contactDiscord: "valoshop#0001",
  },
  ranks: [
    { id: "iron-1", name: "Iron 1", tier: "iron", imageUrl: "/ranks/iron-1.png" },
    { id: "iron-2", name: "Iron 2", tier: "iron", imageUrl: "/ranks/iron-2.png" },
    { id: "iron-3", name: "Iron 3", tier: "iron", imageUrl: "/ranks/iron-3.png" },
    { id: "bronze-1", name: "Bronze 1", tier: "bronze", imageUrl: "/ranks/bronze-1.png" },
    { id: "bronze-2", name: "Bronze 2", tier: "bronze", imageUrl: "/ranks/bronze-2.png" },
    { id: "bronze-3", name: "Bronze 3", tier: "bronze", imageUrl: "/ranks/bronze-3.png" },
    { id: "silver-1", name: "Silver 1", tier: "silver", imageUrl: "/ranks/silver-1.png" },
    { id: "silver-2", name: "Silver 2", tier: "silver", imageUrl: "/ranks/silver-2.png" },
    { id: "silver-3", name: "Silver 3", tier: "silver", imageUrl: "/ranks/silver-3.png" },
    { id: "gold-1", name: "Gold 1", tier: "gold", imageUrl: "/ranks/gold-1.png" },
    { id: "gold-2", name: "Gold 2", tier: "gold", imageUrl: "/ranks/gold-2.png" },
    { id: "gold-3", name: "Gold 3", tier: "gold", imageUrl: "/ranks/gold-3.png" },
    { id: "platinum-1", name: "Platinum 1", tier: "platinum", imageUrl: "/ranks/platinum-1.png" },
    { id: "platinum-2", name: "Platinum 2", tier: "platinum", imageUrl: "/ranks/platinum-2.png" },
    { id: "platinum-3", name: "Platinum 3", tier: "platinum", imageUrl: "/ranks/platinum-3.png" },
    { id: "diamond-1", name: "Diamond 1", tier: "diamond", imageUrl: "/ranks/diamond-1.png" },
    { id: "diamond-2", name: "Diamond 2", tier: "diamond", imageUrl: "/ranks/diamond-2.png" },
    { id: "diamond-3", name: "Diamond 3", tier: "diamond", imageUrl: "/ranks/diamond-3.png" },
    { id: "ascendant-1", name: "Ascendant 1", tier: "ascendant", imageUrl: "/ranks/ascendant-1.png" },
    { id: "ascendant-2", name: "Ascendant 2", tier: "ascendant", imageUrl: "/ranks/ascendant-2.png" },
    { id: "ascendant-3", name: "Ascendant 3", tier: "ascendant", imageUrl: "/ranks/ascendant-3.png" },
    { id: "immortal-1", name: "Immortal 1", tier: "immortal", imageUrl: "/ranks/immortal-1.png" },
    { id: "immortal-2", name: "Immortal 2", tier: "immortal", imageUrl: "/ranks/immortal-2.png" },
    { id: "immortal-3", name: "Immortal 3", tier: "immortal", imageUrl: "/ranks/immortal-3.png" },
    { id: "radiant", name: "Radiant", tier: "radiant", imageUrl: "/ranks/radiant.png" },
    { id: "unranked", name: "Unranked", tier: "unranked", imageUrl: "/ranks/unranked.png" },
  ],
};

let redisClient: Redis | null = null;
let redisInitError: Error | null = null;

function getRedis(): Redis {
  if (redisClient) return redisClient;
  if (redisInitError) throw redisInitError;
  try {
    // Works with Vercel Marketplace "Upstash Redis" integration env vars:
    // KV_REST_API_URL / KV_REST_API_TOKEN (legacy naming kept by the integration)
    // or UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
    const url =
      process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token =
      process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      throw new Error(
        "Missing Redis credentials. Set KV_REST_API_URL and KV_REST_API_TOKEN " +
          "(or UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN) in your environment."
      );
    }

    redisClient = new Redis({ url, token });
    return redisClient;
  } catch (err) {
    redisInitError = err as Error;
    throw redisInitError;
  }
}

/**
 * In-memory fallback used only for local development when no Redis
 * credentials are configured, so `npm run dev` keeps working out of the box.
 */
let localFallback: Database | null = null;

function hasRedisConfig(): boolean {
  return Boolean(
    (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) &&
      (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN)
  );
}

export async function readDB(): Promise<Database> {
  if (!hasRedisConfig()) {
    if (!localFallback) {
      localFallback = JSON.parse(JSON.stringify(DEFAULT_DB));
    }
    return localFallback as Database;
  }

  const redis = getRedis();
  const data = await redis.get<Database>(DB_KEY);

  if (!data) {
    await writeDB(DEFAULT_DB);
    return JSON.parse(JSON.stringify(DEFAULT_DB));
  }

  return data;
}

export async function writeDB(data: Database): Promise<void> {
  if (!hasRedisConfig()) {
    localFallback = data;
    return;
  }

  const redis = getRedis();
  await redis.set(DB_KEY, data);
}
