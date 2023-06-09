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
  id: string,
  thumburl: string,
  iframesrc: string,
  iframesrcdesktop: string,
  preferred?: boolean,
  per: string,
}

export class LC {
  static getIframeSrc = (lc:livecam, forceDesktop:boolean = false):string => {
    let ifsrc = lc.iframesrc;
    if ((!IS_MOBILE || forceDesktop) && (typeof lc.iframesrcdesktop !== 'undefined')) {
      ifsrc = lc.iframesrcdesktop;
    }
    if (ifsrc === 's') {
      ifsrc = lc.url;
    }
    return ifsrc;
  }

  static getThumbUrl = (lc:livecam):string => {
    let thumburl:string = '';
    if (typeof lc.thumburl !== 'undefined') {
      thumburl = lc.thumburl;
    }
    if (thumburl === '') {
      if(this.isPanomax(lc)) {
        if (typeof lc.id !== 'undefined') {
          thumburl = `https://live-image.panomax.com/cams/${lc.id}/recent_reduced.jpg`;
        }
      } else if (this.isSkaping(lc)) {
        if (typeof lc.id !== 'undefined') {
          thumburl = `https://api.skaping.com/media/getLatest?format=jpg&api_key=${lc.id}&quality=thumb`;
        }
      } else if (this.isRoundshot(lc)) {
        if (typeof lc.id !== 'undefined') {
          thumburl = `https://backend.roundshot.com/cams/${lc.id}/thumbnail`;
        }
      }
    }
    return thumburl;
  }

  /**
   * Is this a skaping livecam ?
   * @param lc 
   * @returns 
   */
  static isSkaping = (lc:livecam):boolean => {
    const ifsrc = this.getIframeSrc(lc);

    let isSka:boolean = false;
    if ((typeof ifsrc !== 'undefined')
     && (ifsrc.includes('www.skaping.com'))) {
      isSka = true;
    }
    return isSka;
  }
  /**
   * Is this a Tikee livecam ?
   * @param lc 
   * @returns 
   */
  static isTikeeLc = (lc:livecam):boolean => {
    const ifsrc = this.getIframeSrc(lc);

    let isTikee:boolean = false;
    if ((typeof ifsrc !== 'undefined')
    && (ifsrc.includes('my.tikee.io'))) {
      isTikee = true;
    }
    return isTikee;
  }
  /**
   * Is this a Youtube livecam ?
   * @param lc 
   * @returns 
   */
  static isYtLc = (lc:livecam):boolean => {
    let iYt:boolean = false;
    if ((typeof lc.per !== 'undefined')
     && (typeof lc.id !== 'undefined')
     && (lc.per === 'yt')) {
      iYt = true;
    }
    return iYt;
  }

  /**
   * Is this an IpCamLive livecam ?
   * @param lc 
   * @returns 
   */
  static isIpClLc = (lc:livecam):boolean => {
    const ifsrc = this.getIframeSrc(lc);

    let iIpc:boolean = false;
    if ((typeof ifsrc !== 'undefined')
    && (ifsrc.includes('ipcamlive.com/player/player'))) {
      iIpc = true;
    }
    return iIpc;
  }
  /**
   * Is this an Panomax livecam ?
   * @param lc 
   * @returns 
   */
  static isPanomax = (lc:livecam):boolean => {
    const ifsrc = this.getIframeSrc(lc, true);

    let iIpc:boolean = false;
    if ((typeof ifsrc !== 'undefined')
     && (ifsrc.includes('.panomax.com'))) {
      iIpc = true;
    } else if ((typeof ifsrc !== 'undefined')
            && (ifsrc.startsWith('https://panocam.'))) {
     iIpc = true;
   }  
    return iIpc;
  }
  /**
   * Is this an Roundshot livecam ?
   * @param lc 
   * @returns 
   */
  static isRoundshot = (lc:livecam):boolean => {
    const ifsrc = this.getIframeSrc(lc, true);

    let iRds:boolean = false;
    if ((typeof ifsrc !== 'undefined')
     && (ifsrc.includes('.roundshot.com'))) {
      iRds = true;
    }
    return iRds;
  }
  /**
   * Is this a feratel livecam ?
   * @param lc 
   * @returns 
   */
  static isFeratel = (lc:livecam):boolean => {
    let iFrt:boolean = false;
    if ((typeof lc.per !== 'undefined')
     && (typeof lc.id !== 'undefined')
     && (lc.per === 'frtl')) {
      iFrt = true;
    }
    return iFrt;
  }

}

export const lcTypes:string[] = [
  'city',
  'lake',
  'road',
  'sea',
  'mountain',
  'country',
];
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

export type LcFilters = {
  pref: boolean,
  types: string[],
}
