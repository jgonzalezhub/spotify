'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-6">🎵Spotify Taste Mixer</h1>

      <p className="text-gray-300 mb-8 text-center max-w-md">
        Genera playlists basadas en tus gustos musicales mediante widgets configurables.
      </p>

      <button
        onClick={handleLogin}
        className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-3 rounded-full shadow-lg text-lg"
      >
        Iniciar sesión con Spotify
      </button>
    </div>
  );
}



/*
RETURN DADO COMO EJEMPLO
  return (
      <>
        🎵 Spotify Taste Mixer
      </>  
  );
}
*/


