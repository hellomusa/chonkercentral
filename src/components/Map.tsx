'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTheme } from 'next-themes';
import { fetchBuildings } from '@/lib/api';
import type { Building } from '@prisma/client';

const MAPBOX_STYLE = 'mapbox://styles/musa6/cm4dnrztg01lq01qr3lec1mvu';
const CARLETON_BOUNDS = new mapboxgl.LngLatBounds([[-75.707077, 45.376644], [-75.689986, 45.391594]]);

interface MapProps {
  onBuildingSelect: (buildingName: string | null) => void;
}

export default function Map() {
  const { theme } = useTheme();
  const [buildings, setBuildings] = useState<Building[]>([]);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

    // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_STYLE,
      maxBounds: CARLETON_BOUNDS,
      pitch: 30,
      antialias: true,
      config: {
        basemap: {
          lightPreset: theme === 'dark' ? 'dusk' : 'dawn'
        }
      }
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Print layers when map loads
    map.current.on('style.load', () => {
      const layers = map.current?.getStyle()!.layers;
      console.log('Map layers:', layers);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [theme]);

  // Fetch buildings data
  useEffect(() => {
    async function loadBuildings() {
      try {
        const buildingsData = await fetchBuildings();
        setBuildings(buildingsData);
      } catch (error) {
        console.error('Failed to load buildings:', error);
      }
    }
    loadBuildings();
  }, []);

  // Handle theme changes
  useEffect(() => {
    if (!map.current) return;
    
    map.current.setStyle(MAPBOX_STYLE, {
      config: {
        basemap: {
          lightPreset: theme === 'dark' ? 'dusk' : 'dawn'
        },
      },
      localFontFamily: "arial",
      localIdeographFontFamily: "arial"
    });
  }, [theme]);

  const handleMarkerClick = useCallback((el: HTMLDivElement, buildingName: string) => {
    // Update marker styles
    document.querySelectorAll('.marker').forEach(m => {
      m.classList.remove('active');
      m.querySelector('.marker-label')?.classList.remove('marker-label-active');
      m.querySelector('.marker-label')?.classList.add('marker-label-hidden');
    });
    
    el.classList.add('active');
    el.querySelector('.marker-label')?.classList.remove('marker-label-hidden');
    el.querySelector('.marker-label')?.classList.add('marker-label-active');
    
    // Notify parent component of building selection
    // onBuildingSelect(buildingName);
 // }, [onBuildingSelect])
  }, [])

  const createMarkerElement = useCallback((building: Building) => {
    const el = document.createElement('div');
    el.className = `marker ${building.name === 'MacOdrum Library' ? 'library-building' : 'study-building'}`;
    
    const label = document.createElement('div');
    label.className = 'marker-label marker-label-hidden';
    label.textContent = building.name;
    el.appendChild(label);

    return el;
  }, []);

  // Handle markers
  useEffect(() => {
    if (!map.current || !buildings.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    buildings.forEach(building => {
      const el = createMarkerElement(building);
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([building.lng, building.lat])
        .addTo(map.current!);

      el.addEventListener('click', () => handleMarkerClick(el, building.name));
      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
    };
  }, [theme, buildings, handleMarkerClick, createMarkerElement]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full rounded-lg shadow-lg"
    />
  );
}