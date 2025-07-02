"use client";

import { GEORGIAN_RIVERS } from './rivers';

const NearestBeachButton = () => {
  const getUserLocation = (searchQuery: string) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const destination = encodeURIComponent(searchQuery);
        
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destination}&travelmode=walking`;
        
        window.open(googleMapsUrl, "_blank");
      });
    } else {
      alert("გეოლოკაცია არ არის მხარდაჭერილი ამ ბრაუზერში");
    }
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center my-6">
      {GEORGIAN_RIVERS.map((river) => (
        <button
          key={river.id}
          onClick={() => getUserLocation(river.searchQuery)}
          className={`px-4 py-2 text-white rounded transition-colors ${river.buttonColor || 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {river.buttonText || `${river.name} - სანაპირო`}
        </button>
      ))}
    </div>
  );
};

export default NearestBeachButton;
