import { api } from "@/lib/api";

export function login(payload: { email: string; password: string }) {
  return api("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logout() {
    return api("/auth/logout", {
        method: "GET"
    })
}
