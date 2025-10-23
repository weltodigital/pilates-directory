'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Star, Phone, ExternalLink, Clock, Users } from 'lucide-react';

interface Studio {
  id: string;
  name: string;
  description: string;
  address: string;
  postcode: string;
  city: string;
  county: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  google_rating?: number;
  google_review_count: number;
  class_types: string[];
  price_range?: string;
  beginner_friendly: boolean;
  online_booking_available: boolean;
  parking_available: boolean;
  full_url_path: string;
}

interface LocationStudiosMapProps {
  studios: Studio[];
  locationName: string;
  locationType: 'county' | 'city';
}

export default function LocationStudiosMap({ studios, locationName, locationType }: LocationStudiosMapProps) {
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);

  // Filter studios that have coordinates
  const studiosWithCoords = studios.filter(studio => studio.latitude && studio.longitude);

  if (studiosWithCoords.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2 text-gray-600">Map View Unavailable</h3>
        <p className="text-gray-500">
          Location data is being updated for studios in {locationName}.
        </p>
      </div>
    );
  }

  // Calculate the center point and zoom level
  const centerLat = studiosWithCoords.reduce((sum, studio) => sum + (studio.latitude || 0), 0) / studiosWithCoords.length;
  const centerLng = studiosWithCoords.reduce((sum, studio) => sum + (studio.longitude || 0), 0) / studiosWithCoords.length;

  // Determine zoom level based on spread of locations
  const latSpread = Math.max(...studiosWithCoords.map(s => s.latitude || 0)) - Math.min(...studiosWithCoords.map(s => s.latitude || 0));
  const lngSpread = Math.max(...studiosWithCoords.map(s => s.longitude || 0)) - Math.min(...studiosWithCoords.map(s => s.longitude || 0));
  const maxSpread = Math.max(latSpread, lngSpread);

  let zoom = 13;
  if (maxSpread > 0.1) zoom = 11;
  if (maxSpread > 0.2) zoom = 10;
  if (maxSpread > 0.5) zoom = 9;

  // Create static map image instead of interactive embed (no API calls)
  const markers = studiosWithCoords.slice(0, 10).map((studio, index) => {
    return `markers=color:purple%7Clabel:${index + 1}%7C${studio.latitude},${studio.longitude}`;
  }).join('&');

  // Static map URL (free for reasonable usage)
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${centerLat},${centerLng}&zoom=${zoom}&size=600x400&maptype=roadmap&${markers}&format=png`;

  // Fallback Google Maps search URL for "Open in Google Maps" button
  const searchQuery = `pilates+studios+in+${encodeURIComponent(locationName)}`;
  const googleMapsUrl = `https://www.google.com/maps/search/${searchQuery}/@${centerLat},${centerLng},${zoom}z`;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-purple-600" />
              Pilates Studios Map - {locationName}
            </h2>
            <p className="text-gray-600 mt-1">
              {studiosWithCoords.length} studio{studiosWithCoords.length !== 1 ? 's' : ''}
              {studiosWithCoords.length !== studios.length && (
                <span className="text-sm"> ({studios.length - studiosWithCoords.length} more without map locations)</span>
              )}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Click markers to view studio details
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        {/* Map */}
        <div className="lg:col-span-2 h-96 bg-gray-200 relative">
          <div className="relative w-full h-full">
            <img
              src={staticMapUrl}
              alt={`Map showing ${studiosWithCoords.length} pilates studios in ${locationName}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // If static map fails, show fallback
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center flex-col gap-4 bg-gray-100">
                      <div class="text-center">
                        <div class="mb-4">
                          <svg class="h-16 w-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                        </div>
                        <h3 class="text-lg font-semibold mb-2 text-gray-600">View ${studiosWithCoords.length} Studios on Map</h3>
                        <p class="text-gray-500 mb-4">Interactive map with all pilates studios in ${locationName}</p>
                        <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer"
                           class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
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

            {/* Overlay for interactive map link */}
            <div className="absolute top-4 right-4">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 text-sm rounded shadow hover:shadow-md transition-all"
              >
                <ExternalLink className="h-4 w-4" />
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Studio List */}
        <div className="lg:col-span-1 h-96 overflow-y-auto bg-gray-50">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Studios on Map</h3>
            <div className="space-y-3">
              {studiosWithCoords.map((studio, index) => (
                <div
                  key={studio.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedStudio?.id === studio.id
                      ? 'bg-purple-50 border-purple-200 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-purple-200 hover:bg-purple-50'
                  }`}
                  onClick={() => setSelectedStudio(selectedStudio?.id === studio.id ? null : studio)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm leading-tight">{studio.name}</h4>
                      <p className="text-xs text-gray-500 mt-1 truncate">{studio.address}</p>
                      {studio.google_rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">{studio.google_rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded Studio Details */}
                  {selectedStudio?.id === studio.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="space-y-2">
                        {studio.phone && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{studio.phone}</span>
                          </div>
                        )}

                        {studio.price_range && (
                          <div className="text-xs text-gray-600">
                            <strong>Price:</strong> {studio.price_range}
                          </div>
                        )}

                        {studio.class_types && studio.class_types.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {studio.class_types.slice(0, 2).map((type, idx) => (
                              <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                {type}
                              </span>
                            ))}
                            {studio.class_types.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{studio.class_types.length - 2}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                          {studio.beginner_friendly && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />Beginner Friendly
                            </span>
                          )}
                          {studio.online_booking_available && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />Online Booking
                            </span>
                          )}
                          {studio.parking_available && (
                            <span>🅿️ Parking</span>
                          )}
                        </div>

                        <div className="flex gap-2 mt-3">
                          <Link
                            href={`/${studio.full_url_path}`}
                            className="flex-1 text-center px-3 py-1.5 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                          >
                            View Details
                          </Link>
                          {studio.website && (
                            <a
                              href={studio.website}
                              target="_blank"
                              rel="nofollow noopener noreferrer"
                              className="px-3 py-1.5 border border-purple-600 text-purple-600 text-xs rounded hover:bg-purple-50 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Studios without coordinates */}
      {studios.length > studiosWithCoords.length && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-2">
            Additional Studios in {locationName}
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            These studios don't have map locations yet but are available in {locationName}:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {studios
              .filter(studio => !studio.latitude || !studio.longitude)
              .map((studio) => (
                <Link
                  key={studio.id}
                  href={`/${studio.full_url_path}`}
                  className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-colors group"
                >
                  <div>
                    <h5 className="font-medium text-sm text-gray-900 group-hover:text-purple-700">{studio.name}</h5>
                    <p className="text-xs text-gray-500">{studio.address}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-purple-600" />
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}