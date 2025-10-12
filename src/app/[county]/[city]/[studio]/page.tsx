import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Star, Clock, Phone } from 'lucide-react';

interface StudioPageProps {
  params: Promise<{
    county: string;
    city: string;
    studio: string;
  }>;
}

export async function generateMetadata({ params }: StudioPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  return {
    title: `Pilates Studio in ${resolvedParams.city} | Find Classes Near You`,
    description: `Discover pilates classes and studio information. Find reformer, mat, and clinical pilates with verified reviews and online booking.`,
  };
}

export default async function StudioPage({ params }: StudioPageProps) {
  const resolvedParams = await params;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="container">
          <nav className="text-sm text-gray-600 mb-4">
            <ol className="flex space-x-2">
              <li>
                <Link href="/" className="hover:text-purple-600">Home</Link>
              </li>
              <li className="before:content-['/'] before:mx-2">
                <Link href={`/${resolvedParams.county}`} className="hover:text-purple-600">
                  {resolvedParams.county}
                </Link>
              </li>
              <li className="before:content-['/'] before:mx-2">
                <Link href={`/${resolvedParams.county}/${resolvedParams.city}`} className="hover:text-purple-600">
                  {resolvedParams.city}
                </Link>
              </li>
              <li className="before:content-['/'] before:mx-2 text-gray-900">{resolvedParams.studio}</li>
            </ol>
          </nav>

          <h1>Pilates Studio in {resolvedParams.city}</h1>
          <p>Find detailed information about this pilates studio including class schedules, instructor profiles, and booking options.</p>

          <div className="meta-badges">
            <span className="meta-badge primary">
              <MapPin className="h-3 w-3" />
              {resolvedParams.city}
            </span>
            <span className="meta-badge success">
              <Star className="h-3 w-3" />
              Professional Studio
            </span>
            <span className="meta-badge warning">
              <Clock className="h-3 w-3" />
              Classes Available
            </span>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <button className="btn-primary">
              <Phone className="h-4 w-4 mr-2" />
              Contact Studio
            </button>
            <button className="btn-secondary">
              <Clock className="h-4 w-4 mr-2" />
              View Schedule
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="content-section">
            <h2>About This Studio</h2>
            <p>This pilates studio offers a range of classes including reformer pilates, mat classes, and specialized programs. Contact the studio directly for the most up-to-date class schedules and pricing information.</p>

            <div className="mt-6">
              <button className="btn-secondary">
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}