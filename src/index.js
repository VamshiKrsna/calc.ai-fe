import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import Canvas from './Canvas.js';
import Header from './Header.js';
import CanvasBody from './CanvasBody.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <Canvas /> */}
    <Header />
    <CanvasBody />
  </React.StrictMode>
);