import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { removeCardFromDeckThunk } from "../../../../store/decks"
import { Alert, AlertTitle, Snackbar, Slide } from "@mui/material"

function DeckPage ({ currentPage, cards, selectedDeck }) {

    const [pageCards, setPageCards] = useState(null)
    const [toastOpen, setToastOpen] = useState()
    const [toastType, setToastType] = useState()
    const dispatch = useDispatch()

    const removeCard = (card) => {
        dispatch(removeCardFromDeckThunk(selectedDeck, card))
        setToastType("success")
        setToastOpen(true)
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

    const handleClose = (event, reason) => {
        if(reason !== 'clickaway')
        setToastOpen(false)
    }

    const TransitionSlideUp = (props) => {
        return <Slide {...props} direction="up"/>
    }

    return (
        <>
        <Snackbar TransitionComponent={TransitionSlideUp} open={toastOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}}>
                {toastType === 'success' && <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
                    <AlertTitle> Success </AlertTitle>
                    Card removed!
                </Alert>}
        </Snackbar>
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
