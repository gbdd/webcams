import React, { FC, ReactElement, useEffect, useState } from 'react';
import './WebcamMap.css';
import { TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import {
  getPreference,
  PREFERENCES,
  setPreference,
} from '../tools/preferences';
import {
  livecam,
} from '../tools/consts';
import { WebcamMarker } from './WebcamMarker';
import { IS_MOBILE } from '../tools/UIConstants';

type WebcamMapProps = {
  webcams: livecam[],
  onPopupOpened: Function,
  onPrefCamsChanged: Function,
  onlyPreferred: boolean,
  displayTools: boolean,
}

const defaultZoom: number = 10;

export const WebcamMap: FC<WebcamMapProps> = ({
  webcams, 
  onPopupOpened, 
  onlyPreferred, 
  onPrefCamsChanged, 
  displayTools
}): ReactElement => {
  const map = useMap();

  useEffect(
    () => {
      const lastZoom = getPreference(PREFERENCES.MAP_LAST_ZOOM, defaultZoom);
      const lastCenter = getPreference(PREFERENCES.MAP_LAST_CENTER, {lat: 45.57439550729501, lng: 6.143455853878999 });

      map.setView(new L.LatLng(lastCenter.lat, lastCenter.lng), lastZoom);

      map.locate();
    }
  , [map]);

  const [popupOpened, setPopupOpened] = useState<boolean>(false);
  const [locSearchInProgress, setLocSearchInProgress] = useState<boolean>(false);
  const [centerBeforePopup, setCenterBeforePopup] = useState<(L.LatLng | null)>(null);
  const [targetAllowed, setTargetAllowed] = useState<boolean>(true);

  useMapEvents({
    zoomend: (evt) => {
      if (evt?.target?._zoom) {
        setPreference(PREFERENCES.MAP_LAST_ZOOM, evt.target._zoom);
      }
    },
    moveend: (evt) => {
      // cancel loc search if any
      setLocSearchInProgress(false);

      if (!popupOpened && evt?.target?._lastCenter) {
        setPreference(PREFERENCES.MAP_LAST_CENTER, evt.target._lastCenter);
      }
    },
    popupopen: (evt) => {
      setPopupOpened(true);
      setCenterBeforePopup(map.getCenter());
      onPopupOpened(true);
    },
    popupclose: (evt) => {
      if (popupOpened) {
        setPopupOpened(false);
        if (centerBeforePopup !== null) {
          map.setView(centerBeforePopup);
        }
      }
      setCenterBeforePopup(null);
      onPopupOpened(false);
    },
    locationfound: (evt) => {
      if (locSearchInProgress) {
        setLocSearchInProgress(false);
        map.setView(evt.latlng, defaultZoom, {
          animate: true,
        });
      }

    },
    locationerror: (evt) => {
      setLocSearchInProgress(false);
      setTargetAllowed(false);
    }
  })

  // TOPO LAYER  url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"

  const clusterPolygonOptions = {
    fillColor: 'transparent',
    color: 'transparent',
  };

  const handleSetPreferred = (_lc:livecam, _preferred:boolean) => {
    _lc.preferred = _preferred;
    onPrefCamsChanged();
  }

  const handleOnTargetClick = (evt:React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    evt.preventDefault();
    setLocSearchInProgress(true);
    map.locate();
  }

  return (
    <React.Fragment>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup polygonOptions={clusterPolygonOptions}>
        {webcams.map((lc, idxlc) => {
          const key:string = `${lc.lat},${lc.lng}`;
          return (
            <React.Fragment key={key}>
              { (!onlyPreferred || lc.preferred) && (
                <WebcamMarker lc={lc} setPreferred={handleSetPreferred}></WebcamMarker>
              )}
            </React.Fragment>
          );
        })}
      </MarkerClusterGroup>
      {(displayTools && targetAllowed) && (
        <div className="Footer" onClick={handleOnTargetClick}>
          <div className="targetButton" >
            <i className="bigIcon fa-sharp fa-regular fa-circle-dot"></i>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

