import pkg from '@/package.json';

export default async function Home() {
  const version = pkg.version || '1.0.0'; // fallback

  return (
    <div className="h-screen flex flex-col justify-between items-center text-center px-6 py-6">
      {/* Spazio in alto (facoltativo) */}
      <div />

      {/* Contenuto centrale */}
      <div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white neon-text drop-shadow-md">
          ekhoes
        </h1>
        <p className="mt-2 text-lg md:text-xl text-gray-400">
          start a digital journey
        </p>
      </div>

      {/* ✅ Versione visibile sempre, senza overflow */}
      <div className="text-s text-gray-600">
        Version {version}
      </div>
    </div>
  );
}
