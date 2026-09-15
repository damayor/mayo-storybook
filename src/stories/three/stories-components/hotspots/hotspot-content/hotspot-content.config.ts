import type { HotspotDataType, HotspotImageSizeType } from '../../../helpers/types/commonTypes';

export const remQuotient = 16;
export const xOffsetLimit = 35;
export const imgBorderAndPadding = 18;

/**
 * Ancho del bloque de texto, en px. Antes era un control de la story; el modal
 * está diseñado alrededor de este ancho (la línea que apunta al hotspot se traza
 * desde su borde), así que se fija aquí y deja de ser parametrizable.
 */
export const CONTENT_TEXT_WIDTH = 350;

/** Lado de la miniatura en px para cada paso de `imageSize`. */
export const IMAGE_SIZES: Record<HotspotImageSizeType, number> = {
  S: 72,
  M: 100,
  L: 140,
};

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
