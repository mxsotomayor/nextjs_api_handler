import db from "./db";

export type Cached<T> = {
  data: T;
  expires: number;
};

export async function cache<T>(
  key: string,
  fetcherFn: () => Promise<T>,
  ttlSeconds = 60
): Promise<T> {
  const record = (await db.get(key)) as Cached<T>;

  const now = Date.now();

  if (record && record.expires > now) { 
    return record.data;
  }

  const data = await fetcherFn(); 

  await db.put(key, {
    data,
    expires: now + ttlSeconds * 1000,
  });

  return data;
}
