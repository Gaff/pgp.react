import React from 'react';
import ReactDOM from 'react-dom';
//import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootswatch/dist/flatly/bootstrap.min.css';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import './polyfills.ts'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

