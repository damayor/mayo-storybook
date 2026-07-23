import { useEffect, useMemo, useRef, useState } from 'react';

import {
  notFoundContentData,
  remQuotient,
  drawContentPointer,
  imgBorderAndPadding,
} from './hotspot-content.config';
import './hotspot-content.css';
import type { HotspotDataType, ModalAnchorType } from '../../../helpers/types/commonTypes';

interface HotspotContentProps {
  hidden?: boolean;
  modalAnchor: ModalAnchorType;
  imageSize: number;
  contentTextWidth: number;
  hotspotData?: HotspotDataType;
  customContent?: React.ReactNode;
}

export default function HotspotContent({
  hidden,
  modalAnchor,
  hotspotData = notFoundContentData,
  customContent,
  imageSize,
  contentTextWidth,
}: HotspotContentProps) {
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
  }, [modalAnchor, customContent, imageSize, contentTextWidth, hotspotData]);

  useEffect(() => {
    window.addEventListener('resize', handleBoxPointers);
    return () => window.removeEventListener('resize', handleBoxPointers);
  }, [modalAnchor]);

  const isLeftAnchor = useMemo(() => {
    return modalAnchor.includes('left');
  }, [modalAnchor]);

  const divBoxClassName = useMemo(() => {
    return `hotspot-content__box 
      ${hidden ? 'content--hidden' : 'content--shown'}
      hotspot-content__box--${modalAnchor}
      `;
  }, [hidden, modalAnchor]);

  const boxStyles = useMemo(() => {
    return {
      image: {
        width: imageSize,
        height: imageSize,
      },
      content: {
        width: contentTextWidth,
      },
    };
  }, [imageSize, contentTextWidth]);

  return (
    <div
      className="hotspot-content"
      style={
        {
          '--content-text-width': `${contentTextWidth / remQuotient}rem`,
          '--origin-x-offset': `${isLeftAnchor ? 1 : -1}px`,
        } as React.CSSProperties
      }
    >
      {customContent ? (
        <div ref={contentRef} className={divBoxClassName}>
          {customContent}
        </div>
      ) : (
        <>
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
            <figcaption style={boxStyles.content} className="hotspot-content__text">
              <div className="hotspot-content__header">{hotspotData.header}</div>
              <p className="hotspot-content__paragraph">{hotspotData.description}</p>
            </figcaption>
          </figure>
        </>
      )}
    </div>
  );
}
