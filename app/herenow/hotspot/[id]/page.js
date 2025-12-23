'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import LeafletMap from '@/components/LeafletMap';

export default function Hotspot({ params }) {
	const id = use(params).id;
	const [hotspots, setHotspots] = useState([]);
	const [notFound, setNotFound] = useState(false);

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
				}
			})
			.catch((err) => {
				console.error(err);
				setNotFound(true);
			});
	}, [id]);

	if (notFound) return <div>Hotspot not found (404)</div>;

	return (
		<div>
			<LeafletMap hotspots={hotspots} />
		</div>
	);
}
