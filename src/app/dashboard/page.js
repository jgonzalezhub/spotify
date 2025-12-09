'use client';

import { useState } from 'react';
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
  const [playlistName, setPlaylistName] = useState("Mi playlist");
  const [loading, setLoading] = useState(false);

  // FAVORITOS
  const [favoriteIds, setFavoriteIds] = useState([]);

  // Últimas preferencias guardadas (para refrescar o añadir más canciones)
  const [lastPreferences, setLastPreferences] = useState(null);

  // GENERAR PLAYLIST
  const handleGeneratePlaylist = async () => {
    setLoading(true);
    const preferences = { artists, genres, decades, mood, popularity };

    try {
      const result = await generatePlaylist(preferences);

      if (!result || result.length === 0) {
        alert("No se han encontrado canciones con esos filtros.");
        return;
      }

      setPlaylist(result);
      setFavoriteIds([]);
      setLastPreferences(preferences);

    } catch (err) {
      console.error("Error generando playlist:", err);
    } finally {
      setLoading(false);
    }
  };

  // REFRESCAR PLAYLIST
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
        new Map([...playlist, ...more].map(t => [t.id, t])).values()
      );

      setPlaylist(unique);
    } finally {
      setLoading(false);
    }
  };

  // ELIMINAR UNA CANCIÓN
  const handleRemoveTrack = (trackId) => {
    setPlaylist(prev => prev.filter(t => t.id !== trackId));
    setFavoriteIds(prev => prev.filter(id => id !== trackId));
  };

  // FAVORITOS 
  const handleToggleFavorite = (track) => {
    setFavoriteIds(prev =>
      prev.includes(track.id)
        ? prev.filter(id => id !== track.id)
        : [...prev, track.id]
    );
  };

  // ORDENACIÓN
  const handleSort = (mode) => {
    setPlaylist(prev => {
      const sorted = [...prev];

      switch (mode) {
        case "title-asc":
          sorted.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "title-desc":
          sorted.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "artist-asc":
          sorted.sort((a, b) =>
            a.artists[0].name.localeCompare(b.artists[0].name)
          );
          break;
        case "artist-desc":
          sorted.sort((a, b) =>
            b.artists[0].name.localeCompare(a.artists[0].name)
          );
          break;
        case "random":
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

  // RESUMEN DE FILTROS
  const renderPreferencesSummary = () => {
    if (!lastPreferences) return null;

    const { artists, genres, decades, popularity, mood } = lastPreferences;

    return (
      <div className="mt-4 bg-gray-900 p-4 rounded">
        <h3 className="font-semibold mb-2">⚙️ Filtros usados:</h3>

        <p><strong>Artistas:</strong> {artists.length ? artists.map(a => a.name).join(", ") : "—"}</p>
        <p><strong>Géneros:</strong> {genres.length ? genres.join(", ") : "—"}</p>
        <p><strong>Décadas:</strong> {decades.length ? decades.join(", ") : "—"}</p>
        <p><strong>Popularidad:</strong> {popularity[0]} – {popularity[1]}</p>
        <p>
          <strong>Mood:</strong>{" "}
          {mood
            ? `Energía ${mood.energy}, Felicidad ${mood.valence}, Bailabilidad ${mood.danceability}, Acústico ${mood.acousticness}`
            : "—"}
        </p>
      </div>
    );
  };

  
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
        <button onClick={handleResetFilters} className="bg-gray-700 px-4 py-2 rounded">
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

      {/* Botón generar */}
      <div className="text-center mb-8">
        <button
          onClick={handleGeneratePlaylist}
          className="bg-green-500 hover:bg-green-600 px-10 py-3 rounded-full text-black font-bold text-lg"
        >
          {loading ? "Generando..." : "🎶 Generar Playlist"}
        </button>
      </div>

      {/* Mostrar playlist */}
      {playlist.length > 0 && (
        <>
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
          />

          {renderPreferencesSummary()}
        </>
      )}
    </div>
  );
}
