import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import PokemonSearch from "./components/PokemonSearch"
import DeckBuilderWrapper from "./components/DeckBuilder";
import GameLobbyWrapper from "./components/GameLobbyWrapper/GameLobbyWrapper";
import GameSceneWrapper from "./components/GameSceneWrapper/GameSceneWrapper"
import { io } from 'socket.io-client'

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const socketClientRef = useRef();

  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);


  useEffect(() => {
    socketClientRef.current = io('localhost:3000')
    socketClientRef.current.connect()

    socketClientRef.current.on("connect", () => {
      console.log("Connected");
    });

    socketClientRef.current.on("disconnected", () => {
      console.log("Disconnected");
    });

    // setInterval(() => {
    //   // console.log(socketClientRef?.current)
    //   if(socketClientRef.current.connected === false) {
    //     socketClientRef.current.connect();
    //     console.log('trying to reconnect')
    //   }
    // }, [10000])

    return () => {
      socketClientRef.current.removeAllListeners();
      // socketClientRef.disconnect()
    };
  }, [])

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path='/'>
            <PokemonSearch />
          </Route>
          <Route exact path='/build-deck'>
            <DeckBuilderWrapper />
          </Route>
          <Route exact path='/play'>
            <GameLobbyWrapper socket={socketClientRef.current}/>
          </Route>
          <Route exact path={`/lobby/:lobbyId`}>
            <GameSceneWrapper socket={socketClientRef.current}/>
          </Route>
          <Route exact path='/'>
            <DeckBuilderWrapper />
          </Route>
          <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route path='/search'>
            <PokemonSearch />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
