const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include", // for JWT cookies
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
  const errorData = await res.json().catch(() => null);
  const message = errorData?.message || res.statusText || "Unknown error";
  throw new Error(message);
}

  return res.json();
}
