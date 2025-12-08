
/*
📊 POPULARITY WIDGET
Popularity Widget
Descripción: Elegir entre hits mainstream o joyas ocultas

Parámetro: Popularity (0-100)

Funcionalidades:

Slider o categorías (Mainstream 80-100, Popular 50-80, Underground 0-50)
Filtrar canciones por popularidad
*/

'use client';

import { useState } from 'react';

export default function PopularityWidget({ value, onChange }) {
  // value viene del Dashboard → [min, max]
  const [range, setRange] = useState(value || [0, 100]);

  // Ajustar sliders
  const handleSlider = (index, newValue) => {
    const updated = [...range];
    updated[index] = Number(newValue);
    setRange(updated);
    onChange(updated);
  };

  // Moods predefinidos de popularidad
  const presets = {
    Underground: [0, 50],
    Popular: [50, 80],
    Mainstream: [80, 100],
  };

  const applyPreset = (preset) => {
    const updated = presets[preset];
    setRange(updated);
    onChange(updated);
  };

  return (
    <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">📊 Popularidad</h2>

      {/* Categorías rápidas */}
      <div className="grid grid-cols-1 gap-2 mb-4">
        {Object.entries(presets).map(([label, rangeVals]) => (
          <button
            key={label}
            onClick={() => applyPreset(label)}
            className="bg-purple-600 hover:bg-purple-700 p-2 rounded text-white font-semibold"
          >
            {label} ({rangeVals[0]}–{rangeVals[1]})
          </button>
        ))}
      </div>

      {/* Sliders manuales */}
      <div className="space-y-4">
        {/* Popularidad mínima */}
        <div>
          <label className="block mb-1">
            Mínimo: {range[0]}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={range[0]}
            onChange={(e) => handleSlider(0, e.target.value)}
            className="w-full"
          />
        </div>

        {/* Popularidad máxima */}
        <div>
          <label className="block mb-1">
            Máximo: {range[1]}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={range[1]}
            onChange={(e) => handleSlider(1, e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Mostrar rango seleccionado */}
      <div className="mt-4 text-sm text-gray-300">
        Rango actual: <span className="font-bold">{range[0]} – {range[1]}</span>
      </div>
    </div>
  );
}
