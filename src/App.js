import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useRef } from 'react'
import { render } from '@testing-library/react';

function App() {
  const [Funfact, setFunfact] = useState(null);
  const inputRef = useRef(null);

  function handleClick() {
    fetch("/movie_comments", {
      method: "POST",
    }).then(res => res.json())
      .then(data => setFunfact(data.data));
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Your reviews:</h1>
        <div>
          <h3>"Movie ID: 157336"</h3>
          <input type="text" ref={inputRef} />
          <input type="text" ref={inputRef} />
          <button className="button"
            onClick={handleClick}>
            delete
          </button>
        </div>
        <div>
          <p>"Movie ID: 157336"</p>
          <input type="text" ref={inputRef} />
          <input type="text" ref={inputRef} />
          <button className="button"
            onClick={handleClick}>
            delete
          </button>
        </div>
        <div>
          <p>"Movie ID: 157336"</p>
          <input type="text" ref={inputRef} />
          <input type="text" ref={inputRef} />
          <button className="button"
            onClick={handleClick}>
            delete
          </button>
        </div>
        <button className="button"
          onClick={handleClick}>
          Save Changes
        </button>
      </header>
    </div>
  );
}

export default App;
