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
  // ESTADO GLOBAL DEL DASHBOARD
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [decades, setDecades] = useState([]);
  const [mood, setMood] = useState(null);
  const [popularity, setPopularity] = useState([0, 100]);

  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(false);

 
  // GENERAR PLAYLIST
  const handleGeneratePlaylist = async () => {
    setLoading(true);

    const preferences = {
      artists,
      genres,
      decades,
      mood,
      popularity,
    };

    try {
      const result = await generatePlaylist(preferences);
      setPlaylist(result);
    } catch (err) {
      console.error("Error generando playlist:", err);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Cada widget controla una parte de las preferencias */}
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
          {loading ? 'Generando Playlist...' : '🎶 Generar Playlist'}
        </button>
      </div>

      {/* PLAYLIST RESULTANTE */}
      {playlist.length > 0 && (
        <PlaylistDisplay tracks={playlist} />
      )}

      {playlist.length === 0 && !loading && (
        <p className="text-center text-gray-400 text-lg">
          No has generado ninguna playlist todavía. Ajusta los widgets y pulsa el botón.
        </p>
      )}

    </div>
  );
}
