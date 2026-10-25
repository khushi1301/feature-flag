// In dev, Vite proxies /api to the Express server (see vite.config.js).
// In production, set VITE_API_URL to the deployed API origin.
const BASE = import.meta.env.VITE_API_URL ?? "";

export async function request(path, { method = "GET", body } = {}) {
  let res;
  try {
    res = await fetch(`${BASE}/api${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Can't reach the server. Is it running?");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    // A 5xx with no JSON body means nothing is answering behind the proxy.
    if (!data?.message && res.status >= 500) throw new Error("Can't reach the server. Is it running?");
    throw new Error(data?.message ?? `Request failed (${res.status})`);
  }
  return data;
}
