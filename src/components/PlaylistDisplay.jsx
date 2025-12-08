/*
PLAYLIST DISPLAY
Muestra la playlist generada por generatePlaylist().
Recibe un array de tracks y los pinta usando TrackCard.
*/
'use client';

import TrackCard from './TrackCard';

export default function PlaylistDisplay({ tracks }) {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">🎧 Playlist generada</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tracks.map(track => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}
