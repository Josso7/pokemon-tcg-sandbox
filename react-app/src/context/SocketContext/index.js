import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
} from 'react'

import io from 'socket.io-client'

export const SocketContext = createContext()

export const SocketProvider = ({ children, store }) => {

  const [isConnected, setConnected] = useState(false)

  // const socketUrl = `${process.env.API_URL}/socket.io`

  const socket = useRef(null)

  const handleOnMessage = message => {
    console.log(message)
    // store.dispatch here
  }

  useEffect(() => {
    if (!isConnected) {
      socket.current = io({connectionStateRecovery: {
        // the backup duration of the sessions and the packets
        maxDisconnectionDuration: 2 * 60 * 1000,
        // whether to skip middlewares upon successful recovery
        skipMiddlewares: true,
      }})

      socket.current.on('connect', () => {
        console.info(`Successfully connected to socket`)
        setConnected(true)
      })

      socket.current.on('disconnect', () => {
        console.info(`Successfully disconnected`)
        setConnected(false)
      })

      socket.current.on('error', err => {
        console.log('Socket Error:', err.message)
      })

      socket.current.on('message', handleOnMessage)
    }

    return () => {
      if (socket.current && socket.current.connected) {
        socket.current.disconnect()
      }
    }
  }, [])

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
