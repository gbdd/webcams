import L from 'leaflet';
import { IS_MOBILE } from './UIConstants';

export type PrefLoc = {
  lat: number,
  lng: number,
}

export interface livecam {
  lat: number,
  lng: number,
  name: string,
  type: string,
  url: string,
  thumburl: string,
  iframesrc: string,
  iframesrcdesktop: string,
  preferred?: boolean,
}

export const getIframeSrc = (lc:livecam):string => {
  let ifsrc = lc.iframesrc;
  if (ifsrc === "s") {
    ifsrc = lc.url;
  }
  if (!IS_MOBILE && (typeof lc.iframesrcdesktop !== 'undefined')) {
    ifsrc = lc.iframesrcdesktop;
  }
  return ifsrc;
}

export const isTikeeLc = (lc:livecam):boolean => {
  const ifsrc = getIframeSrc(lc);

  let isTikee:boolean = false;
  if ((typeof ifsrc !== 'undefined')
   && (ifsrc.includes('my.tikee.io'))) {
    isTikee = true;
  }
  return isTikee;
}
export const isYtLc = (lc:livecam):boolean => {
  const ifsrc = getIframeSrc(lc);

  let iYt:boolean = false;
  if ((typeof ifsrc !== 'undefined')
   && (ifsrc.includes('www.youtube.com/embed'))) {
    iYt = true;
  }
  return iYt;
}
export const isIpClLc = (lc:livecam):boolean => {
  const ifsrc = getIframeSrc(lc);

  let iIpc:boolean = false;
  if ((typeof ifsrc !== 'undefined')
   && (ifsrc.includes('ipcamlive.com/player/player'))) {
    iIpc = true;
  }
  return iIpc;
}

export const iconCity = new L.Icon({
  iconUrl: require('../assets/icon-city.png'),
  iconSize: new L.Point(24, 24),
  shadowSize: [0, 0],
  iconAnchor: [12, 12],
  className: 'mapMarker'
});
export const iconLake = new L.Icon({
  iconUrl: require('../assets/icon-lake.png'),
  iconSize: new L.Point(24, 24),
  shadowSize: [0, 0],
  iconAnchor: [12, 12],
  className: 'mapMarker'
});
export const iconRoad = new L.Icon({
  iconUrl: require('../assets/icon-road.png'),
  iconSize: new L.Point(24, 24),
  shadowSize: [0, 0],
  iconAnchor: [12, 12],
  className: 'mapMarker'
});
export const iconSea = new L.Icon({
  iconUrl: require('../assets/icon-sea.png'),
  iconSize: new L.Point(24, 24),
  shadowSize: [0, 0],
  iconAnchor: [12, 12],
  className: 'mapMarker'
});
export const iconMountain = new L.Icon({
  iconUrl: require('../assets/icon-mountain.png'),
  iconSize: new L.Point(24, 24),
  shadowSize: [0, 0],
  iconAnchor: [12, 12],
  className: 'mapMarker'
});
export const iconCountry = new L.Icon({
  iconUrl: require('../assets/icon-country.png'),
  iconSize: new L.Point(24, 24),
  shadowSize: [0, 0],
  iconAnchor: [12, 12],
  className: 'mapMarker'
});

export const PRODUCT_SHORTNAME:string = 'BddWbcms';


export const WC_COLORS = {
  BACKGROUND: '59554a',
  BACKGROUND_LIGHTER: '6f6a5d',
  BACKGROUND_DARKER: '47443b',
}
