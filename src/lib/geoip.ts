import geoip from "geoip-lite";

/**
 * Get geographical information based on the IP address.
 *
 * @param {string} ip - The IP address to lookup.
 * @returns {geoip.Lookup | null} - The geographical information or null if not found.
 */
export function lookupGeoData(ip: string) {
  return geoip.lookup(ip);
}
