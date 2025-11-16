/**
 * Location utility functions for geolocation and reverse geocoding
 */

import { LocationData } from '@/types/location';

export interface GetLocationOptions {
  onSuccess: (location: LocationData) => void;
  onError: (error: string, details?: string) => void;
}

// Re-export LocationData for backward compatibility
export type { LocationData };

/**
 * Gets the user's current location using browser geolocation API
 * and performs reverse geocoding using Nominatim OpenStreetMap service
 * Stores complete Nominatim response data
 */
export const getCurrentLocation = ({
  onSuccess,
  onError,
}: GetLocationOptions): void => {
  // Check if geolocation is supported
  if (!navigator.geolocation) {
    onError(
      'Geolocation Not Supported',
      'Your browser does not support geolocation services'
    );
    return;
  }

  // Get current position
  navigator.geolocation.getCurrentPosition(
    async position => {
      const { latitude, longitude } = position.coords;

      try {
        // Use Nominatim for reverse geocoding (free OpenStreetMap service)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
        );
        const data = await response.json();

        // Store the complete Nominatim response
        const locationData: LocationData = {
          place_id: data.place_id,
          licence: data.licence,
          osm_type: data.osm_type,
          osm_id: data.osm_id,
          lat: data.lat,
          lon: data.lon,
          class: data.class,
          type: data.type,
          place_rank: data.place_rank,
          importance: data.importance,
          addresstype: data.addresstype,
          name: data.name,
          display_name: data.display_name,
          address: data.address || {},
          boundingbox: data.boundingbox,
        };

        onSuccess(locationData);
      } catch (error) {
        console.error('Error getting location details:', error);
        onError(
          'Location Error',
          'Failed to get location details. Please try again.'
        );
      }
    },
    error => {
      console.error('Error getting location:', error);
      onError(
        'Location Access Denied',
        'Unable to get your location. Please check your browser permissions.'
      );
    }
  );
};

/**
 * Formats a location object into a human-readable display string
 * Shows state_district, state, and country
 */
export const formatLocation = (location: LocationData): string => {
  const { address, display_name } = location;

  // Build a concise location string with state_district, state, country
  const parts: string[] = [];

  if (address?.state_district) {
    parts.push(address.state_district);
  }

  if (address?.state) {
    parts.push(address.state);
  }

  if (address?.country) {
    parts.push(address.country);
  }

  return parts.length > 0 ? parts.join(', ') : display_name;
};

/**
 * Validates if a location object has the required data
 */
export const isValidLocation = (
  location: LocationData | undefined
): boolean => {
  return !!(location && location.name);
};
