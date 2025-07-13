// src/lib/api.js
const BASE = process.env.REACT_APP_API || "http://localhost:8000";

export async function apiGet(path) {
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost(path) {
  // 🚫  NO custom headers
  // 🚫  NO JSON body
  const res = await fetch(BASE + path, { method: "POST" });
  if (!res.ok) throw new Error(await res.text());
  // if /scrape returns no JSON, just return void
  return res.headers.get("content-type")?.includes("application/json")
    ? res.json()
    : undefined;
}
