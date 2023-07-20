import { useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { io } from 'socket.io-client'
import './GameLobbyWrapper.css'
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import { useSelector } from 'react-redux';

let socket;

function GameLobbyWrapper () {

    const [lobbyId, setLobbyId] = useState()
    // const [socket, setSocket] = useState(io())
    const user = useSelector(state => state.session.user)
    const [toastOpen, setToastOpen] = useState(false)
    const [showLobbyJoin, setShowLobbyJoin] = useState(false)
    const history = useHistory()


    useEffect(() => {
        socket = io()

        socket.on("room_not_found", () => {
            setToastOpen(true)
        })

        return (() => {
            socket.off("room_not_found")
            socket.disconnect()
        })
    }, [])

    const handleCreate = () => {
        const newLobbyId = uuidv4();
        history.push(`/lobby/${newLobbyId}`)
        socket.emit("create_room", newLobbyId, user.username)
    }

    const handleJoin = () => {
        console.log('test')
        socket.emit('check_room', lobbyId)
    }

    const showJoinLobbyForm = () => {
        setShowLobbyJoin(true)
    }

    const handleClose = (event, reason) => {
        if(reason !== 'clickaway'){
            setToastOpen(false)
        }
    }

    return (
        <>
        {toastOpen && <Snackbar open={toastOpen} onClose={handleClose} autoHideDuration={3000} anchorOrigin={{horizontal: 'center', vertical: 'top'}}>
            {toastOpen && <Alert onClose={handleClose} sx={{width: "100%"}} severity='error'>    
                <AlertTitle> Error </AlertTitle>
                No room found 
            </Alert>}
        </Snackbar>}
            <div>
                <button onClick={handleCreate}>
                    Create Game
                </button>
                <button onClick={showJoinLobbyForm}>
                    Join Game
                </button>
            </div>
            {showLobbyJoin && <div>
                <input  className='lobby-input' placeholder='Enter a Lobby ID' type='text' value={lobbyId} onChange={(e) => setLobbyId(e.target.value)}></input>    
                <button onClick={handleJoin}> Join Lobby </button>
            </div>}
        </>
    )
}

export default GameLobbyWrapper