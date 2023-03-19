import React, { useEffect, useState } from 'react';
import { MapContainer } from 'react-leaflet';
import './App.css';
import axios from 'axios';
import { WebcamMap } from './components/WebcamMap';
import { livecam } from './tools/consts';

function App() {
  const [myWebcams, setMyWebcams] = useState<livecam[]>([]);
  useEffect(() => {
    axios.get('./livecams.json')
    .then((data) => {
      if ((typeof data.data !== 'undefined') && (typeof data.data.livecams !== 'undefined')) {
        setMyWebcams(data.data.livecams);
      }
    })
    .catch((err) => {
      console.error(`UNable to load webcam data : ${err} : `, err);
    });

  }
  , []);

  return (
    <div className="App">
      <MapContainer center={[ 45.57439550729501, 6.143455853878999 ]} zoom={10} scrollWheelZoom={true} zoomControl={false}>
        <WebcamMap webcams={myWebcams}></WebcamMap>
      </MapContainer>
    </div>
  );
}

export default App;
