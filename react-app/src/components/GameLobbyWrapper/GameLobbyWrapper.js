import { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import './GameLobbyWrapper.css'

function GameLobbyWrapper () {

    const [lobbyId, setLobbyId] = useState()
    const [showLobbyJoin, setShowLobbyJoin] = useState(false)
    const history = useHistory()

    const handleCreate = () => {
        const newLobbyId = uuidv4();
        history.push(`/lobby/${newLobbyId}`)
    }

    const handleJoin = () => {
        
    }

    const showJoinLobbyForm = () => {
        setShowLobbyJoin(true)
    }

    return (
        <>
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