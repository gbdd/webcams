import React, { useEffect, useState } from 'react';
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
      <WebcamMap webcams={myWebcams}></WebcamMap>
    </div>
  );
}

export default App;
