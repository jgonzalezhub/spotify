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

  // ESTADO GLOBAL DEL DASHBOARD
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [decades, setDecades] = useState([]);
  const [mood, setMood] = useState(null);
  const [popularity, setPopularity] = useState([0, 100]);

  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(false);

  // HISTORIAL — Inicializa vacío ✔ Evita Hydration error
  const [history, setHistory] = useState([]);

  // Cargar historial desde localStorage SOLO en cliente
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("playlist_history") || "[]");
    setHistory(stored);
  }, []);

  // GUARDAR NUEVA PLAYLIST EN EL HISTORIAL
  const saveToHistory = (tracks) => {
    const newEntry = {
      id: crypto.randomUUID(),  // ID único ✔
      date: new Date().toLocaleString(),
      tracks,
    };

    const newHistory = [newEntry, ...history];

    setHistory(newHistory);
    localStorage.setItem("playlist_history", JSON.stringify(newHistory));
  };

  // GENERAR PLAYLIST PRINCIPAL
  const handleGeneratePlaylist = async () => {
    setLoading(true);

    const preferences = { artists, genres, decades, mood, popularity };

    try {
      const result = await generatePlaylist(preferences);
      setPlaylist(result);

      // Guardar en historial
      saveToHistory(result);

    } catch (error) {
      console.error("Error generando playlist:", error);
    } finally {
      setLoading(false);
    }
  };

  // GESTIÓN DE PLAYLIST

  // 1. Eliminar canción
  const removeTrack = (trackId) => {
    setPlaylist(prev => prev.filter(track => track.id !== trackId));
  };

  // 2. Favoritos ⭐
  const toggleFavorite = (track) => {
    const favorites = JSON.parse(localStorage.getItem("favorite_tracks") || "[]");
    const exists = favorites.some(f => f.id === track.id);

    const updated = exists
      ? favorites.filter(f => f.id !== track.id)
      : [...favorites, track];

    localStorage.setItem("favorite_tracks", JSON.stringify(updated));
  };

  // 3. Refrescar playlist
  const refreshPlaylist = async () => {
    setLoading(true);
    try {
      const result = await generatePlaylist({
        artists, genres, decades, mood, popularity
      });
      setPlaylist(result);
    } finally {
      setLoading(false);
    }
  };

  // 4. Añadir más canciones
  const addMoreTracks = async () => {
    setLoading(true);
    try {
      const more = await generatePlaylist({
        artists, genres, decades, mood, popularity
      });

      // evitar duplicados
      const unique = Array.from(
        new Map([...playlist, ...more].map(t => [t.id, t])).values()
      );

      setPlaylist(unique);
    } finally {
      setLoading(false);
    }
  };


  // RENDER
  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-6">

      {/* CABECERA SUPERIOR */}
      <Header />

      {/* TÍTULO */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold">🎧 Spotify Taste Mixer</h1>
        <p className="text-gray-300 mt-2">
          Ajusta tus preferencias y genera una playlist personalizada basada en tu estilo musical.
        </p>
      </div>

      {/* GRID DE WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        <ArtistWidget selectedItems={artists} onSelect={setArtists} />
        <GenreWidget selectedItems={genres} onSelect={setGenres} />
        <DecadeWidget selectedItems={decades} onSelect={setDecades} />
        <MoodWidget mood={mood} onChange={setMood} />
        <PopularityWidget value={popularity} onChange={setPopularity} />
      </div>

      {/* BOTÓN DE GENERACIÓN */}
      <div className="text-center mb-12">
        <button
          onClick={handleGeneratePlaylist}
          className="bg-green-500 hover:bg-green-600 px-10 py-3 rounded-full text-black font-bold text-lg shadow-lg transition-transform hover:scale-105"
        >
          {loading ? "Generando Playlist..." : "🎶 Generar Playlist"}
        </button>
      </div>

      {/* PLAYLIST RESULTANTE */}
      {playlist.length > 0 && (
        <PlaylistDisplay
          tracks={playlist}
          onRemove={removeTrack}
          onFavorite={toggleFavorite}
          onRefresh={refreshPlaylist}
          onAddMore={addMoreTracks}
        />
      )}

      {playlist.length === 0 && !loading && (
        <p className="text-center text-gray-400 text-lg">
          No has generado ninguna playlist todavía. Ajusta los widgets y pulsa el botón.
        </p>
      )}

      {/* HISTORIAL */}
      {history.length > 0 && (
        <div className="mt-12 bg-gray-900 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-3">📜 Historial de Playlists</h2>

          <ul className="space-y-2">
            {history.map((item, index) => (
              <li
                key={item.id || index}   // ✔ evita error de keys
                className="p-2 bg-gray-800 rounded"
              >
                <p className="text-sm text-gray-400">{item.date}</p>
                <p>{item.tracks.length} canciones</p>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
