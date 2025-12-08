'use client';

import { useState, useEffect } from 'react';

export default function SavedPlaylistsPage() {
  const [history, setHistory] = useState([]);

  // Cargar historial desde localStorage en cliente
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("playlist_history") || "[]");
    setHistory(stored);
  }, []);

  // Eliminar playlist guardada por ID
  const deletePlaylist = (id) => {
    const updated = history.filter(p => p.id !== id);
    setHistory(updated);
    localStorage.setItem("playlist_history", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Playlists Guardadas</h1>

      {history.length === 0 && (
        <p className="text-gray-400">No tienes playlists guardadas todavía.</p>
      )}

      <ul className="space-y-4">
        {history.map((entry, index) => (
          <li key={entry.id || index} className="bg-gray-800 p-4 rounded-lg">

            <p className="text-sm text-gray-400">{entry.date}</p>

            <p className="text-lg font-semibold">
              {entry.tracks?.length || 0} canciones
            </p>

            <div className="flex gap-4 mt-3">
              <a
                href={`/saved/${entry.id}`}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white"
              >
                Ver playlist
              </a>

              <button
                onClick={() => deletePlaylist(entry.id)}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
              >
                Eliminar
              </button>
            </div>

          </li>
        ))}
      </ul>
    </div>
  );
}
