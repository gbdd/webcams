import React, { FC, ReactElement } from 'react';
import './WebcamMap.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet';
import {
  livecam,
} from '../tools/consts';
import { WebcamMarker } from './WebcamMarker';

type WebcamMapProps = {
  webcams: livecam[],
}

export const WebcamMap: FC<WebcamMapProps> = ({webcams}): ReactElement => {

  /*
  const map = useMapEvents({
    zoomend: (evt) => {
      console.log('BDDKROLL zoom end : ', evt);
    },
    move: (evt) => {
      console.log('BDDKROLL move : ', evt);
    }
  })*/

  // TOPO LAYER  url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"

  const clusterPolygonOptions = {
    fillColor: 'transparent',
    color: 'transparent',
  };

  return (
    <MapContainer center={[ 45.57439550729501, 6.143455853878999 ]} zoom={10} scrollWheelZoom={true}>
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
    </MapContainer>
  );
}

