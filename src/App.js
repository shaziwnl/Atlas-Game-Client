import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './components/Signup';
import Login from './components/Login';
import {JoinGame} from './components/JoinGame';
import Random from './components/Random';
import Multiplayer from './components/Multiplayer';


function App() { 
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/game' element={<Random />} /> 
        <Route path='/joingame' element={<JoinGame />} />
        <Route path='/multiplayer' element={<Multiplayer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
