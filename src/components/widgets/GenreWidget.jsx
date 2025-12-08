/*
🎸 GENRE WIDGET
Descripción: Seleccionar géneros musicales disponibles

Funcionalidades:
Listar todos los géneros disponibles
Selección múltiple (límite sugerido: 3-5 géneros)
Filtrado por búsqueda
*/
'use client';
import { useState } from 'react';   

const ALL_GENRES = [
  'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient', 'anime',
  'black-metal', 'bluegrass', 'blues', 'bossanova', 'brazil', 'breakbeat',
  'british', 'cantopop', 'chicago-house', 'children', 'chill', 'classical',
  'club', 'comedy', 'country', 'dance', 'dancehall', 'death-metal', 
  'deep-house', 'detroit-techno', 'disco', 'disney', 'drum-and-bass', 
  'dub', 'dubstep', 'edm', 'electro', 'electronic', 'emo', 'folk', 'forro',
  'french', 'funk', 'garage', 'german', 'gospel', 'goth', 'grindcore',
  'groove', 'grunge', 'guitar', 'happy', 'hard-rock', 'hardcore',
  'hardstyle', 'heavy-metal', 'hip-hop', 'house', 'idm', 'indian', 
  'indie', 'indie-pop', 'industrial', 'iranian', 'j-dance', 'j-idol',
  'j-pop', 'j-rock', 'jazz', 'k-pop', 'kids', 'latin', 'latino', 'malay',
  'mandopop', 'metal', 'metal-misc', 'metalcore', 'minimal-techno',
  'movies', 'mpb', 'new-age', 'new-release', 'opera', 'pagode', 'party',
  'philippines-opm', 'piano', 'pop', 'pop-film', 'post-dubstep',
  'power-pop', 'progressive-house', 'psych-rock', 'punk', 'punk-rock',
  'r-n-b', 'rainy-day', 'reggae', 'reggaeton', 'road-trip', 'rock',
  'rock-n-roll', 'rockabilly', 'romance', 'sad', 'salsa', 'samba',
  'sertanejo', 'show-tunes', 'singer-songwriter', 'ska', 'sleep',
  'songwriter', 'soul', 'soundtracks', 'spanish', 'study', 'summer',
  'swedish', 'synth-pop', 'tango', 'techno', 'trance', 'trip-hop',
  'turkish', 'work-out', 'world-music'
];

export default function GenreWidget({ selectedItems, onSelect }) {
  const [search, setSearch] = useState('');

  // Filtra géneros por texto
  const filteredGenres = ALL_GENRES.filter(g =>
    g.toLowerCase().includes(search.toLowerCase())
  );

  // Límite sugerido: 5 géneros
  const LIMIT = 5;

  const toggleGenre = (genre) => {
    const already = selectedItems.includes(genre);

    if (already) {
      onSelect(selectedItems.filter(item => item !== genre));
      return;
    }

    if (selectedItems.length >= LIMIT) return;

    onSelect([...selectedItems, genre]);
  };

  return (
    <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-3">🎸 Géneros musicales</h2>

      {/* Buscador */}
      <input
        type="text"
        className="w-full p-2 rounded bg-gray-700 text-white mb-3"
        placeholder="Buscar género..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Lista de géneros */}
      <div className="max-h-40 overflow-y-auto">
        {filteredGenres.map(genre => (
          <div
            key={genre}
            className={`p-2 rounded cursor-pointer hover:bg-gray-700
            ${selectedItems.includes(genre) ? 'bg-green-700' : ''}`}
            onClick={() => toggleGenre(genre)}
          >
            {genre}
          </div>
        ))}
      </div>

      {/* Géneros seleccionados */}
      {selectedItems.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm text-gray-300 mb-1">Seleccionados:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedItems.map(genre => (
              <span key={genre} className="bg-green-600 px-3 py-1 text-sm rounded">
                {genre}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}