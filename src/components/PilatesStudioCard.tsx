'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Globe, Star, Clock } from 'lucide-react';
import StudioImage from '@/components/StudioImage';

interface PilatesStudio {
  id: string;
  name: string;
  description: string;
  address: string;
  postcode: string;
  city: string;
  county: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  google_rating?: number;
  google_review_count?: number;
  class_types: string[];
  instructor_names?: string[];
  specialties?: string[];
  price_range?: string;
  equipment_available?: string[];
  is_active: boolean;
  opening_hours?: Record<string, string>;
  full_url_path?: string;
  images?: string[];
}

interface PilatesStudioCardProps {
  studio: PilatesStudio;
  showLocation?: boolean;
}

export default function PilatesStudioCard({ studio, showLocation = true }: PilatesStudioCardProps) {
  const handleContactClick = () => {
    if (studio.website) {
      window.open(studio.website, '_blank', 'noopener,noreferrer');
    } else if (studio.phone) {
      window.open(`tel:${studio.phone}`, '_self');
    }
  };

  const formatOpeningHours = (hours: Record<string, string>) => {
    if (!hours || Object.keys(hours).length === 0) return null;

    const today = new Date().getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayKey = today.toString();

    if (hours[todayKey]) {
      return hours[todayKey];
    }

    return Object.values(hours)[0];
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Studio Image */}
      <StudioImage
        src={studio.images && studio.images.length > 0 ? studio.images[0] : ''}
        alt={`${studio.name} - Studio Image`}
        studioName={studio.name}
        containerClassName="w-full h-48"
        size="medium"
      />

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {studio.name}
            </h3>

          {/* Rating */}
          {studio.google_rating && (
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm font-medium text-gray-900">
                  {studio.google_rating}
                </span>
              </div>
              {studio.google_review_count && studio.google_review_count > 0 && (
                <span className="ml-2 text-sm text-gray-600">
                  ({studio.google_review_count} reviews)
                </span>
              )}
            </div>
          )}

          {/* Location */}
          {showLocation && (
            <div className="flex items-start mb-3">
              <MapPin className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-600">
                <div>{studio.address}</div>
                {studio.city && studio.county && (
                  <div>{studio.city}, {studio.county}</div>
                )}
              </div>
            </div>
          )}

          {/* Class Types */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {studio.class_types.slice(0, 3).map((classType, index) => (
                <span
                  key={index}
                  className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium"
                >
                  {classType}
                </span>
              ))}
              {studio.class_types.length > 3 && (
                <span className="inline-block text-purple-600 px-2 py-1 rounded text-xs">
                  +{studio.class_types.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {studio.description}
          </p>

          {/* Opening Hours */}
          {studio.opening_hours && Object.keys(studio.opening_hours).length > 0 && (
            <div className="flex items-center mb-3 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-purple-600 mr-2" />
              <span>{formatOpeningHours(studio.opening_hours)}</span>
            </div>
          )}

          {/* Contact Information */}
          <div className="flex items-center space-x-4 mb-4">
            {studio.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 text-purple-600 mr-1" />
                <span>{studio.phone}</span>
              </div>
            )}
            {studio.website && (
              <div className="flex items-center text-sm text-gray-600">
                <Globe className="h-4 w-4 text-purple-600 mr-1" />
                <span>Website</span>
              </div>
            )}
          </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleContactClick}
            className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            {studio.website ? 'Visit Website' : studio.phone ? 'Call Studio' : 'Contact Studio'}
          </button>

          {studio.full_url_path && (
            <Link
              href={`/${studio.full_url_path}`}
              className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition-colors text-sm font-medium"
            >
              View Details
            </Link>
          )}
        </div>

        {/* Specialties */}
        {studio.specialties && studio.specialties.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500 mb-1">Specialties:</div>
            <div className="flex flex-wrap gap-1">
              {studio.specialties.slice(0, 2).map((specialty, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}