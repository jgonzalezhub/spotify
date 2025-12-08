'use client';

import { useEffect, useState, use } from 'react';
import TrackCard from '@/components/TrackCard';

export default function SavedPlaylistDetail({ params }) {

  const { id } = use(params); // ← CORRECTO EN NEXT 15

  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("playlist_history") || "[]");
    const entry = stored.find(p => p.id === id);
    setPlaylist(entry);
  }, [id]);

  if (!playlist) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-6">
        <p className="text-gray-400">Playlist no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-4"> Playlist guardada</h1>
      <p className="text-gray-400 mb-4">{playlist.date}</p>

      <div className="space-y-4">
        {playlist.tracks.map(track => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}
