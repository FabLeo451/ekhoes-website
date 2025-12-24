'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import LeafletMap from '@/components/LeafletMap';

export default function Hotspot({ params }) {
	const id = use(params).id;
	const [hotspots, setHotspots] = useState([]);
	const [notFound, setNotFound] = useState(false);
	const [loaded, setLoaded] = useState(false);

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
				console.log(data);
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
				<div style={{
					fontSize: '1.1rem',
					lineHeight: '1.6',
					color: '#eee', // quasi bianco
				}}>
					{hotspots[0].description}
				</div>
			</div>

		</div>
	);

}
