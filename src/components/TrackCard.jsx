/*
// TRACK CARD
Muestra información de una canción:
    - Imagen del álbum
    - Título de la canción
    - Artista(s)
Este componente se usa dentro de PlaylistDisplay.
*/
'use client';

export default function TrackCard({ track }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 flex gap-4 items-center shadow hover:bg-gray-700 transition">
      
      {/* Imagen del álbum */}
      <img
        src={track.album.images?.[0]?.url}
        alt={track.name}
        className="w-16 h-16 rounded"
      />

      {/* Información de la canción */}
      <div>
        <h3 className="text-lg font-semibold">{track.name}</h3>
        <p className="text-gray-300 text-sm">
          {track.artists.map(a => a.name).join(', ')}
        </p>
      </div>
    </div>
  );
}
