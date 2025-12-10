'use client';

import { useState, useEffect } from 'react';
import { generatePlaylist } from '@/lib/spotify';

// Widgets
import ArtistWidget from '@/components/widgets/ArtistWidget';
import GenreWidget from '@/components/widgets/GenreWidget';
import DecadeWidget from '@/components/widgets/DecadeWidget';
import MoodWidget from '@/components/widgets/MoodWidget';
import PopularityWidget from '@/components/widgets/PopularityWidget';

// Otros componentes
import PlaylistDisplay from '@/components/PlaylistDisplay';
import Header from '@/components/Header';

export default function DashboardPage() {
  // FILTROS
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [decades, setDecades] = useState([]);
  const [mood, setMood] = useState(null);
  const [popularity, setPopularity] = useState([0, 100]);

  // PLAYLIST
  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState('Mi playlist');
  const [loading, setLoading] = useState(false);

  // FAVORITOS (por id de track)
  const [favoriteIds, setFavoriteIds] = useState([]);

  // Últimas preferencias guardadas (para refrescar / añadir más)
  const [lastPreferences, setLastPreferences] = useState(null);

  // HISTORIAL DE PLAYLISTS 
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("playlist_history") || "[]");
      setHistory(data);
    } catch {
      setHistory([]);
    }
  }, []);

  // GENERAR PLAYLIST
  const handleGeneratePlaylist = async () => {
    setLoading(true);
    const preferences = { artists, genres, decades, mood, popularity };

    try {
      const result = await generatePlaylist(preferences);

      if (!result || result.length === 0) {
        alert('No se han encontrado canciones con esos filtros.');
        return;
      }

      setPlaylist(result);
      setFavoriteIds([]);
      setLastPreferences(preferences);

      // Añadir al historial
      const entry = {
        id:
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : String(Date.now()),
        name: playlistName,
        tracks: result,
        filters: preferences,
        createdAt: new Date().toISOString(),
      };

      // Actualizar estado y almacenamiento del historial
      const updatedHistory = [entry, ...history];
      setHistory(updatedHistory);
      if (typeof window !== 'undefined') {
        localStorage.setItem('playlist_history', JSON.stringify(updatedHistory));
      }
    } catch (err) {
      console.error('Error generando playlist:', err);
    } finally {
      setLoading(false);
    }
  };

  // REFRESCAR PLAYLIST CON LOS MISMOS FILTROS
  const handleRefreshPlaylist = async () => {
    if (!lastPreferences) return;
    setLoading(true);

    try {
      const result = await generatePlaylist(lastPreferences);
      setPlaylist(result);
    } finally {
      setLoading(false);
    }
  };

  // AÑADIR MÁS CANCIONES
  const handleAddMoreTracks = async () => {
    if (!lastPreferences) return;
    setLoading(true);

    try {
      const more = await generatePlaylist(lastPreferences);
      const unique = Array.from(
        new Map([...playlist, ...more].map((t) => [t.id, t])).values()
      );
      setPlaylist(unique);
    } finally {
      setLoading(false);
    }
  };

  // ELIMINAR UNA CANCIÓN
  const handleRemoveTrack = (trackId) => {
    setPlaylist((prev) => prev.filter((t) => t.id !== trackId));
    setFavoriteIds((prev) => prev.filter((id) => id !== trackId));
  };

  // FAVORITOS (toggle)
  const handleToggleFavorite = (track) => {
    setFavoriteIds((prev) =>
      prev.includes(track.id)
        ? prev.filter((id) => id !== track.id)
        : [...prev, track.id]
    );
  };

  // ORDENACIÓN
  const handleSort = (mode) => {
    setPlaylist((prev) => {
      const sorted = [...prev];

      switch (mode) {
        case 'title-asc':
          sorted.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'title-desc':
          sorted.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'artist-asc':
          sorted.sort((a, b) =>
            a.artists[0].name.localeCompare(b.artists[0].name)
          );
          break;
        case 'artist-desc':
          sorted.sort((a, b) =>
            b.artists[0].name.localeCompare(a.artists[0].name)
          );
          break;
        case 'random':
          sorted.sort(() => Math.random() - 0.5);
          break;
      }

      return sorted;
    });
  };

  // REINICIAR FILTROS
  const handleResetFilters = () => {
    setArtists([]);
    setGenres([]);
    setDecades([]);
    setMood(null);
    setPopularity([0, 100]);
  };

  // GUARDAR PLAYLIST EN "MIS PLAYLISTS"
  const handleSaveCurrentPlaylist = () => {
    if (!playlist.length) {
      alert('No hay canciones en la playlist para guardar.');
      return;
    }

    if (!lastPreferences) {
      alert('No se han encontrado filtros asociados a esta playlist.');
      return;
    }

    const stored = (() => {
      if (typeof window === 'undefined') return [];
      try {
        return JSON.parse(localStorage.getItem('saved_playlists') || '[]');
      } catch {
        return [];
      }
    })();

    const entry = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now()),
      name: playlistName,
      tracks: playlist,
      filters: lastPreferences,
      createdAt: new Date().toISOString(),
    };

    const updated = [entry, ...stored];

    if (typeof window !== 'undefined') {
      localStorage.setItem('saved_playlists', JSON.stringify(updated));
    }

    alert('✅ Playlist guardada en "Mis playlists".');
  };

  // GENERAR PLAYLIST SOLO CON FAVORITOS
  const handleGenerateFromFavorites = () => {
    if (!playlist.length || !favoriteIds.length) {
      alert('No hay canciones favoritas en la playlist actual.');
      return;
    }

    const favTracks = playlist.filter((t) => favoriteIds.includes(t.id));

    if (!favTracks.length) {
      alert('No se ha encontrado ninguna canción favorita válida.');
      return;
    }

    setPlaylist(favTracks);
    setPlaylistName((prev) => `${prev} (solo favoritas)`);
    // lastPreferences se mantiene; los filtros originales siguen siendo los mismos
  };

  // Vista rápida de últimas playlists del historial
  const latestHistory = history.slice(0, 3);

  // RENDER
  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-6">
      <Header />

      {/* Nombre Playlist + Reset */}
      <div className="flex justify-between mb-6">
        <input
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          className="bg-gray-800 p-2 rounded"
        />
        <button
          onClick={handleResetFilters}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          🔄 Reiniciar filtros
        </button>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
        <ArtistWidget selectedItems={artists} onSelect={setArtists} />
        <GenreWidget selectedItems={genres} onSelect={setGenres} />
        <DecadeWidget selectedItems={decades} onSelect={setDecades} />
        <MoodWidget mood={mood} onChange={setMood} />
        <PopularityWidget value={popularity} onChange={setPopularity} />
      </div>

      {/* Botones para generar */}
      <div className="text-center mb-8 flex flex-col items-center gap-4">
        <button
          onClick={handleGeneratePlaylist}
          className="bg-green-500 hover:bg-green-600 px-10 py-3 rounded-full text-black font-bold text-lg"
        >
          {loading ? 'Generando...' : '🎶 Generar Playlist'}
        </button>

        {playlist.length > 0 && favoriteIds.length > 0 && (
          <button
            onClick={handleGenerateFromFavorites}
            className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-full text-black font-semibold text-sm"
          >
            ⭐ Generar playlist solo con favoritas
          </button>
        )}
      </div>

      {/* Mostrar playlist */}
      {playlist.length > 0 && (
        <PlaylistDisplay
          tracks={playlist}
          playlistName={playlistName}
          onNameChange={setPlaylistName}
          favorites={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          onRemove={handleRemoveTrack}
          onSort={handleSort}
          onRefresh={handleRefreshPlaylist}
          onAddMore={handleAddMoreTracks}
          preferences={lastPreferences}
          onSave={handleSaveCurrentPlaylist}           // ⬅ Guardar playlist
          onGenerateFromFavorites={handleGenerateFromFavorites} // ⬅ botón extra dentro
        />
      )}

      {/* Vista rápida del historial */}
      {latestHistory.length > 0 && (
        <div className="mt-10 bg-gray-900 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold">📜 Últimas playlists generadas</h2>
            <a
              href="/history"
              className="text-sm text-blue-400 hover:underline"
            >
              Ver historial completo
            </a>
          </div>

          <ul className="space-y-2">
            {latestHistory.map((h) => (
              <li key={h.id} className="bg-gray-800 p-3 rounded">
                <p className="font-semibold">{h.name}</p>
                <p className="text-xs text-gray-400">
                  {new Date(h.createdAt).toLocaleString()} ·{' '}
                  {h.tracks.length} canciones
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
