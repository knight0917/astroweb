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
