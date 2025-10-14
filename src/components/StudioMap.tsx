'use client'

import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google: typeof google;
  }
}

declare var google: {
  maps: {
    Map: new (element: HTMLElement, options: any) => any;
    Marker: new (options: any) => any;
    InfoWindow: new (options: any) => any;
    LatLngBounds: new () => any;
    LatLng: new (lat: number, lng: number) => any;
    MapTypeId: {
      ROADMAP: string;
    };
    Size: new (width: number, height: number) => any;
    Point: new (x: number, y: number) => any;
    event: {
      addListener: (instance: any, eventName: string, handler: () => void) => any;
      removeListener: (listener: any) => void;
    };
  };
};

interface Studio {
  id: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  county_slug: string;
  city_slug: string;
  slug?: string;
  full_url_path?: string;
  google_rating?: number;
  phone?: string;
  website?: string;
}

interface StudioMapProps {
  studios: Studio[];
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  height?: string;
}

export default function StudioMap({
  studios,
  center,
  zoom = 12,
  height = '400px'
}: StudioMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const initMap = async () => {
      try {
        // Load Google Maps script dynamically
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
        script.async = true;

        // Wait for script to load
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;

          // Only add script if it's not already loaded
          if (!document.querySelector(`script[src*="maps.googleapis.com"]`)) {
            document.head.appendChild(script);
          } else {
            resolve(undefined);
          }
        });

        // Use the global google object
        const google = window.google;

        if (!mapRef.current) return;

        // Calculate center from studios if not provided
        let mapCenter = center;
        if (!mapCenter && studios.length > 0) {
          const validStudios = studios.filter(s => s.latitude && s.longitude);
          if (validStudios.length > 0) {
            const avgLat = validStudios.reduce((sum, s) => sum + (s.latitude || 0), 0) / validStudios.length;
            const avgLng = validStudios.reduce((sum, s) => sum + (s.longitude || 0), 0) / validStudios.length;
            mapCenter = { lat: avgLat, lng: avgLng };
          }
        }

        // Default to London if no center or studios
        if (!mapCenter) {
          mapCenter = { lat: 51.5074, lng: -0.1278 };
        }

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: mapCenter,
          zoom: zoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          keyboardShortcuts: false,
          mapDataControl: false,
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          gestureHandling: 'cooperative',
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        setMap(mapInstance);
        setIsLoaded(true);

        // Add markers for each studio
        studios.forEach((studio) => {
          if (studio.latitude && studio.longitude) {
            const marker = new google.maps.Marker({
              position: { lat: studio.latitude, lng: studio.longitude },
              map: mapInstance,
              title: studio.name,
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#9333ea" stroke="#ffffff" stroke-width="3"/>
                    <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">P</text>
                  </svg>
                `),
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 20)
              }
            });

            // Create info window
            const studioUrl = studio.full_url_path || `${studio.county_slug}/${studio.city_slug}/${studio.slug || studio.id}`;
            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div style="padding: 10px; max-width: 300px;">
                  <h3 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px; font-weight: 600;">${studio.name}</h3>
                  <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">${studio.address}</p>
                  ${studio.google_rating ? `
                    <div style="margin: 0 0 8px 0;">
                      <span style="color: #f59e0b; font-size: 14px;">★ ${studio.google_rating.toFixed(1)}</span>
                    </div>
                  ` : ''}
                  <div style="display: flex; gap: 8px; margin-top: 12px;">
                    <a href="/${studioUrl}"
                       style="background: #9333ea; color: #ffffff !important; padding: 6px 12px; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: 500;">
                      View Details
                    </a>
                    ${studio.phone ? `
                      <a href="tel:${studio.phone}"
                         style="background: #10b981; color: #ffffff !important; padding: 6px 12px; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: 500;">
                        Call
                      </a>
                    ` : ''}
                    ${studio.website ? `
                      <a href="${studio.website}" target="_blank" rel="noopener noreferrer"
                         style="background: #3b82f6; color: #ffffff !important; padding: 6px 12px; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: 500;">
                        Website
                      </a>
                    ` : ''}
                  </div>
                </div>
              `
            });

            marker.addListener('click', () => {
              infoWindow.open(mapInstance, marker);
            });
          }
        });

        // Fit map to markers if multiple studios
        if (studios.length > 1) {
          const bounds = new google.maps.LatLngBounds();
          studios.forEach((studio) => {
            if (studio.latitude && studio.longitude) {
              bounds.extend(new google.maps.LatLng(studio.latitude, studio.longitude));
            }
          });
          mapInstance.fitBounds(bounds);

          // Set minimum zoom level
          const listener = google.maps.event.addListener(mapInstance, 'bounds_changed', () => {
            if (mapInstance.getZoom() && mapInstance.getZoom()! > 15) {
              mapInstance.setZoom(15);
            }
            google.maps.event.removeListener(listener);
          });
        }

      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    if (!isLoaded && isMounted) {
      initMap();
    }
  }, [studios, center, zoom, isLoaded, isMounted]);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div
        style={{ height, backgroundColor: '#f3f4f6' }}
        className="flex items-center justify-center rounded-lg border"
      >
        <p className="text-gray-500">Google Maps API key required</p>
      </div>
    );
  }

  if (!isMounted) {
    return (
      <div
        style={{ height, backgroundColor: '#f9fafb' }}
        className="flex items-center justify-center rounded-lg border border-gray-200"
      >
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{ height, width: '100%' }}
      className="rounded-lg border border-gray-200"
    />
  );
}