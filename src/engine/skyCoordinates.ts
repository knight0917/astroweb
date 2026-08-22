/**
 * Converts Ecliptic Longitude and Latitude into 3D Cartesian coordinates inside the Zodiac Dome
 */
export function eclipticToCartesian(
  longitudeDeg: number,
  latitudeDeg: number = 0,
  radius: number = 40
): [number, number, number] {
  const theta = (longitudeDeg * Math.PI) / 180;
  const phi = (latitudeDeg * Math.PI) / 180;

  const x = radius * Math.cos(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi);
  const z = radius * Math.cos(phi) * Math.sin(theta);

  return [x, y, z];
}

/**
 * Converts Topocentric Altitude and Azimuth into 3D Cartesian coordinates for True Sky View
 * Azimuth: 0 = North, 90 = East, 180 = South, 270 = West
 * Altitude: 0 = Horizon, +90 = Zenith, -90 = Nadir
 */
export function horizontalToCartesian(
  altitudeDeg: number,
  azimuthDeg: number,
  radius: number = 40
): [number, number, number] {
  const altRad = (altitudeDeg * Math.PI) / 180;
  const azRad = (azimuthDeg * Math.PI) / 180;

  const r = radius * Math.cos(altRad);
  const y = radius * Math.sin(altRad);
  const x = r * Math.sin(azRad);
  const z = -r * Math.cos(azRad);

  return [x, y, z];
}
