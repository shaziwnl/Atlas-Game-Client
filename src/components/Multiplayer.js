import React from 'react'
import { useState, useEffect } from 'react'
import './random.css' 
import Alert from '@mui/material/Alert'
import axios from 'axios';
import { useLocation, Navigate } from 'react-router-dom';
import useSound from 'use-sound'
import errorSound from './errorcut.mp3'
import successSound from './correct.mp3'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import io from 'socket.io-client'

const socket = io.connect("https://atlas-game.onrender.com")

function Multiplayer() {
    const token = localStorage.getItem('token')

    const location = useLocation();
    const room = useState(location.state.room)

    const [backgroundImage, setBackgroundImage] = useState(1);

    const [turn, setTurn] = useState(true);

    const [open, setOpen] = useState(false);    

    const handleOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    const [prev, setPrev] = useState('atlas')

    const [guess, setGuess] = useState("");

    const [alert, setAlert] = useState("")
    
    const [guesses, setGuesses] = useState([])

    const [result, setResult] = useState("")

    const [redirectToJoinGame, setRedirectToJoinGame] = useState(false)

    const [playErr] = useSound(errorSound, {volume: 1})

    const [playCorrect] = useSound(successSound, {volume: 0.3})

    useEffect(() => {
      if (room) {
        socket.emit('join_room', room[0])
      } else {
        return <Navigate to='/joingame' />
      }
    }, [])

    useEffect(() => { //Every time there is a change in the socket, we receive the message
      socket.on('receive_message', (data) => {
        if (guesses === data.guesses) {
          setTurn(false)
        } else {
          setTurn(true)
        }
        setGuesses(data.guesses)
        setPrev(data.guess)
        setAlert("")
    })}, [socket])

    useEffect(() => {
        socket.on('lost', (room) => {
        setResult(<div className='center-text-container'>
                    <h1 className='center-text'>YOU WON!</h1>
                  </div>)
        setTimeout(() => setRedirectToJoinGame(true), 2000)
    })}, [socket])


    if (!token) { //authentication 
      return <Navigate to='/login' />
    }

    if (redirectToJoinGame) { //if we are leaving the game
      return <Navigate to='/joingame'/>
    }

    function guessesMapper(item) { //function to map the guesses
      return (
        <h1>{item[0].toUpperCase() + item.slice(1)}</h1>
      )
    }
    let listofGuesses = guesses.map(guessesMapper) //this maps the guesses


    function handleSubmit() {
      document.getElementById("guess-input-multiplayer").value = ""
      if (!turn) {
        setAlert(<Alert severity="info"><strong>Please wait for your turn</strong></Alert>)
      } else if (!guess) {
        setAlert(<Alert severity="error"><strong>Guess cannot be empty</strong></Alert>)
      } else {
        axios.post('https://atlas-game.onrender.com/guess', {guess, prev, guesses})
             .then(async (res) => {
              if (res.data.error) {
                setAlert(<Alert variant="filled" severity="info"><strong>{res.data.message}</strong></Alert>)
                playErr()
              } else {
                setTurn(false)
                setAlert("")
                setPrev(res.data.prev)
                playCorrect()
                setGuesses(res.data.guesses)
                await socket.emit('send_message', {room, guesses: res.data.guesses, guess: res.data.prev})
              }
             })
        }
        setGuess("")
    }

    async function handleResign() {
      await socket.emit('resign', room)
      setGuesses([])
      setPrev('atlas')
      setGuess("")
      setResult(<div className='center-text-container'>
                  <h1 className='center-text'>YOU LOST</h1>
                </div>)
      setTimeout(() => setRedirectToJoinGame(true), 2000)
    }

    function leaveRoom() {
      setTimeout(() => setRedirectToJoinGame(true), 1000)
    }

    function changeBg() {
      if (backgroundImage < 5) {
        setBackgroundImage(prev => prev + 1)
      } else {
        setBackgroundImage(1)
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    }

    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };

  return (
    <div className={`random-container-b${backgroundImage}`}>
      {}
      {result}
      <div className="random-game">
        <h1>Atlas</h1>
        {listofGuesses}
        {alert}
        <br></br>
      </div>
      <div className='random-inputs'>
        <input id="guess-input-multiplayer" type='text' placeholder='Guess a City/State/Country/Continent' onKeyDown={handleKeyDown} onChange={(e) => {setGuess(e.target.value); setAlert("")}}></input>
        <button onClick={handleSubmit}>SUBMIT &nbsp; &#10132;</button>
      </div>
      <br></br>
      <br></br>
      <div className='random-buttons'>
        <Button variant="contained" size='large'  onClick={handleOpen}>Show Rules</Button>
        <Button variant="contained" size='large'  onClick={changeBg}>Change Background</Button>
        <Button variant="contained" size='large'  onClick={leaveRoom}>Leave Room</Button>
        <Button variant="contained" size='large' color="error" onClick={handleResign}>Resign</Button>
      </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h1>Test your geography with Atlas</h1>
            <Typography id="modal-modal-description" sx={{ mt: 1 }}>
              The game starts with the word 'Atlas', now you must guess a place which starts with the last letter of the previous word. In this case, 's'. Now suppose 'Singapore' is guessed, the next guess must start with the letter 'e' and so on.
            </Typography>
          </Box>
        </Modal>
    </div>
  )
}

export default Multiplayer
