import React from 'react';
import AudioPlayer from 'react-modular-audio-player';

import "../style.css"


import puhl from './resources/puhl.gif'
import spectrumpic from './resources/spectrum.gif'
 let audioFiles = [
  {
    src: "http://213.141.133.1:8000/stream",
    title: "The Top",
    artist: "PrioFM",
    hideTime:true
  },
  {
    src: "http://213.141.133.1:8000/stream",
    title: "prio",
    artist: "Topp",
    hideTime:true
  }
    ];


class Radio extends React.Component {




  render() {
    return (
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">

<div className='player-wrapper' width="100%">

<AudioPlayer

  audioFiles={audioFiles}
  hideTime={true}
  hideSeeking={true}/>
      </div>Z
      <br/>

      <div><img className="puhl" src={puhl} alt="buffering" height="30px" width="30px" /></div>
      <div><img className="spectrum-img-dimensions" src={spectrumpic} alt="Voice spectrum" /></div>
              <hr />


            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Radio;
