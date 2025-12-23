'use client';
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

export default function LeafletMap({ hotspots, center = [45.4642, 9.19], zoom = 16, height = '500px' }) {
	const mapRef = useRef(null);
	const LRef = useRef(null);

	useEffect(() => {
		let map;

		(async () => {
			const L = (await import('leaflet')).default;
			LRef.current = L;

			const container = document.getElementById('leaflet-map');
			if (!container) return;

			const initialCenter = hotspots.length
				? [hotspots[0].position.latitude, hotspots[0].position.longitude]
				: center;

			map = L.map(container).setView(initialCenter, zoom);

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors',
			}).addTo(map);

			mapRef.current = map;

			// aggiungi marker solo quando la mappa è pronta
			if (hotspots && hotspots.length) {
				hotspots.forEach(h => {
					if (h.enabled) addHotspotMarker(L, map, h);
				});
			}
		})();

		return () => {
			if (mapRef.current) {
				mapRef.current.remove();
				mapRef.current = null;
			}
		};
	}, [hotspots, center, zoom]);

	return <div id="leaflet-map" style={{ height, width: '100%' }} />;
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
