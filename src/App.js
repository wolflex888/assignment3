import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react'
import { render } from '@testing-library/react';

function App() {
  const [Funfact, setFunfact] = useState(null);

  function handleClick() {
    fetch("/fun_facts", {
      method: "POST",
    }).then(res => res.json())
      .then(data => setFunfact(data.data));
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>{Funfact}</p>
        <button className="button"
          onClick={handleClick}>
          Click Me!
        </button>
      </header>
    </div>
  );
}

export default App;
