class MapView {
  renderPolyline(ride) {
    // Create a red polyline from an array of LatLng points.
    return L.polyline(ride.steps, {
      color: 'red',
      opacity: 0.2,
      weight: 5,
      className: `polyline-${ride.timestamp}`,
    });
  }
  togglePolylinePath(polyline) {
    const { opacity } = polyline.options;
    const options =
      opacity == 0.2
        ? { color: '#000', opacity: 1.0 }
        : { color: 'red', opacity: 0.2 };
    return polyline.setStyle(options);
  }
  getTotalBounds(polylines) {
    const bounds = polylines.map(polyline => polyline.getCenter());
    const bound = bounds.reduce(
      (accumulator, current) => {
        accumulator.lat += current.lat;
        accumulator.lng += current.lng;
        return accumulator;
      },
      { lat: 0, lng: 0 }
    );
    const moyenneLat = bound.lat / polylines.length;
    const moyenneLng = bound.lng / polylines.length;
    return [moyenneLat, moyenneLng];
  }
}
export default new MapView();
