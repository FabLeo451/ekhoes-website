import pool from '@/lib/db';

const SCHEMA = process.env.DB_SCHEMA;
const MAX_NEWS = process.env.MAX_NEWS || 10;

async function getNews() {
	const res = await pool.query(`SELECT id, created, text FROM ${SCHEMA}.NEWS ORDER BY created DESC LIMIT ${MAX_NEWS}`);

	return res.rows;
}

export default async function News() {

	const news = await getNews();

	return (
		<div className="relative flex flex-col text-center px-6">

			<div className="mb-[1em] text-white text-lg">News</div>

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
	);
}
