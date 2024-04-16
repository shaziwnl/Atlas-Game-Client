import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import axios from 'axios'
import { Navigate } from 'react-router-dom';
import './login.css'

function Login() {

  const [alert, setAlert] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [token, setToken] = useState("")

  function handleLogin(e) {
    e.preventDefault()
    if (!username) {
      setAlert(<Alert className="error-alert" severity="error"><strong>Please enter your Username</strong></Alert>)
    }
    else if (!password) {
      setAlert(<Alert className="error-alert" severity="error"><strong>Please enter your Password</strong></Alert>)
    } 
    else {
      axios.post(`${process.env.REACT_APP_URL}/login`, {username, password})
           .then(res => {
            if (res.data.errorAlert) {
              setAlert(<Alert className="error-alert" severity="error"><strong>{JSON.stringify(res.data.message)}</strong></Alert>)
            } else {
              localStorage.setItem('token', res.data.token)
              setToken(res.data.token)
            }
           })
    } 
  }

  if (token) { return <Navigate to={'/joingame'}/> }

  return (
    <div className='login'>
      <form className='login-form'>
          <input type='text' placeholder='Username' onChange={(e) => setUsername(e.target.value)}></input>
          <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)}></input>
          <button onClick={handleLogin}>Login</button>
      </form>
      <h2 id="OR">OR</h2>
      <Link to='/'><button className='signUp-btn'>Sign Up</button></Link>
      <br></br>
      {alert}
    </div>
  )
}

export default Login
