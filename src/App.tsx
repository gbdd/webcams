import React, { useEffect, useState } from 'react';
import { MapContainer } from 'react-leaflet';
import './App.css';
import axios from 'axios';
import { WebcamMap } from './components/WebcamMap';
import { livecam, PrefLoc, LcFilters, lcTypes } from './tools/consts';
import { WebcamFilterDialog } from './components/WebcamFilterDialog';
import {
  getPreference,
  PREFERENCES,
  setPreference,
} from './tools/preferences';


function App() {
  const [myWebcams, setMyWebcams] = useState<livecam[]>([]);
  const [filteredWebcams, setFilteredMyWebcams] = useState<livecam[]>([]);
  const [displayHeader, setDisplayHeader] = useState<boolean>(true);
  const [nbPreferredWebcams, setNbPreferredWebcams] = useState<number>(0);
  const [displayFiltersDialog, setDisplayFiltersDialog] = useState<boolean>(false);
  const [filters, setFilters] = useState<LcFilters>({pref: false, types: [...lcTypes]});

  useEffect(() => {
    axios.get('./livecams.json')
    .then((data) => {
      if ((typeof data.data !== 'undefined') && (typeof data.data.livecams !== 'undefined')) {
        setMyWebcams(data.data.livecams);
        applyFilters(filters, data.data.livecams);
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
    }
  }
  , [myWebcams]);

  const mergePreferredCams = (_preferredCams:PrefLoc[]) => {
    let nbPrefs:number = 0;
    _preferredCams.forEach(prefLoc => {
      const foundWc = myWebcams.find(wc => ((wc.lat === prefLoc.lat) && (wc.lng === prefLoc.lng)));
      if (foundWc !== undefined) {
        foundWc.preferred = true;
        nbPrefs += 1;
      }
    })
    if (nbPrefs > 0) {
      const newFilters = {pref: true, types: []};
      setFilters(newFilters);
      applyFilters(newFilters, myWebcams);
    }
  }
  const handlePrefCamChanged = () => {
    applyFilters(filters, myWebcams);
    savePreferredCams();
  }
  const savePreferredCams = () => {
    const prefLocs:PrefLoc[] = [];
    myWebcams.forEach(wc => {
      if (wc.preferred) {
        prefLocs.push({lat: wc.lat, lng: wc.lng});
      }
    });
    setPreference(PREFERENCES.PREF_LOCATION, prefLocs);
  }
  const computeNbPrefWebcams = () => {
    let nbPrefs:number = 0;
    myWebcams.forEach(wc => {
      if (wc.preferred) {
        nbPrefs += 1;
      }
    });
    setNbPreferredWebcams(nbPrefs);
  }

  const applyFilters = (currentFilter:LcFilters, webcamsToFilter:livecam[]) => {
    const filteredLcs:livecam[] = webcamsToFilter.filter((lc:livecam) => {
      if (currentFilter.pref && lc.preferred) {
        return true;
      } else if (currentFilter.types.includes(lc.type)) {
        return true;
      }
      return false;
    });
    setFilteredMyWebcams(filteredLcs);
  }

  const handlePopupOpened = (_opened:boolean) => {
    setDisplayHeader(!_opened);

    computeNbPrefWebcams();
  }

  const handleFilterChanged = (newFilters:LcFilters) => {
    const realNewFilters = {...newFilters};
    /* if ((!realNewFilters.pref) && (realNewFilters.types.length === 0)) {
      realNewFilters.types = [...lcTypes];
    } */
    setFilters(realNewFilters);
    applyFilters(realNewFilters, myWebcams);
  }
  const handleClickOnOpenFilters = () => {
    setDisplayFiltersDialog(!displayFiltersDialog);
  }
  const handleOnCloseOnFilters = () => {
    setDisplayFiltersDialog(false);
  }

  const displayedNumber:string = (filteredWebcams.length === myWebcams.length) ? `${myWebcams.length} webcams` : `${filteredWebcams.length} / ${myWebcams.length} webcams`

  return (
    <div className="App">
      {displayHeader && (
        <div className="Header">
          <div className="HeaderToolbar" onClick={handleClickOnOpenFilters}>
            {displayedNumber}
          </div>
        </div>
      )}
      <MapContainer center={[ 45.57439550729501, 6.143455853878999 ]}
                    zoom={10}
                    scrollWheelZoom={true}
                    zoomControl={false}>
        <WebcamMap
          webcams={filteredWebcams} 
          onPopupOpened={handlePopupOpened}
          onPrefCamsChanged={handlePrefCamChanged}
          displayTools={displayHeader}/>
      </MapContainer>
      {(displayFiltersDialog && displayHeader) && (
        <WebcamFilterDialog
          filters={filters}
          onFilterChanged={handleFilterChanged}
          onClose={handleOnCloseOnFilters}
        />
      )}
    </div>
  );
}

export default App;
