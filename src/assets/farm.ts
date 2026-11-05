import { CROPS } from '../content/farm';
import type { SourceRect } from './terrain';

function cell(column: number, row: number): SourceRect {
  return { texture: 'farm-crops', x: column * 16, y: row * 16, width: 16, height: 16 };
}
export const farmSoil = { dry: cell(0, 1), wet: cell(1, 1) };
export const farmSprout = cell(0, 2);
export function farmCropFrame(row: number, mature: boolean) {
  return cell(mature ? 2 : 1, row);
}
export const farmFrames = [
  farmSoil.dry,
  farmSoil.wet,
  farmSprout,
  ...Object.values(CROPS).flatMap((crop) => [
    farmCropFrame(crop.artRow, false),
    farmCropFrame(crop.artRow, true),
  ]),
];
