import { useEffect, useState } from "react";

const SCRIPT_ID = "google-maps-script";

// Loads the Google Maps JS API once and shares it across every map on the
// page. The browser key is restricted by HTTP referrer and only ever used
// for rendering — geocoding itself always happens server-side.
export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(() => Boolean(window.google?.maps));
  const [error, setError] = useState(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_BROWSER_KEY;

  useEffect(() => {
    if (window.google?.maps) {
      setIsLoaded(true);
      return undefined;
    }

    if (!apiKey) {
      setError("Map is not configured (missing VITE_GOOGLE_MAPS_BROWSER_KEY).");
      return undefined;
    }

    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => setIsLoaded(true));
      return undefined;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setError("Failed to load Google Maps.");
    document.head.appendChild(script);

    return undefined;
  }, [apiKey]);

  return { isLoaded, error };
};
