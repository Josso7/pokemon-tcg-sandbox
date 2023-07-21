import { Alert, Snackbar } from "@mui/material"
import { useEffect, useState, useContext } from "react"
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
// import SocketContext from "../../context/SocketContext/context"
import { useSocket } from '../../context/SocketContext'
import ConnectedUsers from "../GameLobbyWrapper/ConnectedUsers/ConnectedUsers"

function GameSceneWrapper ({ socket }) {

    const [toastOpen, setToastOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState()
    const user = useSelector(state => state.session.user)
    // const socket = useSocket()
    const { lobbyId } = useParams()


    const handleClose = (event, reason) => {
        if(reason !== 'clickaway'){
            setToastOpen(false)
        }
    }

    // setInterval(() => {
    //     console.log(socket)
    // }, [1000])

    useEffect(() => {
        console.log(socket)
        // socket.connect()

        socket.on('user_connected', (data) => {
            console.log('recieved message')
            if(data.joined){
                setToastMessage(data.message)
                setToastOpen(true)
            }
        })

        socket.emit('join_lobby', {username: user.username, room: lobbyId})

    }, [])

    useEffect(() => {

        console.log(socket)
        // if(socket.connected === false) socket.connect()
    }, [socket.connected])

    // useEffect(() => {
    //     if(socket.connected === false) socket.connect()
    // },[socket.connected])

    return (
        <>
        <h1>Game Scene Wrapper</h1>
        {toastOpen && <Snackbar autoHideDuration={3000} onClose={handleClose} open={toastOpen}>
            {toastOpen && <Alert onClose={handleClose} severity='success' sx={{width: "100%"}}>
            {toastMessage}
            </Alert>}
        </Snackbar>}
        <ConnectedUsers socket={socket}/>
        </>
    )
}

export default GameSceneWrapper
