import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import DeckPage from './DeckPage/DeckPage'
import './Deck.css'

function Deck({ selectedDeck }){

    // const decks = useSelector(state => Object.values(state.decks.userDecks))
    const deck = useSelector(state => state.decks.userDecks[selectedDeck])
    const [cards, setCards] = useState(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [cardTypeCounts, setCardTypeCounts] = useState({ "Pokémon": 0, 'Energy': 0, 'Item': 0, 'Supporter': 0, '"Pokémon Tool"': 0, 'Stadium': 0 })
    console.log(selectedDeck)

    const decreasePageNumber = (page) => setCurrentPage(page - 1)
    const increasePageNumber = (page) => setCurrentPage(page + 1)

    useEffect(() => {
        console.log(cards)
        // setDeck(decks.find(deck => deck.id == selectedDeck))
        if(selectedDeck !== '0') {
            setCards(Object.values(deck.cards))
        }
        if(selectedDeck === '0'){
            setCurrentPage(0)
        }
    }, [selectedDeck, deck])

    useEffect(() => {
        if(cards) setCardTypeCounts(getCardTypeCounts())
    }, [cards])

    const getCardTypeCounts = () => {
        const cardTypes = { "Pokémon": 0, 'Energy': 0, 'Item': 0, 'Supporter': 0, "Pokémon Tool": 0, 'Stadium': 0 }
        cards.forEach((card) => {
            if(card.supertype === 'Trainer'){
                cardTypes[card.subtype]++
                // cardTypes['Trainer']++
            } else {
                cardTypes[card.supertype]++ 
            }
        })
        return cardTypes
    }

    return (
        <>
        <h1 className='deck-header'> {deck?.name} Deck </h1>
        <div style={{textAlign: 'center'}}>
            {cards && cards.length && Object.keys(cardTypeCounts).map((cardType, index) => {
                return <span>{ cardType + ': ' + cardTypeCounts[cardType] + ' '}</span>
            }) || ''}
        </div>
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
