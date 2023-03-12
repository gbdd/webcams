import React, { FC, ReactElement, useState, useRef } from 'react';
import './WebcamPopup.css';
import {  Popup } from 'react-leaflet';
import { livecam } from '../tools/consts';

type PopupProps = {
  lc: livecam,
}

export const WebcamPopup: FC<PopupProps> = ({lc}): ReactElement => {
  const [imgWidth, setImgWidth] = useState<number>();
  const thumbContainer = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLImageElement>(null);

  const onImgLoad = (event:any) => {
    setImgWidth(event.target.width);
    if (thumbContainer.current) {
      startScrolling(thumbContainer.current, event.target.width, true);
    }
  }

  const startScrolling = (w:HTMLDivElement, max:(number | undefined), goRight:boolean) => {
    if (typeof max === "undefined") {
      return;
    }
    let nextDirection:boolean = goRight;
    if (max < w.clientWidth) {
      return;
    }
    let timeout:number = 10;
    if (max < (2 * w.clientWidth)) {
      // pour ne pas scroller trop vite
      timeout = 100;
    }
    if (goRight) {
      w.scrollLeft = w.scrollLeft + 1;
      if (w.scrollLeft >= (max - w.clientWidth)) {
        nextDirection = false;
      }
    } else {
      w.scrollLeft = w.scrollLeft - 1;
      if (w.scrollLeft <= 0) {
        nextDirection = true;
      }
    }
    if ((thumbRef.current)
     && (thumbRef.current?.getBoundingClientRect().width > 0)) {
      setTimeout(() => { startScrolling(w, max, nextDirection);}, timeout);
    }
  }// startScrolling


  return (
    <Popup className="markerPopup">
      <div className="popupContent">
      <a href={lc.url} target="_blank" rel="noreferrer">{lc.name}</a>
        { (lc.iframesrc !== undefined) && (
          <iframe src={lc.iframesrc} title={lc.name} allowFullScreen allow='autoplay'></iframe>
        )}
        { ((lc.thumburl !== undefined) && (typeof lc.iframesrc === 'undefined')) && (
          <div ref={thumbContainer} className="popupThumbnailContainer">
            <a href={lc.url} target="_blank" rel="noreferrer">
              <img ref={thumbRef} className="popupThumbnail" src={lc.thumburl} alt={lc.name} onLoad={onImgLoad} width={imgWidth}></img>
            </a>
          </div>
        )}

      </div>
    </Popup>
  );
}
