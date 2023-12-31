import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import PokemonSearch from "./components/PokemonSearch"
import DeckBuilderWrapper from "./components/DeckBuilder";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

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
