const env = require("../config/env");
const { normalizeArea } = require("../utils/area");

// In-memory only — fine for a single server instance at this scale.
// Resets on restart; that's an accepted tradeoff, not a bug.
const cache = new Map();

const geocodeArea = async (areaRaw) => {
  const key = normalizeArea(areaRaw);
  if (cache.has(key)) return cache.get(key);

  let result = null;
  try {
    const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
    url.searchParams.set("address", areaRaw);
    url.searchParams.set("components", `country:${env.geocoding.regionBias}`);
    url.searchParams.set("key", env.geocoding.serverKey);

    const response = await fetch(url);
    const data = await response.json();

    const location = data?.results?.[0]?.geometry?.location;
    if (data.status === "OK" && location) {
      result = { lat: location.lat, lng: location.lng };
    }
  } catch (error) {
    // A failed lookup never blocks saving the lead — it just won't have a pin.
    result = null;
  }

  // Only cache successes — a transient failure shouldn't permanently poison
  // this area for the rest of the process lifetime; let the next save retry.
  if (result) cache.set(key, result);
  return result;
};

module.exports = { geocodeArea };
