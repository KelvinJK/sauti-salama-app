/**
 * Office location. The destination is the shared pin the team provided
 * (6°46'20.6"S 39°14'39.1"E / -6.772382, +39.244204 — plus code 66HV+2MW,
 * Dar es Salaam). We link with Google's documented permanent form rather
 * than the short share URL, because share links carry a one-time session
 * key (skid) that stops working after a while.
 */
export const OFFICE_LAT = -6.772382;
export const OFFICE_LNG = 39.244204;

export const OFFICE_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${OFFICE_LAT},${OFFICE_LNG}`;
