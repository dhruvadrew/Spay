import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export default () => (
  <Popup trigger={<button> Use SPAY </button>} position="right center">
    <div>Popup content here !!</div>
  </Popup>
);