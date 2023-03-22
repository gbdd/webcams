import { PRODUCT_SHORTNAME } from './consts';

/**
 * Global array of preferences constants
 * => Here to avoid duplicate preferences
 * constants can be explicite and large, but try to have smallest value as possible
 * to avoid to exceed localStorage maximum size
 */
export const PREFERENCES = {
  MAP_LAST_ZOOM: 'mapLastZoom',
  MAP_LAST_CENTER: 'mapLastCenter',
  PREF_LOCATION: 'prefLocations',
  ONLY_PREFS: 'onlyPrefs',
};

const getAppPreferenceKey = ():string => {
  return `${PRODUCT_SHORTNAME}_pref`;
};

/**
 * Save a user preference
 * @param {*} key     key of the preference
 * @param {*} value   value of the preference
 */
export const setPreference = (key: string, value: any) => {
  const localData = localStorage.getItem(getAppPreferenceKey());
  let allPreferences:any = {};
  if (localData !== null) {
    allPreferences = JSON.parse(localData);
  }

  allPreferences[key] = value;

  localStorage.setItem(getAppPreferenceKey(), JSON.stringify(allPreferences));
};

/**
 * Get a user preference
 * @param {*} key     key of the preference
 * @param {*} defaultValue The defaultValue to apply if the preference does not exist in the storage
 */
export const getPreference = (key:string, defaultValue:any) => {
  const localData = localStorage.getItem(getAppPreferenceKey());
  let allPreferences:any = {};

  if (localData !== null) {
    allPreferences = JSON.parse(localData);
  } else {
    return defaultValue;
  }

  let foundvalue = allPreferences[key];

  if ((typeof foundvalue === 'undefined')
   || (foundvalue === null)) {
    foundvalue = defaultValue;
  }

  return foundvalue;
};
