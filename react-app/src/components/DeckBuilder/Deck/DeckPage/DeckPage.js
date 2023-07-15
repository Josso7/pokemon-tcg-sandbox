import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { removeCardFromDeckThunk } from "../../../../store/decks"

function DeckPage ({ currentPage, cards, selectedDeck }) {

    const [pageCards, setPageCards] = useState(null)
    const dispatch = useDispatch()

    const removeCard = (card) => {
        dispatch(removeCardFromDeckThunk(selectedDeck, card))
    }

    useEffect(() => {
        setPageCards(() => {
            console.log(cards)
            const cardsArr = []
            for(let i = currentPage * 20; i < (currentPage * 20) + 20 && i < cards.length; i++){
                cardsArr.push(cards[i])
            }
            console.log(cardsArr)
            return cardsArr
        })
    }, [currentPage, cards])

    return (
        <>
            <div className="deck-wrapper">
                {pageCards && pageCards.length && pageCards.map((card) => {
                    return (
                        <div className='single-deck-card-wrapper' key={card.id}>
                            <img className='single-card-image' src={card.image_url}></img>
                            <button style={{display: 'block'}} onClick={() => removeCard(card)}> Remove </button>
                        </div>
                    )
                }) || <h1>Deck is Empty</h1>}
            </div>
        </>
    )
}

export default DeckPage
