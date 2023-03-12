import React, { FC, ReactElement } from 'react';
import './WebcamMarker.css';
import { Marker, Tooltip } from 'react-leaflet';
import { IS_MOBILE } from '../tools/UIConstants';
import L from 'leaflet';
import {
  livecam,
  iconCity,
  iconLake,
  iconMountain,
  iconRoad,
  iconSea,
} from '../tools/consts';
import { WebcamPopup } from './WebcamPopup';

type WebcamMarkerProps = {
  lc: livecam,
}

export const WebcamMarker: FC<WebcamMarkerProps> = ({lc}): ReactElement => {


  const getIcon = (lc:livecam):(L.Icon | undefined) => {
    if (lc.type === 'mountain') {
      return iconMountain;
    } else if (lc.type === 'lake') {
      return iconLake;
    } else if (lc.type === 'road') {
      return iconRoad;
    } else if (lc.type === 'city') {
      return iconCity;
    } else if (lc.type === 'sea') {
      return iconSea;
    }
    return undefined; // TODO default icon !!
  }

  return (
    <Marker position={[ lc.latitude, lc.longitude]} icon={getIcon(lc)}>
      { !IS_MOBILE && (
        <Tooltip>
          {lc.name}
        </Tooltip>
      )}
      <WebcamPopup lc={lc}></WebcamPopup>
    </Marker>
  );
}

