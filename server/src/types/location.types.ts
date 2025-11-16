/**
 * Location Types
 * Shared location data structure matching Nominatim API response
 */

/**
 * Location data interface matching Nominatim API structure
 * Stores complete location data from OpenStreetMap Nominatim service
 *
 * @description
 * This structure stores all location data returned by Nominatim API.
 * Used across Posts and Profiles for consistent location storage.
 *
 * @example
 * ```typescript
 * const location: LocationData = {
 *   place_id: 229887299,
 *   osm_type: "way",
 *   osm_id: 62525106,
 *   lat: "23.2095197",
 *   lon: "72.6335195",
 *   display_name: "Road 2, Sector 6, Gandhinagar, Gujarat, 382006, India",
 *   address: {
 *     road: "Road 2",
 *     city: "गाँधीनगर",
 *     state: "Gujarat",
 *     country: "India",
 *     postcode: "382006"
 *   }
 * }
 * ```
 */
export interface LocationData {
  /** Unique place identifier from OSM */
  place_id: number;

  /** License information for the data */
  licence?: string;

  /** OpenStreetMap type (node, way, relation) */
  osm_type: string;

  /** OpenStreetMap ID */
  osm_id: number;

  /** Latitude as string */
  lat: string;

  /** Longitude as string */
  lon: string;

  /** OSM class (highway, boundary, amenity, etc.) */
  class?: string;

  /** OSM type classification */
  type?: string;

  /** Place ranking for search results */
  place_rank?: number;

  /** Importance score for ranking */
  importance?: number;

  /** Address type (road, city, country, etc.) */
  addresstype?: string;

  /** Short name of the place */
  name?: string;

  /** Full human-readable address */
  display_name: string;

  /** Detailed address components */
  address: {
    /** Street/road name */
    road?: string;

    /** Neighbourhood name */
    neighbourhood?: string;

    /** City name */
    city?: string;

    /** County/district name */
    county?: string;

    /** State district name */
    state_district?: string;

    /** State/province name */
    state?: string;

    /** ISO 3166-2 level 4 code */
    ISO3166_2_lvl4?: string;

    /** Postal/ZIP code */
    postcode?: string;

    /** Country name */
    country?: string;

    /** ISO country code */
    country_code?: string;

    /** Additional address fields */
    [key: string]: any;
  };

  /** Bounding box coordinates [min_lat, max_lat, min_lon, max_lon] */
  boundingbox?: string[];
}
