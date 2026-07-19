import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "mangowatch:cache:";

export async function saveCache<T>(key: string, data: T): Promise<void> {
  await AsyncStorage.setItem(PREFIX + key, JSON.stringify({ data, cachedAt: Date.now() }));
}

export async function loadCache<T>(key: string): Promise<{ data: T; cachedAt: number } | null> {
  const raw = await AsyncStorage.getItem(PREFIX + key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Execute une requete reseau et met le resultat en cache. Si la requete
 * echoue (hors-ligne), retourne la derniere version en cache avec un
 * indicateur `fromCache`.
 */
export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<{ data: T; fromCache: boolean }> {
  try {
    const data = await fetcher();
    await saveCache(key, data);
    return { data, fromCache: false };
  } catch (error) {
    const cached = await loadCache<T>(key);
    if (cached) {
      return { data: cached.data, fromCache: true };
    }
    throw error;
  }
}
