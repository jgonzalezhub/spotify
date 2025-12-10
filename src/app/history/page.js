'use client';

import { useEffect, useState } from 'react';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  // Cargar historial
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('playlist_history') || '[]');
      setHistory(data);
    } catch {
      setHistory([]);
    }
  }, []);

  // Actualizar almacenamiento
  const updateStorage = (updated) => {
    setHistory(updated);
    localStorage.setItem('playlist_history', JSON.stringify(updated));
  };

  // Cambiar nombre de entrada
  const handleNameChange = (id, newName) => {
    const updated = history.map((h) =>
      h.id === id ? { ...h, name: newName } : h
    );
    updateStorage(updated);
  };

  // Eliminar entrada
  const handleDeleteEntry = (id) => {
    const updated = history.filter((h) => h.id !== id);
    updateStorage(updated);
  };

  // Vaciar todo el historial
  const handleClearAll = () => {
    updateStorage([]);
  };

  // Renderizar filtros usados
  const renderFilters = (filters) => {
    if (!filters) return null;
    const { artists, genres, decades, popularity, mood } = filters;

    // Mostrar resumen de filtros
    return (
      <div className="mt-2 bg-gray-800 p-3 rounded text-xs">
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

  // Renderizado principal
  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-6">
      <h1 className="text-3xl font-bold mb-4">📜 Historial de Playlists Generadas</h1>

      {history.length === 0 && (
        <p className="text-gray-300">
          Todavía no hay entradas en el historial. Genera playlists desde el dashboard.
        </p>
      )}

      {history.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-300 text-sm">
              Total: {history.length} playlists generadas
            </p>
            <button
              onClick={handleClearAll}
              className="bg-red-700 hover:bg-red-800 text-sm px-3 py-1 rounded"
            >
              Vaciar historial
            </button>
          </div>

          <div className="space-y-4">
            {history.map((h) => (
              <div key={h.id} className="bg-gray-900 p-4 rounded-lg">
                <div className="flex justify-between gap-3">
                  <div className="flex-1">
                    <input
                      value={h.name}
                      onChange={(e) => handleNameChange(h.id, e.target.value)}
                      className="bg-transparent border-b border-gray-500 w-full mb-1 text-lg font-semibold"
                    />
                    <p className="text-xs text-gray-400">
                      {new Date(h.createdAt).toLocaleString()} ·{' '}
                      {h.tracks.length} canciones
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteEntry(h.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                  >
                    Eliminar
                  </button>
                </div>

                {/* Filtros usados en esa generación */}
                {renderFilters(h.filters)}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
