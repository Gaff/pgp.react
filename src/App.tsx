import React, { Fragment } from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import { Main } from './Main'
import { Intro } from './Intro'
import { Sidebar } from './Sidebar'
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
          <div className="row">
            <div className="col-lg-3 order-2">
              <Sidebar/>
            </div>
            <div className="col-lg-9 order-1 active">
              <Route exact path="/" component={Main}/>
              <Route path="/about" component={Intro}/>
            </div>
          </div>
          <footer className="footer">
            <hr/>
            <p>&copy; pgp.help 2020
              <span className="pull-right">Powered by <a href="http://pages.github.com">GitHub Pages</a> &nbsp; <a href="https://github.com/Gaff/pgp.help/tree/gh-pages">GitHub Repository</a> &nbsp;</span>
            </p>
          </footer>
          <button type="button" className="btn btn-default btn-lg">
            <span className="glyphicon glyphicon-star" aria-hidden="true"></span> Star
          </button>
        </div>
      </Fragment>
  );
}

export default App;
