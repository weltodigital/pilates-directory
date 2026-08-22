'use client'

import { useEffect, useRef, useState } from 'react'

export interface MapStudio {
  id: string;
  name: string;
  latitude?: number | null;
  longitude?: number | null;
  full_url_path?: string | null;
  address?: string | null;
  google_rating?: number | null;
  google_review_count?: number | null;
}

interface StudioLocationsMapProps {
  studios: MapStudio[];
  /** Tailwind height class for the map surface. */
  heightClass?: string;
  /** Zoom used when there is a single studio (bounds are fitted otherwise). */
  singleZoom?: number;
}

/** Escape values interpolated into popup HTML. */
function esc(value: string) {
  return value
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export default function StudioLocationsMap({
  studios,
  heightClass = 'h-96',
  singleZoom = 15,
}: StudioLocationsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [failed, setFailed] = useState(false);

  const points = studios.filter(
    s => typeof s.latitude === 'number' && typeof s.longitude === 'number'
  );

  useEffect(() => {
    if (!containerRef.current || !points.length) return;
    let cancelled = false;

    (async () => {
      try {
        // Imported here rather than at module scope: Leaflet touches `window`,
        // which does not exist while the page is prerendered.
        const L = (await import('leaflet')).default;
        // leaflet.markercluster is a UMD plugin that extends a *global* L
        // (`L.MarkerClusterGroup = L.FeatureGroup.extend(...)`), so the global
        // has to exist before it is imported or it throws.
        (window as any).L = L;
        await import('leaflet.markercluster');
        if (cancelled || !containerRef.current) return;

        const map = L.map(containerRef.current, { scrollWheelZoom: false });
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Brand pin, drawn as HTML so no image assets are needed and the
        // default icon-path problem never arises.
        const icon = L.divIcon({
          className: '',
          html:
            '<span style="display:block;width:26px;height:26px;border-radius:50% 50% 50% 0;' +
            'background:hsl(var(--brand));border:2px solid #fff;transform:rotate(-45deg);' +
            'box-shadow:0 2px 6px rgba(0,0,0,.3)"></span>',
          iconSize: [26, 26],
          iconAnchor: [13, 26],
          popupAnchor: [0, -26],
        });

        const markers = points.map(s => {
          const href = s.full_url_path ? `/${s.full_url_path}` : null;
          const rating = s.google_rating
            ? `<div style="margin-top:4px;font-weight:600">★ ${s.google_rating.toFixed(1)}` +
              (s.google_review_count ? ` <span style="font-weight:400;opacity:.7">(${s.google_review_count})</span>` : '') +
              '</div>'
            : '';
          const title = href
            ? `<a href="${esc(href)}" style="color:hsl(var(--brand));font-weight:600;text-decoration:none">${esc(s.name)}</a>`
            : `<strong>${esc(s.name)}</strong>`;

          return L.marker([s.latitude as number, s.longitude as number], { icon })
            .bindPopup(
              `<div style="font-family:var(--font-geist),sans-serif;font-size:13px;line-height:1.5;min-width:150px">
                 ${title}
                 ${s.address ? `<div style="margin-top:4px;opacity:.75">${esc(s.address)}</div>` : ''}
                 ${rating}
               </div>`
            );
        });

        if (markers.length === 1) {
          markers[0].addTo(map);
          map.setView([points[0].latitude as number, points[0].longitude as number], singleZoom);
        } else {
          // Cluster so a county with hundreds of studios stays readable.
          const cluster = (L as any).markerClusterGroup({
            showCoverageOnHover: false,
            maxClusterRadius: 45,
            iconCreateFunction: (c: any) => L.divIcon({
              className: '',
              html:
                '<div style="display:flex;align-items:center;justify-content:center;' +
                'width:38px;height:38px;border-radius:50%;background:hsl(var(--brand));' +
                'color:#fff;font:600 13px var(--font-geist),sans-serif;border:2px solid #fff;' +
                `box-shadow:0 2px 8px rgba(0,0,0,.25)">${c.getChildCount()}</div>`,
              iconSize: [38, 38],
            }),
          });
          markers.forEach(m => cluster.addLayer(m));
          map.addLayer(cluster);
          map.fitBounds(cluster.getBounds(), { padding: [40, 40], maxZoom: 14 });
        }
      } catch (err) {
        console.error('Map failed to load:', err);
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(points.map(p => p.id)), singleZoom]);

  if (!points.length) {
    return (
      <div className={`flex ${heightClass} items-center justify-center bg-surface-sunken text-sm text-ink-muted`}>
        No mapped locations yet
      </div>
    );
  }

  if (failed) {
    return (
      <div className={`flex ${heightClass} items-center justify-center bg-surface-sunken text-sm text-ink-muted`}>
        Map could not be loaded
      </div>
    );
  }

  return <div ref={containerRef} className={`${heightClass} w-full`} aria-label="Map of pilates studios" />;
}
