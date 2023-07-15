const LOAD_DECK = 'decks/LOAD_DECK'
const LOAD_USER_DECKS = 'decks/LOAD_USER_DECKS'
const ADD_CARD = 'decks/ADD_CARD'
const REMOVE_CARD = 'decks/REMOVE_CARD'
const UPDATE_DECK = 'decks/UPDATE_DECK'
const CREATE_DECK = 'decks/CREATE_DECK'
const DELETE_DECK = 'decks/DELETE_DECK'


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

const addCardCreator = (deckId, card) => {
    return {
        type: ADD_CARD,
        deckId,
        card
    }
}

const createDeckCreator = (deck) => {
    return {
        type: CREATE_DECK,
        deck
    }
}

const deleteDeckCreator = (deck) => {
    return {
        type: DELETE_DECK,
        deck
    }
}

const removeCardCreator = (deckId, card) => {
    return {
        type: REMOVE_CARD,
        deckId,
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
        dispatch(addCardCreator(deckId, data))
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
        dispatch(removeCardCreator(deckId, data))
        return
    } else {
        const errors = await response.json()
        return errors
    }
}

export const deleteDeckThunk = (deckId) => async (dispatch) => {
    const response = await fetch(`/api/decks/${deckId}/delete`, {
        method: 'DELETE'
    })

    if(response.ok){
        const data = await response.json()
        dispatch(deleteDeckCreator(data))
        return
    } else {
        const errors = await response.json()
        return errors
    }
}

export const createDeckThunk = (name) => async (dispatch) => {
    const response = await fetch(`/api/decks/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name})
    })
    if(response.ok){
        const data = await response.json()
        dispatch(createDeckCreator(data))
        return data.id
    } else {
        const errors = await response.json()
        return errors
    }
}

export const updateDeckThunk = (deckId, name) => async (dispatch) => {
    const response = await fetch(`/api/decks/${deckId}/edit`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name})
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


const initialState = {userDecks: {}}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case LOAD_USER_DECKS: {
            const newState = {userDecks: {}}
            action.decks.forEach((deck) => {
                newState.userDecks[deck.id] = deck
            })
            console.log(newState)
            return newState
        }
        case LOAD_DECK: {
            const newState = {}
            action.deck.forEach((card) => {
                newState.cards[card.id] = card
            })
            return newState
        }
        case CREATE_DECK: {
            const newState = global.structuredClone(state)
            newState.userDecks[action.deck.id] = action.deck
            return newState
        }
        case ADD_CARD: {
            console.log(action.card)
            const newState = global.structuredClone(state)
            newState.userDecks[action.deckId].cards[action.card.id] = action.card
            return newState
        }
        case REMOVE_CARD: {
            const newState = global.structuredClone(state)
            delete newState.userDecks[action.deckId].cards[action.card.id]
            return newState
        }
        case DELETE_DECK: {
            const newState = global.structuredClone(state)
            delete newState.userDecks[action.deck.id]
            return newState
        }
        case UPDATE_DECK: {
            const newState = global.structuredClone(state)
            newState.userDecks[action.deck.id] = action.deck
            return newState
        }
        default: return state
    }
}

export default reducer
