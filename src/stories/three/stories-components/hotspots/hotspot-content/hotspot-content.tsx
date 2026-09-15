import { useEffect, useMemo, useRef, useState } from 'react';

import {
  notFoundContentData,
  remQuotient,
  drawContentPointer,
  imgBorderAndPadding,
  CONTENT_TEXT_WIDTH,
  IMAGE_SIZES,
} from './hotspot-content.config';
import './hotspot-content.css';
import type {
  HotspotDataType,
  HotspotImageSizeType,
  ModalAnchorType,
} from '../../../helpers/types/commonTypes';

interface HotspotContentProps {
  modalAnchor: ModalAnchorType;
  imageSize: HotspotImageSizeType;
  hotspotData?: HotspotDataType;
}

export default function HotspotContent({
  modalAnchor,
  hotspotData = notFoundContentData,
  imageSize,
}: HotspotContentProps) {
  const imageSizeInPx = IMAGE_SIZES[imageSize];
  const contentRef = useRef<HTMLDivElement>(null);
  const [pointerLeft, setPointerLeft] = useState(0);
  const [pointerTop, setPointerTop] = useState(0);

  const handleBoxPointers = () => {
    if (contentRef.current) {
      setPointerLeft(
        contentRef.current.offsetLeft +
          (isLeftAnchor
            ? imgBorderAndPadding
            : contentRef.current.offsetWidth - imgBorderAndPadding)
      );
      setPointerTop(contentRef.current.offsetTop + contentRef.current.offsetHeight / 2);
    }
  };

  useEffect(() => {
    handleBoxPointers();
  }, [modalAnchor, imageSizeInPx, hotspotData]);

  useEffect(() => {
    window.addEventListener('resize', handleBoxPointers);
    return () => window.removeEventListener('resize', handleBoxPointers);
  }, [modalAnchor]);

  const isLeftAnchor = useMemo(() => {
    return modalAnchor.includes('left');
  }, [modalAnchor]);

  // El componente se monta y desmonta con la selección, así que siempre está en
  // su estado visible: no hay variante `content--hidden` que aplicar.
  const divBoxClassName = useMemo(
    () => `hotspot-content__box content--shown hotspot-content__box--${modalAnchor}`,
    [modalAnchor]
  );

  const boxStyles = useMemo(() => {
    return {
      image: {
        width: imageSizeInPx,
        height: imageSizeInPx,
      },
      content: {
        width: CONTENT_TEXT_WIDTH,
      },
    };
  }, [imageSizeInPx]);

  return (
    <div
      className="hotspot-content"
      style={
        {
          '--content-text-width': `${CONTENT_TEXT_WIDTH / remQuotient}rem`,
          '--origin-x-offset': `${isLeftAnchor ? 1 : -1}px`,
        } as React.CSSProperties
      }
    >
      <svg className="hotspot-content_pointer">
        <path d={drawContentPointer(isLeftAnchor, pointerTop, pointerLeft)} />
      </svg>
      <figure ref={contentRef} className={divBoxClassName}>
        {hotspotData.imageUrl ? (
          <img
            src={hotspotData.imageUrl}
            alt=""
            style={boxStyles.image}
            className="hotspot-content__image"
          />
        ) : (
          <div
            style={boxStyles.image}
            className="hotspot-content__image hotspot-content__image--default"
          />
        )}
        <div className="hotspot-content__vl"></div>
        {/* Tipografía en Tailwind: el resto del layout sigue en el CSS. */}
        <figcaption style={boxStyles.content} className="hotspot-content__text">
          <div className="mt-0 mb-1.5 text-2xl leading-tight font-semibold tracking-[0.1em] uppercase">
            {hotspotData.header}
          </div>
          <p className="m-0 text-base leading-snug">{hotspotData.description}</p>
        </figcaption>
      </figure>
    </div>
  );
}
