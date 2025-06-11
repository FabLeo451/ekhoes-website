import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import pkg from '@/package.json';
import HomeLoggedIn from '@/components/HomeLoggedIn';
import pool from '@/lib/db';
import News from '@/components/news';

const SCHEMA = process.env.DB_SCHEMA;
const MAX_NEWS = process.env.MAX_NEWS || 10;
const TAGLINE = process.env.TAGLINE || 'Work in progress...';

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
				<div className="relative min-h-screen flex flex-col text-center px-6 py-[3em]">

					<div className="flex flex-col items-center gap-4 mb-[3em]">
						<h1 className="text-5xl md:text-6xl font-extrabold text-white neon-text drop-shadow-md animate-pulse">
							ekhoes
						</h1>
						<p className="text-lg md:text-xl text-gray-400 mt-[2em]">
							{TAGLINE}
						</p>
					</div>

					<News/>

				</div>
			)
			}


		</div>
	);
}
