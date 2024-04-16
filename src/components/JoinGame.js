import React, { useEffect } from 'react'
import './joingame.css'
import { Link, Navigate } from 'react-router-dom'
import { useState } from 'react'

import { socket } from '../socket';

function JoinGame() {
    const [room, setRoom] = useState("")
    const [validRoom, setValidRoom] = useState(false)
    const [logout, setLogout] = useState(false)
    const [goToMultiplayer, setGoToMultiplayer] = useState(false)
    const token = localStorage.getItem('token')

    useEffect(() => {
        
        socket.on('join_success', (data) => {
            console.log(data.message);
            setGoToMultiplayer(true);
            
        })

        socket.on('join_fail', (message) => {
            console.log(message)
        })


    },[])

    if (!token) {
        return <Navigate to='/login' />
    }

    if (validRoom) {
        socket.emit('join_room', room)
    }

    if (logout) {
        return <Navigate to='/login'/>
    }

    if (goToMultiplayer) {
        return <Navigate to='/multiplayer' state={{room}} />
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

export { socket, JoinGame }
