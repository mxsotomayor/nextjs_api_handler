import db from "./db.js";
export async function cache(key, fetcherFn, ttlSeconds = 60) {
    const record = (await db.get(key));
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
export async function isCached(key) {
    const record = (await db.get(key));
    const now = Date.now();
    if (record && record.expires > now) {
        return record.data;
    }
    return null;
}
