import React from 'react'
import './joingame.css'
import { Link, Navigate } from 'react-router-dom'
import { useState } from 'react'

function JoinGame() {
    const [room, setRoom] = useState("")
    const [validRoom, setValidRoom] = useState(false)
    const [logout, setLogout] = useState(false)
    const token = useState(localStorage.getItem('token'))

    if (!token) {
        return <Navigate to='/login' />
    }

    if (validRoom) {
        return <Navigate to='/multiplayer' state={{room}} />
    }

    if (logout) {
        return <Navigate to='/login'/>
    }

    function joinRoom() {
        if (room) {
            setValidRoom(true)
        }
    }

    function handleLogout() {
        localStorage.removeItem('token')
        setLogout(true)
    }
    
    return (
        <div className='joingame-container'>
            <div className='joingame-form'>
                <input type='text' placeholder='Room ID' onChange={(e) => setRoom(e.target.value)}></input>
                <button onClick={joinRoom}>Join/Start Game</button>
                <h2 id="OR">OR</h2>
                <br></br>
                <Link to='/game'><button>Single Player</button></Link>
                {/* <Link to='/game' state={{auth: location.state.auth}}><button>Single Player</button></Link> */}
                <br></br>
                <br></br>
                <button id='logout-btn-jg' onClick={handleLogout}>Log out</button>
            </div>
        </div>
    )
}

export default JoinGame
