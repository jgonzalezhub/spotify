
/*
🎤 Artist Widget
Descripción: Buscar y seleccionar artistas favoritos

Endpoint: GET /search?type=artist&q={query}

Funcionalidades:

Búsqueda con debouncing
Mostrar imagen, nombre del artista
Selección múltiple (límite sugerido: 5 artistas)
*/

'use client';

import { useState, useEffect } from 'react';
import { getAccessToken } from '@/lib/auth';


export default function ArtistWidget({ selectedItems, onSelect }) {
  const [query, setQuery] = useState(''); // Texto que escribe el usuario
  const [results, setResults] = useState([]); // Resultados de búsqueda
  const [loading, setLoading] = useState(false); // Estado de carga

  // Se evita hacer demasiadas peticiones mientras el usuario escribe
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim().length > 0) searchArtists(query);
    }, 300);
    return () => clearTimeout(delay);
  }, [query]);

  // Buscar artistas en Spotify
  const searchArtists = async (text) => {
    try {
      setLoading(true);
      const token = getAccessToken();

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${text}&type=artist&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await response.json();
      setResults(data.artists?.items || []);
    } catch (error) {
      console.error('Error buscando artistas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Añade o elimina artista seleccionado
  const toggleArtist = (artist) => {
    const alreadySelected = selectedItems.find(a => a.id === artist.id);

    // Si ya estaba seleccionado, lo eliminamos
    if (alreadySelected) {
      onSelect(selectedItems.filter(a => a.id !== artist.id));
      return;
    }

    // Limite sugerido: 5 artistas
    if (selectedItems.length >= 5) return;

    // Añadimos nuevo artista
    onSelect([...selectedItems, artist]);
  };

  return (
    <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-3">🎤 Artistas favoritos</h2>

      {/* INPUT DE BÚSQUEDA */}
      <input
        type="text"
        className="w-full p-2 rounded bg-gray-700 text-white"
        placeholder="Buscar artistas..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {/* LOADING */}
      {loading && <p className="text-gray-400 mt-2">Buscando...</p>}

      {/* LISTA DE RESULTADOS */}
      <div className="mt-3 max-h-40 overflow-y-auto">
        {results.map(artist => (
          <div
            key={artist.id}
            className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-700
              ${selectedItems.some(a => a.id === artist.id) ? 'bg-green-700' : ''}`}
            onClick={() => toggleArtist(artist)}
          >
            <img
              src={artist.images?.[0]?.url || '/default.jpg'}
              className="w-12 h-12 rounded"
              alt={artist.name}
            />
            <span>{artist.name}</span>
          </div>
        ))}
      </div>

      {/* ARTISTAS SELECCIONADOS */}
      {selectedItems.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm text-gray-300 mb-1">Seleccionados:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedItems.map(artist => (
              <span
                key={artist.id}
                className="bg-green-600 px-3 py-1 text-sm rounded"
              >
                {artist.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
