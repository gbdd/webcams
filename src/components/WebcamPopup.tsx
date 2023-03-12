import React, { FC, ReactElement, useState, useRef, useEffect } from 'react';
import './WebcamPopup.css';
import {  Popup, useMap, useMapEvents } from 'react-leaflet';
import { livecam } from '../tools/consts';

type PopupProps = {
  lc: livecam,
}

export const WebcamPopup: FC<PopupProps> = ({lc}): ReactElement => {
  const map = useMap();
  const [imgWidth, setImgWidth] = useState<number>();
  const [maxWidth, setMaxWidth] = useState<number>();
  const [maxHeight, setMaxHeight] = useState<number>();
  const [contentWidth, setContentWidth] = useState<number>();
  const [contentHeight, setContentHeight] = useState<number>();

  useEffect(
    () => {
      if (typeof lc.iframesrc !== 'undefined') {
        setMaxWidth(map.getSize().x);
        setMaxHeight(map.getSize().y);
      }
      setPopupContentSize(map.getSize().x, map.getSize().y);
    }
  , [map]);
  const thumbContainer = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLImageElement>(null);
  
  const setPopupContentSize = (_mapWidth:number, _mapHeight:number) => {
    if (typeof lc.iframesrc !== 'undefined') {
      if (typeof _mapWidth !== 'undefined') {
        setContentWidth(_mapWidth * 80 / 100);
        setContentHeight(_mapHeight * 80 / 100);
      }
    }
  }

  const onImgLoad = (event:any) => {
    setImgWidth(event.target.width);
    if (thumbContainer.current) {
      startScrolling(thumbContainer.current, event.target.width, true);
    }
  }

  useMapEvents({
    resize: (evt) => {
      setPopupContentSize(map.getSize().x, map.getSize().y);
    }
  })

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
    <React.Fragment>
    { (typeof lc.iframesrc !== "undefined") && (
      <Popup className="markerPopup" maxWidth={maxWidth} maxHeight={maxHeight}>
        <div  className="popupContent" style={{width: contentWidth, height: contentHeight}}>
        <a href={lc.url} target="_blank" rel="noreferrer">{lc.name}</a>
          { (lc.iframesrc !== undefined) && (
            <iframe className="popupIframe" src={lc.iframesrc} title={lc.name} allowFullScreen allow='autoplay'></iframe>
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
    )}
    { (typeof lc.iframesrc === "undefined") && (
    <Popup className="markerPopup">
      <div  className="popupContent">
      <a href={lc.url} target="_blank" rel="noreferrer">{lc.name}</a>
        { (lc.iframesrc !== undefined) && (
          <iframe className="popupIframe" src={lc.iframesrc} title={lc.name} allowFullScreen allow='autoplay'></iframe>
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
    )}
    </React.Fragment>
  );
}
