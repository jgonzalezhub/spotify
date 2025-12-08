/*
HEADER DE NAVEGACIÓN
- Muestra el nombre de la app
- Botón para cerrar sesión
(borra tokens y vuelve al login)
*/

'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth'; 

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    logout();          // LLAMAR A LA FUNCIÓN REAL
    router.push('/');  // Volver a la página de inicio
  };

  return (
    <header className="w-full bg-gray-900 p-4 flex justify-between items-center shadow-lg mb-6">
      <h1 className="text-2xl font-bold text-green-400">
        Spotify Taste Mixer
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Cerrar sesión
      </button>
    </header>
  );
}
