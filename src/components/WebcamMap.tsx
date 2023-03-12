import React, { FC, ReactElement, useEffect } from 'react';
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

type WebcamMapProps = {
  webcams: livecam[],
}

export const WebcamMap: FC<WebcamMapProps> = ({webcams}): ReactElement => {
  const map = useMap();
  useEffect(
    () => {
      const lastZoom = getPreference(PREFERENCES.MAP_LAST_ZOOM, 10);
      const lastCenter = getPreference(PREFERENCES.MAP_LAST_CENTER, {lat: 45.57439550729501, lng: 6.143455853878999 });
      map.setView(new L.LatLng(lastCenter.lat, lastCenter.lng), lastZoom);
    }
  , [map]);

  useMapEvents({
    zoomend: (evt) => {
      if (evt?.target?._zoom) {
        setPreference(PREFERENCES.MAP_LAST_ZOOM, evt.target._zoom);
      }
    },
    moveend: (evt) => {
      if (evt?.target?._lastCenter) {
        setPreference(PREFERENCES.MAP_LAST_CENTER, evt.target._lastCenter);
      }
    }
  })

  // TOPO LAYER  url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"

  const clusterPolygonOptions = {
    fillColor: 'transparent',
    color: 'transparent',
  };

  return (
    <React.Fragment>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup polygonOptions={clusterPolygonOptions}>
        {webcams.map((lc, idxlc) => {
          const key:string = `${lc.latitude},${lc.longitude}`;
          return (
            <WebcamMarker lc={lc} key={key}></WebcamMarker>
          );
        })}
      </MarkerClusterGroup>
    </React.Fragment>
  );
}

