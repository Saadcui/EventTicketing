"use client"

import { useEffect, useRef } from "react"

interface EventMapProps {
  address: string
}

export default function EventMap({ address }: EventMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  // This is a placeholder for a real map implementation
  // In a real app, you would use a library like Mapbox, Google Maps, or Leaflet
  useEffect(() => {
    if (mapRef.current) {
      // Simulate a map with a colored div
      const mapContainer = mapRef.current
      mapContainer.style.backgroundColor = "#e5e7eb"
      mapContainer.style.position = "relative"

      // Add a marker
      const marker = document.createElement("div")
      marker.style.position = "absolute"
      marker.style.top = "50%"
      marker.style.left = "50%"
      marker.style.transform = "translate(-50%, -50%)"
      marker.style.width = "20px"
      marker.style.height = "20px"
      marker.style.backgroundColor = "red"
      marker.style.borderRadius = "50%"

      mapContainer.appendChild(marker)

      // Add address text
      const addressText = document.createElement("div")
      addressText.style.position = "absolute"
      addressText.style.bottom = "10px"
      addressText.style.left = "10px"
      addressText.style.backgroundColor = "white"
      addressText.style.padding = "5px 10px"
      addressText.style.borderRadius = "4px"
      addressText.style.fontSize = "12px"
      addressText.textContent = address

      mapContainer.appendChild(addressText)
    }
  }, [address])

  return (
    <div
      ref={mapRef}
      className="w-full h-[200px] rounded-md overflow-hidden"
      aria-label={`Map showing location: ${address}`}
    />
  )
}
