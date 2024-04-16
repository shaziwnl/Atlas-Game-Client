import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import axios from 'axios'
import './signup.css'




function Signup() {

  const [alert, setAlert] = useState("")
  const [user, setUser] = useState({firstName: "", lastName: "", username: "", password: ""})
  

  function handleSignup(e) {
    e.preventDefault()
    if (!user.firstName) {
      setAlert(<Alert className="error-alert" severity="error"><strong>Please enter your First Name</strong></Alert>)
    }
    else if (!user.lastName) {
      setAlert(<Alert className="error-alert" severity="error"><strong>Please enter your Last Name</strong></Alert>)
    }
    else if (!user.username) {
      setAlert(<Alert className="error-alert" severity="error"><strong>Please enter your Username</strong></Alert>)
    }
    else if (!user.password) {
      setAlert(<Alert className="error-alert" severity="error"><strong>Please enter your Password</strong></Alert>)
    }
    else if (user.password.length < 8) {
      setAlert(<Alert className="error-alert" severity="error"><strong>Password must have at least 8 characters</strong></Alert>)
    }
    else if (!(/\d/.test(user.password))) {
      setAlert(<Alert className="error-alert" severity="error"><strong>Password must have a digit</strong></Alert>)
    }
    else if (!(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(user.password))) {
      setAlert(<Alert className="error-alert" severity="error"><strong>Password must have a special character</strong></Alert>)
    }
    else {
      axios.post(`${process.env.REACT_APP_URL}/signup`, user)
           .then(res => {
            if (res.data.message === 'Username already exists') {
              setAlert(<Alert className="error-alert" severity="error"><strong>Username already exists</strong></Alert>)
            } else {
              setAlert(<Alert className="error-alert" severity="success"><strong>User registered successfully!</strong></Alert>)
            }
           })
    } 
  }

  return (
    <div className='signup'>
      <form className='signup-form'>
          <input type='text' placeholder='First Name' onChange={(e) => setUser({...user, firstName: e.target.value})}></input>
          <input type='text' placeholder='Last Name' onChange={(e) => setUser({...user, lastName: e.target.value})}></input>
          <input type='text' placeholder='Username' onChange={(e) => setUser({...user, username: e.target.value})}></input>
          <input type='password' placeholder='Password' onChange={(e) => setUser({...user, password: e.target.value})}></input>
          <button onClick={handleSignup}>Sign Up</button>
      </form>
      <h2 id="OR">OR</h2>
      <Link to='/login'><button className='login-btn'>Login</button></Link>
      <br></br>
      {alert}
    </div>
  )
}

export default Signup
