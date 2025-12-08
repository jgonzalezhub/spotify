/*
// PLAYLIST DISPLAY
    - Muestra la lista de canciones generadas
    - Permite eliminar canciones
    - Permite marcar favoritos 
    - Botón para refrescar playlist
    - Botón para añadir más canciones
    - Botón compartir playlist
    - Exportar JSON / CSV
*/
import TrackCard from './TrackCard';


export default function PlaylistDisplay({
  tracks,
  onRemove,
  onFavorite,
  onRefresh,
  onAddMore
}) {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-xl">

      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">🎶 Tu Playlist Generada</h2>

      {/* Buttons */}
      <div className="flex gap-4 flex-wrap mb-6">
        
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

        {/* Compartir */}
        <button
          onClick={() =>
            navigator.clipboard.writeText(
              tracks
                .map(t => t?.external_urls?.spotify)
                .filter(Boolean)
                .join("\n")
            )
          }
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white"
        >
          🔗 Compartir (copiar links)
        </button>

        {/* Export JSON */}
        <button
          onClick={() => {
            const data = JSON.stringify(tracks, null, 2);
            const blob = new Blob([data], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "playlist.json";
            a.click();
          }}
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-black"
        >
          📥 Exportar JSON
        </button>

        {/* Export CSV */}
        <button
          onClick={() => {
            const rows = tracks.map(
              t => `${t.name},${t.artists[0]?.name || ""},${t.popularity}`
            );
            const csv = "title,artist,popularity\n" + rows.join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "playlist.csv";
            a.click();
          }}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
        >
          📄 Exportar CSV
        </button>

      </div>

      {/* Track list */}
      <div className="space-y-4">
        {tracks.map(track => (
          <div key={track.id} className="relative">

            {/* Track Card */}
            <TrackCard track={track} />

            {/* Remove button */}
            <button
              onClick={() => onRemove(track.id)}
              className="absolute right-2 top-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              ✖
            </button>

            {/* Favorite button */}
            <button
              onClick={() => onFavorite(track)}
              className="absolute right-2 bottom-2 bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded"
            >
              ⭐
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}