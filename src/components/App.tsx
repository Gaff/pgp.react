import React, { Fragment } from 'react';
import './App.css';
import { KeyContainer } from './KeyContainer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserNinja } from '@fortawesome/free-solid-svg-icons'

function App() {
  return (
      <Fragment>
        <header className="navbar navbar-expand-lg fixed-top navbar-dark bg-primary">
          <div className="container">
            <div className="navbar-header">
              <div className="navbar-brand"><FontAwesomeIcon className="d-inline-block" size="lg" pull="left" icon={faUserNinja}/><strong>pgp.help</strong></div>
            </div>
          </div>
        </header>
        <div className="container">
          <KeyContainer/>
          <footer className="footer">
            <hr/>
            <p>&copy; pgp.help 2020
              <span className="pull-right">Powered by <a href="http://pages.github.com">GitHub Pages</a> &nbsp; <a href="https://github.com/Gaff/pgp.help/tree/gh-pages">GitHub Repository</a> &nbsp;</span>
            </p>
          </footer>
        </div>
      </Fragment>
  );
}

export default App;
