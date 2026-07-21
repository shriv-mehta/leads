import { useEffect, useRef } from "react";
import { useGoogleMaps } from "../../hooks/useGoogleMaps";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const EDMONTON_CENTER = { lat: 53.5461, lng: -113.4938 };

// One pin per area — sized by lead count, with a conversion-rate readout on
// click. Falls back to a plain list if Maps isn't configured or an area has
// no coordinates yet (a failed geocode never hides the lead, just its pin).
const AreaPinMap = ({ groups }) => {
  const { isLoaded, error } = useGoogleMaps();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const pinned = groups.filter((g) => g.areaLat && g.areaLng);
  const unpinned = groups.filter((g) => !g.areaLat || !g.areaLng);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: EDMONTON_CENTER,
        zoom: 10,
      });
    }

    const map = mapInstance.current;
    const infoWindow = new window.google.maps.InfoWindow();
    const markers = pinned.map((group) => {
      const position = { lat: Number(group.areaLat), lng: Number(group.areaLng) };

      const marker = new window.google.maps.Marker({
        position,
        map,
        label: String(group.leadCount),
        title: group.area,
      });

      marker.addListener("click", () => {
        const convertedCount = Number(group.convertedCount);
        const rate = group.leadCount > 0 ? ((convertedCount / group.leadCount) * 100).toFixed(0) : 0;
        infoWindow.setContent(
          `<strong>${group.area}</strong><br/>${group.leadCount} lead(s) · ${rate}% converted`
        );
        infoWindow.open(map, marker);
      });

      return marker;
    });

    // Deliberately no fitBounds() here — a rep with one or two leads would
    // get zoomed in tight on a single point instead of seeing the city.
    // The map always stays at the fixed Edmonton-wide view set above.

    return () => markers.forEach((marker) => marker.setMap(null));
  }, [isLoaded, pinned]);

  if (error) {
    return (
      <div className="map-container">
        <div className="map-fallback">{error}</div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="map-container">
        <Loader />
      </div>
    );
  }

  if (groups.length === 0) {
    return <EmptyState icon="🗺️" title="No leads to plot yet" />;
  }

  return (
    <div className="stack">
      <div className="map-container" ref={mapRef} />
      {unpinned.length > 0 && (
        <p className="field__hint">
          {unpinned.length} area(s) couldn't be located on the map yet: {unpinned.map((g) => g.area).join(", ")}
        </p>
      )}
    </div>
  );
};

export default AreaPinMap;
