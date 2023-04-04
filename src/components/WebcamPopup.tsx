import React, { FC, ReactElement, useState, useRef, useEffect } from 'react';
import './WebcamPopup.css';
import {  Popup, useMap, useMapEvents } from 'react-leaflet';
import { livecam } from '../tools/consts';
import { IS_MOBILE } from '../tools/UIConstants';
import { StarToggle } from './StarToggle';

type PopupProps = {
  lc: livecam,
  setPreferred: Function,
}

export const WebcamPopup: FC<PopupProps> = ({lc, setPreferred}): ReactElement => {
  const map = useMap();
  const [imgWidth, setImgWidth] = useState<number>();
  const [maxWidth, setMaxWidth] = useState<number>();
  const [maxHeight, setMaxHeight] = useState<number>();
  const [contentWidth, setContentWidth] = useState<number>();
  const [contentHeight, setContentHeight] = useState<number>();

  useEffect(
    () => {
      if ((typeof lc.iframesrc !== 'undefined')
       || (!IS_MOBILE && (typeof lc.iframesrcdesktop !== "undefined")))
      {
        setMaxWidth(map.getSize().x);
        setMaxHeight(map.getSize().y);
      }
      setPopupContentSize(map.getSize().x, map.getSize().y);
    }
  , [map, lc.iframesrc, lc.iframesrcdesktop]);

  const thumbContainer = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLImageElement>(null);
  
  const setPopupContentSize = (_mapWidth:number, _mapHeight:number) => {
    if ((typeof lc.iframesrc !== 'undefined')
     || (!IS_MOBILE && (typeof lc.iframesrcdesktop !== "undefined"))) {
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

  const handleOnCheck = (_checked:boolean) => {
    setPreferred(lc, _checked);
  }

  const handleOnClose = () => {
    map.closePopup();
  }

  const isPreferred = ():boolean => {
    let pref:boolean = false
    if ((typeof lc.preferred !== "undefined")
     && (lc.preferred !== null)) {
      pref = lc.preferred;
    }
    return pref;
  }

  let iframesrc = lc.iframesrc;
  if (iframesrc === "s") {
    iframesrc = lc.url;
  }
  if (!IS_MOBILE && (typeof lc.iframesrcdesktop !== "undefined")) {
    iframesrc = lc.iframesrcdesktop;
  }


  const renderPopupHeader = () => {
    return (
      <div className="popupHeader">
        <div className='popupHeaderTitle'>
          <a href={lc.url} target="_blank" rel="noreferrer">{lc.name}&nbsp;<i className="fa-solid fa-house"></i></a>
        </div>
        <div className='popupHeaderToolbar'>
          <StarToggle checked={isPreferred()} onChecked={handleOnCheck}></StarToggle>
          <div className='closeButton' onClick={handleOnClose}>
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>
      </div>
    )
  }

  return (
    <React.Fragment>
    { (typeof iframesrc !== "undefined") && (
      <Popup className="markerPopup" maxWidth={maxWidth} maxHeight={maxHeight}>
        <div  className="popupContent" style={{width: contentWidth, height: contentHeight}}>
          {renderPopupHeader()}
          { (iframesrc !== undefined) && (
            <iframe className="popupIframe" src={iframesrc} title={lc.name} allowFullScreen allow='autoplay'></iframe>
          )}
        </div>
      </Popup>
    )}
    { (typeof iframesrc === "undefined") && (
    <Popup className="markerPopup">
      <div  className="popupContent">
        {renderPopupHeader()}
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
