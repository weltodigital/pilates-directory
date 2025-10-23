'use client'

import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

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

interface StaticStudioMapProps {
  studios: Studio[];
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  height?: string;
}

export default function StaticStudioMap({
  studios,
  center,
  zoom = 12,
  height = '400px'
}: StaticStudioMapProps) {
  // Filter studios that have coordinates
  const studiosWithCoords = studios.filter(studio => studio.latitude && studio.longitude);

  if (studiosWithCoords.length === 0) {
    return (
      <div
        style={{ height, backgroundColor: '#f3f4f6' }}
        className="flex items-center justify-center rounded-lg border flex-col gap-4"
      >
        <MapPin className="h-12 w-12 text-gray-400" />
        <div className="text-center">
          <p className="text-gray-500 mb-2">Map view temporarily unavailable</p>
          <a
            href={`https://www.google.com/maps/search/pilates+studios+near+me`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Open Google Maps
          </a>
        </div>
      </div>
    );
  }

  // Calculate center from studios if not provided
  let mapCenter = center;
  if (!mapCenter && studiosWithCoords.length > 0) {
    const avgLat = studiosWithCoords.reduce((sum, s) => sum + (s.latitude || 0), 0) / studiosWithCoords.length;
    const avgLng = studiosWithCoords.reduce((sum, s) => sum + (s.longitude || 0), 0) / studiosWithCoords.length;
    mapCenter = { lat: avgLat, lng: avgLng };
  }

  // Default to London if no center or studios
  if (!mapCenter) {
    mapCenter = { lat: 51.5074, lng: -0.1278 };
  }

  // Create markers parameter for static map
  const markers = studiosWithCoords.slice(0, 10).map((studio, index) => {
    return `markers=color:purple%7Clabel:${index + 1}%7C${studio.latitude},${studio.longitude}`;
  }).join('&');

  // Create static map URL (NO API KEY REQUIRED for basic static maps)
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${mapCenter.lat},${mapCenter.lng}&zoom=${zoom}&size=800x400&maptype=roadmap&${markers}&format=png`;

  // Fallback Google Maps search URL
  const searchQuery = studiosWithCoords.length > 0
    ? `pilates+studios+near+${mapCenter.lat},${mapCenter.lng}`
    : 'pilates+studios+near+me';
  const googleMapsUrl = `https://www.google.com/maps/search/${searchQuery}`;

  return (
    <div className="relative">
      <div
        style={{ height, width: '100%' }}
        className="rounded-lg border border-gray-200 bg-gray-100 overflow-hidden"
      >
        {/* Static map image with fallback */}
        <div className="relative w-full h-full">
          <img
            src={staticMapUrl}
            alt={`Map showing ${studiosWithCoords.length} pilates studios`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // If image fails, show interactive fallback
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center flex-col gap-4 bg-gray-50">
                    <div class="text-gray-600 text-center">
                      <div class="mb-4">
                        <svg class="h-12 w-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </div>
                      <p class="text-gray-500 mb-4">View ${studiosWithCoords.length} studios on Google Maps</p>
                      <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer"
                         class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                        Open Google Maps
                      </a>
                    </div>
                  </div>
                `;
              }
            }}
          />

          {/* Overlay with link to interactive map */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white bg-opacity-90 text-gray-800 text-sm rounded shadow-lg hover:bg-opacity-100 transition-all flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open Interactive Map
            </a>
          </div>
        </div>
      </div>

      {/* Studio markers legend */}
      {studiosWithCoords.length > 1 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Studios on Map</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {studiosWithCoords.slice(0, 10).map((studio, index) => (
              <div key={studio.id} className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="truncate">
                  <span className="font-medium">{studio.name}</span>
                  {studio.google_rating && (
                    <span className="ml-2 text-yellow-600">★ {studio.google_rating.toFixed(1)}</span>
                  )}
                </div>
              </div>
            ))}
            {studiosWithCoords.length > 10 && (
              <div className="text-sm text-gray-500 col-span-full">
                +{studiosWithCoords.length - 10} more studios available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}