
/*
😊 MOOD WIDGET
Descripción: Seleccionar niveles de energía y características musicales

Parámetros: Energy, Valence, Danceability, Acousticness

Funcionalidades:

Sliders para energía (0-100)
Selección de mood (Happy, Sad, Energetic, Calm)
Características de audio
*/

'use client';
import { useState, useEffect } from "react";

export default function MoodWidget({ mood, onChange }) {
  const DEFAULT_VALUES = {
  energy: 50,
  valence: 50,
  danceability: 50,
  acousticness: 50
};

const [values, setValues] = useState(mood ?? DEFAULT_VALUES);

  // Sincroniza si cambia el estado global
  useEffect(() => {
    if (mood) setValues(mood);
  }, [mood]);

  // Actualiza un slider individual
  const handleSlider = (field, value) => {
    const updated = { ...values, [field]: Number(value) };
    setValues(updated);
    onChange(updated); // Enviar al Dashboard
  };

  // Ajustes automáticos según mood elegido
  const presetMoods = {
    Happy:      { energy: 70, valence: 90, danceability: 60, acousticness: 20 },
    Sad:        { energy: 30, valence: 20, danceability: 30, acousticness: 70 },
    Energetic:  { energy: 95, valence: 70, danceability: 80, acousticness: 10 },
    Calm:       { energy: 20, valence: 50, danceability: 40, acousticness: 80 },
  };

  const applyMood = (preset) => {
    const presetValues = presetMoods[preset];
    setValues(presetValues);
    onChange(presetValues);
  };

  return (
    <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">😊 Mood & Características</h2>

      {/* Moods predefinidos */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {Object.keys(presetMoods).map(label => (
          <button
            key={label}
            onClick={() => applyMood(label)}
            className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white font-semibold"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sliders manuales */}
      <div className="space-y-4">
        
        {/* Energía */}
        <div>
          <label className="block mb-1">⚡ Energía: {values.energy}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={values.energy}
            onChange={(e) => handleSlider("energy", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Valence */}
        <div>
          <label className="block mb-1">😊 Felicidad (Valence): {values.valence}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={values.valence}
            onChange={(e) => handleSlider("valence", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Danceability */}
        <div>
          <label className="block mb-1">💃 Bailabilidad: {values.danceability}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={values.danceability}
            onChange={(e) => handleSlider("danceability", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Acousticness */}
        <div>
          <label className="block mb-1">🎻 Acústico: {values.acousticness}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={values.acousticness}
            onChange={(e) => handleSlider("acousticness", e.target.value)}
            className="w-full"
          />
        </div>

      </div>
    </div>
  );
}
