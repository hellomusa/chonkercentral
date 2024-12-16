'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useTheme } from 'next-themes'
import { fetchBuildings } from '@/lib/api'
import type { Building } from '@prisma/client'

const MAPBOX_STYLE = 'mapbox://styles/mapbox/dark-v11'
const CARLETON_BOUNDS = new mapboxgl.LngLatBounds([
  [-75.707077, 45.376644],
  [-75.689986, 45.391594],
])

interface MapProps {
  onBuildingSelect: (buildingName: string | null) => void
}

export default function Map() {
  const { theme } = useTheme()
  const [buildings, setBuildings] = useState<Building[]>([])

  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_STYLE,
      maxBounds: CARLETON_BOUNDS,
      pitch: 15,
      antialias: true,
      config: {
        basemap: {
          lightPreset: theme === 'dark' ? 'dusk' : 'dawn',
        },
      },
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
    // Print layers when map loads
    map.current.on('style.load', () => {
      const layers = map.current?.getStyle()!.layers
      console.log('Map layers:', layers)
    })

    map.current.on('load', () => {
      // Add an empty GeoJSON source for the building outline
      map.current?.addSource('building-outline', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      })

      // Add a layer for the building outline
      map.current?.addLayer({
        id: 'building-outline-layer',
        type: 'line',
        source: 'building-outline',
        layout: {},
        paint: {
          'line-color': '#ffffff', // Red color for the outline
          'line-width': 2, // Thickness of the outline
          'line-opacity': 0.6, // Slight transparency
        },
      })

      // Handle click event on the map
      map.current?.on('click', function (e) {
        // Query rendered features at the clicked point
        const feature = map.current?.queryRenderedFeatures(e.point, {
          layers: ['building'], // Specify the "building" layer to ensure correct querying
        })[0]

        if (feature) {
          // Update the source data with the clicked feature's geometry
          const source: mapboxgl.GeoJSONSource =
            map.current?.getSource('building-outline')!
          source.setData({
            type: 'FeatureCollection',
            features: [feature], // Use the clicked feature as the data
          })

          // Optional: Fly to the clicked location
          map.current?.flyTo({ center: e.lngLat })
        }
      })
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [theme])

  // Fetch buildings data
  useEffect(() => {
    async function loadBuildings() {
      try {
        const buildingsData = await fetchBuildings()
        setBuildings(buildingsData)
      } catch (error) {
        console.error('Failed to load buildings:', error)
      }
    }
    loadBuildings()
  }, [])

  // Handle theme changes
  useEffect(() => {
    if (!map.current) return

    map.current.setStyle(MAPBOX_STYLE, {
      config: {
        basemap: {
          lightPreset: theme === 'dark' ? 'dusk' : 'dawn',
        },
      },
      localFontFamily: 'arial',
      localIdeographFontFamily: 'arial',
    })
  }, [theme])

  const handleMarkerClick = useCallback(
    (el: HTMLDivElement, buildingName: string) => {
      // Update marker styles
      document.querySelectorAll('.marker').forEach((m) => {
        m.classList.remove('active')
        m
          .querySelector('.marker-label')
          ?.classList.remove('marker-label-active')
        m.querySelector('.marker-label')?.classList.add('marker-label-hidden')
      })

      el.classList.add('active')
      el.querySelector('.marker-label')?.classList.remove('marker-label-hidden')
      el.querySelector('.marker-label')?.classList.add('marker-label-active')

      //     setSelectedBuilding(buildingName)
      //  }, [setSelectedBuilding])
    },
    []
  )

  const createMarkerElement = useCallback((building: Building) => {
    const el = document.createElement('div')
    el.className = `marker ${building.name === 'MacOdrum Library' ? 'library-building' : 'study-building'}`

    const label = document.createElement('div')
    label.className = 'marker-label marker-label-hidden'
    label.textContent = building.name
    el.appendChild(label)

    return el
  }, [])

  // Handle markers
  useEffect(() => {
    if (!map.current || !buildings.length) return

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    buildings.forEach((building) => {
      const el = createMarkerElement(building)

      const marker = new mapboxgl.Marker(el)
        .setLngLat([building.lng, building.lat])
        .addTo(map.current!)

      el.addEventListener('click', () => handleMarkerClick(el, building.name))
      markersRef.current.push(marker)
    })

    return () => {
      markersRef.current.forEach((marker) => marker.remove())
    }
  }, [theme, buildings, handleMarkerClick, createMarkerElement])

  return (
    <div ref={mapContainer} className="w-full h-full rounded-lg shadow-lg" />
  )
}
