const LOAD_RESULTS = 'search/LOAD_RESULTS'

const loadResultsCreator = (results) => {
    return {
        type: LOAD_RESULTS,
        results
    }
}


const initialState = {}

const reducer = (state = initialState) => {
    switch(action.type){
        case LOAD_RESULTS: {
            const newState = {}
            newState
        }
        default: return state
    }
}
