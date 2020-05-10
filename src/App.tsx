import React from 'react';
import './App.css';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { Main } from './Main'
import { Intro } from './Intro'

function App() {
  return (
    <div>
      <BrowserRouter>
        <header className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <div className="navbar-brand">pgp.help</div>
            </div>
          </div>
        </header>
        <div className="container">
          <div className="row">
            <div className="col-lg-3 order-2">
              <nav>
                <ul>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/about">About</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </ul>
              </nav>
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
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
