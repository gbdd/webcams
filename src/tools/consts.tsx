import L from 'leaflet';

export type PrefLoc = {
  lat: number,
  lng: number,
}

export interface livecam {
  latitude: number,
  longitude: number,
  name: string,
  description: string,
  type: string,
  url: string,
  thumburl: string,
  iframesrc: string,
  iframesrcdesktop: string,
  preferred?: boolean,
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

export const PRODUCT_SHORTNAME:string = 'BddWbcms';
