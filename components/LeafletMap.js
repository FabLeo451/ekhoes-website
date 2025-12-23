'use client';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

export default function LeafletMap({ hotspots, center = [45.4642, 9.19], zoom = 16 }) {
	const mapRef = useRef(null);
	const mapContainerRef = useRef(null);
	const LRef = useRef(null);
	const [mapReady, setMapReady] = useState(false);

	// Crea la mappa solo quando il container ha dimensioni
	useEffect(() => {
		let map;

		(async () => {
			const L = (await import('leaflet')).default;
			LRef.current = L;

			if (!mapContainerRef.current) return;

			// Controlla se il container ha altezza
			const rect = mapContainerRef.current.getBoundingClientRect();
			if (rect.height === 0) return;

			// Evita di creare la mappa più volte
			if (mapRef.current) return;

			const initialCenter = hotspots.length
				? [hotspots[0].position.latitude, hotspots[0].position.longitude]
				: center;

			map = L.map(mapContainerRef.current).setView(initialCenter, zoom);

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors',
			}).addTo(map);

			mapRef.current = map;
			setMapReady(true);
		})();
	}, [center, zoom, hotspots]);

	// Aggiorna i marker quando la mappa è pronta e hotspots cambiano
	useEffect(() => {
		if (!mapReady || !mapRef.current || !LRef.current || !hotspots || !hotspots.length) return;

		const map = mapRef.current;
		const L = LRef.current;

		// Rimuove i marker esistenti
		map.eachLayer(layer => {
			if (layer._icon) map.removeLayer(layer);
		});

		hotspots.forEach(h => {
			if (h.enabled) addHotspotMarker(L, map, h);
		});

		// Centra la mappa sul primo hotspot abilitato
		const first = hotspots.find(h => h.enabled);
		if (first) {
			map.setView([first.position.latitude, first.position.longitude], zoom);
		}
	}, [mapReady, hotspots, zoom]);

	return (
		<div
			ref={mapContainerRef}
			style={{
				width: '100%',
				height: '100vh', // occupa tutto lo schermo
			}}
		/>
	);
}

function addHotspotMarker(L, map, h) {
	const icon = L.divIcon({
		html: `
      <div style="position: relative; width: 60px; height: 60px;">
        <div class="pulsing-circle" style="position:absolute;top:15px;left:15px"></div>
        <div style="
          position: absolute;
          top: 50px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 12px;
          font-weight: bold;
          background: white;
          padding: 2px 5px;
          border: 1px solid gray;
          border-radius: 3px;
          white-space: nowrap;
        ">
          ${h.name || ''}
        </div>
      </div>
    `,
		className: '',
		iconSize: [60, 70],
		iconAnchor: [30, 30],
	});

	L.marker([h.position.latitude, h.position.longitude], { icon }).addTo(map);
}
