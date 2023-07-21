import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function ConnectedUsers({ socket }){


    const [connectedUsers, setConnectedUsers] = useState([])
    const { lobbyId} = useParams()

    // const updateConnectedUsers = (users, user) => {
    //     const newUsers = [...users]
    //     if(!newUsers.contains(user)) newUsers.push(user)
    //     setConnectedUsers(newUsers)
    // }

    useEffect(() => {

        // socket.on('user_connected', (data) => {
        //     updateConnectedUsers(connectedUsers, data.username)
        // })

        socket.on('connected_users', (data) => {
            console.log(data)
            setConnectedUsers(data)
        })

        socket.emit('get_connected_users', lobbyId)

    }, [])

    return (
        <>
            <div className="connected-users-wrapper">
                {connectedUsers.length && connectedUsers.map((username) => {
                    return <div> {username} </div>
                }) || ''}
            </div>
        </>
    )
}

export default ConnectedUsers
