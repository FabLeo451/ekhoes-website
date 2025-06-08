import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import pkg from '@/package.json';
import HomeLoggedIn from '@/components/HomeLoggedIn';

export default async function Home() {

  const version = pkg.version || '1.0.0'; // fallback

  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.COOKIE_NAME)?.value;

  let loggedIn = false;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);

    //console.log('[Navbar] decoded = ', decoded)

    loggedIn = true;

  } catch (err) {
    //return (<div className="pl-1">Invalid token: {err.message}</div>);
  }

  return (
    <div>

      {/* Contenuto centrale */}
      {loggedIn ? (
        <HomeLoggedIn />
      ) : (
        <div className="relative h-screen flex flex-col items-center justify-center text-center px-6 py-6">
          {/* Contenuto centrato verticalmente */}
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white neon-text drop-shadow-md">
              ekhoes
            </h1>
            <p className="text-lg md:text-xl text-gray-400">
              start a digital journey
            </p>
          </div>

          {/* Footer ancorato in basso */}
          <div className="absolute bottom-4 text-s text-gray-600">
            Version {version}
          </div>
        </div>
      )
      }


    </div>
  );
}
