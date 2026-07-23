import type { HotspotDataType } from '../../../helpers/types/commonTypes';

export const remQuotient = 16;
export const xOffsetLimit = 35;
export const imgBorderAndPadding = 18;

export const notFoundContentData: HotspotDataType = {
  header: 'No Data',
};

// //Vertices of svg path based on the content text position and image width.
export const drawContentPointer = (
  pointsLeft: boolean,
  pointerTop: number,
  pointerLeft: number
) => {
  const vertex2X = pointerLeft + (pointsLeft ? -xOffsetLimit : xOffsetLimit);
  return `M0 0 L${vertex2X} 0 L${vertex2X} ${pointerTop} L${pointerLeft} ${pointerTop}`;
};

export const a = 1;
