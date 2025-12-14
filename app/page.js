import pkg from '@/package.json';
import HomeLoggedIn from '@/components/HomeLoggedIn';
import { isAuthenticated } from '@/lib/session';
import News from '@/components/news';

const TAGLINE = process.env.TAGLINE || 'Work in progress...';
const BANNER = process.env.BANNER || 'Work in progress...';

export default async function Home() {

	const version = pkg.version || '1.0.0'; // fallback

	return (
		<div>

			{await isAuthenticated() ? (
				<HomeLoggedIn />
			) : (
				<div className="relative min-h-screen flex flex-col text-center px-6 py-[3em]">

					<div className="flex flex-col items-center gap-2 mb-[3em]">
						<h1 className="text-5xl md:text-6xl font-extrabold text-white neon-text drop-shadow-md animate-pulse">
							ekhoes
						</h1>
						<p className="text-lg md:text-xl text-gray-300 mt-[2em]">
							{TAGLINE}
						</p>
						<p className="text-base text-gray-400">
							{BANNER}
						</p>
					</div>

					<News/>

				</div>
			)
			}


		</div>
	);
}
