'use client'

import { useState, useEffect } from 'react'

export default function TestPage() {
  const [studios, setStudios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        console.log('Fetching pilates studios...')
        const response = await fetch('/api/studios')
        console.log('Response:', response)
        
        if (!response.ok) {
          throw new Error('Failed to fetch pilates studios')
        }
        
        const data = await response.json()
        console.log('Data:', data)
        setStudios(data.studios || [])
      } catch (err) {
        console.error('Error:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchStudios()
  }, [])

  if (loading) {
    return <div>Loading pilates studios...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page - Pilates Studios</h1>
      <p>Found {studios.length} pilates studios</p>
      
      {studios.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Pilates Studios:</h2>
          <ul className="space-y-2">
            {studios.slice(0, 5).map((studio: any) => (
              <li key={studio.id} className="p-2 border rounded">
                <strong>{studio.name}</strong> - {studio.city} ({studio.rating}⭐)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
