'use client';

export default function TrackCard({ track }) {
  if (!track) return null; // seguridad

  const image = track?.album?.images?.[0]?.url || "/placeholder.png";
  const title = track?.name || "Canción desconocida";
  const artists = track?.artists?.map(a => a.name).join(", ") || "Artista desconocido";
  const preview = track?.preview_url;

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow hover:bg-gray-700 transition">

      {/* Imagen */}
      <img
        src={image}
        alt={title}
        className="w-16 h-16 rounded mb-2"
      />

      {/* Info */}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-300 text-sm">{artists}</p>

      {/* Preview de audio */}
      {preview && (
        <audio controls className="w-full mt-2">
          <source src={preview} type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
}
