
/*
📅 DECADE WIDGET
Descripción: Elegir décadas/eras musicales preferidas

Implementación: Filtro por año en búsquedas

Funcionalidades:

Selector de décadas (1950s, 1960s, 1970s... 2020s)
Rango de años personalizado
Múltiple selección

*/
'use client';

import { useState } from 'react';

export default function DecadeWidget({ selectedItems, onSelect }) {
  // Lista fija de décadas según la práctica
  const DECADES = [
    "1950", "1960", "1970",
    "1980", "1990", "2000",
    "2010", "2020"
  ];

  // Estado para el rango personalizado
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // Manejar selección de décadas
  const toggleDecade = (decade) => {
    const already = selectedItems.includes(decade);

    if (already) {
      // Si ya estaba seleccionada, la quitamos
      onSelect(selectedItems.filter(d => d !== decade));
      return;
    }

    // Añadimos nueva década
    onSelect([...selectedItems, decade]);
  };

  // Añadir un rango personalizado
  const addCustomRange = () => {
    if (!customStart || !customEnd) return;

    const start = parseInt(customStart);
    const end = parseInt(customEnd);

    if (isNaN(start) || isNaN(end)) return;
    if (start >= end) return;

    // Guardamos el rango como string "start-end"
    const range = `${start}-${end}`;

    // Evitar duplicados
    if (!selectedItems.includes(range)) {
      onSelect([...selectedItems, range]);
    }

    // Limpiar inputs
    setCustomStart('');
    setCustomEnd('');
  };

  return (
    <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-3">📅 Décadas / Rango de años</h2>

      {/* Selección por décadas */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {DECADES.map(decade => (
          <button
            key={decade}
            onClick={() => toggleDecade(decade)}
            className={`p-2 rounded border border-gray-500
              ${selectedItems.includes(decade)
                ? 'bg-green-600 border-green-700'
                : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {decade}s
          </button>
        ))}
      </div>

      {/* Selector de rango personalizado */}
      <div className="bg-gray-700 p-3 rounded mb-4">
        <h3 className="text-sm text-gray-300 mb-2">Rango personalizado</h3>

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Inicio"
            className="w-full p-2 rounded bg-gray-600 text-white"
            value={customStart}
            onChange={e => setCustomStart(e.target.value)}
          />
          <input
            type="number"
            placeholder="Fin"
            className="w-full p-2 rounded bg-gray-600 text-white"
            value={customEnd}
            onChange={e => setCustomEnd(e.target.value)}
          />
        </div>

        <button
          onClick={addCustomRange}
          className="mt-2 w-full bg-blue-500 hover:bg-blue-600 p-2 rounded text-white"
        >
          Añadir rango
        </button>
      </div>

      {/* Mostrar seleccionados */}
      {selectedItems.length > 0 && (
        <div>
          <h3 className="text-sm text-gray-300 mb-1">Seleccionados:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedItems.map(item => (
              <span
                key={item}
                className="bg-green-600 px-3 py-1 text-sm rounded"
              >
                {item.includes('-')
                  ? `${item} (personalizado)`
                  : `${item}s`}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
