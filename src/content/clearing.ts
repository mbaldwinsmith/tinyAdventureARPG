/** Deliberately authored integration scene; not the generated campaign world. */
export const CLEARING = {
  widthPixels: 480,
  heightPixels: 272,
  tilePixels: 16,
  spawn: { x: 240, y: 146 },
  trees: [
    [24, 48],
    [74, 40],
    [186, 48],
    [236, 40],
    [286, 48],
    [338, 40],
    [390, 48],
    [448, 56],
    [24, 112],
    [50, 176],
    [20, 232],
    [84, 260],
    [155, 272],
    [472, 112],
    [466, 172],
    [472, 238],
    [420, 272],
    [280, 266],
    [336, 266],
  ],
  bushes: [
    [72, 139],
    [183, 221],
    [304, 131],
    [312, 237],
  ],
  rocks: [
    [63, 199],
    [307, 101],
    [450, 231],
  ],
  pond: { x: 21, y: 9, columns: 6, rows: 5 },
} as const;
export const PREVIEW_SPEED_PIXELS_PER_SECOND = 60;

/** Shared authored geography for the retained core grid and its terrain renderer. */
export function clearingPathAt(x: number, y: number): boolean {
  return (
    x >= 0 &&
    x < 30 &&
    y >= 0 &&
    y < 17 &&
    ((x >= 14 && x <= 15 && y >= 7) ||
      (x >= 10 && x <= 19 && y >= 8 && y <= 10) ||
      (x >= 7 && x <= 10 && y >= 7 && y <= 9) ||
      (x >= 14 && x <= 15 && y <= 8) ||
      (x >= 19 && x <= 21 && y >= 10 && y <= 11))
  );
}
