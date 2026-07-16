import "server-only";

/** Only vehicle paths in the configured Vercel Blob public CDN may be deleted. */
export function isVercelBlobUrl(value: string) {
  try {
    const url = new URL(value);
    const storeId = process.env.BLOB_STORE_ID;
    const expectedHost = storeId ? `${storeId}.public.blob.vercel-storage.com` : null;
    return url.protocol === "https:" && url.pathname.startsWith("/vehicles/") && (expectedHost ? url.hostname === expectedHost : /^[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/i.test(url.hostname));
  } catch {
    return false;
  }
}
