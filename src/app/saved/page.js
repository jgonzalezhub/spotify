/*
MIS PLAYLISTS GUARDADAS
- Muestra una lista de playlists guardadas por el usuario
- Permite renombrar, eliminar y vaciar todas las playlists guardadas
- Permite ver detalles de cada playlist, eliminar canciones y marcarlas como favoritas

No se ha generado en el dashboard, sino en una nueva página "Mis Playlists" accesible desde el header por la ssiguiente razón: 

Motivos:
- Separación clara entre generación y gestión de playlists
- Mejor experiencia de usuario al evitar sobrecargar el dashboard
- Facilita la navegación y acceso rápido a las playlists guardadas

Ventajas:
- Organización: Mantiene el dashboard enfocado en la generación de playlists.
- Usabilidad: Los usuarios pueden gestionar sus playlists guardadas sin distracciones.
- Escalabilidad: Permite añadir más funcionalidades de gestión en el futuro sin complicar el dashboard.

*/


'use client';

import { useEffect, useState } from 'react';
import TrackCard from '@/components/TrackCard';
import Header from '@/components/Header';

export default function SavedPlaylistsPage() {
  const [saved, setSaved] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [sortMode, setSortMode] = useState('');

  // Cargar playlists guardadas
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('saved_playlists') || '[]');
      setSaved(data);
      if (data.length > 0) setSelectedId(data[0].id);
    } catch {
      setSaved([]);
    }
  }, []);

  const updateStorage = (updated) => {
    setSaved(updated);
    localStorage.setItem('saved_playlists', JSON.stringify(updated));
  };

  const selected = saved.find((p) => p.id === selectedId) || null;

  // Cambiar nombre
  const handleNameChange = (id, newName) => {
    const updated = saved.map((p) =>
      p.id === id ? { ...p, name: newName } : p
    );
    updateStorage(updated);
  };

  // Eliminar playlist guardada
  const handleDeletePlaylist = (id) => {
    const updated = saved.filter((p) => p.id !== id);
    updateStorage(updated);

    if (selectedId === id) {
      setSelectedId(updated[0]?.id || null);
      setFavoriteIds([]);
    }
  };

  // Vaciar todo
  const handleClearAll = () => {
    updateStorage([]);
    setSelectedId(null);
    setFavoriteIds([]);
  };

  // Eliminar canción
  const handleRemoveTrack = (trackId) => {
    if (!selected) return;

    const updated = saved.map((p) =>
      p.id === selected.id
        ? { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) }
        : p
    );

    updateStorage(updated);
  };

  // Favoritos
  const handleToggleFavorite = (track) => {
    setFavoriteIds((prev) =>
      prev.includes(track.id)
        ? prev.filter((id) => id !== track.id)
        : [...prev, track.id]
    );
  };

  // Ordenar canciones
  const getSortedTracks = () => {
    if (!selected) return [];
    const tracks = [...selected.tracks];

    switch (sortMode) {
      case 'title-asc':
        return tracks.sort((a, b) => a.name.localeCompare(b.name));
      case 'title-desc':
        return tracks.sort((a, b) => b.name.localeCompare(a.name));
      case 'artist-asc':
        return tracks.sort((a, b) =>
          a.artists[0].name.localeCompare(b.artists[0].name)
        );
      case 'artist-desc':
        return tracks.sort((a, b) =>
          b.artists[0].name.localeCompare(a.artists[0].name)
        );
      default:
        return tracks;
    }
  };

  const renderFilters = (filters) => {
    if (!filters) return null;
    const { artists, genres, decades, popularity, mood } = filters;

    return (
      <div className="mt-3 bg-gray-800 p-3 rounded text-sm">
        <p><strong>Artistas:</strong> {artists.length ? artists.map(a => a.name).join(', ') : '—'}</p>
        <p><strong>Géneros:</strong> {genres.length ? genres.join(', ') : '—'}</p>
        <p><strong>Décadas:</strong> {decades.length ? decades.join(', ') : '—'}</p>
        <p><strong>Popularidad:</strong> {popularity[0]} – {popularity[1]}</p>
        <p>
          <strong>Mood:</strong>{' '}
          {mood
            ? `Energía ${mood.energy}, Felicidad ${mood.valence}, Bailabilidad ${mood.danceability}, Acústico ${mood.acousticness}`
            : '—'}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-6">
      <Header />

      <h1 className="text-3xl font-bold mb-4">🎵 Mis Playlists Guardadas</h1>

      {saved.length === 0 && (
        <p className="text-gray-300">
          No tienes playlists guardadas. Ve al dashboard y pulsa “💾 Guardar playlist”.
        </p>
      )}

      {saved.length > 0 && (
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* LISTA DE PLAYLISTS */}
          <div className="md:w-1/3 bg-gray-900 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">Playlists</h2>
              <button
                onClick={handleClearAll}
                className="text-xs bg-red-700 hover:bg-red-800 px-3 py-1 rounded"
              >
                Vaciar todo
              </button>
            </div>

            <ul className="space-y-3">
              {saved.map((p) => (
                <li
                  key={p.id}
                  className={`p-3 rounded cursor-pointer ${
                    p.id === selectedId ? 'bg-gray-700' : 'bg-gray-800'
                  }`}
                  onClick={() => setSelectedId(p.id)}
                >
                  <input
                    value={p.name}
                    onChange={(e) => handleNameChange(p.id, e.target.value)}
                    className="bg-transparent border-b border-gray-500 w-full mb-1 text-sm"
                  />
                  <p className="text-xs text-gray-400">
                    {new Date(p.createdAt).toLocaleString()} · {p.tracks.length} canciones
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePlaylist(p.id);
                    }}
                    className="mt-2 text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* DETALLE DE PLAYLIST */}
          <div className="md:w-2/3 bg-gray-900 p-4 rounded-lg">
            {!selected ? (
              <p className="text-gray-300">Selecciona una playlist.</p>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">{selected.name}</h2>
                <p className="text-sm text-gray-400 mb-2">
                  {selected.tracks.length} canciones
                </p>

                {renderFilters(selected.filters)}

                <div className="flex items-center gap-3 mt-4 mb-4">
                  <span className="text-sm text-gray-300">Ordenar:</span>
                  <select
                    value={sortMode}
                    onChange={(e) => setSortMode(e.target.value)}
                    className="bg-gray-800 px-3 py-2 rounded text-white text-sm"
                  >
                    <option value="">Sin orden</option>
                    <option value="title-asc">Título A–Z</option>
                    <option value="title-desc">Título Z–A</option>
                    <option value="artist-asc">Artista A–Z</option>
                    <option value="artist-desc">Artista Z–A</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {getSortedTracks().map((track) => (
                    <div key={track.id} className="relative">
                      <TrackCard
                        track={track}
                        isFavorite={favoriteIds.includes(track.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                      <button
                        onClick={() => handleRemoveTrack(track.id)}
                        className="absolute right-3 bottom-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
