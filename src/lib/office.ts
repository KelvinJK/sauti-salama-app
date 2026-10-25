/**
 * Office location — confirmed by the team as 114 Rose Garden Road,
 * Dar es Salaam, Tanzania (Kinondoni). Google's geocoder resolves it to the
 * formatted address "114 Rose Garden Rd, Dar es Salaam, Tanzania" at
 * -6.765818, 39.2481242.
 *
 * The link uses Google's documented permanent search form rather than a share
 * URL, because share links carry a one-time session key (skid) that stops
 * working after a while. The place_id form was tested and does not open this
 * address, so the text query below is the form that actually lands on the pin.
 */
export const OFFICE_ADDRESS = "114 Rose Garden Road, Dar es Salaam, Tanzania";
export const OFFICE_LAT = -6.765818;
export const OFFICE_LNG = 39.2481242;

/** Google's canonical short form of the address, used in the map link. */
export const OFFICE_MAP_QUERY = "114 Rose Garden Rd, Dar es Salaam, Tanzania";

export const OFFICE_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  OFFICE_MAP_QUERY,
)}`;
