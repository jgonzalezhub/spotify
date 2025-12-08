import { getAccessToken, refreshAccessToken } from "@/lib/auth";

export async function spotifyRequest(url) {
  let token = getAccessToken();

  if (!token) {
    token = await refreshAccessToken();
    if (!token) {
      window.location.href = "/";
      return;
    }
  }

  let response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  // Si el token expiró →
  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      window.location.href = "/";
      return;
    }

    response = await fetch(url, {
      headers: { Authorization: `Bearer ${newToken}` }
    });
  }

  if (!response.ok) {
    throw new Error(`Spotify API Error ${response.status}`);
  }

  return response.json();
}
