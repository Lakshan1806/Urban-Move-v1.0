import { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';

const MapComponent = ({ 
  currentLocation, 
  pickupLocation, 
  dropoffLocation, 
  rideStatus 
}) => {
  const [directions, setDirections] = useState(null);
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef(null);

  const mapContainerStyle = {
    width: '100%',
    height: '70vh'
  };

  const defaultCenter = {
    lat: 6.9271,
    lng: 79.8612
  };

  const mapStyles = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "transit",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "administrative",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "road",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ];

  useEffect(() => {
    if (!window.google || !currentLocation) return;

    const directionsService = new window.google.maps.DirectionsService();

    const origin = rideStatus === 'accepted' ? currentLocation : pickupLocation;
    const destination = rideStatus === 'accepted' ? pickupLocation : dropoffLocation;

    if (!origin || !destination) return;

    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false,
        avoidFerries: true,
        avoidTolls: true
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error('Directions request failed:', status);
          setDirections(null);
        }
      }
    );
  }, [currentLocation, pickupLocation, dropoffLocation, rideStatus]);

  const handleMapLoad = (map) => {
    mapRef.current = map;
    setMapError(false);
  };

  const handleMapError = () => {
    setMapError(true);
    console.error('Google Maps failed to load');
  };

  if (mapError) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-red-50 p-4">
        <div className="text-red-600 font-medium mb-2">
          Google Maps failed to load
        </div>
        <p className="text-sm text-gray-600 text-center">
          Please check your API key and network connection.
        </p>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      onError={handleMapError}
      libraries={['places', 'geometry']}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={currentLocation || defaultCenter}
        zoom={15}
        onLoad={handleMapLoad}
        options={{
          disableDefaultUI: true, 
          zoomControl: false,     
          gestureHandling: 'greedy',
          styles: mapStyles,      
          clickableIcons: false,  
          minZoom: 12,            
          maxZoom: 18             
        }}
      >
        {currentLocation && (
          <Marker
            position={currentLocation}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}

        {pickupLocation && (
          <Marker
            position={pickupLocation}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            label="P"
          />
        )}

        {dropoffLocation && rideStatus === 'in_progress' && (
          <Marker
            position={dropoffLocation}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            label="D"
          />
        )}

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#3b82f6',
                strokeWeight: 5,
                strokeOpacity: 0.8,
                zIndex: 1
              },
              preserveViewport: true
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;