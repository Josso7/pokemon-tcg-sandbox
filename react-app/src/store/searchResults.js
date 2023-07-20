const reducer = () => () => {
    switch(action.type){
        case SAVE_RESULTS: {
            const newState = [...action.results]
            return newState
        }
        default: return state
    }
}

export default reducer
