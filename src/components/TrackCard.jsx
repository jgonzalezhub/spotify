'use client';

/*
TRACK CARD
- Portada
- Título
- Artistas
- Estrella de favorito (llena/vacía)
- Preview de audio (si está disponible)
*/

export default function TrackCard({ track, isFavorite, onToggleFavorite }) {
  if (!track) return null;

  const image = track.album?.images?.[0]?.url;
  const title = track.name || 'Sin título';
  const artists = track.artists?.map((a) => a.name).join(', ') || 'Desconocido';

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex gap-4 items-center shadow hover:bg-gray-700 transition relative">
      {/* Imagen */}
      {image && (
        <img src={image} alt={title} className="w-16 h-16 rounded" />
      )}

      {/* Info */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-300 text-sm">{artists}</p>

        {/* Preview de audio */}
        {track.preview_url && (
          <audio controls className="mt-2 w-full">
            <source src={track.preview_url} type="audio/mpeg" />
            Tu navegador no soporta audio.
          </audio>
        )}
      </div>

      {/* Favorito */}
      <button
        onClick={() => onToggleFavorite(track)}
        className="absolute right-3 top-3 text-2xl"
      >
        {isFavorite ? '⭐' : '☆'}
      </button>
    </div>
  );
}
