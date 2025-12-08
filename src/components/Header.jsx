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
    logout();
    router.push('/');
  };

  return (
    <header className="w-full bg-gray-900 p-4 flex justify-between items-center shadow-lg mb-6">

      {/* Nombre de la App */}
      <h1
        onClick={() => router.push('/dashboard')}
        className="text-2xl font-bold text-green-400 cursor-pointer"
      >
        Spotify Taste Mixer
      </h1>

      <div className="flex items-center gap-3">

        {/* Ir a Playlists Guardadas */}
        <button
          onClick={() => router.push('/saved')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          MIS PLAYLIST
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </div>

    </header>
  );
}
