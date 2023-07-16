import { useState, useEffect } from 'react'
import pokemon from 'pokemontcgsdk'
import './DeckCardBrowser.css'
import energyCards from '../../../Data/energyCards'
import { getPageResults } from '../../../utils/searchUtils'
import { createPortal } from 'react-dom'
import { addCardToDeckThunk } from '../../../store/decks'
import { loadResultsCreator } from '../../../store/search'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, AlertTitle } from '@mui/material'
import { Snackbar } from '@mui/material'

function PokemonSearch({ selectedDeck }) {

    const [expansion, setExpansion] = useState()
    const [supertype, setSupertype] = useState()
    const [type, setType] = useState()
    const results = useSelector(state => state.search)
    const [pageCards, setPageCards] = useState([])
    const [pageNumber, setPageNumber] = useState(0)
    const [resultCount, setResultCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [loadingPage, setLoadingPage] = useState(1)
    const deck = useSelector(state => state.decks.userDecks[selectedDeck])
    const [toastType, setToastType] = useState()
    const [toastOpen, setToastOpen] = useState()
    const dispatch = useDispatch()


    const addCard = async (card) => {
        console.log(card.subtypes)
        const payload = {imageUrl: card.images.large, supertype: card.supertype, subtype: card.subtypes[0]}
        const response = await dispatch(addCardToDeckThunk(selectedDeck, payload))
        console.log(response)
        if (response?.errors === 'MAX DECK SIZE'){
            setToastOpen(true)
            setToastType('error')
        } else {
            setToastOpen(true)
            setToastType('success')
        }
    }

    const handleSearch = async () => {
        setPageCards([])
        setResultCount(0)
        setPageNumber(0)
        setLoading(true)
        const queryObject = {}
        if(supertype === 'Energy'){
            // setResults(energyCards)
            dispatch(loadResultsCreator(energyCards, 16))
            // setResultCount(16)
            setLoading(false)
            return
        }
        // if(expansion === 'standard'){
        //     queryObject.q = 'regulationMark:E OR regulationMark:F OR regulationMark:G'
        //     const results = await pokemon.card.where(queryObject)
        //     setResultCount(results.totalCount)
        //     const searchResults = await getPageResults(results, queryObject)
        //     console.log(searchResults)
        //     setResults(searchResults)
        //     setLoading(false)
        //     return
        // }
        if(expansion === 'standard') queryObject.q = 'regulationMark:E OR regulationMark:F OR regulationMark:G'
        else if(expansion) queryObject.q = `set.id:${expansion}`
        if(supertype) queryObject.q = queryObject.q + ` supertype:${supertype}`
        if(type && supertype === 'Pokémon') queryObject.q = queryObject.q + ` types:${type}`
        console.log(queryObject)
        const results = await pokemon.card.where(queryObject)
        // setResultCount(results.totalCount)
        const searchResults = await getPageResults(results, queryObject, setLoadingPage)
        console.log(searchResults)
        // setResults(searchResults)
        dispatch(loadResultsCreator(searchResults, results.totalCount))
        setLoading(false)
    }

    const paginateCards = () => {
        const cardsArr = []
        console.log(results)
        console.log(pageNumber)
        for(let i = pageNumber * 20; i < (pageNumber * 20) + 20 && i < results.resultCount; i++){
            console.log(i)
            cardsArr.push(results[i])
        }
        console.log(cardsArr)
        setPageCards(cardsArr)
    }

    useEffect(() => {
        if(results.length) {
            paginateCards()
        }
    }, [pageNumber, results])

    // useEffect(() => {
    //     if(results.length) paginateCards()
    // }, [])

    // useEffect(() => {
    //     if(results.length) paginateCards()
    // }, [results])

    const increasePage = (page) => setPageNumber(page + 1)
    const decreasePage = (page) => setPageNumber(page - 1)
    
      const handleClose = () => {
        setToastOpen(false)
      }

    return (
        <>
        <Snackbar open={toastOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}}>
            <div>
                {toastType === 'error' && <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
                    <AlertTitle> Error </AlertTitle>
                    Your deck already has 60 cards!
                </Alert>}
                {toastType === 'success' && <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
                    <AlertTitle> Success </AlertTitle>
                    New deck size: {Object.values(deck.cards).length}
                </Alert>}
            </div>
      </Snackbar>
        <h1 className='search-header'> Search Cards</h1>
            <div className="search-options-wrapper">

                <select onChange={(e) => setExpansion(e.target.value)} disabled={supertype === 'Energy'}>
                    <option  value=''>
                        - Select an Expansion -
                    </option>
                    <option value='standard'>
                        All Standard Legal Cards
                    </option>
                    <option value='sv1'>
                        Scarlet & Violet
                    </option>
                    <option value='sv2'>
                        Paldea Evolved
                    </option>
                </select>

                <select onChange={(e) => setSupertype(e.target.value)}>
                    <option value=''>
                        - Select a Supertype -
                    </option>
                    <option value='Energy'>
                        Energy
                    </option>
                    <option value='Pokémon'>
                        Pokemon
                    </option>
                    <option value='Trainer'>
                        Trainer
                    </option>
                </select>

                <select onChange={(e) => setType(e.target.value)} disabled={supertype !== 'Pokémon'}>
                    <option value=''>
                        - Select a Type -
                    </option>
                    <option value='Colorless'>
                        Colorless
                    </option>
                    <option value='Darkness'>
                        Darkness
                    </option>
                    <option value='Dragon'>
                        Dragon
                    </option>
                    <option value='Fighting'>
                        Fighting
                    </option>
                    <option value='Fire'>
                        Fire
                    </option>
                    <option value='Grass'>
                        Grass
                    </option>
                    <option value='Lightning'>
                        Lightning
                    </option>
                    <option value='Metal'>
                        Metal
                    </option>
                    <option value='Psychic'>
                        Psychic
                    </option>
                    <option value='Water'>
                        Water
                    </option>
                </select>

                <button onClick={() => handleSearch()}> Search </button>
            </div>
            {loading && createPortal(<div className='loading-background'>
                <div className='loading-text'>
                    <p>Loading results, this may take some time</p>
                    {results.resultCount && results.resultCount < 251 && <p>{`Loading ${results.resultCount} of ${results.resultCount} `}</p> || ''}
                        {results.resultCount > 251 && <p>{`Loading ${loadingPage * 250 > results.resultCount ? results.resultCount : loadingPage * 250} of ${results.resultCount} `}</p>}
                </div>
            </div>, document.querySelector('#root'))}
            <div className='cards-wrapper'>
                {pageCards && pageCards.length &&
                pageCards.map((card) => {
                    console.log(card);
                    return (
                        <>
                            <div className='search-results-single-card-wrapper'>
                                <img key={card?.id} className='single-card-image' src={card?.images?.large}></img>
                                <button onClick={() => addCard(card)}> Add </button>
                            </div>
                        </>
                    )
                })
                || ''}
            </div>
            {results && results.length && <div className='page-number-wrapper'>
                <div>
                {pageNumber > 0 && <button onClick={() => decreasePage(pageNumber)}> Previous Page </button>}
                </div>
                <div>
                    {'Page ' + (pageNumber + 1) + ' of ' + Math.ceil(results.length / 20)}
                </div>
                <div>
                    {pageNumber <= (results.resultCount / 20) - 1 && <button onClick={() => increasePage(pageNumber)}> Next Page </button>}
                </div>
            </div> || ''}
        </>
    )
}

export default PokemonSearch
