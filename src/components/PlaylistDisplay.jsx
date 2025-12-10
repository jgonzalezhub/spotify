/*
// PLAYLIST DISPLAY
    - Muestra la lista de canciones generadas
    - Permite eliminar canciones
    - Permite marcar favoritos 
    - Botón para refrescar playlist
    - Botón para añadir más canciones
    - Botón compartir playlist
    - Exportar JSON / CSV
    -Compartir links (copiar al portapapeles)
    - Ordenar canciones
    - Editar nombre de la playlist
    
*/


'use client';

import { useState } from 'react';
import TrackCard from './TrackCard';

export default function PlaylistDisplay({
  tracks,
  playlistName,
  onNameChange,
  favorites = [],
  onToggleFavorite,
  onRemove,
  onSort,
  onRefresh,
  onAddMore,
  preferences,
  onSave,                 // ⬅ NUEVO
  onGenerateFromFavorites // ⬅ NUEVO
}) {
  const [copied, setCopied] = useState(false);

  // FILTROS USADOS
  const renderPreferencesSummary = () => {
    if (!preferences) return null;

    const { artists, genres, decades, popularity, mood } = preferences;

    return (
      <div className="mb-6 bg-gray-800 p-4 rounded">
        <h3 className="font-semibold mb-2">⚙️ Filtros usados:</h3>

        <p>
          <strong>Artistas:</strong>{' '}
          {artists.length ? artists.map((a) => a.name).join(', ') : '—'}
        </p>
        <p>
          <strong>Géneros:</strong>{' '}
          {genres.length ? genres.join(', ') : '—'}
        </p>
        <p>
          <strong>Décadas:</strong>{' '}
          {decades.length ? decades.join(', ') : '—'}
        </p>
        <p>
          <strong>Popularidad:</strong> {popularity[0]} – {popularity[1]}
        </p>

        <p>
          <strong>Mood:</strong>{' '}
          {mood
            ? `Energía ${mood.energy}, Felicidad ${mood.valence}, Bailabilidad ${mood.danceability}, Acústico ${mood.acousticness}`
            : '—'}
        </p>
      </div>
    );
  };

  // COPIAR LINKS
  const handleCopyLinks = () => {
    navigator.clipboard.writeText(
      tracks
        .map((t) => t?.external_urls?.spotify)
        .filter(Boolean)
        .join('\n')
    );

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-xl">

      {/* Nombre Playlist */}
      <input
        className="w-full bg-gray-800 p-2 rounded mb-4 text-xl font-bold"
        value={playlistName}
        onChange={(e) => onNameChange(e.target.value)}
      />

      {/* Filtros usados */}
      {renderPreferencesSummary()}

      {/* Botones superiores */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Refrescar */}
        <button
          onClick={onRefresh}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          🔄 Refrescar Playlist
        </button>

        {/* Añadir más */}
        <button
          onClick={onAddMore}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        >
          ➕ Añadir Más
        </button>

        {/* Guardar playlist */}
        {onSave && (
          <button
            onClick={onSave}
            className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded text-white"
          >
            💾 Guardar playlist
          </button>
        )}

        {/* Solo favoritas */}
        {onGenerateFromFavorites && favorites.length > 0 && (
          <button
            onClick={onGenerateFromFavorites}
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-black"
          >
            ⭐ Solo favoritas
          </button>
        )}

        {/* Copiar Links */}
        <button
          onClick={handleCopyLinks}
          className={`px-4 py-2 rounded text-white ${
            copied ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {copied ? '✔ Copiado!' : '🔗 Compartir (copiar links)'}
        </button>

        {/* Exportar JSON */}
        <button
          onClick={() => {
            const data = JSON.stringify(tracks, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'playlist.json';
            a.click();
          }}
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-black"
        >
          📥 Exportar JSON
        </button>

        {/* Exportar CSV */}
        <button
          onClick={() => {
            const rows = tracks.map(
              (t) => `${t.name},${t.artists?.[0]?.name || ''},${t.popularity}`
            );
            const csv = 'title,artist,popularity\n' + rows.join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'playlist.csv';
            a.click();
          }}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
        >
          📄 Exportar CSV
        </button>

        {/* Selector de orden */}
        <select
          onChange={(e) => onSort(e.target.value)}
          className="bg-gray-800 px-3 py-2 rounded text-white"
        >
          <option value="">Ordenar por…</option>
          <option value="title-asc">Título A–Z</option>
          <option value="title-desc">Título Z–A</option>
          <option value="artist-asc">Artista A–Z</option>
          <option value="artist-desc">Artista Z–A</option>
          <option value="random">Aleatorio</option>
        </select>
      </div>

      {/* LISTA DE CANCIONES */}
      <div className="space-y-4">
        {tracks.map((track) => {
          const isFavorite = favorites.includes(track.id);

          return (
            <div key={track.id} className="relative">
              <TrackCard
                track={track}
                isFavorite={isFavorite}
                onToggleFavorite={onToggleFavorite}
              />

              <button
                onClick={() => onRemove(track.id)}
                className="absolute right-3 bottom-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                ✖
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
