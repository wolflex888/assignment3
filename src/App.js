import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useRef, Component} from 'react';
import ReactDom from 'react-dom';
import { render } from '@testing-library/react';


function App() {
  const [comm, setComm] = useState([]);
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true)
  const inputRef = useRef([])

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
    .then(() => {
      for (let i = 0; i < comm.length; i++){
        inputRef.current[comm[i].comment_id] = {}
        inputRef.current[comm[i].comment_id]["comment"] = comm[i].comment
        inputRef.current[comm[i].comment_id]['rate'] = comm[i].rate
      };
      setIsLoading(false);
    })
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
  function deleteComments() {
    fetch("/delete_comments", {
      method: "POST",
    }).then(res => res.json())
      .then(data => setComm(data.delete_comments));
  };

  // const [Sav, setSav] = useState(null);
  // function saveComment() {
  //   fetch("/movie_comments", {
  //     method: "POST",
  //   }).then(res => res.json())
  //     .then(data => setSav(data.data));
  // }
  const handleCommentChange = (e) =>{
  };
  

  const handleRateChange = (e) => {

  };
  
  const handleChange = (e) => {
    for (let i = 0; i < comm.length; i++){
      if (comm[i].comment_id == e.target.id)
      comm[i][e.target.name] = e.target.value 
    };
    console.log(inputRef.current)
  };

  function editComments(e) {
    // fetch("http://localhost:3001/edit_comments", {
    //   method: "PATCH",
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     formData
    //   })})
    console.log(inputRef.current)
  };
  if (isLoading){
    return (<div className="App">Loading Data</div>)
  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>Your reviews:</h1>
          <form onSubmit={editComments}>
            {comm && comm.map((item) => 
            <div>
              <label className='movie-id-tag'>Movie ID: 157336</label>
              <input id={item.comment_id} ref={inputRef[item.comment_id]} name="rate" type="text" value={item.rate} onChange={handleChange}/>
              <input id={item.comment_id} ref={inputRef[item.comment_id]} name="comment" type="text" value={item.comment} onChange={handleChange} />
              <button id={item.comment_id} name="delete-button" type="submit">Delete</button>
            </div>
          )}
          <button className="save-all-button" type="submit">Save Changes</button>
          </form>

      </header>
    </div>
  );
}

export default App;
