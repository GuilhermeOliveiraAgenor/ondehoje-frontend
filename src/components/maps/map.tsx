'use client'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'

import { Icon } from 'leaflet'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'

import { Icons } from '@/components/ui/icons'
import { Skeleton } from '@/components/ui/skeleton'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

interface MapProps {
  onPositionMarkerChange: (latitude: number, longitude: number) => void
  latitude: number
  longitude: number
}

export default function Map({
  onPositionMarkerChange,
  latitude,
  longitude,
}: MapProps) {
  console.log('Map props:', { latitude, longitude })
  const [positionMarker, setPositionMarker] = useState({
    latitude,
    longitude,
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigator.geolocation.getCurrentPosition(function (position) {
        if (latitude === 0 && longitude === 0) {
          setPositionMarker({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          onPositionMarkerChange(
            position.coords.latitude,
            position.coords.longitude,
          )
        }

        setIsLoading(false)
      })
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Skeleton className="h-24 w-full bg-transparent" />
        <Icons.spinner className="h-4 w-4" />
      </div>
    )
  }

  const mapIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/252/252025.png',
    iconSize: [30, 30],
  })

  function MyComponent() {
    useMapEvents({
      click(event) {
        const { lat, lng } = event.latlng
        setPositionMarker({
          latitude: parseFloat(lat.toFixed(6)),
          longitude: parseFloat(lng.toFixed(6)),
        })
        onPositionMarkerChange(
          parseFloat(lat.toFixed(6)),
          parseFloat(lng.toFixed(6)),
        )
      },
    })

    return (
      <Marker
        position={[positionMarker.latitude, positionMarker.longitude]}
        icon={mapIcon}
      />
    )
  }

  return (
    <MapContainer
      center={[positionMarker.latitude, positionMarker.longitude]}
      zoom={15}
      scrollWheelZoom={false}
      className="relative z-0 h-full w-full overflow-hidden"
    >
      <MyComponent />
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`}
      />
    </MapContainer>
  )
}
