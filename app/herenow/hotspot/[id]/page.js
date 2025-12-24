'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import LeafletMap from '@/components/LeafletMap';

export default function Hotspot({ params }) {
	const id = use(params).id;
	const [hotspots, setHotspots] = useState([]);
	const [notFound, setNotFound] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [comments, setComments] = useState([]);

	useEffect(() => {
		if (!id) return;

		fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/hotspot/${id}`)
			.then((res) => {
				if (res.status === 404) {
					setNotFound(true);
					return null;
				}
				return res.json();
			})
			.then((data) => {
				//console.log(data);
				if (data) {
					setHotspots(data);
					setLoaded(true);
				}
			})
			.catch((err) => {
				console.error(err);
				setNotFound(true);
			});
	}, [id]);

	useEffect(() => {
		if (!loaded) return;

		getComments();
	}, [loaded]);

	async function getComments() {
		fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/hotspot/${id}/comments`)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log(data);
				if (data) {
					setComments(data);
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}

	if (notFound) return <div>Hotspot not found (404)</div>;
	if (!loaded) return <div>Loading...</div>;

	return (
		<div>
			<div style={{ height: '30vh', width: '100%' }}>
				<LeafletMap hotspots={hotspots} />
			</div>
			<div style={{
				maxWidth: '800px',
				marginTop: '10px',
				padding: '5px 20px 5px 20px',
				color: '#fff', // testo chiaro
				boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
				fontFamily: 'Arial, sans-serif',
			}}>
				{/* Nome hotspot: più grande e in grassetto */}
				<div style={{
					fontSize: '1.8rem',
					fontWeight: '700',

					color: '#00BFFF', // blu acceso per evidenziare
				}}>
					{hotspots[0].name}
				</div>

				{/* Owner: più piccolo e in corsivo */}
				<div style={{
					fontSize: '1rem',
					fontStyle: 'italic',
					marginBottom: '8px',
					color: '#aaa', // grigio chiaro
				}}>
					Created by {hotspots[0].owner}
				</div>

				{/* Descrizione: dimensione media, line-height maggiore */}
				<div className="w-full rounded-sm lg:max-w-[50vw] mx-auto  bg-white/10 border border-white/10 backdrop-blur-md shadow-2xl shadow-black/40">
					<div className="p-2 text-left flex flex-col">
						{hotspots[0].description}
					</div>
				</div>
			</div>

			{/* Comments */}
			<div className="text-left flex flex-col gap-2 pr-2 ml-5 mr-5 mt-3 mb-5 pb-5">
				<div className="font-bold text-base mb-1">Comments</div>

				<div className="max-h-[40vh] overflow-y-auto">
					{comments.map((item) => (
						<div key={item.id} className="flex flex-col mb-3">

							<div className="flex gap-1 items-baseline text-xs text-gray-400">
								<span className="font-bold text-gray-300">
									{item.userName}
								</span>
								<span>
									{new Date(item.created).toLocaleString()}
								</span>
							</div>

							<div className="text-gray-300 text-xs">
								{item.message}
							</div>

						</div>
					))}
				</div>
			</div>



		</div>
	);

}
