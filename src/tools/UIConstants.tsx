//
// File : UIConstants.jsx
// File containing graphical Constants or common variables used in the UI components
//
import { UAParser } from "ua-parser-js";


// User Agent constants (parsed by UA-Parser)
const uaparser = new UAParser();
export const CURRENT_OS = uaparser.getOS();
export const CURRENT_BROWSER = uaparser.getBrowser();
export const CURRENT_DEVICE = uaparser.getDevice();

export const IS_MOBILE = ((typeof CURRENT_DEVICE !== 'undefined')
    && (typeof CURRENT_DEVICE.type !== 'undefined')
    && (CURRENT_DEVICE.type === 'mobile'));

export const IS_MACOS = CURRENT_OS.name === 'Mac OS';

export const IS_WINDOWS = CURRENT_OS.name === 'Windows';

export const IS_SAFARI = CURRENT_BROWSER.name === 'Safari';

export const IS_FIREFOX = CURRENT_BROWSER.name === 'Firefox';

