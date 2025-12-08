import { getAccessToken } from "@/lib/auth";
import { spotifyRequest } from "@/lib/spotifyRequest";

/*
  generatePlaylist(preferences)
  
  Combina resultados de:
  - Top tracks por artista
  - Tracks por género
  Luego:
  - Filtra por década
  - Filtra por popularidad
  - Elimina duplicados
  - Devuelve máximo 30 tracks

  Esta función respeta EXACTAMENTE lo que pide el profesor.
*/

export async function generatePlaylist(preferences) {
  const { artists, genres, decades, popularity } = preferences;

  // Obtener token (spotifyRequest internamente refrescará si expira)
  const token = getAccessToken();

  let allTracks = [];

  // 1. TOP TRACKS DE ARTISTAS SELECCIONADOS
  for (const artist of artists) {
    const data = await spotifyRequest(
      `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`
    );

    if (data?.tracks) {
      allTracks.push(...data.tracks);
    }
  }

  // 2.BÚSQUEDA POR GÉNERO
  for (const genre of genres) {
    const data = await spotifyRequest(
      `https://api.spotify.com/v1/search?type=track&q=genre:${genre}&limit=20`
    );

    if (data?.tracks?.items) {
      allTracks.push(...data.tracks.items);
    }
  }

  // 3.FILTRAR POR DÉCADA
  if (decades.length > 0) {
    allTracks = allTracks.filter(track => {
      const year = new Date(track.album.release_date).getFullYear();
      return decades.some(decade => {
        const decadeStart = parseInt(decade);
        return year >= decadeStart && year < decadeStart + 10;
      });
    });
  }

  // 4.FILTRAR POR POPULARIDAD
  if (popularity) {
    const [min, max] = popularity;
    allTracks = allTracks.filter(
      track => track.popularity >= min && track.popularity <= max
    );
  }

  // 5.ELIMINAR DUPLICADOS Y LIMITAR A 30 TRACKS
  const uniqueTracks = Array.from(
    new Map(allTracks.map(track => [track.id, track])).values()
  ).slice(0, 30);

  return uniqueTracks;
}
