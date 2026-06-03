import type { Vulnerability } from "@/data/vulnerabilities";

const API_BASE = "/api/vulnerabilities";
// Leitura via arquivo estatico (funciona no Vercel, sem backend). As escritas
// continuam indo para API_BASE, que so existe localmente (server/api.mjs).
const STATIC_DATA_URL = "/custom-vulnerabilities.json";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message =
      payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
        ? payload.error
        : "Request failed";

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function fetchCustomVulnerabilities() {
  const response = await fetch(STATIC_DATA_URL, { cache: "no-cache" });
  return parseResponse<Vulnerability[]>(response);
}

export async function createCustomVulnerability(vulnerability: Vulnerability) {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vulnerability),
  });

  return parseResponse<Vulnerability>(response);
}

export async function deleteCustomVulnerability(id: string) {
  const response = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  return parseResponse<{ id: string }>(response);
}

export async function updateCustomVulnerability(vulnerability: Vulnerability) {
  const response = await fetch(`${API_BASE}/${encodeURIComponent(vulnerability.id)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vulnerability),
  });

  return parseResponse<Vulnerability>(response);
}
