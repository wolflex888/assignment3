import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useRef, Component} from 'react';
import ReactDom from 'react-dom';
import { render } from '@testing-library/react';


function App() {
  const [comm, setComm] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const commentRef = useRef([])
  const rateRef = useRef({})

   async function updateComments() {
      fetch('http://localhost:3001/movie_comments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }).then((response) => response.json())
  .then((data) => {
    setComm(data.movie_comments);}
    )
  };

  useEffect(() => {
    updateComments()
    setIsLoading(false);
  }, []);


  // const movie_info = comm.map(info => (
  //   <h3>{ info.rate }</h3>
  // ))

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
  function deleteComments(e) {
  };

  // const [Sav, setSav] = useState(null);
  // function saveComment() {
  //   fetch("/movie_comments", {
  //     method: "POST",
  //   }).then(res => res.json())
  //     .then(data => setSav(data.data));
  // }
  
  const handleChange = (e) => {
    if (e.target.name=="comment"){
      commentRef.current[e.target.id]=e.target.value
    }
    if (e.target.name=="rate"){
      rateRef.current[e.target_id]=e.target.value
    }
    console.log(commentRef.current[e.target.id])
    console.log(commentRef.current)
  
  }

  function editComments(e) {
    fetch("http://localhost:3001/edit_comments", {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comments: commentRef.current,
        rate: rateRef.current
      })})
  };
  if (isLoading){
    return (<div className="App">Loading Data</div>)
  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>Your reviews:</h1>
          <form onSubmit={editComments}>
            {comm && comm.map((item, index) => 
            <div>
              <label className='movie-id-tag'>Movie ID: 157336</label>
              <input id={item.comment_id} ref={(element) => {rateRef.current[item.comment_id] = element}} name="rate" type="text" onChange={handleChange}/>
              <input  id={item.comment_id} ref={(element) => {commentRef.current[item.comment_id] = element}} name="comment" type="text" onChange={handleChange} />
              <button id={item.comment_id} name="delete-button" type="submit" onClick={(element) => commentRef.current[item.comment_id].focus()}>Delete</button>
            </div>
          )}
          <button className="save-all-button" type="submit">Save Changes</button>
          </form>

      </header>
    </div>
  );
}

export default App;
