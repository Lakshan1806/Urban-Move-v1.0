const { Client } = require('@googlemaps/google-maps-services-js');
const client = new Client({});

// Get distance and duration between two points
const getDistanceMatrix = async (origin, destination) => {
  try {
    const response = await client.distancematrix({
      params: {
        origins: [{ lat: origin[1], lng: origin[0] }],
        destinations: [{ lat: destination[1], lng: destination[0] }],
        key: process.env.GOOGLE_MAPS_API_KEY,
        mode: 'driving',
        region: 'lk',
      },
    });

    if (response.data.rows[0].elements[0].status === 'OK') {
      return {
        distance: response.data.rows[0].elements[0].distance.value, // in meters
        duration: response.data.rows[0].elements[0].duration.value, // in seconds
      };
    }
    throw new Error('Distance calculation failed');
  } catch (error) {
    console.error('Error in getDistanceMatrix:', error);
    throw error;
  }
};

// Geocode an address
const geocodeAddress = async (address) => {
  try {
    const response = await client.geocode({
      params: {
        address,
        key: process.env.GOOGLE_MAPS_API_KEY,
        region: 'lk',
      },
    });

    if (response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        coordinates: [location.lng, location.lat],
        address: response.data.results[0].formatted_address,
      };
    }
    throw new Error('Geocoding failed');
  } catch (error) {
    console.error('Error in geocodeAddress:', error);
    throw error;
  }
};

module.exports = { getDistanceMatrix, geocodeAddress };