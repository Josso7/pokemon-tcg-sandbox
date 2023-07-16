import { useState, useEffect } from 'react'
import pokemon from 'pokemontcgsdk'
import './DeckCardBrowser.css'
import energyCards from '../../../Data/energyCards'
import { getPageResults } from '../../../utils/searchUtils'
import { createPortal } from 'react-dom'
import { addCardToDeckThunk } from '../../../store/decks'
import { useDispatch } from 'react-redux'

function PokemonSearch({ selectedDeck }) {

    const [expansion, setExpansion] = useState()
    const [supertype, setSupertype] = useState()
    const [type, setType] = useState()
    const [results, setResults] = useState([])
    const [pageCards, setPageCards] = useState([])
    const [pageNumber, setPageNumber] = useState(0)
    const [resultCount, setResultCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [loadingPage, setLoadingPage] = useState(1)
    const dispatch = useDispatch()

    const addCard = (card) => {
        const payload = {imageUrl: card.images.large, supertype: card.supertype, subtype: card.subtypes[0]}
        dispatch(addCardToDeckThunk(selectedDeck, payload))
    }

    const handleSearch = async () => {
        setPageCards([])
        setResultCount(0)
        setPageNumber(0)
        setLoading(true)
        const queryObject = {}
        if(supertype === 'Energy'){
            setResults(energyCards)
            setResultCount(16)
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
        setResultCount(results.totalCount)
        const searchResults = await getPageResults(results, queryObject, setLoadingPage)
        console.log(searchResults)
        setResults(searchResults)
        setLoading(false)
    }

    const paginateCards = () => {
        const cardsArr = []
        console.log(results)
        for(let i = pageNumber * 20; i < (pageNumber * 20) + 20 && i < resultCount; i++){
            console.log(i)
            cardsArr.push(results[i])
        }
        console.log(cardsArr)
        setPageCards(cardsArr)
    }

    useEffect(() => {
        if(results.length) paginateCards()
    }, [pageNumber])

    useEffect(() => {
        if(results.length) paginateCards()
    }, [results])

    const increasePage = (page) => setPageNumber(page + 1)
    const decreasePage = (page) => setPageNumber(page - 1)

    return (
        <>
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
                    {resultCount && resultCount < 251 && <p>{`Loading ${resultCount} of ${resultCount} `}</p> || ''}
                    {resultCount > 251 && <p>{`Loading ${loadingPage * 250 > resultCount ? resultCount : loadingPage * 250} of ${resultCount} `}</p>}
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
                    <button onClick={() => increasePage(pageNumber)}> Next Page </button>
                </div>
            </div> || ''}
        </>
    )
}

export default PokemonSearch
