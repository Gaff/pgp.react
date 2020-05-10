import React, { Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { Main } from './Main'
import { Intro } from './Intro'

function App() {
  return (
    <div className="App">
      <header>
        My first react App
      </header>
      <BrowserRouter>
        <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        </nav>
        <div>
          <Route exact path="/" component={Home}/>
          <Route path="/about" component={Main}/>
        </div>
      </BrowserRouter>
    </div>
  );
}

const Home = () => (
  <Fragment>
    <h1>Home</h1>
  </Fragment>
  );

export default App;
