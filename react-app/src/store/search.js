const LOAD_RESULTS = 'search/LOAD_RESULTS'

export const loadResultsCreator = (results, resultCount) => {
    return {
        type: LOAD_RESULTS,
        results,
        resultCount
    }
}


const initialState = {}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case LOAD_RESULTS: {
            const newState = [...action.results]
            newState.resultCount = action.resultCount
            return newState
        }
        default: return state
    }
}

export default reducer