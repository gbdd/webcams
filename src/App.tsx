import React, { useEffect, useState } from 'react';
import { MapContainer } from 'react-leaflet';
import './App.css';
import axios from 'axios';
import { WebcamMap } from './components/WebcamMap';
import { livecam, PrefLoc } from './tools/consts';
import { StarToggle } from './components/StarToggle';
import {
  getPreference,
  PREFERENCES,
  setPreference,
} from './tools/preferences';


function App() {
  const [myWebcams, setMyWebcams] = useState<livecam[]>([]);
  const [displayHeader, setDisplayHeader] = useState<boolean>(true);
  const [displayPreferedWebcam, setDisplayPreferedWebcam] = useState<boolean>(false);

  useEffect(() => {
    axios.get('./livecams.json')
    .then((data) => {
      if ((typeof data.data !== 'undefined') && (typeof data.data.livecams !== 'undefined')) {
        setMyWebcams(data.data.livecams);
      }
    })
    .catch((err) => {
      console.error(`Unable to load webcam data : ${err} : `, err);
    });

  }
  , []);

  useEffect(() => {
    const preferredLocs:PrefLoc[] = getPreference(PREFERENCES.PREF_LOCATION, []);
    if (preferredLocs.length > 0) {
      mergePreferredCams(preferredLocs);
      // setDisplayPreferedWebcam(getPreference(PREFERENCES.ONLY_PREFS, false));
    }
  }
  , [myWebcams]);

  const mergePreferredCams = (_preferredCams:PrefLoc[]) => {
    let thereAreSome:boolean = false;
    _preferredCams.forEach(prefLoc => {
      const foundWc = myWebcams.find(wc => ((wc.latitude === prefLoc.lat) && (wc.longitude === prefLoc.lng)));
      if (foundWc !== undefined) {
        foundWc.preferred = true;
        thereAreSome = true;
      }
    })
    if (thereAreSome) {
      setDisplayPreferedWebcam(getPreference(PREFERENCES.ONLY_PREFS, false));
    }
  }
  const handlePrefCamChanged = () => {
    savePreferredCams();
  }
  const savePreferredCams = () => {
    const prefLocs:PrefLoc[] = [];
    myWebcams.forEach(wc => {
      if (wc.preferred) {
        prefLocs.push({lat: wc.latitude, lng: wc.longitude});
      }
    });
    setPreference(PREFERENCES.PREF_LOCATION, prefLocs);
  }


  const handlePopupOpened = (_opened:boolean) => {
    setDisplayHeader(!_opened);
  }

  const handleOnChecked = (_checked:boolean) => {
    setDisplayPreferedWebcam(_checked);
    setPreference(PREFERENCES.ONLY_PREFS, _checked);
  }

  return (
    <div className="App">
      {displayHeader && (
        <div className="Header">
          <div className="HeaderTitle">
            Webcams
          </div>
          <div className="HeaderToolbar">
            <StarToggle checked={displayPreferedWebcam} onChecked={handleOnChecked}></StarToggle>
          </div>
        </div>
      )}
      <MapContainer center={[ 45.57439550729501, 6.143455853878999 ]}
                    zoom={10}
                    scrollWheelZoom={true}
                    zoomControl={false}>
        <WebcamMap
          webcams={myWebcams} 
          onPopupOpened={handlePopupOpened}
          onlyPreferred={displayPreferedWebcam}
          onPrefCamsChanged={handlePrefCamChanged}/>
      </MapContainer>
    </div>
  );
}

export default App;
