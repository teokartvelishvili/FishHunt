"use client";

import { useEffect, useState } from "react";


interface GoogleMapWithKMLProps {
  river: string;
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
      script.onload = () => setIsScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsScriptLoaded(true);
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
      const kmlUrl = `/kml-files/${river}.kml`; // KML URL

      const kmlLayer = new google.maps.KmlLayer({
        url: kmlUrl,
        map: map,
      });

      return () => kmlLayer.setMap(null); // Clean up the KML layer
    }
  }, [map, river]);

  if (!isScriptLoaded) {
    return <div>Loading Map...</div>;
  }

  return <div id="map" style={{ width: "100%", height: "500px" }} />;
};

export default GoogleMapWithKML;
