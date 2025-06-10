import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import pkg from '@/package.json';
import HomeLoggedIn from '@/components/HomeLoggedIn';
import pool from '@/lib/db';

const SCHEMA = process.env.DB_SCHEMA;
const MAX_NEWS = process.env.MAX_NEWS || 10;

async function getNews() {
	const res = await pool.query(`SELECT id, created, text FROM ${SCHEMA}.NEWS ORDER BY created DESC LIMIT ${MAX_NEWS}`);

	//console.log('[home]', res.rows)
	return res.rows;
}

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

	const news = await getNews();

	return (
		<div>

			{/* Contenuto centrale */}
			{loggedIn ? (
				<HomeLoggedIn />
			) : (
				<div className="relative min-h-screen flex flex-col text-center px-6 py-[6em]">
					<div className="flex flex-col items-center gap-4">
						<h1 className="text-5xl md:text-6xl font-extrabold text-white neon-text drop-shadow-md animate-pulse">
							ekhoes
						</h1>
						<p className="text-lg md:text-xl text-gray-400">
							work in progres...
						</p>
					</div>

					<div className="mt-[3em] mb-[1em] text-white text-lg">News</div>

					<div className="card w-full max-w-[90vw] lg:max-w-[50vw] mx-auto bg-white/10 border border-white/10 backdrop-blur-md shadow-2xl shadow-black/40">
						<div className="card-body text-left flex flex-col gap-3">
							{news.map((item) => (
								<div key={item.id} className="flex gap-2 items-baseline">
									<span className="text-xs text-gray-400">
										{new Date(item.created).toLocaleString()}
									</span>
									<span className="text-gray-300">{item.text}</span>
								</div>
							))}
						</div>
					</div>


				</div>
			)
			}


		</div>
	);
}
