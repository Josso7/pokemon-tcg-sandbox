const LOAD_DECK = 'decks/LOAD_DECK'
const LOAD_USER_DECKS = 'decks/LOAD_USER_DECKS'
const ADD_CARD = 'decks/ADD_CARD'
const REMOVE_CARD = 'decks/REMOVE_CARD'
const UPDATE_DECK = 'decks/UPDATE_DECK'


const loadDeck = (deck) => {
    return {
        type: LOAD_DECK,
        deck
    }
}

const loadUserDecks = (decks) => {
    return {
        type: LOAD_USER_DECKS,
        decks
    }
}

const addCardCreator = (card) => {
    return {
        type: ADD_CARD,
        card
    }
}

const removeCardCreator = (card) => {
    return {
        type: REMOVE_CARD,
        card
    }
}

const updateDeckCreator = (deck) => {
    return {
        type: UPDATE_DECK,
        deck
    }
}

export const getUserDecksThunk = (userId) => async (dispatch) => {
    const response = await fetch(`/api/decks/current`)
    if(response.ok){
        const data = await response.json()
        dispatch(loadUserDecks(data))
        return
    } else {
        const errors = await response.json()
        return errors
    }
}

export const getSingleDeckThunk = (deckId) => async (dispatch) => {
    const response = await fetch(`/api/decks/${deckId}`)
    if(response.ok){
        const data = await response.json()
        dispatch(loadDeck(data))
        return
    } else {
        const errors = await response.json()
        return errors
    }
}

export const addCardToDeckThunk = (deckId, card) => async (dispatch) => {
    const response = await fetch(`/api/decks/${deckId}/addCard`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(card)
    })
    if(response.ok){
        const data = await response.json()
        dispatch(addCardCreator(data))
        return
    } else {
        const errors = await response.json()
        return errors
    }
}

export const removeCardFromDeckThunk = (deckId, card) => async (dispatch) => {
    const response = await fetch(`/api/decks/${deckId}/removeCard`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(card)
    })
    if(response.ok){
        const data = await response.json()
        dispatch(removeCardCreator(data))
        return
    } else {
        const errors = await response.json()
        return errors
    }
}

export const deleteDeckThunk = (deckId) => async (dispatch) => {
    const response = await fetch(`/api/decks/${deckId}/delete`)

    if(response.ok){
        return
    } else {
        const errors = await response.json()
        return errors
    }
}

export const updateDeck = (name) => async (dispatch) => {
    const response = await fetch(`/api/decks/${deckId}/edit`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(name)
    })
    if(response.ok){
        const data = await response.json()
        dispatch(updateDeckCreator(data))
        return
    } else {
        const errors = await response.json()
        return errors
    }
}


const initialState = {cards: {}}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case LOAD_USER_DECKS: {
            const newState = {userDecks: {}}
            action.decks.forEach((deck) => {
                newState.userDecks[deck.id] = deck
            })
            return newState
        }
        case LOAD_DECK: {
            const newState = {}
            action.deck.forEach((card) => {
                newState.cards[card.id] = card 
            })
            return newState
        }
        case ADD_CARD: {
            const newState = {...state}
            newState.cards[action.card.id] = card
            return newState
        }
        case REMOVE_CARD: {
            const newState = {...state}
            delete newState.cards[action.card.id] 
            return newState
        }
        case UPDATE_DECK: {
            const newState = {...state}
            newState.decks[action.deck.id] = action.deck
            return newState
        }
    }
}

export default reducer