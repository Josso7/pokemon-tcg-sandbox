import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PokemonSearch from '../PokemonSearch/PokemonSearch'
import { getUserDecksThunk } from '../../store/decks.js'
import Deck from './Deck/deck'
import DeckSelector from './DeckSelector/DeckSelector'
import DeckCardBrowser from './DeckCardBrowser'

function DeckBuilderWrapper() {

    const dispatch = useDispatch()

    const [toggleScene, setToggleScene] = useState(null)
    const [selectedDeck, setSelectedDeck] = useState(0)
    const [deckButtonDisabled, setDeckButtonDisabled] = useState(true)
    const user = useSelector(state => state.session.user)

    useEffect(() => {
        if(user) dispatch(getUserDecksThunk(user.id))
    }, [])

    useEffect(() => {
        if(selectedDeck) setDeckButtonDisabled(false)
        if(selectedDeck === '0') {
            setDeckButtonDisabled(true)
            setToggleScene(null)
        }
    }, [selectedDeck])

    return (
        <>
        {/* <h1 className='deck-builder-header'>Deck Builder</h1> */}
        <div className='scene-toggle-wrapper'>
            <button disabled={deckButtonDisabled} className={toggleScene === 'search'? 'active-tab' : ''} onClick={() => setToggleScene("search")}>
                Search
            </button>
            <button disabled={deckButtonDisabled} className={toggleScene === 'deck'? 'active-tab' : ''} onClick={() => setToggleScene("deck")}>
                Deck
            </button>
            <DeckSelector setSelectedDeck={setSelectedDeck} selectedDeck={selectedDeck} />
        </div>
        {toggleScene === 'deck' &&
            <Deck selectedDeck={selectedDeck} />}
        {toggleScene === 'search' &&
            <DeckCardBrowser selectedDeck={selectedDeck}/>}

        </>
    )
}

export default DeckBuilderWrapper
