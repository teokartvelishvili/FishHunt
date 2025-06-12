"use client";

import { useEffect, useState } from "react";

interface GoogleMapWithKMLProps {
  river: string;
}

// ვაცხადებთ, რომ `window.initMap` არსებობს TypeScript-ისთვის
declare global {
  interface Window {
    initMap: () => void;
  }
}

const GoogleMapWithKML: React.FC<GoogleMapWithKMLProps> = ({ river }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (!isScriptLoaded && !window.google) {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsScriptLoaded(true);
      };
      document.body.appendChild(script);
      window.initMap = initMap; // აქ ვამატებთ `initMap`-ს როგორც გლობალურ ფუნქციას
    } else {
      setIsScriptLoaded(true);
      if (window.google) {
        initMap();
      }
    }
  }, [isScriptLoaded]);

  const initMap = () => {
    const googleMap = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: { lat: 41.7151, lng: 44.8271 },
        zoom: 7,
      }
    );
    setMap(googleMap);
  };

  useEffect(() => {
    if (map && river) {
      const kmlUrl = `${window.location.origin}/kml-files/${river}.kml`;

      console.log("Loading KML:", kmlUrl); // Debugging
      const kmlLayer = new google.maps.KmlLayer({
        url: kmlUrl,
        map: map,
      });

      return () => kmlLayer.setMap(null);
    }
  }, [map, river]);

  if (!isScriptLoaded) {
    return <div>Loading Map...</div>;
  }

  return <div id="map" style={{ width: "100%", height: "500px" }} />;
};

export default GoogleMapWithKML;
