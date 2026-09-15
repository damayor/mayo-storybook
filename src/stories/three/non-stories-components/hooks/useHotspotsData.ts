import { useEffect, useState } from 'react';
import type { HotspotDataType } from '../../helpers/types/commonTypes';
import { HOTSPOTS_DATA_URL } from '../../helpers/constants/scene-constants';

/**
 * Carga el contenido mock de los hotspots desde `public/`.
 *
 * El JSON vive fuera del bundle a propósito: el contenido de producto cambia
 * sin tocar el código. La ruta es fija — esto es un demo, no un cliente REST.
 */
export function useHotspotsData() {
  const [data, setData] = useState<HotspotDataType[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    fetch(HOTSPOTS_DATA_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`${response.status} al cargar ${HOTSPOTS_DATA_URL}`);
        return response.json();
      })
      .then((json: HotspotDataType[]) => {
        if (!cancelled) setData(Array.isArray(json) ? json : []);
      })
      .catch((cause: Error) => {
        if (cancelled || cause.name === 'AbortError') return;
        console.error('[hotspots] no se pudo cargar el contenido:', cause);
        setError(cause);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return { data, error };
}
