'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface Butcher {
  id: string
  name: string
  address: string
  city: string
  postcode: string
  latitude?: number
  longitude?: number
  rating: number
  phone?: string
  website?: string
  full_url_path?: string
}

interface GoogleMapProps {
  butchers: Butcher[]
  center?: { lat: number; lng: number }
  zoom?: number
  height?: string
  className?: string
  showSingleMarker?: boolean
}

declare global {
  interface Window {
    google: any
  }
}

export default function GoogleMap({
  butchers,
  center,
  zoom = 12,
  height = '400px',
  className = '',
  showSingleMarker = false
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const initMap = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

      if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        if (isMounted) {
          setError('Google Maps API key not configured')
          setIsLoading(false)
        }
        return
      }

      if (!mapRef.current || !isMounted) return

      try {
        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['maps']
        })

        await loader.load()

        if (!isMounted) return

        const google = window.google

        // Calculate center if not provided
        let mapCenter = center
        if (!mapCenter && butchers.length > 0) {
          if (butchers.length === 1 && butchers[0].latitude && butchers[0].longitude) {
            mapCenter = {
              lat: butchers[0].latitude,
              lng: butchers[0].longitude
            }
          } else {
            // Calculate bounds center
            const bounds = new google.maps.LatLngBounds()
            butchers.forEach(butcher => {
              if (butcher.latitude && butcher.longitude) {
                bounds.extend({ lat: butcher.latitude, lng: butcher.longitude })
              }
            })
            mapCenter = {
              lat: bounds.getCenter().lat(),
              lng: bounds.getCenter().lng()
            }
          }
        }

        if (!mapCenter) {
          mapCenter = { lat: 51.5074, lng: -0.1278 } // Default to London
        }

        const newMap = new google.maps.Map(mapRef.current, {
          center: mapCenter,
          zoom: butchers.length === 1 ? 15 : zoom,
          mapTypeId: 'roadmap',
          styles: [
            {
              featureType: 'poi.business',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        })

        // Add markers for butchers
        const markers: any[] = []
        const infoWindows: any[] = []

        butchers.forEach((butcher, index) => {
          if (!butcher.latitude || !butcher.longitude) return

          const marker = new google.maps.Marker({
            position: { lat: butcher.latitude, lng: butcher.longitude },
            map: newMap,
            title: butcher.name,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#bf2d11" stroke="white" stroke-width="2"/>
                  <text x="16" y="20" text-anchor="middle" fill="white" font-size="16" font-weight="bold">🥩</text>
                </svg>
              `),
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 16)
            }
          })

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-3 max-w-xs">
                <h3 class="font-bold text-gray-900 mb-2">${butcher.name}</h3>
                <p class="text-sm text-gray-600 mb-2">${butcher.address}, ${butcher.city}</p>
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-yellow-500">★</span>
                  <span class="text-sm font-medium">${butcher.rating.toFixed(1)}</span>
                </div>
                <div class="flex gap-2 text-sm">
                  ${butcher.phone ? `<a href="tel:${butcher.phone}" class="text-purple-600 hover:underline">Call</a>` : ''}
                  ${butcher.website ? `<a href="${butcher.website}" target="_blank" class="text-purple-600 hover:underline">Website</a>` : ''}
                  ${butcher.full_url_path ? `<a href="/${butcher.full_url_path}" class="text-purple-600 hover:underline">Details</a>` : ''}
                </div>
              </div>
            `
          })

          marker.addListener('click', () => {
            // Close all other info windows
            infoWindows.forEach(iw => iw.close())
            infoWindow.open(newMap, marker)
          })

          markers.push(marker)
          infoWindows.push(infoWindow)
        })

        // Fit map to show all markers if multiple butchers
        if (butchers.length > 1 && !showSingleMarker) {
          const bounds = new google.LatLngBounds()
          butchers.forEach(butcher => {
            if (butcher.latitude && butcher.longitude) {
              bounds.extend({ lat: butcher.latitude, lng: butcher.longitude })
            }
          })
          newMap.fitBounds(bounds)

          // Set minimum zoom level
          const listener = google.maps.event.addListener(newMap, 'idle', () => {
            if (newMap.getZoom() > 16) {
              newMap.setZoom(16)
            }
            google.maps.event.removeListener(listener)
          })
        }

        if (isMounted) {
          setMap(newMap)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error)
        if (isMounted) {
          setError('Failed to load map')
          setIsLoading(false)
        }
      }
    }

    initMap()

    return () => {
      isMounted = false
    }
  }, [butchers, center, zoom, showSingleMarker])

  if (error) {
    return (
      <div
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <p className="text-gray-600 mb-2">Map unavailable</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={mapRef}
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ height }}
    />
  )
}