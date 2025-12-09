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
}) {
  const [copied, setCopied] = useState(false); // ← NUEVO ESTADO

  // Función para copiar links
  const handleCopyLinks = () => {
    navigator.clipboard.writeText(
      tracks
        .map((t) => t?.external_urls?.spotify)
        .filter(Boolean)
        .join('\n')
    );

    setCopied(true);

    // Volver al texto normal después de 2 segundos
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-xl">

      {/* Nombre playlist editable */}
      <input
        className="w-full bg-gray-800 p-2 rounded mb-4 text-xl font-bold"
        value={playlistName}
        onChange={(e) => onNameChange(e.target.value)}
      />

      {/* Botones superiores */}
      <div className="flex flex-wrap gap-3 mb-6">

        {/* 🔄 Refrescar playlist */}
        <button
          onClick={onRefresh}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          🔄 Refrescar Playlist
        </button>

        {/* ➕ Añadir más canciones */}
        <button
          onClick={onAddMore}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        >
          ➕ Añadir Más
        </button>

        {/* Compartir links con feedback */}
        <button
          onClick={handleCopyLinks}
          className={`px-4 py-2 rounded text-white ${
            copied
              ? 'bg-green-600'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {copied ? '✔ Copiado!' : '🔗 Compartir (copiar links)'}
        </button>

        {/* Exportar JSON */}
        <button
          onClick={() => {
            const data = JSON.stringify(tracks, null, 2);
            const blob = new Blob([data], {
              type: 'application/json',
            });
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

        {/* Ordenación */}
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

      {/* Lista de canciones */}
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

              {/* Botón eliminar */}
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
