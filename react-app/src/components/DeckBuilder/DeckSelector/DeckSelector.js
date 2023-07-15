import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createDeckThunk, deleteDeckThunk, updateDeckThunk } from "../../../store/decks"

function DeckSelector({ setSelectedDeck, selectedDeck }) {

    const [deckName, setDeckName] = useState()
    const [updateDeckName, setUpdateDeckName] = useState()
    const dispatch = useDispatch()

    const decks = useSelector(state => Object.values(state.decks.userDecks))

    const newDeck = async () => {
        const newDeckId = await dispatch(createDeckThunk(deckName))
        console.log(newDeckId)
        setDeckName('')
        setSelectedDeck(newDeckId)
    }

    const deleteDeck = () => {
        if(selectedDeck) dispatch(deleteDeckThunk(selectedDeck))
        setSelectedDeck('0')
    }

    const updateDeck = () => {
        if(selectedDeck) dispatch(updateDeckThunk(selectedDeck, updateDeckName))
        setUpdateDeckName('')
    }

    return (
        <>
            <select value={selectedDeck} onChange={(e) => setSelectedDeck(e.target.value)}>
                <option value={0}>
                    - Please Choose a Deck -
                </option>
                {decks && decks.length && decks.map((deck) => (
                    <option value={deck.id}>
                        {deck.name}
                    </option>
                ))}
            </select>
            {selectedDeck && <input value={updateDeckName} onChange={(e) => setUpdateDeckName(e.target.value)} placeholder="Update Deck Name..."></input> || ''}
            {selectedDeck && <button onClick={() => updateDeck()}> Update Deck Name </button> || ''}
            {selectedDeck && <button onClick={() => deleteDeck()} className="delete-deck-button"> Delete Selected Deck </button> || ''}
            {!selectedDeck && <input value={deckName} placeholder='Create a new Deck...' onChange={(e) => setDeckName(e.target.value)}></input> || ''}
            {!selectedDeck && <button onClick={() => newDeck()} className="new-deck-button"> Create New Deck </button> || ''}
        </>
    )
}

export default DeckSelector
