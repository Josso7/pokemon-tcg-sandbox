import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import DeckPage from './DeckPage/DeckPage'
import './Deck.css'

function Deck({ selectedDeck }){

    const decks = useSelector(state => Object.values(state.decks.userDecks))
    const deck = useSelector(state => state.decks.userDecks[selectedDeck])
    const [cards, setCards] = useState(null)
    const [currentPage, setCurrentPage] = useState(0)
    console.log(selectedDeck)

    const decreasePageNumber = (page) => setCurrentPage(page - 1)
    const increasePageNumber = (page) => setCurrentPage(page + 1)

    useEffect(() => {
        console.log(cards)
        // setDeck(decks.find(deck => deck.id == selectedDeck))
        if(selectedDeck !== '0') setCards(Object.values(deck.cards))
        setCurrentPage(0)
    }, [selectedDeck, deck])

    return (
        <>
        <h1 className='deck-header'> {deck?.name} Deck </h1>
        {cards && cards.length && <h2 className='deck-length'> {cards.length} Cards</h2> || ''}
            {cards && cards.length && <DeckPage currentPage={currentPage} cards={cards} selectedDeck={selectedDeck} /> || <h1 style={{textAlign: 'center'}}> Deck is Empty</h1>}
            <div className='deck-page-number-wrapper'>
                {currentPage > 0 && <button onClick={() => decreasePageNumber(currentPage)}>Previous Page</button>}
                {cards && cards.length && <div className='page-text'> {'Page ' + (currentPage + 1) + ' of ' + Math.ceil(cards?.length / 20)} </div> || ''}
                {currentPage + 1 < Math.ceil(cards?.length / 20) && <button onClick={() => increasePageNumber(currentPage)}>Next Page</button>}
            </div>
        </>
    )
}

export default Deck
