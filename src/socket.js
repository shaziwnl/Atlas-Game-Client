import { io } from 'socket.io-client'

export const socket = io("https://atlas-game.onrender.com", {
    autoConnect: false
});