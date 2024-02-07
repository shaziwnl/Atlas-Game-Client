import React from 'react'
import { useState } from 'react'
import './random.css' 
import Alert from '@mui/material/Alert'
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import useSound from 'use-sound'
import errorSound from './errorcut.mp3'
import successSound from './correct.mp3'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

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




function Random() {
    const [backgroundImage, setBackgroundImage] = useState(1);
    const [open, setOpen] = useState(false);    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [guess, setGuess] = useState("");
    const [token, setToken] =  useState(localStorage.getItem('token'))
    const [prev, setPrev] = useState('atlas')

    const [alert, setAlert] = useState("")

    const [guesses, setGuesses] = useState([])

    const [redirectToJoinGame, setRedirectToJoinGame] = useState(false)

    const [playErr] = useSound(errorSound, {volume: 1})
    const [playCorrect] = useSound(successSound, {volume: 0.3})

    
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

    const listofGuesses = guesses.map(guessesMapper) //this maps the guesses

    function changeBg() {
      if (backgroundImage < 5) {
        setBackgroundImage(prev => prev + 1)
      } else {
        setBackgroundImage(1)
      }
    }


    function handleSubmit() {
      document.getElementById("guess-input").value = ""
      if (!guess) {
        setAlert(<Alert severity="error"><strong>Guess cannot be empty</strong></Alert>)
      } else {
      axios.post('https://atlas-game.onrender.com/guess', {guess, prev, guesses, room: "SinglePlayer"})
           .then(res => {
            if (res.data.error) {
              setAlert(<Alert variant="filled" severity="info"><strong>{res.data.message}</strong></Alert>)
              playErr()
            } else {
              setAlert("")
              setGuesses(res.data.guesses)
              setPrev(res.data.prev)
              playCorrect()
            }
           })
      }
      setGuess("")
    }

    function handleLeave() {
      setGuesses([])
      setPrev('atlas')
      setGuess("")
      setRedirectToJoinGame(true)
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    }


  return (
    <div className={`random-container-b${backgroundImage}`}>
      <div className="random-game">
        <h1>Atlas</h1>
        {listofGuesses}
        {alert}
        <br></br>
      </div>
      <div className='random-inputs'>
        <input id="guess-input" type='text' placeholder='Guess a City/State/Country/Continent' onKeyDown={handleKeyDown} onChange={(e) => {setGuess(e.target.value); setAlert("")}}></input>
        <button onClick={handleSubmit}>SUBMIT &nbsp; &#10132;</button>
      </div>
      <br></br>
      <br></br>
      <div className='random-buttons'>
        <Button variant="contained" size='large'  onClick={handleOpen}>Show Rules</Button>
        <Button variant="contained" size='large'  onClick={changeBg}>Change Background</Button>
        <Button variant="contained" size='large'  onClick={() => {setGuesses([]); setAlert(""); setGuess(""); document.getElementById('guess-input').value = ""}}>Reset game</Button>
        <Button variant="contained" size='large' color="error" onClick={handleLeave}>Leave game</Button>
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

export default Random
