'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import LeafletMap from '@/components/LeafletMap';

const hotspots = [
	{
		id: '1',
		name: 'Hotspot Centrale',
		description: '',
		owner: 'me',
		ownedByMe: true,
		enabled: true,
		private: false,
		position: {
			latitude: 45.4642,
			longitude: 9.19,
		},
		likes: 10,
		likedByMe: false,
		subscriptions: 5,
		subscribed: false,
		category: null,
	},
];

export default function Herenow() {

	return (
		<div>
			<div className="flex justify-center mt-[3em] font-bold text-4xl">
				Hotspot
			</div>
			<LeafletMap hotspots={hotspots} />
		</div>
	);
}
