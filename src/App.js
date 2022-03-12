import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import ReactDom from 'react-dom';
import { render } from '@testing-library/react';


function App() {
  const [comm, setComm] = useState([]);
  // const inputRef = useRef(null);
  // let val = inputRef.current.value;


  //  function getComments() {
  //     fetch('/movie_comments', {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       }
  //     }).then((response) => response.json())
  // .then((data) => {
  //   setComm(data.movie_comments);
  // });
  // }

  useEffect(() => {
    fetch('/movie_comments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((response) => response.json())
      .then(data => {
        setComm(data.movie_comments);
      })
  }, [])


  // const movie_info = comm.map(info => (
  //   <h3>{ info.rate }</h3>
  // ))
  const movie_comment = comm.map(info => ((info.comment)))
  const movie_rate = comm.map(info => ((info.rate)))


  // const [loading, setLoading] = useState(false);


  //-----
  // async function fetch_data() {
  //   return await fetch("/movie_comments", {
  //     method: "POST",
  //   }).then(resp => resp.json()).then(data => setComm(data.movie_comments))
  // }
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const movie_comments = await fetch("/movie_comments", {
  //       method: "POST",
  //     });
  //     const json_data = await movie_comments.json();
  //     setComm(json_data.movie_comments)
  //     console.log(comm)
  //   }
  //   fetchData();
  // }, [loading])
  // setLoading(true)
  //------


  // const [Del, setDel] = useState(null);
  // function deleteComment() {
  //   fetch("/movie_comments", {
  //     method: "POST",
  //   }).then(res => res.json())
  //     .then(data => setDel(data.data));
  // }

  // const [Sav, setSav] = useState(null);
  // function saveComment() {
  //   fetch("/movie_comments", {
  //     method: "POST",
  //   }).then(res => res.json())
  //     .then(data => setSav(data.data));
  // }

  function deleteComments() {
    console.log("hello")
  }

  function saveComments() {
    console.log("goodbye")
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Your reviews:</h1>
        <div>
          <p>Movie ID: 157336</p>
          <input type="text" value={movie_rate[0]} name="rate" onChange={deleteComments} />
          <input type="text" value={movie_comment[0]} name="comment" onChange={deleteComments} />
          <button className="button"
            onClick={deleteComments}>
            delete
          </button>
        </div>
        <div>
          <p>Movie ID: 157336</p>
          <input type="text" value={movie_rate[1]} name="rate" onChange={deleteComments} />
          <input type="text" value={movie_comment[1]} name="comment" onChange={deleteComments} />
          <button className="button"
            onClick={deleteComments}>
            delete
          </button>
        </div>
        <button className="button"
          onClick={saveComments}>
          Save Changes
        </button>
      </header>
    </div>
  );
}

export default App;
