import React from 'react';
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
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        </nav>
        <div>
          <Route exact path="/" component={Main}/>
          <Route path="/about" component={Intro}/>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
